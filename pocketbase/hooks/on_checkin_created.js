// Hook: onRecordAfterCreateSuccess on "checkins"
// Resets absence stage to 0 and updates last_checkin_at on the parent trip
onRecordAfterCreateSuccess((e) => {
  const checkin = e.record
  const tripId = checkin.getString('trip_id')
  const status = checkin.getString('status')

  if (tripId && status !== 'cancelled') {
    try {
      const trip = $app.findRecordById('trips', tripId)
      trip.set('current_absence_stage', 0)
      trip.set('last_checkin_at', checkin.getString('timestamp') || new Date().toISOString())
      $app.save(trip)
    } catch (err) {
      console.log('Error updating trip after checkin:', err)
    }
  }

  e.next()
}, 'checkins')
