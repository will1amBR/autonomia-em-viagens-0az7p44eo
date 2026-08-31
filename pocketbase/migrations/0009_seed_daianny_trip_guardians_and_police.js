migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const tripsCol = app.findCollectionByNameOrId('trips')
    const guardiansCol = app.findCollectionByNameOrId('guardians')
    const presenceLogsCol = app.findCollectionByNameOrId('presence_logs')
    const assessmentsCol = app.findCollectionByNameOrId('assessments')

    // 1. Seed / Update Daianny (traveler user)
    let daiannyId = ''
    try {
      const existingDaianny = app.findAuthRecordByEmail('_pb_users_auth_', 'daianny@autonomia.com')
      existingDaianny.setPassword('Skip@Pass')
      existingDaianny.setVerified(true)
      existingDaianny.set('name', 'Daianny')
      existingDaianny.set('role', 'user')
      existingDaianny.set('phone', '+55 11 98888-0000')
      existingDaianny.set('emergency_passcode', '9999')
      existingDaianny.set('duress_secret_code', '9999')
      existingDaianny.set('duress_method', 'secret_code')
      existingDaianny.set('last_online_at', new Date().toISOString())
      existingDaianny.set(
        'last_location_approx',
        'São Paulo - GRU (Aeroporto Internacional de Guarulhos), SP, Brasil',
      )
      app.save(existingDaianny)
      daiannyId = existingDaianny.id
    } catch (_) {
      const daiannyUser = new Record(users)
      daiannyUser.setEmail('daianny@autonomia.com')
      daiannyUser.setPassword('Skip@Pass')
      daiannyUser.setVerified(true)
      daiannyUser.set('name', 'Daianny')
      daiannyUser.set('role', 'user')
      daiannyUser.set('phone', '+55 11 98888-0000')
      daiannyUser.set('emergency_passcode', '9999')
      daiannyUser.set('duress_secret_code', '9999')
      daiannyUser.set('duress_method', 'secret_code')
      daiannyUser.set('last_online_at', new Date().toISOString())
      daiannyUser.set(
        'last_location_approx',
        'São Paulo - GRU (Aeroporto Internacional de Guarulhos), SP, Brasil',
      )
      app.save(daiannyUser)
      daiannyId = daiannyUser.id
    }

    // 2. Seed / Update Police user (policia@autonomia.com)
    try {
      const existingPolice = app.findAuthRecordByEmail('_pb_users_auth_', 'policia@autonomia.com')
      existingPolice.setPassword('Skip@Pass')
      existingPolice.setVerified(true)
      existingPolice.set('name', 'Oficial Plantão Policial & Consular')
      existingPolice.set('role', 'police')
      existingPolice.set('phone', '+55 61 2026-6000')
      app.save(existingPolice)
    } catch (_) {
      const policeUser = new Record(users)
      policeUser.setEmail('policia@autonomia.com')
      policeUser.setPassword('Skip@Pass')
      policeUser.setVerified(true)
      policeUser.set('name', 'Oficial Plantão Policial & Consular')
      policeUser.set('role', 'police')
      policeUser.set('phone', '+55 61 2026-6000')
      app.save(policeUser)
    }

    // 3. Seed / Update Trip for Daianny
    let tripId = ''
    try {
      const existingTrip = app.findFirstRecordByData('trips', 'user_id', daiannyId)
      existingTrip.set('title', 'Viagem Itália com Escala em Londres - Visita ao Fabrizio')
      existingTrip.set('origin_city', 'Brasil, São Paulo - GRU')
      existingTrip.set('transit_countries', 'Londres, Reino Unido (LHR - Heathrow)')
      existingTrip.set('destination_country', 'Itália')
      existingTrip.set('destination_city', 'Roma')
      existingTrip.set('departure_date', '2025-05-15')
      existingTrip.set('return_date', '2025-05-30')
      existingTrip.set('trip_reason', 'Visita pessoal e turismo em Roma')
      existingTrip.set('accommodation_type', 'Casa/Apartamento residencial do anfitrião')
      existingTrip.set('accommodation_address', 'Via del Corso, 241, Apt 4B, 00186 Roma RM, Itália')
      existingTrip.set('who_is_paying', 'Anfitrião cobrindo hospedagem')
      existingTrip.set('traveling_with', 'Sozinha (recebida no destino pelo anfitrião)')
      existingTrip.set('host_responsible_person', 'Fabrizio Moretti')
      existingTrip.set('host_relationship', 'Pessoa que ela acabou de conhecer')
      existingTrip.set('host_phone', '+39 349 876 5432')
      existingTrip.set('host_document', 'IT-RM-8849201')
      existingTrip.set(
        'companion_details',
        'Primo Mateo Moretti reside no mesmo imóvel (4º andar, código de portaria #4012)',
      )
      existingTrip.set('destination_contact', '+39 349 876 5432')
      existingTrip.set('quick_notes', 'Portaria código #4012. 4º andar, Apartamento 4B.')
      existingTrip.set('checkin_frequency', 'every_12h')
      existingTrip.set('checkin_preferred_time', '20:00')
      existingTrip.set('checkin_start_time', '08:00')
      existingTrip.set('checkin_active', true)
      existingTrip.set('notify_guardians_on_absence', true)
      existingTrip.set('accommodation_details', {
        responsibleName: 'Fabrizio Moretti',
        responsiblePhone: '+39 349 876 5432',
        responsibleDocument: 'IT-RM-8849201',
        relationship: 'Pessoa que ela acabou de conhecer',
        companionNotes:
          'Primo Mateo Moretti reside no mesmo imóvel (4º andar, código de portaria #4012)',
        address: 'Via del Corso, 241, Apt 4B, 00186 Roma RM, Itália',
        type: 'Casa/Apartamento residencial do anfitrião',
        whoIsPaying: 'Anfitrião cobrindo hospedagem',
        intercomCode: '#4012',
        floor: '4º andar',
      })
      app.save(existingTrip)
      tripId = existingTrip.id
    } catch (_) {
      const tripRec = new Record(tripsCol)
      tripRec.set('user_id', daiannyId)
      tripRec.set('title', 'Viagem Itália com Escala em Londres - Visita ao Fabrizio')
      tripRec.set('origin_city', 'Brasil, São Paulo - GRU')
      tripRec.set('transit_countries', 'Londres, Reino Unido (LHR - Heathrow)')
      tripRec.set('destination_country', 'Itália')
      tripRec.set('destination_city', 'Roma')
      tripRec.set('departure_date', '2025-05-15')
      tripRec.set('return_date', '2025-05-30')
      tripRec.set('trip_reason', 'Visita pessoal e turismo em Roma')
      tripRec.set('accommodation_type', 'Casa/Apartamento residencial do anfitrião')
      tripRec.set('accommodation_address', 'Via del Corso, 241, Apt 4B, 00186 Roma RM, Itália')
      tripRec.set('who_is_paying', 'Anfitrião cobrindo hospedagem')
      tripRec.set('traveling_with', 'Sozinha (recebida no destino pelo anfitrião)')
      tripRec.set('host_responsible_person', 'Fabrizio Moretti')
      tripRec.set('host_relationship', 'Pessoa que ela acabou de conhecer')
      tripRec.set('host_phone', '+39 349 876 5432')
      tripRec.set('host_document', 'IT-RM-8849201')
      tripRec.set(
        'companion_details',
        'Primo Mateo Moretti reside no mesmo imóvel (4º andar, código de portaria #4012)',
      )
      tripRec.set('destination_contact', '+39 349 876 5432')
      tripRec.set('quick_notes', 'Portaria código #4012. 4º andar, Apartamento 4B.')
      tripRec.set('checkin_frequency', 'every_12h')
      tripRec.set('checkin_preferred_time', '20:00')
      tripRec.set('checkin_start_time', '08:00')
      tripRec.set('checkin_active', true)
      tripRec.set('notify_guardians_on_absence', true)
      tripRec.set('accommodation_details', {
        responsibleName: 'Fabrizio Moretti',
        responsiblePhone: '+39 349 876 5432',
        responsibleDocument: 'IT-RM-8849201',
        relationship: 'Pessoa que ela acabou de conhecer',
        companionNotes:
          'Primo Mateo Moretti reside no mesmo imóvel (4º andar, código de portaria #4012)',
        address: 'Via del Corso, 241, Apt 4B, 00186 Roma RM, Itália',
        type: 'Casa/Apartamento residencial do anfitrião',
        whoIsPaying: 'Anfitrião cobrindo hospedagem',
        intercomCode: '#4012',
        floor: '4º andar',
      })
      app.save(tripRec)
      tripId = tripRec.id
    }

    // 4. Seed Assessment for Daianny's trip (if not already present)
    try {
      const existingAssess = app.findFirstRecordByData('assessments', 'trip_id', tripId)
      existingAssess.set('overall_score', 48)
      existingAssess.set('tier', 'MODERATE')
      existingAssess.set(
        'summary_text',
        'Viagem com pontos críticos de atenção: anfitrião recém-conhecido e hospedagem paga por terceiros. Mantenha os guardiões ativos.',
      )
      app.save(existingAssess)
    } catch (_) {
      const assessRec = new Record(assessmentsCol)
      assessRec.set('user_id', daiannyId)
      assessRec.set('trip_id', tripId)
      assessRec.set('overall_score', 48)
      assessRec.set('tier', 'MODERATE')
      assessRec.set(
        'summary_text',
        'Viagem com pontos críticos de atenção: anfitrião recém-conhecido e hospedagem paga por terceiros. Mantenha os guardiões ativos.',
      )
      assessRec.set('answers', {
        canReturnTomorrow: 'yes_dependent',
        hasValidPassport: true,
        hasDigitalCopies: true,
        hasRequiredVisas: true,
        hasPhysicalControlOfPassport: true,
        hasReturnTicket: true,
        hasOwnMoney: false,
        hasInternationalCard: true,
        hasEmergencyReserve: false,
        whoPaysTrip: 'other_person',
        whoPaysHousing: 'other_person',
        hasWorkingPhone: true,
        hasInternetEsim: true,
        canBuyEssentialsAlone: true,
        canLeaveHousingAlone: true,
        canStayElsewhereIfNecessary: false,
        relationshipDuration: 'less_than_1_month',
        inPersonMeetingsCount: 'never_met',
        hasVisitedCountryBefore: false,
        knowsHostPersonally: 'no',
        exactAddressKnown: true,
        respectsLimits: 'unknown',
        minimizesConcerns: 'sometimes',
        feelsPressureToAcceptConditions: true,
        feltNeedToChooseBetweenSafetyAndTrip: false,
        familyFriendsInformedDetailed: true,
      })
      assessRec.set('breakdown', {
        documentation: 90,
        return: 50,
        finances: 35,
        communication: 75,
        housing: 40,
        mobility: 60,
        protectionNetwork: 80,
        emergency: 65,
      })
      assessRec.set('dependence_factors', [
        'Anfitrião conhecido recentemente sem encontros prévios comprovados.',
        'Hospedagem em domicílio privado coberta integralmente pelo anfitrião.',
        'Necessidade de confirmação diária de bem-estar com rede de apoio.',
      ])
      assessRec.set('recommendations', [
        'Compartilhe a chave de localização diária com seus Guardiões de Emergência.',
        'Mantenha seu passaporte sempre sob sua guarda física pessoal.',
        'Memorize o código de portaria #4012 e o contato do Consulado-Geral em Roma (+39 333 306 4545).',
      ])
      app.save(assessRec)
    }

    // 5. Seed Guardians for Daianny & Trip
    const guardiansData = [
      {
        name: 'William',
        email: 'william@autonomia.com',
        phone: '+55 11 98888-1111',
        relationship: 'Rede de Apoio Familiar',
        access_type: 'emergency',
        notify_on_checkin: true,
        receive_missed_alert: true,
        receive_full_itinerary: true,
        notes: 'Contato primário de emergência com acesso total a itinerário e alertas sob coação.',
      },
      {
        name: 'Camila',
        email: 'camila@autonomia.com',
        phone: '+55 11 97777-2222',
        relationship: 'Amiga Próxima / Segurança',
        access_type: 'security',
        notify_on_checkin: false,
        receive_missed_alert: true,
        receive_full_itinerary: false,
        notes: 'Nível de segurança: alertada em caso de protocolo de ausência prolongada.',
      },
      {
        name: 'Vinicius',
        email: 'vinicius@autonomia.com',
        phone: '+55 11 96666-3333',
        relationship: 'Rede de Apoio de Emergência',
        access_type: 'emergency',
        notify_on_checkin: true,
        receive_missed_alert: true,
        receive_full_itinerary: true,
        notes: 'Guardião de emergência com notificação em tempo real de check-in e alertas.',
      },
    ]

    for (const g of guardiansData) {
      try {
        const records = app.findRecordsByFilter(
          'guardians',
          `trip_id = "${tripId}" && email = "${g.email}"`,
          '-created',
          1,
          0,
        )
        if (records.length > 0) {
          const rec = records[0]
          rec.set('name', g.name)
          rec.set('phone', g.phone)
          rec.set('relationship', g.relationship)
          rec.set('access_type', g.access_type)
          rec.set('country', 'Brasil')
          rec.set('notify_on_checkin', g.notify_on_checkin)
          rec.set('receive_missed_alert', g.receive_missed_alert)
          rec.set('receive_full_itinerary', g.receive_full_itinerary)
          rec.set('notes', g.notes)
          app.save(rec)
          continue
        }
      } catch (_) {}

      const newG = new Record(guardiansCol)
      newG.set('user_id', daiannyId)
      newG.set('trip_id', tripId)
      newG.set('name', g.name)
      newG.set('email', g.email)
      newG.set('phone', g.phone)
      newG.set('relationship', g.relationship)
      newG.set('country', 'Brasil')
      newG.set('access_type', g.access_type)
      newG.set('notify_on_checkin', g.notify_on_checkin)
      newG.set('receive_missed_alert', g.receive_missed_alert)
      newG.set('receive_full_itinerary', g.receive_full_itinerary)
      newG.set('notes', g.notes)
      app.save(newG)
    }

    // 6. Seed Presence Log for Daianny (Initial login / last-known in São Paulo - GRU)
    try {
      const records = app.findRecordsByFilter(
        'presence_logs',
        `user_id = "${daiannyId}" && event_type = "login"`,
        '-created',
        1,
        0,
      )
      if (records.length === 0) {
        const presenceRec = new Record(presenceLogsCol)
        presenceRec.set('user_id', daiannyId)
        presenceRec.set('trip_id', tripId)
        presenceRec.set('event_type', 'login')
        presenceRec.set('location_lat', -23.4356)
        presenceRec.set('location_lng', -46.4731)
        presenceRec.set(
          'location_name',
          'São Paulo - GRU (Aeroporto Internacional de Guarulhos - Terminal 3), SP, Brasil',
        )
        presenceRec.set('accuracy_meters', 15)
        presenceRec.set('device_info', 'Mobile Safari / iPhone 15 Pro (iOS 18.2)')
        presenceRec.set('ip_address', '177.18.204.89')
        presenceRec.set('battery_level', '94%')
        presenceRec.set(
          'notes',
          'Login inicial da Daianny antes do embarque para escala em Londres (LHR) e destino Roma (FCO)',
        )
        presenceRec.set('is_duress', false)
        presenceRec.set('timestamp', new Date().toISOString())
        app.save(presenceRec)
      }
    } catch (_) {}
  },
  (app) => {
    // Down rollback logic if needed
  },
)
