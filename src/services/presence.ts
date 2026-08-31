import pb from '@/lib/pocketbase/client'
import { PresenceLog, ConfirmationMedia, DuressAlert } from '@/types/trip'

export interface GpsDevicePayload {
  trip_id?: string
  guardian_ids?: string[]
  message?: string
  location_lat?: number
  location_lng?: number
  location_name?: string
  accuracy_meters?: number
  device_info?: string
  timestamp?: string
  is_manual_location?: boolean
}

export interface DuressAlertPayload {
  trip_id?: string
  trigger_method: 'button_hold' | 'volume_key' | 'secret_code' | 'discreet_media_button'
  location_lat?: number
  location_lng?: number
  location_address?: string
  device_info?: string
  timestamp?: string
}

export const presenceService = {
  // Capture device user-agent & basic platform details
  getDeviceInfo(): string {
    if (typeof window === 'undefined') return 'Dispositivo Desconhecido'
    const ua = navigator.userAgent
    let platform = 'Navegador Web'
    if (/iPhone|iPad|iPod/i.test(ua)) platform = 'Apple iOS (Mobile)'
    else if (/Android/i.test(ua)) platform = 'Android Device (Mobile)'
    else if (/Macintosh|Mac OS X/i.test(ua)) platform = 'macOS Desktop'
    else if (/Windows/i.test(ua)) platform = 'Windows PC'
    else if (/Linux/i.test(ua)) platform = 'Linux'

    const browser = /Chrome/i.test(ua)
      ? 'Chrome'
      : /Safari/i.test(ua)
        ? 'Safari'
        : /Firefox/i.test(ua)
          ? 'Firefox'
          : /Edge/i.test(ua)
            ? 'Edge'
            : 'Web'
    return `${platform} (${browser}) • ${new Date().toLocaleTimeString('pt-BR')}`
  },

  // Get current browser geolocation as Promise
  async getCurrentPosition(): Promise<{
    lat?: number
    lng?: number
    accuracy?: number
    error?: string
  }> {
    if (!navigator.geolocation) {
      return { error: 'Geolocalização não suportada pelo navegador' }
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          })
        },
        (err) => {
          console.warn('Geolocation permission/error:', err)
          resolve({ error: err.message || 'Permissão de GPS negada' })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  },

  // Send automatic email with GPS and device info to selected guardians
  async sendGpsNotificationToGuardians(payload: GpsDevicePayload) {
    try {
      const res = await pb.send('/api/guardian-notify-gps', {
        method: 'POST',
        body: payload,
      })
      return res
    } catch (e: any) {
      console.error('Error calling guardian-notify-gps hook:', e)
      throw new Error(e.message || 'Falha ao enviar e-mail com localização.')
    }
  },

  // Trigger silent duress alert (notifies emergency guardians and police without showing alerts on screen)
  async triggerSilentDuressAlert(payload: DuressAlertPayload) {
    try {
      const res = await pb.send('/api/duress-silent-alert', {
        method: 'POST',
        body: payload,
      })
      return res
    } catch (e: any) {
      console.warn('Silent duress triggered with warning (continuing silently):', e)
      return { success: true, silent: true }
    }
  },

  // Record presence event in PocketBase
  async recordPresenceLog(
    userId: string,
    eventType: PresenceLog['eventType'],
    options?: {
      tripId?: string
      lat?: number
      lng?: number
      locationName?: string
      accuracy?: number
      notes?: string
      isDuress?: boolean
    },
  ): Promise<string | null> {
    try {
      const timestamp = new Date().toISOString()
      const deviceInfo = this.getDeviceInfo()
      const rec = await pb.collection('presence_logs').create({
        user_id: userId,
        trip_id: options?.tripId || '',
        event_type: eventType,
        location_lat: options?.lat,
        location_lng: options?.lng,
        location_name:
          options?.locationName ||
          (options?.lat ? `${options.lat.toFixed(5)}, ${options.lng?.toFixed(5)}` : ''),
        accuracy_meters: options?.accuracy,
        device_info: deviceInfo,
        notes: options?.notes || '',
        is_duress: !!options?.isDuress,
        timestamp,
      })
      return rec.id
    } catch (e) {
      console.warn('Error recording presence log:', e)
      return null
    }
  },

  // List presence logs for traveler/guardians/police
  async listPresenceLogs(userId?: string, tripId?: string): Promise<PresenceLog[]> {
    try {
      const filterParts: string[] = []
      if (userId) filterParts.push(`user_id = "${userId}"`)
      if (tripId) filterParts.push(`trip_id = "${tripId}"`)
      const filter = filterParts.join(' && ')

      const res = await pb.collection('presence_logs').getList<PresenceLog>(1, 50, {
        filter: filter || undefined,
        sort: '-created',
      })

      return res.items.map((i: any) => ({
        id: i.id,
        userId: i.user_id,
        tripId: i.trip_id,
        eventType: i.event_type,
        locationLat: i.location_lat,
        locationLng: i.location_lng,
        locationName: i.location_name,
        accuracyMeters: i.accuracy_meters,
        deviceInfo: i.device_info,
        ipAddress: i.ip_address,
        batteryLevel: i.battery_level,
        notes: i.notes,
        isDuress: i.is_duress,
        timestamp: i.timestamp || i.created,
        created: i.created,
      }))
    } catch (e) {
      console.warn('Error listing presence logs:', e)
      return []
    }
  },

  // Upload confirmation photo or morning/night video
  async uploadConfirmationMedia(formData: FormData): Promise<any> {
    try {
      const rec = await pb.collection('confirmation_media').create(formData)
      return rec
    } catch (e: any) {
      console.error('Error uploading confirmation media:', e)
      throw new Error(e.message || 'Falha ao enviar arquivo de confirmação.')
    }
  },

  // List confirmation media records
  async listConfirmationMedia(userId?: string, tripId?: string): Promise<ConfirmationMedia[]> {
    try {
      const filterParts: string[] = []
      if (userId) filterParts.push(`user_id = "${userId}"`)
      if (tripId) filterParts.push(`trip_id = "${tripId}"`)
      const filter = filterParts.join(' && ')

      const res = await pb.collection('confirmation_media').getList(1, 50, {
        filter: filter || undefined,
        sort: '-created',
      })

      return res.items.map((i: any) => ({
        id: i.id,
        userId: i.user_id,
        tripId: i.trip_id,
        mediaType: i.media_type,
        file: i.file,
        fileUrl: i.file ? pb.files.getURL(i, i.file) : undefined,
        caption: i.caption,
        locationApprox: i.location_approx,
        locationLat: i.location_lat,
        locationLng: i.location_lng,
        takenUnderDuress: i.taken_under_duress,
        deviceInfo: i.device_info,
        timestamp: i.timestamp || i.created,
        created: i.created,
      }))
    } catch (e) {
      console.warn('Error listing confirmation media:', e)
      return []
    }
  },

  // List duress alerts (for admin/police/emergency guardians)
  async listDuressAlerts(): Promise<DuressAlert[]> {
    try {
      const res = await pb.collection('duress_alerts').getList(1, 30, {
        sort: '-created',
      })
      return res.items.map((i: any) => ({
        id: i.id,
        userId: i.user_id,
        tripId: i.trip_id,
        triggerMethod: i.trigger_method,
        locationLat: i.location_lat,
        locationLng: i.location_lng,
        locationAddress: i.location_address,
        deviceInfo: i.device_info,
        notifiedGuardiansCount: i.notified_guardians_count,
        notifiedPolice: i.notified_police,
        status: i.status,
        timestamp: i.timestamp || i.created,
        created: i.created,
      }))
    } catch (e) {
      console.warn('Error listing duress alerts:', e)
      return []
    }
  },
}
