import pb from '@/lib/pocketbase/client'
import {
  TripData,
  TripAssessmentAnswers,
  GuardianContact,
  CheckinLogEvent,
  CheckinStatus,
  ChecklistItem,
  TripDestination,
} from '@/types/trip'
import { DESTINATIONS_CATALOG, DEFAULT_CHECKLIST } from '@/lib/constants'
import { calculateAutonomyScore } from '@/lib/scoreCalculator'

export const tripsService = {
  async getDestinations(): Promise<TripDestination[]> {
    try {
      const records = await pb.collection('destinations').getFullList({ sort: 'country' })
      if (records.length > 0) {
        return records.map((r) => ({
          country: r.country,
          city: r.city,
          countryCode: r.country_code,
          policeNumber: r.police_number || '112',
          medicalEmergencyNumber: r.medical_emergency_number || '112',
          generalEmergencyNumber: r.general_emergency_number || '112',
          consulateEmbassyName: r.consulate_embassy_name || '',
          consulateAddress: r.consulate_address || '',
          consulatePhone: r.consulate_phone || '',
          consulateEmail: r.consulate_email || '',
          consulateEmergency24h: r.consulate_emergency_24h || '',
          safeHavens: Array.isArray(r.safe_havens) ? r.safe_havens : [],
          travelTips: Array.isArray(r.travel_tips) ? r.travel_tips : [],
        }))
      }
    } catch (e) {
      console.warn('Could not load destinations from server, using local catalog', e)
    }
    return Object.values(DESTINATIONS_CATALOG)
  },

  async getUserTrip(userId: string): Promise<TripData | null> {
    try {
      const tripRecords = await pb.collection('trips').getList(1, 1, {
        filter: `user_id = "${userId}"`,
        sort: '-created',
      })

      if (tripRecords.items.length === 0) {
        return null
      }

      const tripRec = tripRecords.items[0]

      // Fetch absence notifications
      let absenceLogs: any[] = []
      try {
        const notifRecords = await pb.collection('absence_notifications').getList(1, 30, {
          filter: `trip_id = "${tripRec.id}"`,
          sort: '-created',
        })
        absenceLogs = notifRecords.items.map((n) => ({
          id: n.id,
          userId: n.user_id,
          tripId: n.trip_id,
          stage: n.stage,
          recipientType: n.recipient_type,
          recipientEmail: n.recipient_email,
          recipientName: n.recipient_name,
          subject: n.subject,
          message: n.message,
          status: n.status || 'sent',
          sentAt: n.sent_at || n.created,
        }))
      } catch (e) {
        console.warn('Failed to load absence notifications', e)
      }

      // Fetch assessment
      let assessmentAnswers: TripAssessmentAnswers | undefined
      try {
        const assessRecords = await pb.collection('assessments').getList(1, 1, {
          filter: `trip_id = "${tripRec.id}"`,
          sort: '-created',
        })
        if (assessRecords.items.length > 0 && assessRecords.items[0].answers) {
          assessmentAnswers = assessRecords.items[0].answers
        }
      } catch (e) {
        console.warn('Failed to load assessment', e)
      }

      // Fetch guardians
      let guardiansList: GuardianContact[] = []
      try {
        const gRecords = await pb.collection('guardians').getFullList({
          filter: `trip_id = "${tripRec.id}"`,
          sort: 'created',
        })
        guardiansList = gRecords.map((g) => ({
          id: g.id,
          name: g.name,
          relationship: g.relationship || 'Contato',
          phone: g.phone,
          email: g.email || '',
          country: g.country || 'Brasil',
          accessType: (g.access_type as any) || 'emergency',
          notifyOnCheckin: !!g.notify_on_checkin,
          receiveMissedCheckinAlert: !!g.receive_missed_alert,
          receiveFullItinerary: !!g.receive_full_itinerary,
          notes: g.notes || '',
        }))
      } catch (e) {
        console.warn('Failed to load guardians', e)
      }

      // Fetch checkins
      let checkinsList: CheckinLogEvent[] = []
      try {
        const cRecords = await pb.collection('checkins').getList(1, 20, {
          filter: `trip_id = "${tripRec.id}"`,
          sort: '-timestamp',
        })
        checkinsList = cRecords.items.map((c) => ({
          id: c.id,
          timestamp: c.timestamp || c.created,
          status: c.status as CheckinStatus,
          note: c.note || '',
          locationApprox: c.location_approx || '',
          escalationStage: c.escalation_stage as any,
        }))
      } catch (e) {
        console.warn('Failed to load checkins', e)
      }

      // Fetch safety plans (checklist)
      let checklistItems: ChecklistItem[] = []
      try {
        const planRecords = await pb.collection('safety_plans').getFullList({
          filter: `trip_id = "${tripRec.id}"`,
          sort: 'created',
        })
        if (planRecords.length > 0) {
          checklistItems = planRecords.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            category: (p.category as any) || 'seguranca',
            completed: !!p.completed,
            whyItMatters: p.why_it_matters || '',
            actionTip: p.action_tip || '',
            isRequiredForHighAutonomy: !!p.is_required_for_high_autonomy,
          }))
        }
      } catch (e) {
        console.warn('Failed to load safety plans', e)
      }

      if (checklistItems.length === 0) {
        checklistItems = DEFAULT_CHECKLIST
      }

      const country = tripRec.destination_country || 'Itália'
      const destInfo = DESTINATIONS_CATALOG[country] || DESTINATIONS_CATALOG['Italia']

      const defaultAnswers: TripAssessmentAnswers = {
        canReturnTomorrow: 'yes_dependent',
        hasValidPassport: true,
        hasDigitalCopies: false,
        hasRequiredVisas: true,
        hasPhysicalControlOfPassport: true,
        hasReturnTicket: false,
        hasOwnMoney: false,
        hasInternationalCard: true,
        hasEmergencyReserve: false,
        whoPaysTrip: 'other_person',
        whoPaysHousing: 'other_person',
        hasWorkingPhone: true,
        hasInternetEsim: false,
        canBuyEssentialsAlone: true,
        canLeaveHousingAlone: true,
        canStayElsewhereIfNecessary: false,
        relationshipDuration: '1_to_6_months',
        inPersonMeetingsCount: '1_to_2_times',
        hasVisitedCountryBefore: false,
        knowsHostPersonally: 'partially',
        exactAddressKnown: true,
        respectsLimits: 'sometimes',
        minimizesConcerns: 'sometimes',
        feelsPressureToAcceptConditions: true,
        feltNeedToChooseBetweenSafetyAndTrip: false,
        familyFriendsInformedDetailed: true,
      }

      const activeAnswers = assessmentAnswers || defaultAnswers
      const scoreResult = calculateAutonomyScore(activeAnswers)

      return {
        id: tripRec.id,
        title: tripRec.title,
        originCity: tripRec.origin_city || '',
        destinationCountry: tripRec.destination_country,
        destinationCity: tripRec.destination_city,
        transitCountries: tripRec.transit_countries || '',
        departureDate: tripRec.departure_date,
        returnDate: tripRec.return_date,
        tripReason: tripRec.trip_reason || '',
        accommodationType: tripRec.accommodation_type || '',
        accommodationAddress: tripRec.accommodation_address || '',
        whoIsPaying: tripRec.who_is_paying || 'Eu mesmo(a)',
        travelingWith: tripRec.traveling_with || 'Sozinho(a)',
        hostResponsiblePerson: tripRec.host_responsible_person || '',
        destinationContact: tripRec.destination_contact || '',
        assessment: activeAnswers,
        scoreResult,
        checklist: checklistItems,
        guardians: guardiansList,
        checkinConfig: {
          frequency: (tripRec.checkin_frequency as any) || 'every_12h',
          preferredTime: tripRec.checkin_preferred_time || '21:00',
          startTime: tripRec.checkin_start_time || '08:00',
          shareLocation: true,
          active: tripRec.checkin_active !== false,
          notifyGuardiansOnAbsence: tripRec.notify_guardians_on_absence ?? true,
          gracePeriodMinutes: 30,
        },
        checkinHistory: checkinsList,
        absenceNotifications: absenceLogs,
        currentAbsenceStage: tripRec.current_absence_stage || 0,
        lastCheckinAt: tripRec.last_checkin_at || '',
        destinationInfo: destInfo,
        quickNotes: tripRec.quick_notes || '',
        createdAt: tripRec.created,
        updatedAt: tripRec.updated,
      }
    } catch (e) {
      console.error('Error fetching user trip from PocketBase:', e)
      return null
    }
  },

  async saveTrip(userId: string, trip: Partial<TripData>): Promise<string> {
    const payload = {
      user_id: userId,
      title: trip.title || 'Minha Viagem',
      origin_city: trip.originCity || '',
      destination_country: trip.destinationCountry || 'Itália',
      destination_city: trip.destinationCity || 'Roma',
      transit_countries: trip.transitCountries || '',
      departure_date: trip.departureDate || '',
      return_date: trip.returnDate || '',
      trip_reason: trip.tripReason || '',
      accommodation_type: trip.accommodationType || '',
      accommodation_address: trip.accommodationAddress || '',
      who_is_paying: trip.whoIsPaying || '',
      traveling_with: trip.travelingWith || '',
      host_responsible_person: trip.hostResponsiblePerson || '',
      destination_contact: trip.destinationContact || '',
      quick_notes: trip.quickNotes || '',
      checkin_frequency: trip.checkinConfig?.frequency || 'every_12h',
      checkin_preferred_time: trip.checkinConfig?.preferredTime || '21:00',
      checkin_start_time: trip.checkinConfig?.startTime || '08:00',
      checkin_active: trip.checkinConfig?.active ?? true,
      notify_guardians_on_absence: trip.checkinConfig?.notifyGuardiansOnAbsence ?? true,
    }

    if (trip.id && !trip.id.startsWith('trip-demo-') && !trip.id.startsWith('custom-')) {
      await pb.collection('trips').update(trip.id, payload)
      return trip.id
    } else {
      const rec = await pb.collection('trips').create(payload)
      return rec.id
    }
  },

  async saveAssessment(userId: string, tripId: string, answers: TripAssessmentAnswers) {
    const score = calculateAutonomyScore(answers)
    const payload = {
      user_id: userId,
      trip_id: tripId,
      overall_score: score.overallScore,
      tier: score.tier,
      summary_text: score.summaryText,
      answers,
      breakdown: score.breakdown,
      dependence_factors: score.identifiedDependenceFactors,
      recommendations: score.recommendedActions,
    }

    try {
      const existing = await pb.collection('assessments').getList(1, 1, {
        filter: `trip_id = "${tripId}"`,
      })
      if (existing.items.length > 0) {
        await pb.collection('assessments').update(existing.items[0].id, payload)
      } else {
        await pb.collection('assessments').create(payload)
      }
    } catch (e) {
      console.warn('Could not persist assessment to backend', e)
    }
  },

  async saveGuardian(
    userId: string,
    tripId: string,
    guardian: Omit<GuardianContact, 'id'>,
    existingId?: string,
  ) {
    const payload = {
      user_id: userId,
      trip_id: tripId,
      name: guardian.name,
      relationship: guardian.relationship,
      phone: guardian.phone,
      email: guardian.email,
      country: guardian.country,
      access_type: guardian.accessType,
      notify_on_checkin: guardian.notifyOnCheckin,
      receive_missed_alert: guardian.receiveMissedCheckinAlert,
      receive_full_itinerary: guardian.receiveFullItinerary,
      notes: guardian.notes || '',
    }

    if (existingId && !existingId.startsWith('g-')) {
      await pb.collection('guardians').update(existingId, payload)
      return existingId
    } else {
      const rec = await pb.collection('guardians').create(payload)
      return rec.id
    }
  },

  async deleteGuardian(id: string) {
    if (!id.startsWith('g-')) {
      try {
        await pb.collection('guardians').delete(id)
      } catch (e) {
        console.warn('Error deleting guardian record', e)
      }
    }
  },

  async logCheckin(
    userId: string,
    tripId: string,
    status: CheckinStatus,
    note?: string,
    location?: string,
  ) {
    try {
      const rec = await pb.collection('checkins').create({
        user_id: userId,
        trip_id: tripId,
        status,
        note: note || '',
        location_approx: location || '',
        timestamp: new Date().toISOString(),
      })

      // Reset trip absence stage
      if (status !== 'cancelled') {
        try {
          await pb.collection('trips').update(tripId, {
            current_absence_stage: 0,
            last_checkin_at: new Date().toISOString(),
          })
        } catch {
          /* intentionally ignored */
        }
      }

      return rec.id
    } catch (e) {
      console.warn('Error logging checkin to server', e)
      return `chk-${Date.now()}`
    }
  },

  async triggerAbsenceCheck(tripId: string, stage?: number) {
    try {
      const response = await pb.send('/api/v1/absence/check', {
        method: 'POST',
        body: {
          trip_id: tripId,
          stage: stage || 0,
        },
      })
      return response
    } catch (e) {
      console.warn('Could not run absence check API:', e)
      return null
    }
  },

  async syncChecklist(userId: string, tripId: string, checklist: ChecklistItem[]) {
    try {
      // Upsert checklist items
      for (const item of checklist) {
        const payload = {
          user_id: userId,
          trip_id: tripId,
          item_key: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          completed: item.completed,
          why_it_matters: item.whyItMatters,
          action_tip: item.actionTip,
          is_required_for_high_autonomy: item.isRequiredForHighAutonomy,
        }
        if (!item.id.includes('-') && item.id.length === 15) {
          // PB record id format
          await pb.collection('safety_plans').update(item.id, payload)
        }
      }
    } catch (e) {
      console.warn('Error syncing checklist items', e)
    }
  },
}
