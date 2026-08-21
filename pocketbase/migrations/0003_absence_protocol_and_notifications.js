migrate(
  (app) => {
    // 1. Add notify_guardians_on_absence to trips collection if not present
    try {
      const tripsCol = app.findCollectionByNameOrId('trips')
      if (!tripsCol.fields.getByName('notify_guardians_on_absence')) {
        tripsCol.fields.add(new BoolField({ name: 'notify_guardians_on_absence' }))
      }
      if (!tripsCol.fields.getByName('checkin_start_time')) {
        tripsCol.fields.add(new TextField({ name: 'checkin_start_time' }))
      }
      if (!tripsCol.fields.getByName('last_checkin_at')) {
        tripsCol.fields.add(new TextField({ name: 'last_checkin_at' }))
      }
      if (!tripsCol.fields.getByName('current_absence_stage')) {
        tripsCol.fields.add(new NumberField({ name: 'current_absence_stage' }))
      }
      if (!tripsCol.fields.getByName('absence_stage_updated_at')) {
        tripsCol.fields.add(new TextField({ name: 'absence_stage_updated_at' }))
      }
      app.save(tripsCol)
    } catch (err) {
      console.log('Error modifying trips collection:', err)
    }

    // 2. Create absence_notifications collection to track notifications sent during the 4 stages
    const usersColId = '_pb_users_auth_'
    const tripsColId = app.findCollectionByNameOrId('trips').id

    const absenceNotifications = new Collection({
      name: 'absence_notifications',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
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
          required: true,
        },
        { name: 'stage', type: 'number', required: true },
        { name: 'recipient_type', type: 'text', required: true }, // 'traveler' | 'guardians_security' | 'guardians_all'
        { name: 'recipient_email', type: 'text', required: true },
        { name: 'recipient_name', type: 'text' },
        { name: 'subject', type: 'text', required: true },
        { name: 'message', type: 'text' },
        { name: 'status', type: 'text' }, // 'sent' | 'simulated' | 'failed'
        { name: 'sent_at', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_absence_notif_trip ON absence_notifications (trip_id, stage, created DESC)',
        'CREATE INDEX idx_absence_notif_user ON absence_notifications (user_id, created DESC)',
      ],
    })
    app.save(absenceNotifications)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('absence_notifications')
      app.delete(col)
    } catch (_) {}
  },
)
