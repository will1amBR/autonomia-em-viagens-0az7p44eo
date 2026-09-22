/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0010: Fix confirmation_media file field and duress_alerts access rules
 * - confirmation_media: add or verify 'media_file' (type 'file') or update collection fields
 * - duress_alerts: ensure @request.auth.role = 'police' can list/view/update
 * - users: ensure @request.auth.role = 'police' can view users list/record for alert expansion
 */
migrate(
  (app) => {
    // 1. Check & fix confirmation_media
    try {
      const mediaColl = app.findCollectionByNameOrId('confirmation_media')
      if (mediaColl) {
        // Check if media_file field exists
        const existingField = mediaColl.fields.getByName('media_file')
        if (!existingField) {
          mediaColl.fields.add(
            new FileField({
              name: 'media_file',
              required: false,
              maxSelect: 1,
              maxSize: 52428800, // 50MB
              mimeTypes: [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/gif',
                'image/heic',
                'video/mp4',
                'video/quicktime',
                'video/webm',
                'video/3gpp',
              ],
            }),
          )
        }
        mediaColl.listRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        mediaColl.viewRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        mediaColl.createRule = '@request.auth.id != ""'
        mediaColl.updateRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        mediaColl.deleteRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin")'
        app.save(mediaColl)
      }
    } catch (err) {
      console.log('[Migration 0010] Error updating confirmation_media:', err)
    }

    // 2. Check & fix duress_alerts rules
    try {
      const duressColl = app.findCollectionByNameOrId('duress_alerts')
      if (duressColl) {
        duressColl.listRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        duressColl.viewRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        duressColl.createRule = '@request.auth.id != ""'
        duressColl.updateRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        duressColl.deleteRule = '@request.auth.id != "" && (@request.auth.role = "admin")'
        app.save(duressColl)
      }
    } catch (err) {
      console.log('[Migration 0010] Error updating duress_alerts:', err)
    }

    // 3. Ensure users collection allows police to view users
    try {
      const usersColl = app.findCollectionByNameOrId('users')
      if (usersColl) {
        usersColl.listRule =
          '@request.auth.id != "" && (@request.auth.id = id || @request.auth.role = "admin" || @request.auth.role = "police")'
        usersColl.viewRule =
          '@request.auth.id != "" && (@request.auth.id = id || @request.auth.role = "admin" || @request.auth.role = "police")'
        app.save(usersColl)
      }
    } catch (err) {
      console.log('[Migration 0010] Error updating users rules:', err)
    }

    // 4. Ensure trips & guardians collections allow police to view
    try {
      const tripsColl = app.findCollectionByNameOrId('trips')
      if (tripsColl) {
        tripsColl.listRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        tripsColl.viewRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        app.save(tripsColl)
      }
      const guardiansColl = app.findCollectionByNameOrId('guardians')
      if (guardiansColl) {
        guardiansColl.listRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        guardiansColl.viewRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        app.save(guardiansColl)
      }
      const logsColl = app.findCollectionByNameOrId('presence_logs')
      if (logsColl) {
        logsColl.listRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        logsColl.viewRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        app.save(logsColl)
      }
      const absenceColl = app.findCollectionByNameOrId('absence_notifications')
      if (absenceColl) {
        absenceColl.listRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        absenceColl.viewRule =
          '@request.auth.id != "" && (@request.auth.id = user_id || @request.auth.role = "admin" || @request.auth.role = "police")'
        absenceColl.createRule = '@request.auth.id != ""'
        app.save(absenceColl)
      }
    } catch (err) {
      console.log('[Migration 0010] Error updating other collections for police role:', err)
    }
  },
  (app) => {
    // down migration
  },
)
