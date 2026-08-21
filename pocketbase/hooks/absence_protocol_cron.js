// Hook to process absence protocol checks and mail dispatches
// Cron runs every 5 minutes: "*/5 * * * *"

cronAdd('absence_protocol_check', '*/5 * * * *', () => {
  try {
    const now = new Date()
    const nowTime = now.getTime()

    // Find all active trips where checkin is enabled
    const trips = $app.findRecordsByFilter('trips', 'checkin_active = true', '-created', 100, 0)

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i]
      const userId = trip.getString('user_id')
      if (!userId) continue

      let user = null
      try {
        user = $app.findRecordById('_pb_users_auth_', userId)
      } catch (_) {
        continue
      }

      const travelerName = user.getString('name') || 'Viajante'
      const travelerEmail = user.getString('email') || ''
      const destinationCity = trip.getString('destination_city') || 'Destino'
      const destinationCountry = trip.getString('destination_country') || ''
      const destinationLocation =
        destinationCity + (destinationCountry ? ', ' + destinationCountry : '')
      const preferredTime = trip.getString('checkin_preferred_time') || '21:00'
      const notifyGuardians = trip.getBool('notify_guardians_on_absence')

      // Find the latest check-in for this trip
      let latestCheckinTime = 0
      let latestCheckinDateStr = ''
      try {
        const lastCheckins = $app.findRecordsByFilter(
          'checkins',
          'trip_id = "' + trip.id + '" && status != "cancelled"',
          '-created',
          1,
          0,
        )
        if (lastCheckins.length > 0) {
          const c = lastCheckins[0]
          const ts = c.getString('timestamp') || c.getString('created')
          latestCheckinTime = new Date(ts).getTime()
          latestCheckinDateStr = ts
        } else {
          // If no checkins yet, consider the trip creation time
          latestCheckinTime = new Date(trip.getString('created')).getTime()
          latestCheckinDateStr = trip.getString('created')
        }
      } catch (_) {
        latestCheckinTime = new Date(trip.getString('created')).getTime()
      }

      if (!latestCheckinTime || isNaN(latestCheckinTime)) continue

      const minutesSinceLastContact = Math.floor((nowTime - latestCheckinTime) / 60000)
      const currentStage = trip.getInt('current_absence_stage') || 0

      // Stage thresholds in minutes:
      // Stage 1: > 30 minutes
      // Stage 2: > 60 minutes (1h)
      // Stage 3: > 180 minutes (3h)
      // Stage 4: > 360 minutes (6h)

      let targetStage = 0
      if (minutesSinceLastContact >= 360) {
        targetStage = 4
      } else if (minutesSinceLastContact >= 180) {
        targetStage = 3
      } else if (minutesSinceLastContact >= 60) {
        targetStage = 2
      } else if (minutesSinceLastContact >= 30) {
        targetStage = 1
      }

      // If targetStage > currentStage, we execute escalations step-by-step
      if (targetStage > currentStage) {
        for (let nextStage = currentStage + 1; nextStage <= targetStage; nextStage++) {
          // Check if this stage notification was already dispatched for this trip
          let alreadySent = false
          try {
            const notifs = $app.findRecordsByFilter(
              'absence_notifications',
              'trip_id = "' + trip.id + '" && stage = ' + nextStage,
              '-created',
              1,
              0,
            )
            if (notifs.length > 0) {
              alreadySent = true
            }
          } catch (_) {}

          if (alreadySent) continue

          const notifsCol = $app.findCollectionByNameOrId('absence_notifications')

          // Stage 1: Direct email to traveler (30 min)
          if (nextStage === 1 && travelerEmail) {
            const subject = 'SafeTrip: Verificação de rotina — Está tudo bem?'
            const htmlBody = `
              <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; color: #1e293b; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
                <h2 style="color: #0f172a; margin-top: 0;">Olá, ${travelerName}</h2>
                <p style="font-size: 15px; line-height: 1.6;">
                  Notamos que você não realizou a confirmação do seu check-in programado para <strong>${preferredTime}</strong> em <strong>${destinationLocation}</strong>.
                </p>
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin: 20px 0;">
                  <p style="margin: 0 0 12px 0; font-weight: bold; color: #166534;">Está tudo bem por aí?</p>
                  <p style="margin: 0; font-size: 14px; color: #15803d;">
                    Basta abrir o aplicativo e tocar em <strong>"Estou bem"</strong> para tranquilizar o sistema e sua rede de apoio.
                  </p>
                </div>
                <p style="font-size: 13px; color: #64748b;">
                  Esta é uma verificação automática preventiva. Autonomia não é desconfiança.
                </p>
              </div>
            `

            try {
              $app.newMailClient().send(
                new MailerMessage({
                  from: {
                    address: $app.settings().meta.senderAddress || 'no-reply@goskip.app',
                    name: 'SafeTrip - Autonomia em Viagens',
                  },
                  to: [{ address: travelerEmail, name: travelerName }],
                  subject: subject,
                  html: htmlBody,
                }),
              )
            } catch (mailErr) {
              console.log('Mail send error stage 1:', mailErr)
            }

            const rec = new Record(notifsCol)
            rec.set('user_id', userId)
            rec.set('trip_id', trip.id)
            rec.set('stage', 1)
            rec.set('recipient_type', 'traveler')
            rec.set('recipient_email', travelerEmail)
            rec.set('recipient_name', travelerName)
            rec.set('subject', subject)
            rec.set('message', 'Aviso direto enviado ao próprio viajante após 30 min sem resposta.')
            rec.set('status', 'sent')
            rec.set('sent_at', new Date().toISOString())
            $app.save(rec)
          }

          // Stage 2: Second attempt to traveler (60 min)
          if (nextStage === 2 && travelerEmail) {
            const subject = 'SafeTrip: Segunda tentativa de contato — Por favor confirme seu estado'
            const htmlBody = `
              <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; color: #1e293b; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
                <h2 style="color: #991b1b; margin-top: 0;">Lembrete de Segurança — 1h de Ausência</h2>
                <p style="font-size: 15px; line-height: 1.6;">
                  Olá, ${travelerName}. Faz 1 hora que seu check-in programado estava agendado em <strong>${destinationLocation}</strong>.
                </p>
                <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 12px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px; color: #991b1b;">
                    Se estiver tudo bem, confirme agora no aplicativo para evitar o acionamento de avisos preventivos aos seus Guardians cadastrados.
                  </p>
                </div>
                <p style="font-size: 13px; color: #64748b;">
                  Horário previsto: ${preferredTime} | Local: ${destinationLocation}
                </p>
              </div>
            `

            try {
              $app.newMailClient().send(
                new MailerMessage({
                  from: {
                    address: $app.settings().meta.senderAddress || 'no-reply@goskip.app',
                    name: 'SafeTrip - Autonomia em Viagens',
                  },
                  to: [{ address: travelerEmail, name: travelerName }],
                  subject: subject,
                  html: htmlBody,
                }),
              )
            } catch (mailErr) {
              console.log('Mail send error stage 2:', mailErr)
            }

            const rec = new Record(notifsCol)
            rec.set('user_id', userId)
            rec.set('trip_id', trip.id)
            rec.set('stage', 2)
            rec.set('recipient_type', 'traveler')
            rec.set('recipient_email', travelerEmail)
            rec.set('recipient_name', travelerName)
            rec.set('subject', subject)
            rec.set('message', 'Segunda tentativa de contato com viajante (+1h de ausência).')
            rec.set('status', 'sent')
            rec.set('sent_at', new Date().toISOString())
            $app.save(rec)
          }

          // Stage 3: Email to guardians of type 'security' and 'emergency' (3h)
          if (nextStage === 3) {
            let guardiansList = []
            try {
              guardiansList = $app.findRecordsByFilter(
                'guardians',
                'trip_id = "' +
                  trip.id +
                  '" && (access_type = "security" || access_type = "emergency")',
                'created',
                50,
                0,
              )
            } catch (_) {}

            for (let gIdx = 0; gIdx < guardiansList.length; gIdx++) {
              const guardian = guardiansList[gIdx]
              const gEmail = guardian.getString('email')
              const gName = guardian.getString('name') || 'Guardian'
              if (!gEmail) continue

              const subject = `SafeTrip: Alerta preventivo sobre ${travelerName} em ${destinationLocation}`
              const htmlBody = `
                <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; color: #1e293b; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
                  <h2 style="color: #d97706; margin-top: 0;">Aviso Preventivo de Ausência</h2>
                  <p style="font-size: 15px; line-height: 1.6;">
                    Olá, ${gName}. Você está cadastrado(a) como Guardian de confiança de <strong>${travelerName}</strong>.
                  </p>
                  <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #92400e;">
                      ${travelerName} não realizou o check-in programado das ${preferredTime} em ${destinationLocation}.
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #78350f;">
                      Já se passaram 3 horas desde o horário previsto. Este é um alerta neutro e preventivo — tente enviar uma mensagem ou ligar para verificar se está tudo bem.
                    </p>
                  </div>
                  <p style="font-size: 13px; color: #64748b;">
                    Destino: ${destinationLocation}<br/>
                    Horário programado: ${preferredTime}
                  </p>
                </div>
              `

              try {
                $app.newMailClient().send(
                  new MailerMessage({
                    from: {
                      address: $app.settings().meta.senderAddress || 'no-reply@goskip.app',
                      name: 'SafeTrip - Autonomia em Viagens',
                    },
                    to: [{ address: gEmail, name: gName }],
                    subject: subject,
                    html: htmlBody,
                  }),
                )
              } catch (mailErr) {
                console.log('Mail send error stage 3 to guardian:', mailErr)
              }

              const rec = new Record(notifsCol)
              rec.set('user_id', userId)
              rec.set('trip_id', trip.id)
              rec.set('stage', 3)
              rec.set('recipient_type', 'guardians_security')
              rec.set('recipient_email', gEmail)
              rec.set('recipient_name', gName)
              rec.set('subject', subject)
              rec.set('message', `Alerta preventivo enviado ao Guardian ${gName} (3h sem contato).`)
              rec.set('status', 'sent')
              rec.set('sent_at', new Date().toISOString())
              $app.save(rec)
            }
          }

          // Stage 4: Email to ALL active guardians (6h)
          if (nextStage === 4) {
            let allGuardians = []
            try {
              allGuardians = $app.findRecordsByFilter(
                'guardians',
                'trip_id = "' + trip.id + '"',
                'created',
                50,
                0,
              )
            } catch (_) {}

            const accomAddress = trip.getString('accommodation_address') || 'Não informada'
            const hostContact =
              trip.getString('destination_contact') ||
              trip.getString('host_responsible_person') ||
              'Não informado'

            for (let gIdx = 0; gIdx < allGuardians.length; gIdx++) {
              const guardian = allGuardians[gIdx]
              const gEmail = guardian.getString('email')
              const gName = guardian.getString('name') || 'Guardian'
              if (!gEmail) continue

              const subject = `SafeTrip ALERTA: ${travelerName} sem contato há mais de 6 horas em ${destinationLocation}`
              const htmlBody = `
                <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; color: #1e293b; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
                  <h2 style="color: #dc2626; margin-top: 0;">Alerta de Ausência Prolongada (6h)</h2>
                  <p style="font-size: 15px; line-height: 1.6;">
                    Prezado(a) ${gName},<br/>
                    O viajante <strong>${travelerName}</strong> está sem realizar contato ou check-in há <strong>6 horas</strong> em <strong>${destinationLocation}</strong>.
                  </p>
                  <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 16px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #991b1b;">
                      Dados de apoio liberados para localização e auxílio:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #7f1d1d; line-height: 1.6;">
                      <li><strong>Última localização conhecida:</strong> ${destinationLocation}</li>
                      <li><strong>Endereço de hospedagem salvo:</strong> ${accomAddress}</li>
                      <li><strong>Contato local registrado:</strong> ${hostContact}</li>
                    </ul>
                  </div>
                  <p style="font-size: 13px; color: #475569;">
                    <strong>Recomendação de ação:</strong> Tente contato telefônico com o viajante. Caso não consiga retorno e suspeite de situação de risco, consulte os serviços consulares ou policiais do país de destino.
                  </p>
                </div>
              `

              try {
                $app.newMailClient().send(
                  new MailerMessage({
                    from: {
                      address: $app.settings().meta.senderAddress || 'no-reply@goskip.app',
                      name: 'SafeTrip - Autonomia em Viagens',
                    },
                    to: [{ address: gEmail, name: gName }],
                    subject: subject,
                    html: htmlBody,
                  }),
                )
              } catch (mailErr) {
                console.log('Mail send error stage 4 to guardian:', mailErr)
              }

              const rec = new Record(notifsCol)
              rec.set('user_id', userId)
              rec.set('trip_id', trip.id)
              rec.set('stage', 4)
              rec.set('recipient_type', 'guardians_all')
              rec.set('recipient_email', gEmail)
              rec.set('recipient_name', gName)
              rec.set('subject', subject)
              rec.set(
                'message',
                `Alerta de nível 4 (6h sem contato) enviado para todos os guardians.`,
              )
              rec.set('status', 'sent')
              rec.set('sent_at', new Date().toISOString())
              $app.save(rec)
            }
          }
        }

        // Update trip's current_absence_stage
        trip.set('current_absence_stage', targetStage)
        trip.set('absence_stage_updated_at', new Date().toISOString())
        $app.save(trip)
      }
    }
  } catch (globalErr) {
    console.log('Cron absence protocol check error:', globalErr)
  }
})
