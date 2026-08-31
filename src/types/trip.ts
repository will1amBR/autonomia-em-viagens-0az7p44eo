export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  emergencyPasscode?: string // Safe quick exit code
  duressMethod?: 'hold_3s' | 'volume_key' | 'secret_code'
  duressSecretCode?: string
  lastOnlineAt?: string
  lastLocationApprox?: string
}

export interface PresenceLog {
  id: string
  userId: string
  tripId?: string
  eventType:
    | 'login'
    | 'heartbeat'
    | 'checkin'
    | 'manual_update'
    | 'media_upload'
    | 'duress_signal'
    | 'guardian_gps_notification'
  locationLat?: number
  locationLng?: number
  locationName?: string
  accuracyMeters?: number
  deviceInfo?: string
  ipAddress?: string
  batteryLevel?: string
  notes?: string
  isDuress?: boolean
  timestamp: string
  created?: string
}

export interface ConfirmationMedia {
  id: string
  userId: string
  tripId?: string
  mediaType: 'photo_routine' | 'video_morning' | 'video_night' | 'photo_emergency'
  file?: string
  fileUrl?: string
  caption?: string
  locationApprox?: string
  locationLat?: number
  locationLng?: number
  takenUnderDuress?: boolean
  deviceInfo?: string
  timestamp: string
  created?: string
}

export interface DuressAlert {
  id: string
  userId: string
  tripId?: string
  triggerMethod: string
  locationLat?: number
  locationLng?: number
  locationAddress?: string
  deviceInfo?: string
  notifiedGuardiansCount?: number
  notifiedPolice?: boolean
  status: 'dispatched' | 'acknowledged' | 'investigating' | 'resolved'
  timestamp: string
  created?: string
}

export type IndependenceCategory =
  | 'documentation'
  | 'return'
  | 'finances'
  | 'communication'
  | 'housing'
  | 'mobility'
  | 'protectionNetwork'
  | 'emergency'

export interface IndependenceBreakdown {
  documentation: number // 0-100%
  return: number // 0-100%
  finances: number // 0-100%
  communication: number // 0-100%
  housing: number // 0-100%
  mobility: number // 0-100%
  protectionNetwork: number // 0-100%
  emergency: number // 0-100%
}

export type ScoreTier = 'HIGH' | 'MODERATE' | 'LOW'

export interface AutonomyScoreResult {
  overallScore: number // 0-100
  tier: ScoreTier
  summaryText: string
  breakdown: IndependenceBreakdown
  identifiedDependenceFactors: string[]
  recommendedActions: string[]
}

export interface TripAssessmentAnswers {
  // Central Question
  canReturnTomorrow: 'yes_alone' | 'yes_dependent' | 'no' | 'not_sure'

  // Documentation
  hasValidPassport: boolean
  hasDigitalCopies: boolean
  hasRequiredVisas: boolean
  hasPhysicalControlOfPassport: boolean

  // Return & Finances
  hasReturnTicket: boolean
  hasOwnMoney: boolean
  hasInternationalCard: boolean
  hasEmergencyReserve: boolean
  whoPaysTrip?: 'myself' | 'shared' | 'other_person' | 'company' | string
  whoPaysHousing?: 'myself' | 'shared' | 'other_person' | 'host' | string

  // Communication & Mobility
  hasWorkingPhone: boolean
  hasInternetEsim: boolean
  canBuyEssentialsAlone: boolean
  canLeaveHousingAlone: boolean
  canStayElsewhereIfNecessary: boolean

  // Relationship & Context
  relationshipDuration:
    | 'less_than_1_month'
    | '1_to_6_months'
    | '6_to_12_months'
    | 'more_than_1_year'
    | 'family_or_long_friend'
  inPersonMeetingsCount: 'never' | '1_to_2_times' | '3_to_5_times' | 'many_times' | 'lives_together'
  hasVisitedCountryBefore: boolean
  knowsHostPersonally: 'yes' | 'no' | 'partially'
  exactAddressKnown: boolean

  // Pressure & Dynamics Check
  respectsLimits: 'always' | 'sometimes' | 'rarely' | 'not_sure'
  minimizesConcerns: 'never' | 'sometimes' | 'frequently'
  feelsPressureToAcceptConditions: boolean
  feltNeedToChooseBetweenSafetyAndTrip: boolean
  familyFriendsInformedDetailed: boolean
}

