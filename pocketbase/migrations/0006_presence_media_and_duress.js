migrate(
  (app) => {
    // 1. Expand users collection with silent duress preferences & police access
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('duress_method')) {
      // 'hold_3s' | 'volume_key' | 'secret_code'
      users.fields.add(new TextField({ name: 'duress_method' }))
    }
    if (!users.fields.getByName('duress_secret_code')) {
      users.fields.add(new TextField({ name: 'duress_secret_code' }))
    }
    if (!users.fields.getByName('last_online_at')) {
      users.fields.add(new TextField({ name: 'last_online_at' }))
    }
    if (!users.fields.getByName('last_location_approx')) {
      users.fields.add(new TextField({ name: 'last_location_approx' }))
    }
    app.save(users)

    // 2. Expand trips collection with detailed companion/host fields
    const trips = app.findCollectionByNameOrId('trips')
    if (!trips.fields.getByName('host_relationship')) {
      trips.fields.add(new TextField({ name: 'host_relationship' }))
    }
    if (!trips.fields.getByName('host_phone')) {
      trips.fields.add(new TextField({ name: 'host_phone' }))
    }
    if (!trips.fields.getByName('host_document')) {
      trips.fields.add(new TextField({ name: 'host_document' }))
    }
    if (!trips.fields.getByName('companion_details')) {
      trips.fields.add(new TextField({ name: 'companion_details' }))
    }
    if (!trips.fields.getByName('accommodation_details')) {
      trips.fields.add(new JSONField({ name: 'accommodation_details' }))
    }
    app.save(trips)

    const usersColId = '_pb_users_auth_'
    const tripsColId = trips.id

    // 3. Collection: presence_logs (Activity & Location history)
    // Visibility rule: Traveler OR Emergency Guardians OR Police OR Admin
    const presenceLogs = new Collection({
      name: 'presence_logs',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'police' || @collection.guardians.user_id ?= user_id && @collection.guardians.email ?= @request.auth.email && @collection.guardians.access_type ?= 'emergency')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'police' || @collection.guardians.user_id ?= user_id && @collection.guardians.email ?= @request.auth.email && @collection.guardians.access_type ?= 'emergency')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      deleteRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          collectionId: usersColId,
          cascadeDelete: true,
          maxSelect: 1,
          required: true,
        },
        {
          name: 'trip_id',
          type: 'relation',
          collectionId: tripsColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'event_type', type: 'text', required: true }, // 'login' | 'heartbeat' | 'checkin' | 'manual_update' | 'media_upload' | 'duress_signal'
        { name: 'location_lat', type: 'number' },
        { name: 'location_lng', type: 'number' },
        { name: 'location_name', type: 'text' },
        { name: 'accuracy_meters', type: 'number' },
        { name: 'device_info', type: 'text' },
        { name: 'ip_address', type: 'text' },
        { name: 'battery_level', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'is_duress', type: 'bool' },
        { name: 'timestamp', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_presence_user_time ON presence_logs (user_id, created DESC)',
        'CREATE INDEX idx_presence_trip ON presence_logs (trip_id, created DESC)',
      ],
    })
    app.save(presenceLogs)

    // 4. Collection: confirmation_media (Scheduled photos & morning/night videos)
    const confirmationMedia = new Collection({
      name: 'confirmation_media',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'police' || @collection.guardians.user_id ?= user_id && @collection.guardians.email ?= @request.auth.email && @collection.guardians.access_type ?= 'emergency')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'police' || @collection.guardians.user_id ?= user_id && @collection.guardians.email ?= @request.auth.email && @collection.guardians.access_type ?= 'emergency')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      deleteRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          collectionId: usersColId,
          cascadeDelete: true,
          maxSelect: 1,
          required: true,
        },
        {
          name: 'trip_id',
          type: 'relation',
          collectionId: tripsColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'media_type', type: 'text', required: true }, // 'photo_routine' | 'video_morning' | 'video_night' | 'photo_emergency'
        {
          name: 'file',
          type: 'file',
          maxSelect: 1,
          maxSize: 52428800, // 50MB
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'video/mp4',
            'video/webm',
            'video/quicktime',
          ],
        },
        { name: 'caption', type: 'text' },
        { name: 'location_approx', type: 'text' },
        { name: 'location_lat', type: 'number' },
        { name: 'location_lng', type: 'number' },
        { name: 'taken_under_duress', type: 'bool' },
        { name: 'device_info', type: 'text' },
        { name: 'timestamp', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_conf_media_user ON confirmation_media (user_id, created DESC)',
        'CREATE INDEX idx_conf_media_trip ON confirmation_media (trip_id, created DESC)',
      ],
    })
    app.save(confirmationMedia)

    // 5. Collection: duress_alerts (Silent threat alerts dispatched to guardians & police)
    const duressAlerts = new Collection({
      name: 'duress_alerts',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'police' || @collection.guardians.user_id ?= user_id && @collection.guardians.email ?= @request.auth.email && @collection.guardians.access_type ?= 'emergency')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'police' || @collection.guardians.user_id ?= user_id && @collection.guardians.email ?= @request.auth.email && @collection.guardians.access_type ?= 'emergency')",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          collectionId: usersColId,
          cascadeDelete: true,
          maxSelect: 1,
          required: true,
        },
        {
          name: 'trip_id',
          type: 'relation',
          collectionId: tripsColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'trigger_method', type: 'text', required: true }, // 'button_hold' | 'volume_key' | 'secret_code' | 'discreet_media_button'
        { name: 'location_lat', type: 'number' },
        { name: 'location_lng', type: 'number' },
        { name: 'location_address', type: 'text' },
        { name: 'device_info', type: 'text' },
        { name: 'notified_guardians_count', type: 'number' },
        { name: 'notified_police', type: 'bool' },
        { name: 'status', type: 'text' }, // 'dispatched' | 'acknowledged' | 'investigating' | 'resolved'
        { name: 'timestamp', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_duress_user ON duress_alerts (user_id, created DESC)'],
    })
    app.save(duressAlerts)
  },
  (app) => {
    const tryDelete = (name) => {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
    tryDelete('duress_alerts')
    tryDelete('confirmation_media')
    tryDelete('presence_logs')
  },
)
