/// <reference path="../pb_data/types.d.ts" />

routerAdd('POST', '/backend/v1/absence-protocol-check', (c) => {
  const authRecord = c.get('authRecord')
  const body = c.requestInfo().body || {}
  const tripId = body.tripId
  const forceStage = typeof body.forceStage === 'number' ? body.forceStage : null

  // Se tiver tripId específico ou executar verificação geral
  let tripsToCheck = []
  if (tripId) {
    try {
      const t = $app.findRecordById('trips', tripId)
      if (t) tripsToCheck.push(t)
    } catch (err) {}
  } else {
    try {
      tripsToCheck = $app.findRecordsByFilter('trips', 'checkin_active = true')
    } catch (err) {}
  }

  const results = []

  for (let i = 0; i < tripsToCheck.length; i++) {
    const trip = tripsToCheck[i]
    const userId = trip.getString('user_id')
    let user = null
    try {
      user = $app.findRecordById('users', userId)
    } catch (err) {}

    const userName = user ? user.getString('name') || user.getString('email') : 'Viajante'
    const userEmail = user ? user.getString('email') : ''
    const tripTitle = trip.getString('title') || 'Viagem'
    const destCity = trip.getString('destination_city') || ''
    const destCountry = trip.getString('destination_country') || ''
    const hostName = trip.getString('host_responsible_person') || 'Não informado'
    const hostPhone = trip.getString('host_phone') || 'Não informado'
    const hostRelation = trip.getString('host_relationship') || 'Anfitrião'
    const hotelAddress = trip.getString('accommodation_address') || 'Não informado'

    // Buscar guardians
    let guardians = []
    try {
      guardians = $app.findRecordsByFilter('guardians', `user_id = "${userId}"`)
    } catch (err) {}

    // Buscar última presença
    let lastPresenceLog = null
    try {
      const pLogs = $app.findRecordsByFilter(
        'presence_logs',
        `user_id = "${userId}"`,
        '-timestamp',
        1,
      )
      if (pLogs && pLogs.length > 0) lastPresenceLog = pLogs[0]
    } catch (err) {}

    const lastPresenceTime = lastPresenceLog
      ? lastPresenceLog.getString('timestamp')
      : trip.getString('last_checkin_at') || trip.getString('created')
    const lastPresenceLocation = lastPresenceLog
      ? lastPresenceLog.getString('location_approx')
      : user
        ? user.getString('last_location_approx')
        : 'Não informada'

    // Determinar estágio (se forçado pela simulação manual ou calculado por tempo)
    let stage = forceStage !== null ? forceStage : trip.getInt('current_absence_stage') || 0

    if (forceStage === null) {
      // Cálculo baseado em horas decorridas desde último checkin
      const now = Date.now()
      const lastTime = lastPresenceTime ? new Date(lastPresenceTime).getTime() : now
      const hoursElapsed = (now - lastTime) / (1000 * 60 * 60)

      const freq = trip.getString('checkin_frequency') || 'daily'
      let expectedIntervalHours = 24
      if (freq === 'twice_daily') expectedIntervalHours = 12
      if (freq === 'every_6h') expectedIntervalHours = 6
      if (freq === 'every_other_day') expectedIntervalHours = 48

      const overdueHours = hoursElapsed - expectedIntervalHours

      if (overdueHours > 24) {
        stage = 4 // > 24h atraso: Acionamento Consular e Polícia
      } else if (overdueHours > 12) {
        stage = 3 // 12-24h atraso: Contato com Anfitrião e Guardião Secundário
      } else if (overdueHours > 4) {
        stage = 2 // 4-12h atraso: Alerta discreto ao Guardião Primário
      } else if (overdueHours > 0.5) {
        stage = 1 // 30min-4h atraso: Lembrete amigável à viajante
      } else {
        stage = 0 // Em dia
      }
    }

    // Se o estágio avançou ou é uma simulação forçada (> 0)
    let notificationRecord = null
    let emailsSent = 0
    let simulationNote = ''

    if (stage > 0) {
      // Registrar na tabela absence_notifications
      try {
        const absenceColl = $app.findCollectionByNameOrId('absence_notifications')

        if (stage <= 2) {
          const notif = new Record(absenceColl)
          notif.set('user_id', userId)
          notif.set('trip_id', trip.id)
          notif.set('stage', stage)
          notif.set('recipient_type', 'traveler')
          notif.set('recipient_email', userEmail || 'daianny@autonomia.com')
          notif.set('recipient_name', userName)
          notif.set(
            'subject',
            stage === 1
              ? `SafeTrip: Verificação de rotina — Está tudo bem em ${destCity}?`
              : `SafeTrip: Segunda tentativa de contato — Por favor confirme seu estado`,
          )
          notif.set(
            'message',
            `Aviso etapa ${stage} do protocolo de ausência para viagem a ${destCity}. Contato de acolhimento.`,
          )
          notif.set('status', 'sent')
          notif.set('sent_at', new Date().toISOString())
          $app.save(notif)
          notificationRecord = notif
        } else {
          // Etapa 3 ou 4: notificar guardiões
          const targetGuardians =
            stage === 3
              ? guardians.filter(
                  (g) =>
                    g.getString('access_type') === 'security' ||
                    g.getString('access_type') === 'emergency',
                )
              : guardians

          const listToRecord = targetGuardians.length > 0 ? targetGuardians : guardians
          for (let gIdx = 0; gIdx < listToRecord.length; gIdx++) {
            const g = listToRecord[gIdx]
            const notif = new Record(absenceColl)
            notif.set('user_id', userId)
            notif.set('trip_id', trip.id)
            notif.set('stage', stage)
            notif.set('recipient_type', stage === 3 ? 'guardians_security' : 'guardians_all')
            notif.set('recipient_email', g.getString('email'))
            notif.set('recipient_name', g.getString('name'))
            notif.set(
              'subject',
              stage === 3
                ? `SafeTrip: Alerta preventivo sobre ${userName} em ${destCity}`
                : `SafeTrip ALERTA: ${userName} sem contato prolongado em ${destCity}`,
            )
            notif.set(
              'message',
              `Ausência registrada. Contato anfitrião: ${hostName} (${hostPhone}). Hospedagem: ${hotelAddress}.`,
            )
            notif.set('status', 'sent')
            notif.set('sent_at', new Date().toISOString())
            $app.save(notif)
            notificationRecord = notif
          }
        }
      } catch (dbErr) {
        console.log('[Absence Check API] Erro ao salvar absence_notification:', dbErr)
      }

      // Atualizar estado na viagem
      try {
        trip.set('current_absence_stage', stage)
        trip.set('absence_stage_updated_at', new Date().toISOString())
        $app.save(trip)
      } catch (tErr) {}

      // Disparar e-mails reais ou capturar ausência de SMTP
      try {
        const mailClient = $app.newMailClient()

        if (stage === 1 && userEmail) {
          // E-mail para a viajante
          const msg = new MailerMessage({
            from: {
              address: $app.settings().meta.senderAddress || 'checkin@autonomiaemviagens.com.br',
              name: 'Autonomia em Viagens - Lembrete',
            },
            to: [{ address: userEmail, name: userName }],
            subject: `[Lembrete de Autonomia] Tudo bem na sua viagem em ${destCity}?`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2>Olá, ${userName}!</h2>
                  <p>Passando para lembrar do seu registro de presença diário da viagem para <strong>${destCity}, ${destCountry}</strong>.</p>
                  <p>Basta abrir o aplicativo e tocar em "Confirmar Presença" quando tiver um momento tranquilo.</p>
                  <p style="color: #64748b; font-size: 13px;">Autonomia não é desconfiança — é seu espaço seguro de registro.</p>
                </div>
              `,
          })
          try {
            mailClient.send(msg)
            emailsSent++
          } catch (mErr) {
            console.log('[Absence API] Simulado envio viajante:', mErr.message)
          }
        } else if (stage >= 2) {
          // E-mails para os guardiões relevantes
          const targetGuardians =
            stage === 2
              ? guardians.filter((g) => g.getString('access_type') === 'emergency').slice(0, 1)
              : guardians

          for (let gIdx = 0; gIdx < targetGuardians.length; gIdx++) {
            const guardian = targetGuardians[gIdx]
            const gEmail = guardian.getString('email')
            const gName = guardian.getString('name')
            if (!gEmail) continue

            const subject =
              stage === 2
                ? `[Aviso Discreto - Autonomia] Verificação de rotina de ${userName}`
                : stage === 3
                  ? `[Atenção - Rede de Apoio] Janela de check-in pendente para ${userName}`
                  : `[Protocolo Máximo - Autonomia] Assistência Consular/Segurança para ${userName}`

            const msg = new MailerMessage({
              from: {
                address:
                  $app.settings().meta.senderAddress || 'seguranca@autonomiaemviagens.com.br',
                name: 'Autonomia em Viagens - Rede de Apoio',
              },
              to: [{ address: gEmail, name: gName }],
              subject: subject,
              html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #0f172a;">Aviso da Rede de Apoio (Etapa ${stage} de 4)</h2>
                    <p>Olá <strong>${gName}</strong>,</p>
                    <p>Como guardião(ã) de <strong>${userName}</strong>, você está recebendo esta notificação conforme o protocolo de ausência planejado.</p>
                    <ul>
                      <li><strong>Viajante:</strong> ${userName} (${userEmail})</li>
                      <li><strong>Destino:</strong> ${destCity}, ${destCountry}</li>
                      <li><strong>Anfitrião/Contato:</strong> ${hostName} (${hostPhone}) - ${hostRelation}</li>
                      <li><strong>Hospedagem:</strong> ${hotelAddress}</li>
                      <li><strong>Última localização:</strong> ${lastPresenceLocation}</li>
                      <li><strong>Último registro:</strong> ${lastPresenceTime}</li>
                    </ul>
                    <p>Recomendamos entrar em contato amigável e com discrição.</p>
                    <hr />
                    <p style="font-size: 12px; color: #64748b;">Protocolo de Autonomia em Viagens — seguro e não invasivo.</p>
                  </div>
                `,
            })

            try {
              mailClient.send(msg)
              emailsSent++
            } catch (mErr) {
              console.log(`[Absence API] Simulado envio guardião ${gEmail}:`, mErr.message)
            }
          }
        }
      } catch (clientErr) {
        simulationNote = 'SMTP não configurado (simulado em log do sistema)'
        console.log('[Absence API] SMTP indisponível (modo simulação):', clientErr.message)
      }
    }

    results.push({
      tripId: trip.id,
      userName,
      stage,
      emailsSent,
      guardiansCount: guardians.length,
      notificationCreated: !!notificationRecord,
      simulation: simulationNote || undefined,
    })
  }

  return c.json(200, {
    success: true,
    processedTrips: results.length,
    results,
  })
})
