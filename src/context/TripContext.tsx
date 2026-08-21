import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  TripData,
  TripAssessmentAnswers,
  GuardianContact,
  CheckinStatus,
  CheckinLogEvent,
  UserProfile,
} from '../types/trip'
import { calculateAutonomyScore } from '../lib/scoreCalculator'
import { DEFAULT_CHECKLIST, DESTINATIONS_CATALOG } from '../lib/constants'

const INITIAL_ANSWERS: TripAssessmentAnswers = {
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

const INITIAL_TRIP: TripData = {
  id: 'trip-demo-roma-1',
  title: 'Viagem a Roma e Centro Histórico',
  destinationCountry: 'Itália',
  destinationCity: 'Roma',
  departureDate: '2025-05-12',
  returnDate: '2025-05-27',
  tripReason: 'Férias e convite pessoal',
  accommodationType: 'Apartamento alugado / Anfitrião',
  accommodationAddress: 'Via Nazionale, 114 - Roma RM, Itália',
  whoIsPaying: 'Pessoa conhecida recentemente assumindo passagens e hospedagem',
  travelingWith: 'Acompanhante / Convite pessoal',
  hostResponsiblePerson: 'Marco Bellini',
  destinationContact: '+39 345 987 6543',
  assessment: INITIAL_ANSWERS,
  scoreResult: calculateAutonomyScore(INITIAL_ANSWERS),
  checklist: DEFAULT_CHECKLIST,
  guardians: [
    {
      id: 'g-1',
      name: 'Mariana Silva',
      relationship: 'Irmã',
      phone: '+55 11 98765-4321',
      email: 'mariana.silva@email.com',
      country: 'Brasil',
      accessType: 'emergency',
      notifyOnCheckin: true,
      receiveMissedCheckinAlert: true,
      receiveFullItinerary: true,
      notes: 'Possui cópia das minhas fotos de passaporte e chave de segurança.',
    },
    {
      id: 'g-2',
      name: 'Lucas Mendes',
      relationship: 'Melhor amigo',
      phone: '+55 11 91234-5678',
      email: 'lucas.mendes@email.com',
      country: 'Brasil',
      accessType: 'security',
      notifyOnCheckin: false,
      receiveMissedCheckinAlert: true,
      receiveFullItinerary: false,
      notes: 'Avisar caso eu passe mais de 12 horas sem responder ao check-in programado.',
    },
  ],
  checkinConfig: {
    frequency: 'daily_once',
    preferredTime: '21:00',
    shareLocation: true,
    active: true,
    gracePeriodMinutes: 60,
  },
  checkinHistory: [
    {
      id: 'chk-1',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'ok',
      note: 'Check-in realizado com sucesso às 21:04. Tudo tranquilo no hotel.',
      locationApprox: 'Roma, Itália',
    },
  ],
  destinationInfo: DESTINATIONS_CATALOG['Italia'],
  quickNotes: 'Código da mala: 384. Endereço do consulado salvo.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'Camila Rocha',
  email: 'camila.rocha@email.com',
  phone: '+55 11 99887-7665',
  emergencyPasscode: '9911',
}

interface TripContextType {
  user: UserProfile
  setUser: (u: UserProfile) => void
  currentTrip: TripData
  updateTripAssessment: (answers: TripAssessmentAnswers) => void
  updateTripDetails: (details: Partial<TripData>) => void
  toggleChecklistItem: (id: string) => void
  addChecklistItem: (item: { title: string; category: any; whyItMatters: string }) => void
  addGuardian: (guardian: Omit<GuardianContact, 'id'>) => void
  updateGuardian: (id: string, updates: Partial<GuardianContact>) => void
  removeGuardian: (id: string) => void
  performCheckin: (status: CheckinStatus, note?: string) => void
  updateCheckinConfig: (config: Partial<TripData['checkinConfig']>) => void
  triggerEmergencyAlert: (details: { reason: string; location?: string }) => void
  resetToDefault: () => void
  isQuickExitActive: boolean
  triggerQuickExit: () => void
  restoreFromQuickExit: () => void
}

const TripContext = createContext<TripContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'autonomia_viagens_trip_data_v2'
const LOCAL_STORAGE_USER_KEY = 'autonomia_viagens_user_data_v2'

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
      return saved ? JSON.parse(saved) : INITIAL_USER
    } catch {
      return INITIAL_USER
    }
  })

  const [currentTrip, setCurrentTrip] = useState<TripData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // ensure score is recalculable
        if (parsed.assessment) {
          parsed.scoreResult = calculateAutonomyScore(parsed.assessment)
        }
        return parsed
      }
      return INITIAL_TRIP
    } catch {
      return INITIAL_TRIP
    }
  })

  const [isQuickExitActive, setIsQuickExitActive] = useState<boolean>(false)

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentTrip))
    } catch {
      // ignore
    }
  }, [currentTrip])

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user))
    } catch {
      // ignore
    }
  }, [user])

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser)
  }

  const updateTripAssessment = (answers: TripAssessmentAnswers) => {
    const scoreResult = calculateAutonomyScore(answers)
    setCurrentTrip((prev) => ({
      ...prev,
      assessment: answers,
      scoreResult,
      updatedAt: new Date().toISOString(),
    }))
  }

  const updateTripDetails = (details: Partial<TripData>) => {
    setCurrentTrip((prev) => {
      let destInfo = prev.destinationInfo
      if (details.destinationCountry && DESTINATIONS_CATALOG[details.destinationCountry]) {
        destInfo = DESTINATIONS_CATALOG[details.destinationCountry]
      }
      return {
        ...prev,
        ...details,
        destinationInfo: destInfo,
        updatedAt: new Date().toISOString(),
      }
    })
  }

  const toggleChecklistItem = (id: string) => {
    setCurrentTrip((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
      updatedAt: new Date().toISOString(),
    }))
  }

  const addChecklistItem = (item: { title: string; category: any; whyItMatters: string }) => {
    const newItem = {
      id: `custom-${Date.now()}`,
      title: item.title,
      description: 'Item personalizado adicionado pelo viajante.',
      category: item.category || 'seguranca',
      completed: false,
      whyItMatters: item.whyItMatters || 'Ajuda a manter escolhas livres e documentação segura.',
      actionTip: 'Realize este passo antes de embarcar.',
      isRequiredForHighAutonomy: false,
    }
    setCurrentTrip((prev) => ({
      ...prev,
      checklist: [newItem, ...prev.checklist],
      updatedAt: new Date().toISOString(),
    }))
  }

  const addGuardian = (guardian: Omit<GuardianContact, 'id'>) => {
    const newG: GuardianContact = {
      ...guardian,
      id: `g-${Date.now()}`,
    }
    setCurrentTrip((prev) => ({
      ...prev,
      guardians: [...prev.guardians, newG],
      updatedAt: new Date().toISOString(),
    }))
  }

  const updateGuardian = (id: string, updates: Partial<GuardianContact>) => {
    setCurrentTrip((prev) => ({
      ...prev,
      guardians: prev.guardians.map((g) => (g.id === id ? { ...g, ...updates } : g)),
      updatedAt: new Date().toISOString(),
    }))
  }

  const removeGuardian = (id: string) => {
    setCurrentTrip((prev) => ({
      ...prev,
      guardians: prev.guardians.filter((g) => g.id !== id),
      updatedAt: new Date().toISOString(),
    }))
  }

  const performCheckin = (status: CheckinStatus, note?: string) => {
    const newLog: CheckinLogEvent = {
      id: `chk-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status,
      note:
        note ||
        (status === 'ok'
          ? 'Confirmação rápida realizada com sucesso.'
          : 'Alerta de check-in disparado.'),
      locationApprox: currentTrip.destinationCity + ', ' + currentTrip.destinationCountry,
    }
    setCurrentTrip((prev) => ({
      ...prev,
      checkinHistory: [newLog, ...prev.checkinHistory],
      updatedAt: new Date().toISOString(),
    }))
  }

  const updateCheckinConfig = (config: Partial<TripData['checkinConfig']>) => {
    setCurrentTrip((prev) => ({
      ...prev,
      checkinConfig: {
        ...prev.checkinConfig,
        ...config,
      },
      updatedAt: new Date().toISOString(),
    }))
  }

  const triggerEmergencyAlert = (details: { reason: string; location?: string }) => {
    const emergencyEvent: CheckinLogEvent = {
      id: `emergency-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'needs_help',
      note: `🚨 MODO DE EMERGÊNCIA ATIVADO: ${details.reason}`,
      locationApprox: details.location || currentTrip.destinationCity,
      escalationStage: 4,
    }
    setCurrentTrip((prev) => ({
      ...prev,
      checkinHistory: [emergencyEvent, ...prev.checkinHistory],
      updatedAt: new Date().toISOString(),
    }))
  }

  const resetToDefault = () => {
    setCurrentTrip(INITIAL_TRIP)
    setUserState(INITIAL_USER)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
  }

  const triggerQuickExit = () => {
    setIsQuickExitActive(true)
  }

  const restoreFromQuickExit = () => {
    setIsQuickExitActive(false)
  }

  return (
    <TripContext.Provider
      value={{
        user,
        setUser,
        currentTrip,
        updateTripAssessment,
        updateTripDetails,
        toggleChecklistItem,
        addChecklistItem,
        addGuardian,
        updateGuardian,
        removeGuardian,
        performCheckin,
        updateCheckinConfig,
        triggerEmergencyAlert,
        resetToDefault,
        isQuickExitActive,
        triggerQuickExit,
        restoreFromQuickExit,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export const useTrip = () => {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
