migrate(
  (app) => {
    // 1. Update users collection 'role' select field to include 'police'
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const roleField = users.fields.getByName('role')
    if (roleField) {
      roleField.values = ['user', 'admin', 'police']
    } else {
      users.fields.add(
        new SelectField({
          name: 'role',
          values: ['user', 'admin', 'police'],
          maxSelect: 1,
        }),
      )
    }
    app.save(users)

    // 2. Ensure trips collection has all host and transit fields
    const trips = app.findCollectionByNameOrId('trips')
    if (!trips.fields.getByName('origin_city')) {
      trips.fields.add(new TextField({ name: 'origin_city' }))
    }
    if (!trips.fields.getByName('transit_countries')) {
      trips.fields.add(new TextField({ name: 'transit_countries' }))
    }
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
    // Update trips list and view rules so police can also view authorized trip context
    trips.listRule =
      "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'police')"
    trips.viewRule =
      "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'police')"
    app.save(trips)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const roleField = users.fields.getByName('role')
    if (roleField) {
      roleField.values = ['user', 'admin']
      app.save(users)
    }
  },
)
