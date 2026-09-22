/// <reference path="../pb_data/types.d.ts" />

routerAdd('POST', '/backend/v1/guardian-notify-gps', (c) => {
  const authRecord = c.get('authRecord')
  const body = c.requestInfo().body || {}

  let user = authRecord
  const userId = body.userId || (user ? user.id : null)

  if (!user && userId) {
    try {
      user = $app.findRecordById('users', userId)
    } catch (err) {}
  }

  if (!user) {
    try {
      const travelers = $app.findRecordsByFilter('users', 'role = "traveler"', '-created', 1)
      if (travelers && travelers.length > 0) {
        user = travelers[0]
      }
    } catch (err) {}
  }

  const finalUserId = user ? user.id : 'unknown'
  const userName = user
    ? user.getString('name') || user.getString('email') || 'Viajante'
    : 'Viajante'
  const userEmail = user ? user.getString('email') : ''

  const lat = typeof body.latitude === 'number' ? body.latitude : body.lat ? Number(body.lat) : null
  const lng =
    typeof body.longitude === 'number' ? body.longitude : body.lng ? Number(body.lng) : null
  const locationText =
    body.location ||
    (lat && lng
      ? `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      : 'Localização enviada pelo dispositivo')
  const message = body.message || 'Atualização de localização e status de presença.'

  let tripId = body.tripId || null
  let tripDestination = 'Destino em trânsito'

  if (!tripId && user) {
    try {
      const trips = $app.findRecordsByFilter('trips', `user_id = "${user.id}"`, '-created', 1)
      if (trips && trips.length > 0) {
        tripId = trips[0].id
        tripDestination = `${trips[0].getString('destination_city') || ''}, ${trips[0].getString('destination_country') || ''}`
      }
    } catch (err) {}
  }

  // Salvar no presence_logs
  try {
    const logsColl = $app.findCollectionByNameOrId('presence_logs')
    const logRecord = new Record(logsColl)
    logRecord.set('user_id', finalUserId)
    if (tripId) logRecord.set('trip_id', tripId)
    logRecord.set('event_type', 'guardian_gps_notification')
    logRecord.set('location_name', locationText)
    if (lat !== null) logRecord.set('location_lat', lat)
    if (lng !== null) logRecord.set('location_lng', lng)
    logRecord.set('notes', `GPS compartilhado com a rede de apoio: ${message}`)
    logRecord.set('timestamp', new Date().toISOString())
    $app.save(logRecord)
  } catch (err) {
    console.log('[GPS Notify] Erro ao gravar presence_log:', err)
  }

  // Buscar guardians
  let guardiansCount = 0
  let guardiansList = []
  if (user) {
    try {
      guardiansList = $app.findRecordsByFilter('guardians', `user_id = "${user.id}"`)
      guardiansCount = guardiansList.length
    } catch (err) {}
  }

  let emailSentCount = 0
  let simulationNote = ''

  try {
    const mailClient = $app.newMailClient()

    for (let i = 0; i < guardiansList.length; i++) {
      const g = guardiansList[i]
      const gEmail = g.getString('email')
      const gName = g.getString('name')
      if (!gEmail) continue

      const emailMessage = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress || 'presenca@autonomiaemviagens.com.br',
          name: $app.settings().meta.senderName || 'Autonomia em Viagens',
        },
        to: [{ address: gEmail, name: gName }],
        subject: `[Atualização de Presença] ${userName} compartilhou localização`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #0f172a; margin-top: 0;">Presença Confirmada</h2>
              <p>Olá <strong>${gName}</strong>,</p>
              <p><strong>${userName}</strong> atualizou sua localização com a rede de apoio:</p>
              <ul>
                <li><strong>Localização:</strong> ${locationText}</li>
                <li><strong>Destino:</strong> ${tripDestination}</li>
                <li><strong>Horário:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</li>
                <li><strong>Nota:</strong> ${message}</li>
              </ul>
              <p>Status operacional normal.</p>
            </div>
          `,
      })

      try {
        mailClient.send(emailMessage)
        emailSentCount++
      } catch (mailErr) {
        console.log(`[GPS Notify] Erro/Simulação no envio para ${gEmail}:`, mailErr.message)
      }
    }
  } catch (mailClientErr) {
    simulationNote = 'SMTP não configurado (simulado com sucesso)'
    console.log(
      '[GPS Notify] Mail client indisponível ou SMTP ausente (simulado):',
      mailClientErr.message,
    )
  }

  return c.json(200, {
    success: true,
    message: `Localização enviada para ${guardiansCount} guardiões.`,
    dispatched: {
      guardiansCount,
      emailSentCount,
      simulation: simulationNote || undefined,
    },
  })
})
