routerAdd(
  'POST',
  '/api/duress-silent-alert',
  (c) => {
    const authRecord = c.get('authRecord')
    if (!authRecord) {
      return c.json(401, { error: 'Usuário não autenticado.' })
    }

    const data = $apis.requestInfo(c).data || {}
    const tripId = data.trip_id
    const triggerMethod = data.trigger_method || 'button_hold'
    const locationLat = data.location_lat
    const locationLng = data.location_lng
    const locationAddress = data.location_address || ''
    const deviceInfo = data.device_info || 'Dispositivo Móvel'
    const timestamp = data.timestamp || new Date().toISOString()

    const travelerName = authRecord.getString('name') || 'Viajante'
    const travelerEmail = authRecord.getString('email') || ''
    const travelerPhone = authRecord.getString('phone') || ''

    let tripInfoText = ''
    let tripRec = null
    if (tripId) {
      try {
        tripRec = $app.findRecordById('trips', tripId)
        tripInfoText = `Viagem: ${tripRec.getString('title')} | Destino: ${tripRec.getString('destination_city')}, ${tripRec.getString('destination_country')} | Hospedagem: ${tripRec.getString('accommodation_address')} | Anfitrião: ${tripRec.getString('host_responsible_person')} (${tripRec.getString('host_phone')})`
      } catch (e) {
        console.log('Trip lookup in duress warning:', e)
      }
    }

    // 1. Create duress alert record
    let alertRec = null
    try {
      const duressCol = $app.findCollectionByNameOrId('duress_alerts')
      alertRec = new Record(duressCol)
      alertRec.set('user_id', authRecord.id)
      if (tripId) alertRec.set('trip_id', tripId)
      alertRec.set('trigger_method', triggerMethod)
      if (locationLat !== undefined && locationLat !== null)
        alertRec.set('location_lat', locationLat)
      if (locationLng !== undefined && locationLng !== null)
        alertRec.set('location_lng', locationLng)
      alertRec.set(
        'location_address',
        locationAddress ||
          (locationLat ? `Lat: ${locationLat}, Lng: ${locationLng}` : 'Sem coordenadas'),
      )
      alertRec.set('device_info', deviceInfo)
      alertRec.set('notified_guardians_count', 0)
      alertRec.set('notified_police', true)
      alertRec.set('status', 'dispatched')
      alertRec.set('timestamp', timestamp)
      $app.save(alertRec)
    } catch (e) {
      console.log('Error creating duress record:', e)
    }

    // 2. Also log in presence_logs with is_duress = true
    try {
      const presenceCol = $app.findCollectionByNameOrId('presence_logs')
      const pLog = new Record(presenceCol)
      pLog.set('user_id', authRecord.id)
      if (tripId) pLog.set('trip_id', tripId)
      pLog.set('event_type', 'duress_signal')
      if (locationLat !== undefined && locationLat !== null) pLog.set('location_lat', locationLat)
      if (locationLng !== undefined && locationLng !== null) pLog.set('location_lng', locationLng)
      pLog.set(
        'location_name',
        locationAddress ||
          (locationLat ? `Lat: ${locationLat}, Lng: ${locationLng}` : 'Sinal sob ameaça'),
      )
      pLog.set('device_info', deviceInfo)
      pLog.set('notes', `ALERTA DISCRETO SOB AMEAÇA disparado via: ${triggerMethod}`)
      pLog.set('is_duress', true)
      pLog.set('timestamp', timestamp)
      $app.save(pLog)
    } catch (e) {
      console.log('Error creating presence log for duress:', e)
    }

    // 3. Find emergency guardians (access_type == 'emergency')
    let emergencyGuardians = []
    try {
      if (tripId) {
        const list = $app.findRecordsByFilter(
          'guardians',
          `trip_id = '${tripId}' && access_type = 'emergency' && email != ''`,
        )
        emergencyGuardians = list.map((g) => ({
          name: g.getString('name'),
          email: g.getString('email'),
          phone: g.getString('phone'),
          relationship: g.getString('relationship'),
        }))
      } else {
        const list = $app.findRecordsByFilter(
          'guardians',
          `user_id = '${authRecord.id}' && access_type = 'emergency' && email != ''`,
        )
        emergencyGuardians = list.map((g) => ({
          name: g.getString('name'),
          email: g.getString('email'),
          phone: g.getString('phone'),
          relationship: g.getString('relationship'),
        }))
      }
    } catch (e) {
      console.log('Error finding emergency guardians:', e)
    }

    const googleMapsUrl =
      locationLat && locationLng ? `https://maps.google.com/?q=${locationLat},${locationLng}` : null

    let notifiedCount = 0
    for (let g of emergencyGuardians) {
      try {
        const mailClient = $mails.newMailClient()
        const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #fef2f2; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 2px solid #ef4444; box-shadow: 0 10px 15px -3px rgba(239,68,68,0.1); }
            .header { background: #b91c1c; color: #ffffff; padding: 24px; text-align: center; }
            .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 900; letter-spacing: 0.5px; }
            .content { padding: 24px; }
            .alert-box { background: #fee2e2; border-left: 4px solid #b91c1c; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
            .info-grid { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #f1f5f9; font-size: 13px; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
            .info-row:last-child { border-bottom: none; }
            .label { color: #64748b; font-weight: 600; }
            .value { color: #0f172a; font-weight: 700; text-align: right; }
            .btn { display: inline-block; background: #b91c1c; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 10px; }
            .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 ALERTA SILENCIOSO DE EMERGÊNCIA DISPARADO</h1>
              <div>Sinal de Coação / Ameaça • Nível Guardião de Emergência</div>
            </div>
            <div class="content">
              <p>Prezado(a) Guardião(ã) de Emergência <strong>${g.name}</strong>,</p>
              
              <div class="alert-box">
                <p style="margin: 0; font-weight: 800; color: #991b1b; font-size: 14px;">
                  ⚠️ ${travelerName} acionou um sinal silencioso de emergência/coação.
                </p>
                <p style="margin: 6px 0 0 0; font-size: 12px; color: #7f1d1d;">
                  Este sinal é acionado discretamente pelo viajante sem alertar possíveis terceiros no local. Aja com cautela e procure apoio consular ou das autoridades policiais locais se necessário.
                </p>
              </div>

              <div class="info-grid">
                <div class="info-row">
                  <span class="label">Viajante:</span>
                  <span class="value">${travelerName}</span>
                </div>
                <div class="info-row">
                  <span class="label">Telefone Viajante:</span>
                  <span class="value">${travelerPhone || 'Não informado'}</span>
                </div>
                <div class="info-row">
                  <span class="label">Horário do Disparo:</span>
                  <span class="value">${new Date(timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} (Brasília)</span>
                </div>
                <div class="info-row">
                  <span class="label">Última Localização Registrada:</span>
                  <span class="value">${locationAddress || (locationLat ? `${locationLat.toFixed(5)}, ${locationLng.toFixed(5)}` : 'Sem GPS')}</span>
                </div>
                <div class="info-row">
                  <span class="label">Dispositivo:</span>
                  <span class="value">${deviceInfo}</span>
                </div>
                ${
                  tripInfoText
                    ? `
                <div class="info-row" style="flex-direction: column;">
                  <span class="label">Dados da Viagem & Hospedagem:</span>
                  <span class="value" style="text-align: left; margin-top: 4px; font-weight: normal; font-size: 12px;">${tripInfoText}</span>
                </div>`
                    : ''
                }
              </div>

              ${
                googleMapsUrl
                  ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${googleMapsUrl}" class="btn" target="_blank">
                  📍 Ver Coordenadas Imediatas no Google Maps
                </a>
              </div>`
                  : ''
              }

              <p style="font-size: 12px; color: #475569; margin-top: 15px;">
                <strong>Recomendações para o Guardião de Emergência:</strong><br/>
                1. Tente contato não intrusivo com o viajante por mensagem.<br/>
                2. Se não houver retorno rápido, contate o Plantão Consular do Brasil no país de destino.<br/>
                3. Repasse as coordenadas e informações de hospedagem às autoridades locais caso necessário.
              </p>
            </div>
            <div class="footer">
              Alerta gerado com protocolo de segurança confidencial SafeTrip
            </div>
          </div>
        </body>
        </html>
        `

        mailClient.send({
          from: { address: 'notificacoes@resend.dev', name: 'SafeTrip Alerta Emergência' },
          to: [{ address: g.email, name: g.name }],
          subject: `🚨 [SOS SILENCIOSO] Alerta de Emergência acionado por ${travelerName}`,
          html: htmlBody,
        })
        notifiedCount++
      } catch (err) {
        console.log('Error dispatching duress email to ' + g.email + ':', err)
      }
    }

    // Update alert record with notified count
    if (alertRec) {
      try {
        alertRec.set('notified_guardians_count', notifiedCount)
        $app.save(alertRec)
      } catch (_) {}
    }

    // Note: The UI must not reveal that alert was sent (it returns a generic silent response)
    return c.json(200, {
      success: true,
      silent: true,
      timestamp: timestamp,
    })
  },
  $apis.activityLogger($app),
)
