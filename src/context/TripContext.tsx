import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  TripData,
  TripAssessmentAnswers,
  GuardianContact,
  CheckinStatus,
  CheckinLogEvent,
  UserProfile,
  ChecklistItem,
} from '../types/trip'
import { calculateAutonomyScore } from '../lib/scoreCalculator'
import { DEFAULT_CHECKLIST, DESTINATIONS_CATALOG } from '../lib/constants'
import { tripsService } from '../services/trips'
import { useAuth } from './AuthContext'

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
  originCity: 'São Paulo',
  transitCountries: 'Reino Unido (Londres)',
  whoIsPaying: 'Outra pessoa está pagando tudo',
  travelingWith: 'Com alguém que conheci recentemente',
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
    frequency: 'every_12h',
    preferredTime: '21:00',
    startTime: '08:00',
    shareLocation: true,
    active: true,
    notifyGuardiansOnAbsence: true,
    gracePeriodMinutes: 30,
  },
  currentAbsenceStage: 0,
  absenceNotifications: [
    {
      id: 'notif-demo-1',
      userId: 'usr-1',
      tripId: 'trip-demo-roma-1',
      stage: 1,
      recipientType: 'traveler',
      recipientEmail: 'camila.rocha@email.com',
      recipientName: 'Camila Rocha',
      subject: 'SafeTrip: Verificação de rotina — Está tudo bem?',
      message: 'Aviso direto enviado ao próprio viajante após 30 min sem resposta.',
      status: 'sent',
      sentAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ],
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
  trips: TripData[]
  currentTrip: TripData | null
  hasTrip: boolean
  activeTripId: string | null
  setActiveTripId: (tripId: string) => void
  createTrip: (details: Partial<TripData>) => Promise<string>
  deleteTrip: (tripId: string) => Promise<void>
  updateTripAssessment: (answers: TripAssessmentAnswers) => Promise<void>
  updateTripDetails: (details: Partial<TripData>) => Promise<string | undefined>
  toggleChecklistItem: (id: string) => Promise<void>
  addChecklistItem: (item: { title: string; category: any; whyItMatters: string }) => Promise<void>
  addGuardian: (guardian: Omit<GuardianContact, 'id'>) => Promise<void>
  updateGuardian: (id: string, updates: Partial<GuardianContact>) => Promise<void>
  removeGuardian: (id: string) => Promise<void>
  performCheckin: (status: CheckinStatus, note?: string) => Promise<void>
  updateCheckinConfig: (config: Partial<TripData['checkinConfig']>) => Promise<void>
  triggerEmergencyAlert: (details: { reason: string; location?: string }) => Promise<void>
  simulateAbsenceStage: (stage: 1 | 2 | 3 | 4) => Promise<void>
  resetToDefault: () => void
  isQuickExitActive: boolean
  triggerQuickExit: () => void
  restoreFromQuickExit: () => void
  isLoadingTrip: boolean
  refreshTrip: () => Promise<void>
}

