export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  emergencyPasscode?: string // Safe quick exit code
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
  whoPaysTrip: 'myself' | 'shared' | 'other_person' | 'company'
  whoPaysHousing: 'myself' | 'shared' | 'other_person' | 'host'

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

export interface CheckinConfig {
  frequency: 'daily_once' | 'daily_twice' | 'every_12h' | 'custom'
  preferredTime: string // e.g. "21:00"
  secondaryTime?: string
  shareLocation: boolean
  active: boolean
  gracePeriodMinutes: number // e.g. 60 min before escalation
}

export interface CheckinLogEvent {
  id: string
  timestamp: string
  status: CheckinStatus
  note?: string
  locationApprox?: string
  escalationStage?: 1 | 2 | 3 | 4
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
  destinationCountry: string
  destinationCity: string
  departureDate: string
  returnDate: string
  tripReason: string
  accommodationType: string
  accommodationAddress: string
  whoIsPaying: string
  travelingWith: string
  hostResponsiblePerson: string
  destinationContact: string
  assessment: TripAssessmentAnswers
  scoreResult: AutonomyScoreResult
  checklist: ChecklistItem[]
  guardians: GuardianContact[]
  checkinConfig: CheckinConfig
  checkinHistory: CheckinLogEvent[]
  destinationInfo: TripDestination
  quickNotes?: string
  createdAt: string
  updatedAt: string
}
