migrate(
  (app) => {
    const tripsCol = app.findCollectionByNameOrId('trips')

    if (!tripsCol.fields.getByName('origin_city')) {
      tripsCol.fields.add(
        new TextField({
          name: 'origin_city',
          type: 'text',
          required: false,
        }),
      )
    }

    if (!tripsCol.fields.getByName('transit_countries')) {
      tripsCol.fields.add(
        new TextField({
          name: 'transit_countries',
          type: 'text',
          required: false,
        }),
      )
    }

    app.save(tripsCol)
  },
  (app) => {
    const tripsCol = app.findCollectionByNameOrId('trips')

    const originField = tripsCol.fields.getByName('origin_city')
    if (originField) {
      tripsCol.fields.removeByName('origin_city')
    }

    const transitField = tripsCol.fields.getByName('transit_countries')
    if (transitField) {
      tripsCol.fields.removeByName('transit_countries')
    }

    app.save(tripsCol)
  },
)