const TripContext = createContext<TripContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'autonomia_viagens_trip_data_v3'
const LOCAL_STORAGE_USER_KEY = 'autonomia_viagens_user_data_v3'

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, isAuthenticated } = useAuth()
  const [isLoadingTrip, setIsLoadingTrip] = useState<boolean>(false)
  const [trips, setTrips] = useState<TripData[]>([])
  const [activeTripId, setActiveTripIdState] = useState<string | null>(null)

  const [user, setUserState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
      return saved ? JSON.parse(saved) : INITIAL_USER
    } catch {
      return INITIAL_USER
    }
  })

  const [currentTrip, setCurrentTrip] = useState<TripData | null>(() => {
    // For non-authenticated visitors, default to demo trip or saved demo
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.assessment) {
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

  // Sync auth user with local user profile
  useEffect(() => {
    if (authUser) {
      setUserState({
        id: authUser.id,
        name: authUser.name || authUser.email.split('@')[0],
        email: authUser.email,
        phone: authUser.phone,
        emergencyPasscode: authUser.emergency_passcode || '9911',
      })
    }
  }, [authUser])

  // Fetch all trips from PocketBase when user logs in.
  const refreshTrip = useCallback(async () => {
    if (!authUser?.id) return
    setIsLoadingTrip(true)
    try {
      const dbTrips = await tripsService.getUserTrips(authUser.id)
      setTrips(dbTrips)
      if (dbTrips.length > 0) {
        // If an activeTripId is already set and exists, keep it; else default to first
        const matched = activeTripId ? dbTrips.find((t) => t.id === activeTripId) : null
        const active = matched || dbTrips[0]
        setCurrentTrip(active)
        setActiveTripIdState(active.id)
      } else {
        // Logged-in user has no trips in database
        setCurrentTrip(null)
        setActiveTripIdState(null)
      }
    } catch (e) {
      console.warn('Could not sync user trips with database', e)
      setCurrentTrip(null)
      setTrips([])
    } finally {
      setIsLoadingTrip(false)
    }
  }, [authUser?.id, activeTripId])

  useEffect(() => {
    if (isAuthenticated && authUser?.id) {
      refreshTrip()
    } else if (!isAuthenticated) {
      // Visitor / unauthenticated: restore demo or local trip
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.assessment) {
            parsed.scoreResult = calculateAutonomyScore(parsed.assessment)
          }
          setCurrentTrip(parsed || INITIAL_TRIP)
          setTrips([parsed || INITIAL_TRIP])
          setActiveTripIdState((parsed || INITIAL_TRIP).id)
        } else {
          setCurrentTrip(INITIAL_TRIP)
          setTrips([INITIAL_TRIP])
          setActiveTripIdState(INITIAL_TRIP.id)
        }
      } catch {
        setCurrentTrip(INITIAL_TRIP)
        setTrips([INITIAL_TRIP])
        setActiveTripIdState(INITIAL_TRIP.id)
      }
    }
  }, [isAuthenticated, authUser?.id, refreshTrip])

  const setActiveTripId = (tripId: string) => {
    setActiveTripIdState(tripId)
    const found = trips.find((t) => t.id === tripId)
    if (found) {
      setCurrentTrip(found)
    }
  }

  const createTrip = async (details: Partial<TripData>): Promise<string> => {
    let destInfo = DESTINATIONS_CATALOG['Italia']
    const destCountry = details.destinationCountry || 'Itália'
    const formattedKey = destCountry.replace(/\s+/g, '')
    if (DESTINATIONS_CATALOG[destCountry]) {
      destInfo = DESTINATIONS_CATALOG[destCountry]
    } else if (DESTINATIONS_CATALOG[formattedKey]) {
      destInfo = DESTINATIONS_CATALOG[formattedKey]
    }

    const newTripObj: TripData = {
      id: `trip-${Date.now()}`,
      title: details.title || 'Nova Viagem',
      originCity: details.originCity || 'São Paulo',
      destinationCountry: destCountry,
      destinationCity: details.destinationCity || 'Roma',
      transitCountries: details.transitCountries || '',
      departureDate: details.departureDate || new Date().toISOString().split('T')[0],
      returnDate:
        details.returnDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      tripReason: details.tripReason || 'Turismo',
      accommodationType: details.accommodationType || 'Hotel',
      accommodationAddress: details.accommodationAddress || '',
      whoIsPaying: details.whoIsPaying || 'Eu mesmo(a)',
      travelingWith: details.travelingWith || 'Sozinho(a)',
      hostResponsiblePerson: details.hostResponsiblePerson || '',
      destinationContact: details.destinationContact || '',
      assessment: INITIAL_ANSWERS,
      scoreResult: calculateAutonomyScore(INITIAL_ANSWERS),
      checklist: DEFAULT_CHECKLIST,
      guardians: [],
      checkinConfig: {
        frequency: 'every_12h',
        preferredTime: '21:00',
        startTime: '08:00',
        shareLocation: true,
        active: true,
        notifyGuardiansOnAbsence: true,
        gracePeriodMinutes: 30,
      },
      checkinHistory: [],
      absenceNotifications: [],
      currentAbsenceStage: 0,
      destinationInfo: destInfo,
      quickNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (authUser?.id) {
      try {
        const savedId = await tripsService.saveTrip(authUser.id, newTripObj)
        if (savedId) {
          newTripObj.id = savedId
        }
      } catch (e) {
        console.warn('Error creating trip in DB', e)
      }
    }

    setCurrentTrip(newTripObj)
    setActiveTripIdState(newTripObj.id)
    setTrips((prev) => [newTripObj, ...prev.filter((t) => t.id !== newTripObj.id)])
    return newTripObj.id
  }

  const deleteTrip = async (tripId: string) => {
    if (authUser?.id) {
      await tripsService.deleteTrip(tripId)
    }
    const remaining = trips.filter((t) => t.id !== tripId)
    setTrips(remaining)
    if (currentTrip?.id === tripId) {
      const nextActive = remaining.length > 0 ? remaining[0] : null
      setCurrentTrip(nextActive)
      setActiveTripIdState(nextActive ? nextActive.id : null)
    }
  }

  useEffect(() => {
    try {
      if (currentTrip) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentTrip))
      } else if (isAuthenticated) {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [currentTrip, isAuthenticated])

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

  const updateTripAssessment = async (answers: TripAssessmentAnswers) => {
    const scoreResult = calculateAutonomyScore(answers)
    const base = currentTrip || INITIAL_TRIP
    const updated: TripData = {
      ...base,
      assessment: answers,
      scoreResult,
      updatedAt: new Date().toISOString(),
    }
    setCurrentTrip(updated)

    if (authUser?.id && updated.id && !updated.id.startsWith('trip-demo-')) {
      try {
        await tripsService.saveAssessment(authUser.id, updated.id, answers)
      } catch (e) {
        console.warn('Error saving assessment', e)
      }
    }
  }

  const updateTripDetails = async (details: Partial<TripData>): Promise<string | undefined> => {
    const base = currentTrip || INITIAL_TRIP
    let destInfo = base.destinationInfo
    const destCountry = details.destinationCountry || base.destinationCountry
    if (destCountry) {
      const formattedKey = destCountry.replace(/\s+/g, '')
      if (DESTINATIONS_CATALOG[destCountry]) {
        destInfo = DESTINATIONS_CATALOG[destCountry]
      } else if (DESTINATIONS_CATALOG[formattedKey]) {
        destInfo = DESTINATIONS_CATALOG[formattedKey]
      }
    }

    const updatedTrip: TripData = {
      ...base,
      ...details,
      destinationInfo: destInfo,
      updatedAt: new Date().toISOString(),
    }
    setCurrentTrip(updatedTrip)
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)))

    if (authUser?.id) {
      try {
        const savedId = await tripsService.saveTrip(authUser.id, updatedTrip)
        if (savedId && savedId !== updatedTrip.id) {
          const finalTrip = { ...updatedTrip, id: savedId }
          setCurrentTrip(finalTrip)
          setActiveTripIdState(savedId)
          setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? finalTrip : t)))
          return savedId
        }
      } catch (e) {
        console.warn('Error updating trip details in backend', e)
      }
    }
    return updatedTrip.id
  }

  const toggleChecklistItem = async (id: string) => {
    if (!currentTrip) return
    const updatedChecklist = currentTrip.checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    )
    setCurrentTrip((prev) =>
      prev
        ? {
            ...prev,
            checklist: updatedChecklist,
            updatedAt: new Date().toISOString(),
          }
        : null,
    )

    if (authUser?.id && currentTrip.id) {
      tripsService.syncChecklist(authUser.id, currentTrip.id, updatedChecklist)
    }
  }

  const addChecklistItem = async (item: { title: string; category: any; whyItMatters: string }) => {
    if (!currentTrip) return
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: item.title,
      description: 'Item personalizado adicionado pelo viajante.',
      category: item.category || 'seguranca',
      completed: false,
      whyItMatters: item.whyItMatters || 'Ajuda a manter escolhas livres e documentação segura.',
      actionTip: 'Realize este passo antes de embarcar.',
      isRequiredForHighAutonomy: false,
    }
    const updatedChecklist = [newItem, ...currentTrip.checklist]
    setCurrentTrip((prev) =>
      prev
        ? {
            ...prev,
            checklist: updatedChecklist,
            updatedAt: new Date().toISOString(),
          }
        : null,
    )

    if (authUser?.id && currentTrip.id) {
      tripsService.syncChecklist(authUser.id, currentTrip.id, updatedChecklist)
    }
  }

  const addGuardian = async (guardian: Omit<GuardianContact, 'id'>) => {
    if (!currentTrip) return
    let assignedId = `g-${Date.now()}`
    if (authUser?.id && currentTrip.id) {
      try {
        assignedId = await tripsService.saveGuardian(authUser.id, currentTrip.id, guardian)
      } catch (e) {
        console.warn('Error saving guardian to DB', e)
      }
    }

    const newG: GuardianContact = {
      ...guardian,
      id: assignedId,
    }

    setCurrentTrip((prev) =>
      prev
        ? {
            ...prev,
            guardians: [...prev.guardians, newG],
            updatedAt: new Date().toISOString(),
          }
        : null,
    )
  }

  const updateGuardian = async (id: string, updates: Partial<GuardianContact>) => {
    if (!currentTrip) return
    const target = currentTrip.guardians.find((g) => g.id === id)
    if (target && authUser?.id && currentTrip.id) {
      const merged = { ...target, ...updates }
      tripsService.saveGuardian(authUser.id, currentTrip.id, merged, id)
    }

    setCurrentTrip((prev) =>
      prev
        ? {
            ...prev,
            guardians: prev.guardians.map((g) => (g.id === id ? { ...g, ...updates } : g)),
            updatedAt: new Date().toISOString(),
          }
        : null,
    )
  }

  const removeGuardian = async (id: string) => {
    if (!currentTrip) return
    if (authUser?.id) {
      tripsService.deleteGuardian(id)
    }
    setCurrentTrip((prev) =>
      prev
        ? {
            ...prev,
            guardians: prev.guardians.filter((g) => g.id !== id),
            updatedAt: new Date().toISOString(),
          }
        : null,
    )
  }

  const performCheckin = async (status: CheckinStatus, note?: string) => {
    if (!currentTrip) return
    let checkinId = `chk-${Date.now()}`
    const approx = currentTrip.destinationCity + ', ' + currentTrip.destinationCountry
    if (authUser?.id && currentTrip.id) {
      try {
        checkinId = await tripsService.logCheckin(authUser.id, currentTrip.id, status, note, approx)
      } catch (e) {
        console.warn('Error saving checkin to DB', e)
      }
    }

    const newLog: CheckinLogEvent = {
      id: checkinId,
      timestamp: new Date().toISOString(),
      status,
      note:
        note ||
        (status === 'ok'
          ? 'Confirmação rápida realizada com sucesso.'
          : 'Alerta de check-in disparado.'),
      locationApprox: approx,
    }
    setCurrentTrip((prev) =>
      prev
        ? {
            ...prev,
            currentAbsenceStage: status !== 'cancelled' ? 0 : prev.currentAbsenceStage,
            lastCheckinAt: new Date().toISOString(),
            checkinHistory: [newLog, ...prev.checkinHistory],
            updatedAt: new Date().toISOString(),
          }
        : null,
    )
  }

  const simulateAbsenceStage = async (stage: 1 | 2 | 3 | 4) => {
    if (!currentTrip) return
    if (authUser?.id && currentTrip.id) {
      await tripsService.triggerAbsenceCheck(currentTrip.id, stage)
      await refreshTrip()
    } else {
      // Local state fallback for demo
      const newNotif = {
        id: `notif-${Date.now()}`,
        userId: user.id,
        tripId: currentTrip.id,
        stage,
        recipientType:
          stage <= 2
            ? ('traveler' as const)
            : stage === 3
              ? ('guardians_security' as const)
              : ('guardians_all' as const),
        recipientEmail: stage <= 2 ? user.email : currentTrip.guardians[0]?.email || user.email,
        recipientName: stage <= 2 ? user.name : currentTrip.guardians[0]?.name || 'Guardian',
        subject:
          stage === 1
            ? 'SafeTrip: Verificação de rotina — Está tudo bem?'
            : stage === 2
              ? 'SafeTrip: Segunda tentativa de contato — Confirme seu estado'
              : stage === 3
                ? `SafeTrip: Alerta preventivo sobre ${user.name}`
                : `SafeTrip ALERTA: ${user.name} sem contato há 6h`,
        message: `Disparo automático do Protocolo de Ausência (Etapa ${stage}).`,
        status: 'sent' as const,
        sentAt: new Date().toISOString(),
      }

      setCurrentTrip((prev) =>
        prev
          ? {
              ...prev,
              currentAbsenceStage: stage,
              absenceNotifications: [newNotif, ...(prev.absenceNotifications || [])],
              updatedAt: new Date().toISOString(),
            }
          : null,
      )
    }
  }

  const updateCheckinConfig = async (config: Partial<TripData['checkinConfig']>) => {
    if (!currentTrip) return
    const updated = {
      ...currentTrip,
      checkinConfig: {
        ...currentTrip.checkinConfig,
        ...config,
      },
      updatedAt: new Date().toISOString(),
    }
    setCurrentTrip(updated)

    if (authUser?.id && currentTrip.id) {
      tripsService.saveTrip(authUser.id, updated)
    }
  }

  const triggerEmergencyAlert = async (details: { reason: string; location?: string }) => {
    if (!currentTrip) return
    const loc = details.location || currentTrip.destinationCity
    const emergencyEvent: CheckinLogEvent = {
      id: `emergency-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'needs_help',
      note: `🚨 MODO DE EMERGÊNCIA ATIVADO: ${details.reason}`,
      locationApprox: loc,
      escalationStage: 4,
    }
    setCurrentTrip((prev) =>
      prev
        ? {
            ...prev,
            checkinHistory: [emergencyEvent, ...prev.checkinHistory],
            updatedAt: new Date().toISOString(),
          }
        : null,
    )

    if (authUser?.id && currentTrip.id) {
      tripsService.logCheckin(
        authUser.id,
        currentTrip.id,
        'needs_help',
        emergencyEvent.note,
        emergencyEvent.locationApprox,
      )
    }
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
        trips,
        currentTrip,
        hasTrip: !!currentTrip,
        activeTripId,
        setActiveTripId,
        createTrip,
        deleteTrip,
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
        simulateAbsenceStage,
        resetToDefault,
        isQuickExitActive,
        triggerQuickExit,
        restoreFromQuickExit,
        isLoadingTrip,
        refreshTrip,
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
