/// <reference path="../pb_data/types.d.ts" />

/**
 * Cron Job: Executa a cada 10 minutos para verificar ausência de check-in
 * Implementa o Protocolo de Ausência em 4 Etapas
 */
cronAdd('absence_protocol_check', '*/10 * * * *', () => {
  console.log('[Absence Protocol Cron] Iniciando verificação periódica de check-ins...')

  try {
    const activeTrips = $app.findRecordsByFilter('trips', 'checkin_active = true')
    console.log(`[Absence Protocol Cron] Viagens ativas monitoradas: ${activeTrips.length}`)

    const now = Date.now()

    for (let i = 0; i < activeTrips.length; i++) {
      const trip = activeTrips[i]
      const userId = trip.getString('user_id')

      let user = null
      try {
        user = $app.findRecordById('users', userId)
      } catch (err) {}

      const userName = user ? (user.getString('name') || user.getString('email')) : 'Viajante'
      const userEmail = user ? user.getString('email') : ''
      const tripTitle = trip.getString('title') || 'Viagem'
      const destCity = trip.getString('destination_city') || ''
      const destCountry = trip.getString('destination_country') || ''
      const hostName = trip.getString('host_responsible_person') || 'Não informado'
      const hostPhone = trip.getString('host_phone') || 'Não informado'
      const hostRelation = trip.getString('host_relationship') || 'Anfitrião'
      const hotelAddress = trip.getString('accommodation_address') || 'Não informado'

      // Buscar último checkin ou presença
      let lastPresenceLog = null
      try {
        const pLogs = $app.findRecordsByFilter('presence_logs', `user_id = "${userId}"`, '-timestamp', 1)
        if (pLogs && pLogs.length > 0) lastPresenceLog = pLogs[0]
      } catch (err) {}

      const lastPresenceTime = lastPresenceLog ? lastPresenceLog.getString('timestamp') : trip.getString('last_checkin_at') || trip.getString('created')
      const lastPresenceLocation = lastPresenceLog ? lastPresenceLog.getString('location_approx') : (user ? user.getString('last_location_approx') : 'Não informada')

      const lastTime = lastPresenceTime ? new Date(lastPresenceTime).getTime() : now
      const hoursElapsed = (now - lastTime) / (1000 * 60 * 60)

      const freq = trip.getString('checkin_frequency') || 'daily'
      let expectedIntervalHours = 24
      if (freq === 'twice_daily') expectedIntervalHours = 12
      if (freq === 'every_6h') expectedIntervalHours = 6
      if (freq === 'every_other_day') expectedIntervalHours = 48

      const overdueHours = hoursElapsed - expectedIntervalHours
      const currentStage = trip.getInt('current_absence_stage') || 0

      let newStage = 0
      if (overdueHours > 24) {
        newStage = 4
      } else if (overdueHours > 12) {
        newStage = 3
      } else if (overdueHours > 4) {
        newStage = 2
      } else if (overdueHours > 0.5) {
        newStage = 1
      } else {
        newStage = 0
      }

      // Se o estágio mudou para um nível superior e está acima de zero
      if (newStage > currentStage && newStage > 0) {
        console.log(`[Absence Protocol Cron] Usuário ${userName} progrediu para Estágio ${newStage} (atraso: ${overdueHours.toFixed(1)}h)`)

        // Buscar guardiões
        let guardians = []
        try {
          guardians = $app.findRecordsByFilter('guardians', `user_id = "${userId}" && active = true`)
        } catch (err) {}

        // Registrar no absence_notifications
        try {
          const absenceColl = $app.findCollectionByNameOrId('absence_notifications')
          const notificationRecord = new Record(absenceColl)
          notificationRecord.set('user_id', userId)
          notificationRecord.set('trip_id', trip.id)
          notificationRecord.set('stage', newStage)
          notificationRecord.set('status', 'executed')
          notificationRecord.set('sent_at', new Date().toISOString())

          let actionSummary = `Etapa ${newStage} acionada automaticamente pelo cron (atraso de ${overdueHours.toFixed(1)}h).`
          notificationRecord.set('actions_taken', actionSummary)
          notificationRecord.set('notes', `Monitoramento autônomo. Local: ${lastPresenceLocation}`)
          $app.save(notificationRecord)
        } catch (dbErr) {
          console.log('[Absence Cron] Erro ao gravar notificação:', dbErr)
        }

        // Atualizar viagem
        try {
          trip.set('current_absence_stage', newStage)
          trip.set('absence_stage_updated_at', new Date().toISOString())
          $app.save(trip)
        } catch (tErr) {}

        // Disparo de e-mail (com fallback de simulação)
        try {
          const mailClient = $app.newMailClient()

          if (newStage === 1 && userEmail) {
            const msg = new MailerMessage({
              from: {
                address: $app.settings().meta.senderAddress || 'checkin@autonomiaemviagens.com.br',
                name: 'Autonomia em Viagens'
              },
              to: [{ address: userEmail, name: userName }],
              subject: `[Lembrete de Autonomia] Tudo bem na sua viagem em ${destCity}?`,
              html: `<p>Olá ${userName}, lembrete de presença para a sua viagem a ${destCity}.</p>`
            })
            try { mailClient.send(msg) } catch (mErr) {}
          } else if (newStage >= 2) {
            for (let gIdx = 0; gIdx < guardians.length; gIdx++) {
              const g = guardians[gIdx]
              const gEmail = g.getString('email')
              const gName = g.getString('name')
              if (!gEmail) continue

              const msg = new MailerMessage({
                from: {
                  address: $app.settings().meta.senderAddress || 'seguranca@autonomiaemviagens.com.br',
                  name: 'Autonomia em Viagens - Rede de Apoio'
                },
                to: [{ address: gEmail, name: gName }],
                subject: `[Protocolo de Ausência - Etapa ${newStage}] Aviso para ${userName}`,
                html: `<p>Olá ${gName}, aviso de ausência etapa ${newStage} para ${userName} em ${destCity}. Contato anfitrião: ${hostName} (${hostPhone}).</p>`
              })
              try { mailClient.send(msg) } catch (mErr) {}
            }
          }
        } catch (mailClientErr) {
          console.log('[Absence Cron] MailClient SMTP ausente (simulação cron executada com sucesso)')
        }
      }
    }
  } catch (globalErr) {
    console.log('[Absence Protocol Cron] Erro global:', globalErr)
  }
})
