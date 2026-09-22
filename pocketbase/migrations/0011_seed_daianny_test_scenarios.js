migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const trips = app.findCollectionByNameOrId('trips')
    const duressColl = app.findCollectionByNameOrId('duress_alerts')
    const mediaColl = app.findCollectionByNameOrId('confirmation_media')
    const notifColl = app.findCollectionByNameOrId('absence_notifications')
    const presenceColl = app.findCollectionByNameOrId('presence_logs')

    let daianny = null
    try {
      daianny = app.findAuthRecordByEmail('_pb_users_auth_', 'daianny@autonomia.com')
    } catch (_) {
      return
    }

    let daiannyTrip = null
    try {
      const daiannyTrips = app.findRecordsByFilter(
        'trips',
        `user_id = "${daianny.id}"`,
        '-created',
        1,
      )
      if (daiannyTrips && daiannyTrips.length > 0) {
        daiannyTrip = daiannyTrips[0]
      }
    } catch (_) {}

    const tripId = daiannyTrip ? daiannyTrip.id : null

    // 1. Seed initial confirmation media for Daianny (photo_routine, video_morning, video_night) if none exist
    const existingMedia = app.findRecordsByFilter(
      'confirmation_media',
      `user_id = "${daianny.id}"`,
      '-created',
      1,
    )
    if (!existingMedia || existingMedia.length === 0) {
      // Foto de rotina
      const m1 = new Record(mediaColl)
      m1.set('user_id', daianny.id)
      if (tripId) m1.set('trip_id', tripId)
      m1.set('media_type', 'photo_routine')
      m1.set('caption', 'Almoço no centro de Roma perto da Piazza Navona - tudo em paz')
      m1.set('location_approx', 'Piazza Navona, Roma, Itália (41.8992, 12.4731)')
      m1.set('location_lat', 41.8992)
      m1.set('location_lng', 12.4731)
      m1.set('taken_under_duress', false)
      m1.set('device_info', 'Mobile Safari / iPhone 15 Pro')
      m1.set('timestamp', new Date(Date.now() - 3600000 * 5).toISOString())
      app.save(m1)

      // Vídeo matinal
      const m2 = new Record(mediaColl)
      m2.set('user_id', daianny.id)
      if (tripId) m2.set('trip_id', tripId)
      m2.set('media_type', 'video_morning')
      m2.set('caption', 'Check-in matinal no apartamento da Via del Corso antes de sair')
      m2.set('location_approx', 'Via del Corso 241, Roma, Itália (41.9028, 12.4795)')
      m2.set('location_lat', 41.9028)
      m2.set('location_lng', 12.4795)
      m2.set('taken_under_duress', false)
      m2.set('device_info', 'Mobile Safari / iPhone 15 Pro')
      m2.set('timestamp', new Date(Date.now() - 3600000 * 10).toISOString())
      app.save(m2)
    }

    // 2. Seed an initial duress alert for Daianny so the Police Dashboard (/police/dashboard) displays her verified alert immediately
    const existingDuress = app.findRecordsByFilter(
      'duress_alerts',
      `user_id = "${daianny.id}"`,
      '-created',
      1,
    )
    if (!existingDuress || existingDuress.length === 0) {
      const dAlert = new Record(duressColl)
      dAlert.set('user_id', daianny.id)
      if (tripId) dAlert.set('trip_id', tripId)
      dAlert.set('trigger_method', 'secret_code')
      dAlert.set('location_lat', 41.9028)
      dAlert.set('location_lng', 12.4795)
      dAlert.set(
        'location_address',
        'Via del Corso 241, Apt 4B, Roma, Itália - Código Secreto 9999',
      )
      dAlert.set('device_info', 'Mobile Safari / iPhone 15 Pro (iOS 18.2)')
      dAlert.set('notified_guardians_count', 3)
      dAlert.set('notified_police', true)
      dAlert.set('status', 'dispatched')
      dAlert.set('timestamp', new Date().toISOString())
      app.save(dAlert)

      // Log de presença correspondente
      const pLog = new Record(presenceColl)
      pLog.set('user_id', daianny.id)
      if (tripId) pLog.set('trip_id', tripId)
      pLog.set('event_type', 'duress_signal')
      pLog.set('location_lat', 41.9028)
      pLog.set('location_lng', 12.4795)
      pLog.set('location_name', 'Via del Corso 241, Roma, Itália (Código 9999)')
      pLog.set('device_info', 'Mobile Safari / iPhone 15 Pro')
      pLog.set('is_duress', true)
      pLog.set('notes', 'Sinal sob ameaça acionado via código secreto 9999 no overlay')
      pLog.set('timestamp', new Date().toISOString())
      app.save(pLog)
    }

    // 3. Seed absence notification for Stage 3 (guardians) if only Stage 1 exists
    const existingStage3 = app.findRecordsByFilter(
      'absence_notifications',
      `user_id = "${daianny.id}" && stage = 3`,
      '-created',
      1,
    )
    if (!existingStage3 || existingStage3.length === 0) {
      const n3 = new Record(notifColl)
      n3.set('user_id', daianny.id)
      if (tripId) n3.set('trip_id', tripId)
      n3.set('stage', 3)
      n3.set('recipient_type', 'guardians_security')
      n3.set('recipient_email', 'william@autonomia.com')
      n3.set('recipient_name', 'William')
      n3.set('subject', 'SafeTrip: Alerta preventivo sobre Daianny em Roma, Itália')
      n3.set(
        'message',
        'Ausência de check-in de Daianny em Roma. Anfitrião: Fabrizio Moretti (+39 349 876 5432). Hospedagem: Via del Corso 241, Apt 4B.',
      )
      n3.set('status', 'sent')
      n3.set('sent_at', new Date(Date.now() - 3600000 * 1).toISOString())
      app.save(n3)
    }
  },
  (app) => {
    // down rollback
  },
)
