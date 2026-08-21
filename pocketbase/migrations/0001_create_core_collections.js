migrate(
  (app) => {
    // 1. Add 'role' and 'phone' fields to users collection if not present
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          values: ['user', 'admin'],
          maxSelect: 1,
        }),
      )
    }
    if (!users.fields.getByName('phone')) {
      users.fields.add(
        new TextField({
          name: 'phone',
        }),
      )
    }
    if (!users.fields.getByName('emergency_passcode')) {
      users.fields.add(
        new TextField({
          name: 'emergency_passcode',
        }),
      )
    }
    app.save(users)

    // 2. Collection: destinations
    const destinations = new Collection({
      name: 'destinations',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'country', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'country_code', type: 'text', required: true },
        { name: 'police_number', type: 'text' },
        { name: 'medical_emergency_number', type: 'text' },
        { name: 'general_emergency_number', type: 'text' },
        { name: 'consulate_embassy_name', type: 'text' },
        { name: 'consulate_address', type: 'text' },
        { name: 'consulate_phone', type: 'text' },
        { name: 'consulate_email', type: 'text' },
        { name: 'consulate_emergency_24h', type: 'text' },
        { name: 'safe_havens', type: 'json' },
        { name: 'travel_tips', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_destinations_country_city ON destinations (country, city)',
      ],
    })
    app.save(destinations)

    // 3. Collection: trips
    const trips = new Collection({
      name: 'trips',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      deleteRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
          required: true,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'destination_country', type: 'text', required: true },
        { name: 'destination_city', type: 'text', required: true },
        { name: 'departure_date', type: 'text' },
        { name: 'return_date', type: 'text' },
        { name: 'trip_reason', type: 'text' },
        { name: 'accommodation_type', type: 'text' },
        { name: 'accommodation_address', type: 'text' },
        { name: 'who_is_paying', type: 'text' },
        { name: 'traveling_with', type: 'text' },
        { name: 'host_responsible_person', type: 'text' },
        { name: 'destination_contact', type: 'text' },
        { name: 'quick_notes', type: 'text' },
        { name: 'checkin_frequency', type: 'text' },
        { name: 'checkin_preferred_time', type: 'text' },
        { name: 'checkin_active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_trips_user_created ON trips (user_id, created DESC)'],
    })
    app.save(trips)

    const tripsColId = trips.id

    // 4. Collection: assessments
    const assessments = new Collection({
      name: 'assessments',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      deleteRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
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
        { name: 'overall_score', type: 'number', min: 0, max: 100 },
        { name: 'tier', type: 'text' },
        { name: 'summary_text', type: 'text' },
        { name: 'answers', type: 'json' },
        { name: 'breakdown', type: 'json' },
        { name: 'dependence_factors', type: 'json' },
        { name: 'recommendations', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_assessments_user_created ON assessments (user_id, created DESC)'],
    })
    app.save(assessments)

    // 5. Collection: guardians
    const guardians = new Collection({
      name: 'guardians',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      deleteRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
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
        { name: 'name', type: 'text', required: true },
        { name: 'relationship', type: 'text' },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'access_type', type: 'text' },
        { name: 'notify_on_checkin', type: 'bool' },
        { name: 'receive_missed_alert', type: 'bool' },
        { name: 'receive_full_itinerary', type: 'bool' },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_guardians_user_created ON guardians (user_id, created DESC)'],
    })
    app.save(guardians)

    // 6. Collection: checkins
    const checkins = new Collection({
      name: 'checkins',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      deleteRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
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
        { name: 'status', type: 'text', required: true },
        { name: 'note', type: 'text' },
        { name: 'location_approx', type: 'text' },
        { name: 'escalation_stage', type: 'number' },
        { name: 'timestamp', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_checkins_user_created ON checkins (user_id, created DESC)'],
    })
    app.save(checkins)

    // 7. Collection: safety_plans (checklist items)
    const safetyPlans = new Collection({
      name: 'safety_plans',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      deleteRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
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
        { name: 'item_key', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'completed', type: 'bool' },
        { name: 'why_it_matters', type: 'text' },
        { name: 'action_tip', type: 'text' },
        { name: 'is_required_for_high_autonomy', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_safety_plans_user_trip ON safety_plans (user_id, trip_id)'],
    })
    app.save(safetyPlans)

    // 8. Collection: security_library
    const securityLibrary = new Collection({
      name: 'security_library',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'slug', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'icon_name', type: 'text' },
        { name: 'urgency_level', type: 'text' },
        { name: 'short_summary', type: 'text' },
        { name: 'immediate_steps', type: 'json' },
        { name: 'what_not_to_do', type: 'json' },
        { name: 'rights_and_resources', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_security_library_slug ON security_library (slug)'],
    })
    app.save(securityLibrary)
  },
  (app) => {
    const tryDelete = (name) => {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
    tryDelete('security_library')
    tryDelete('safety_plans')
    tryDelete('checkins')
    tryDelete('guardians')
    tryDelete('assessments')
    tryDelete('trips')
    tryDelete('destinations')
  },
)
