import pb from '@/lib/pocketbase/client'
import { TripDestination } from '@/types/trip'
import { SecurityLibraryCategory } from '@/lib/constants'

export interface PlatformMetrics {
  totalUsers: number
  totalAdmins: number
  totalTrips: number
  totalAssessments: number
  averageScore: number
  scoreDistribution: {
    high: number
    moderate: number
    low: number
  }
  recentTrips: any[]
}

export interface AdminTripOverview {
  id: string
  userId: string
  user_id?: string
  userName?: string
  user_name?: string
  userEmail?: string
  user_email?: string
  title: string
  originCity?: string
  origin_city?: string
  destinationCountry: string
  destination_country?: string
  destinationCity: string
  destination_city?: string
  transitCountries?: string
  transit_countries?: string
  startDate?: string
  start_date?: string
  endDate?: string
  end_date?: string
  accommodationType?: string
  accommodation_type?: string
  accommodationAddress?: string
  accommodation_address?: string
  hostResponsiblePerson?: string
  host_responsible_person?: string
  hostRelationship?: string
  host_relationship?: string
  hostPhone?: string
  host_phone?: string
  stayingWith?: string
  staying_with?: string
  destinationContact?: string
  destination_contact?: string
  whoIsPaying?: string
  who_is_paying?: string
  travelingWith?: string
  traveling_with?: string
  status?: string
  autonomyScore?: number
}

export const adminService = {
  async listActiveTrips(): Promise<AdminTripOverview[]> {
    try {
      const records = await pb.collection('trips').getFullList({
        sort: '-created',
        expand: 'user_id',
      })
      return records.map((r) => ({
        id: r.id,
        userId: r.user_id,
        user_id: r.user_id,
        userName: r.expand?.user_id?.name || 'Viajante',
        user_name: r.expand?.user_id?.name || 'Viajante',
        userEmail: r.expand?.user_id?.email || '',
        user_email: r.expand?.user_id?.email || '',
        title: r.title,
        originCity: r.origin_city,
        origin_city: r.origin_city,
        destinationCountry: r.destination_country,
        destination_country: r.destination_country,
        destinationCity: r.destination_city,
        destination_city: r.destination_city,
        transitCountries: r.transit_countries,
        transit_countries: r.transit_countries,
        startDate: r.start_date,
        start_date: r.start_date,
        endDate: r.end_date,
        end_date: r.end_date,
        accommodationType: r.accommodation_type,
        accommodation_type: r.accommodation_type,
        accommodationAddress: r.accommodation_address,
        accommodation_address: r.accommodation_address,
        hostResponsiblePerson: r.host_responsible_person,
        host_responsible_person: r.host_responsible_person,
        hostRelationship: r.host_relationship,
        host_relationship: r.host_relationship,
        hostPhone: r.host_phone,
        host_phone: r.host_phone,
        stayingWith: r.staying_with,
        staying_with: r.staying_with,
        destinationContact: r.destination_contact,
        destination_contact: r.destination_contact,
        whoIsPaying: r.who_is_paying,
        who_is_paying: r.who_is_paying,
        travelingWith: r.traveling_with,
        traveling_with: r.traveling_with,
        status: r.status,
        autonomyScore: r.autonomy_score,
      }))
    } catch (err) {
      console.warn('Error fetching active trips for admin:', err)
      return []
    }
  },

  async getPlatformMetrics(): Promise<PlatformMetrics> {
    try {
      const [users, trips, assessments] = await Promise.all([
        pb.collection('users').getFullList({ sort: '-created' }),
        pb.collection('trips').getFullList({ sort: '-created' }),
        pb.collection('assessments').getFullList({ sort: '-created' }),
      ])

      const totalUsers = users.length
      const totalAdmins = users.filter((u) => u.role === 'admin').length
      const totalTrips = trips.length
      const totalAssessments = assessments.length

      let scoreSum = 0
      let high = 0
      let moderate = 0
      let low = 0

      assessments.forEach((a) => {
        const score = typeof a.overall_score === 'number' ? a.overall_score : 50
        scoreSum += score
        if (score >= 75) high++
        else if (score >= 45) moderate++
        else low++
      })

      const averageScore = totalAssessments > 0 ? Math.round(scoreSum / totalAssessments) : 70

      return {
        totalUsers,
        totalAdmins,
        totalTrips,
        totalAssessments,
        averageScore,
        scoreDistribution: {
          high,
          moderate,
          low,
        },
        recentTrips: trips.slice(0, 5),
      }
    } catch (e) {
      console.error('Error fetching real admin metrics from backend:', e)
      return {
        totalUsers: 0,
        totalAdmins: 0,
        totalTrips: 0,
        totalAssessments: 0,
        averageScore: 0,
        scoreDistribution: { high: 0, moderate: 0, low: 0 },
        recentTrips: [],
      }
    }
  },

  async listDestinations(): Promise<any[]> {
    return pb.collection('destinations').getFullList({ sort: 'country' })
  },

  async createDestination(data: Partial<TripDestination>): Promise<any> {
    return pb.collection('destinations').create({
      country: data.country,
      city: data.city,
      country_code: data.countryCode,
      police_number: data.policeNumber,
      medical_emergency_number: data.medicalEmergencyNumber,
      general_emergency_number: data.generalEmergencyNumber,
      consulate_embassy_name: data.consulateEmbassyName,
      consulate_address: data.consulateAddress,
      consulate_phone: data.consulatePhone,
      consulate_email: data.consulateEmail,
      consulate_emergency_24h: data.consulateEmergency24h,
      safe_havens: data.safeHavens || [],
      travel_tips: data.travelTips || [],
    })
  },

  async updateDestination(id: string, data: Partial<TripDestination>): Promise<any> {
    return pb.collection('destinations').update(id, {
      country: data.country,
      city: data.city,
      country_code: data.countryCode,
      police_number: data.policeNumber,
      medical_emergency_number: data.medicalEmergencyNumber,
      general_emergency_number: data.generalEmergencyNumber,
      consulate_embassy_name: data.consulateEmbassyName,
      consulate_address: data.consulateAddress,
      consulate_phone: data.consulatePhone,
      consulate_email: data.consulateEmail,
      consulate_emergency_24h: data.consulateEmergency24h,
      safe_havens: data.safeHavens,
      travel_tips: data.travelTips,
    })
  },

  async deleteDestination(id: string): Promise<boolean> {
    await pb.collection('destinations').delete(id)
    return true
  },

  async listSecurityLibrary(): Promise<any[]> {
    return pb.collection('security_library').getFullList({ sort: 'title' })
  },

  async updateSecurityTopic(id: string, data: Partial<SecurityLibraryCategory>): Promise<any> {
    return pb.collection('security_library').update(id, {
      title: data.title,
      short_summary: data.shortSummary,
      urgency_level: data.urgencyLevel,
      immediate_steps: data.immediateSteps,
      what_not_to_do: data.whatNotToDo,
      rights_and_resources: data.rightsAndResources,
    })
  },

  async createSecurityTopic(data: SecurityLibraryCategory): Promise<any> {
    return pb.collection('security_library').create({
      slug: data.id,
      title: data.title,
      icon_name: data.iconName || 'Shield',
      urgency_level: data.urgencyLevel,
      short_summary: data.shortSummary,
      immediate_steps: data.immediateSteps,
      what_not_to_do: data.whatNotToDo,
      rights_and_resources: data.rightsAndResources,
    })
  },

  async deleteSecurityTopic(id: string): Promise<boolean> {
    await pb.collection('security_library').delete(id)
    return true
  },
}
