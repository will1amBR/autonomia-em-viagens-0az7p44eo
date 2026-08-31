routerAdd(
  'POST',
  '/api/guardian-notify-gps',
  (c) => {
    const authRecord = c.get('authRecord')
    if (!authRecord) {
      return c.json(401, { error: 'Usuário não autenticado.' })
    }

    const data = $apis.requestInfo(c).data || {}
    const tripId = data.trip_id
    const guardianIds = Array.isArray(data.guardian_ids) ? data.guardian_ids : []
    const message = data.message || 'Olá! Estou bem e confirmando minha localização atual.'
    const locationLat = data.location_lat
    const locationLng = data.location_lng
    const locationName = data.location_name || ''
    const accuracy = data.accuracy_meters
    const deviceInfo = data.device_info || 'Dispositivo Móvel'
    const timestamp = data.timestamp || new Date().toISOString()
    const isManualLocation = !!data.is_manual_location

    const travelerName = authRecord.getString('name') || 'Viajante'
    const travelerEmail = authRecord.getString('email') || ''
    const travelerPhone = authRecord.getString('phone') || ''

    // Fetch trip if provided
    let tripTitle = 'Viagem Monitorada'
    let tripDest = ''
    if (tripId) {
      try {
        const tripRec = $app.findRecordById('trips', tripId)
        tripTitle = tripRec.getString('title') || tripTitle
        tripDest = `${tripRec.getString('destination_city')}, ${tripRec.getString('destination_country')}`
      } catch (e) {
        console.log('Trip lookup warning:', e)
      }
    }

    // Save presence log in PocketBase
    try {
      const presenceCol = $app.findCollectionByNameOrId('presence_logs')
      const pLog = new Record(presenceCol)
      pLog.set('user_id', authRecord.id)
      if (tripId) pLog.set('trip_id', tripId)
      pLog.set('event_type', 'guardian_gps_notification')
      if (locationLat !== undefined && locationLat !== null) pLog.set('location_lat', locationLat)
      if (locationLng !== undefined && locationLng !== null) pLog.set('location_lng', locationLng)
      pLog.set(
        'location_name',
        locationName || (locationLat ? `Lat: ${locationLat}, Lng: ${locationLng}` : 'Sem GPS'),
      )
      if (accuracy) pLog.set('accuracy_meters', accuracy)
      pLog.set('device_info', deviceInfo)
      pLog.set('notes', `Notificação enviada aos guardiões. Mensagem: ${message}`)
      pLog.set('is_duress', false)
      pLog.set('timestamp', timestamp)
      $app.save(pLog)

      // Update user last online & location
      authRecord.set('last_online_at', timestamp)
      if (locationName || locationLat) {
        authRecord.set('last_location_approx', locationName || `${locationLat}, ${locationLng}`)
      }
      $app.save(authRecord)
    } catch (e) {
      console.log('Error saving presence log:', e)
    }

    // Find recipient guardians
    let guardiansToNotify = []
    try {
      if (guardianIds.length > 0) {
        for (let gId of guardianIds) {
          try {
            const gRec = $app.findRecordById('guardians', gId)
            if (gRec.getString('email')) {
              guardiansToNotify.push({
                name: gRec.getString('name'),
                email: gRec.getString('email'),
                relationship: gRec.getString('relationship'),
                accessType: gRec.getString('access_type'),
              })
            }
          } catch (_) {}
        }
      } else if (tripId) {
        const list = $app.findRecordsByFilter('guardians', `trip_id = '${tripId}' && email != ''`)
        guardiansToNotify = list.map((g) => ({
          name: g.getString('name'),
          email: g.getString('email'),
          relationship: g.getString('relationship'),
          accessType: g.getString('access_type'),
        }))
      } else {
        const list = $app.findRecordsByFilter(
          'guardians',
          `user_id = '${authRecord.id}' && email != ''`,
        )
        guardiansToNotify = list.map((g) => ({
          name: g.getString('name'),
          email: g.getString('email'),
          relationship: g.getString('relationship'),
          accessType: g.getString('access_type'),
        }))
      }
    } catch (e) {
      console.log('Error fetching guardians:', e)
    }

    const appUrl = $os.getenv('APP_URL') || 'https://autonomia-viagens.app'
    let sentCount = 0
    let errors = []

    const googleMapsUrl =
      locationLat && locationLng ? `https://maps.google.com/?q=${locationLat},${locationLng}` : null

    for (let g of guardiansToNotify) {
      try {
        const mailClient = $mails.newMailClient()
        const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #0284c7, #0f172a); color: #ffffff; padding: 24px; text-align: center; }
            .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; }
            .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #e0f2fe; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-top: 4px; }
            .content { padding: 24px; }
            .status-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
            .status-box h3 { margin: 0 0 6px 0; color: #065f46; font-size: 15px; font-weight: 700; }
            .info-grid { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #f1f5f9; font-size: 13px; }
            .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
            .info-row:last-child { border-bottom: none; }
            .label { color: #64748b; font-weight: 500; }
            .value { color: #0f172a; font-weight: 600; text-align: right; }
            .btn { display: inline-block; background: #0284c7; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 10px; }
            .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SafeTrip • Autonomia em Viagens</h1>
              <div class="badge">Atualização de Localização & Bem-Estar</div>
            </div>
            <div class="content">
              <p>Olá, <strong>${g.name}</strong>,</p>
              
              <div class="status-box">
                <h3>✓ ${travelerName} enviou uma confirmação de que está tudo bem</h3>
                <p style="margin: 0; font-size: 13px; color: #047857;">
                  "${message}"
                </p>
              </div>

              <div class="info-grid">
                <div class="info-row">
                  <span class="label">Viajante:</span>
                  <span class="value">${travelerName} (${travelerEmail})</span>
                </div>
                ${
                  tripDest
                    ? `
                <div class="info-row">
                  <span class="label">Viagem:</span>
                  <span class="value">${tripTitle} (${tripDest})</span>
                </div>`
                    : ''
                }
                <div class="info-row">
                  <span class="label">Data/Hora (Registro):</span>
                  <span class="value">${new Date(timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} (Brasília)</span>
                </div>
                <div class="info-row">
                  <span class="label">Localização Informada:</span>
                  <span class="value">${locationName || (locationLat ? `${locationLat.toFixed(5)}, ${locationLng.toFixed(5)}` : 'Não informada / sem GPS')}</span>
                </div>
                ${
                  accuracy
                    ? `
                <div class="info-row">
                  <span class="label">Precisão do GPS:</span>
                  <span class="value">Aproximadamente ${Math.round(accuracy)} metros</span>
                </div>`
                    : ''
                }
                <div class="info-row">
                  <span class="label">Aparelho / Navegador:</span>
                  <span class="value">${deviceInfo}</span>
                </div>
              </div>

              ${
                googleMapsUrl
                  ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${googleMapsUrl}" class="btn" target="_blank">
                  📍 Abrir Localização no Google Maps
                </a>
              </div>`
                  : ''
              }

              <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
                Você está recebendo este e-mail porque foi cadastrado(a) como <strong>Guardião (${g.relationship || 'Contato de Confiança'})</strong> por ${travelerName}. Este é um envio manual de confirmação de segurança e rotina.
              </p>
            </div>
            <div class="footer">
              Autonomia não é desconfiança • Plataforma SafeTrip de Proteção ao Viajante
            </div>
          </div>
        </body>
        </html>
        `

        mailClient.send({
          from: { address: 'notificacoes@resend.dev', name: 'SafeTrip - Autonomia em Viagens' },
          to: [{ address: g.email, name: g.name }],
          subject: `✓ ${travelerName} está bem - Atualização de Localização e Status (${new Date().toLocaleDateString('pt-BR')})`,
          html: htmlBody,
        })
        sentCount++
      } catch (err) {
        console.log('Error sending to ' + g.email + ':', err)
        errors.push({ email: g.email, error: String(err) })
      }
    }

    return c.json(200, {
      success: true,
      message: `Localização enviada para ${sentCount} guardião(ões).`,
      sentCount: sentCount,
      totalGuardians: guardiansToNotify.length,
      errors: errors,
    })
  },
  $apis.activityLogger($app),
)