export interface ChecklistItem {
  id: string
  title: string
  description: string
  category: 'documentacao' | 'retorno' | 'financeiro' | 'comunicacao' | 'seguranca' | 'destino'
  completed: boolean
  whyItMatters: string
  actionTip: string
  isRequiredForHighAutonomy: boolean
}

export type GuardianAccessType = 'basic' | 'security' | 'emergency'

export interface GuardianContact {
  id: string
  name: string
  relationship: string
  phone: string
  email: string
  country: string
  accessType: GuardianAccessType
  notifyOnCheckin: boolean
  receiveMissedCheckinAlert: boolean
  receiveFullItinerary: boolean
  notes?: string
}

export type CheckinStatus =
  | 'pending'
  | 'ok'
  | 'needs_help'
  | 'cannot_speak'
  | 'cancelled'
  | 'missed'

export type CheckinFrequency =
  | 'every_4h'
  | 'every_6h'
  | 'every_8h'
  | 'every_12h'
  | 'every_24h'
  | 'daily_once'
  | 'daily_twice'
  | 'custom'

export interface CheckinConfig {
  frequency: CheckinFrequency
  preferredTime: string // e.g. "21:00" ou startTime
  startTime?: string // e.g. "08:00"
  secondaryTime?: string
  shareLocation: boolean
  active: boolean
  notifyGuardiansOnAbsence: boolean // sim/não
  gracePeriodMinutes: number // 30 min window before Stage 1
}

export interface AbsenceNotificationLog {
  id: string
  userId: string
  tripId: string
  stage: 1 | 2 | 3 | 4
  recipientType: 'traveler' | 'guardians_security' | 'guardians_all'
  recipientEmail: string
  recipientName?: string
  subject: string
  message?: string
  status: 'sent' | 'simulated' | 'failed'
  sentAt: string
}

export interface CheckinLogEvent {
  id: string
  timestamp: string
  status: CheckinStatus
  note?: string
  locationApprox?: string
  escalationStage?: 1 | 2 | 3 | 4
}

export interface DestinationSupportContacts {
  country: string
  city: string
  policeNumber: string
  medicalEmergencyNumber: string
  generalEmergencyNumber: string
  consulateEmbassyName: string
  consulateAddress: string
  consulatePhone: string
  consulateEmail: string
  consulateEmergency24h: string
  referenceHospital: string
  womenHelpline?: string
  foreignerNote?: string
}

export interface TripDestination {
  country: string
  city: string
  countryCode: string
  policeNumber: string
  medicalEmergencyNumber: string
  generalEmergencyNumber: string
  consulateEmbassyName: string
  consulateAddress: string
  consulatePhone: string
  consulateEmail: string
  consulateEmergency24h: string
  safeHavens: {
    name: string
    type: string
    address: string
    notes: string
  }[]
  travelTips: string[]
}

export interface TripData {
  id: string
  title: string
  originCity?: string
  destinationCountry: string
  destinationCity: string
  transitCountries?: string
  departureDate: string
  returnDate: string
  tripReason: string
  accommodationType: string
  accommodationAddress: string
  whoIsPaying: string // "Eu mesmo(a)" | "Dividido (eu e outra pessoa)" | "Outra pessoa está pagando tudo" | "Prefiro não responder"
  travelingWith: string // "Sozinho(a)" | "Com amigos(as)" | "Com familiares" | "Com parceiro(a)/namorado(a)" | "Com alguém que conheci recentemente"
  hostResponsiblePerson: string
  hostRelationship?: string
  hostPhone?: string
  hostDocument?: string
  companionDetails?: string
  accommodationDetails?: Record<string, any>
  destinationContact: string
  assessment: TripAssessmentAnswers
  scoreResult: AutonomyScoreResult
  checklist: ChecklistItem[]
  guardians: GuardianContact[]
  checkinConfig: CheckinConfig
  checkinHistory: CheckinLogEvent[]
  absenceNotifications?: AbsenceNotificationLog[]
  currentAbsenceStage?: number
  lastCheckinAt?: string
  destinationInfo: TripDestination
  quickNotes?: string
  createdAt: string
  updatedAt: string
}
