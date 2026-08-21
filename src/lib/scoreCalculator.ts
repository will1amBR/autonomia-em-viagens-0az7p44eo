import {
  TripAssessmentAnswers,
  AutonomyScoreResult,
  IndependenceBreakdown,
  ScoreTier,
} from '../types/trip'

export function calculateAutonomyScore(answers: TripAssessmentAnswers): AutonomyScoreResult {
  let docPoints = 0
  let returnPoints = 0
  let finPoints = 0
  let commPoints = 0
  let housePoints = 0
  let mobPoints = 0
  let networkPoints = 0
  let emergPoints = 0

  const dependenceFactors: string[] = []
  const recommendations: string[] = []

  // 1. Documentation (Max 100)
  if (answers.hasValidPassport) docPoints += 30
  else
    recommendations.push(
      'Verifique e regularize seu passaporte com antecedência mínima de 6 meses de validade.',
    )

  if (answers.hasPhysicalControlOfPassport) docPoints += 35
  else
    dependenceFactors.push(
      'Você não terá ou não tem certeza de manter a posse física do seu passaporte.',
    )

  if (answers.hasDigitalCopies) docPoints += 20
  else recommendations.push('Salve cópias digitais seguras e envie a uma pessoa de confiança.')

  if (answers.hasRequiredVisas) docPoints += 15
  docPoints = Math.min(100, Math.max(0, docPoints))

  // 2. Return (Max 100)
  if (answers.hasReturnTicket) {
    returnPoints += 45
  } else {
    dependenceFactors.push('Ausência de passagem de volta emitida no seu próprio nome.')
    recommendations.push(
      'Garanta uma passagem de volta com data marcada e código de reserva acessível.',
    )
  }

  if (answers.canReturnTomorrow === 'yes_alone') {
    returnPoints += 55
  } else if (answers.canReturnTomorrow === 'yes_dependent') {
    returnPoints += 25
    dependenceFactors.push(
      'Você depende de outra pessoa para conseguir retornar ao seu país caso precise.',
    )
    recommendations.push(
      'Tenha reserva financeira suficiente para emitir um bilhete aéreo por conta própria.',
    )
  } else if (answers.canReturnTomorrow === 'not_sure') {
    returnPoints += 10
    dependenceFactors.push('Incerteza sobre a viabilidade prática de voltar imediatamente.')
  } else {
    returnPoints += 0
    dependenceFactors.push('Impossibilidade imediata de retornar por meios próprios.')
    recommendations.push(
      'Defina uma reserva de emergência ou fundo garantidor com familiares antes do embarque.',
    )
  }
  returnPoints = Math.min(100, Math.max(0, returnPoints))

  // 3. Finances (Max 100)
  if (answers.hasOwnMoney) finPoints += 35
  else
    dependenceFactors.push(
      'Dependência financeira total de terceiros para custos diários no exterior.',
    )

  if (answers.hasEmergencyReserve) finPoints += 35
  else recommendations.push('Tenha uma reserva de emergência em conta acessível do exterior.')

  if (answers.hasInternationalCard) finPoints += 20
  else recommendations.push('Habilite ou emita um cartão internacional ativo (físico e virtual).')

  if (answers.canBuyEssentialsAlone) finPoints += 10
  else
    dependenceFactors.push(
      'Necessidade de pedir autorização ou dinheiro para comprar itens essenciais de alimentação e transporte.',
    )
  finPoints = Math.min(100, Math.max(0, finPoints))

  // 4. Communication (Max 100)
  if (answers.hasWorkingPhone) commPoints += 40
  else dependenceFactors.push('Risco de ficar sem aparelho celular funcional no destino.')

  if (answers.hasInternetEsim) commPoints += 40
  else recommendations.push('Adquira um eSIM ou plano de roaming internacional antes de pousar.')

  if (answers.familyFriendsInformedDetailed) commPoints += 20
  else
    recommendations.push(
      'Compartilhe seu itinerário e endereços com pelo menos duas pessoas de sua rede de apoio.',
    )
  commPoints = Math.min(100, Math.max(0, commPoints))

  // 5. Housing & Mobility (Max 100 each)
  if (answers.exactAddressKnown) housePoints += 40
  else dependenceFactors.push('Falta de conhecimento do endereço exato onde ficará hospedado(a).')

  if (answers.canLeaveHousingAlone) housePoints += 35
  else
    dependenceFactors.push(
      'Restrição ou dificuldade para sair da hospedagem sozinho(a) a qualquer momento.',
    )

  if (answers.canStayElsewhereIfNecessary) housePoints += 25
  else
    recommendations.push(
      'Pesquise e salve opções de hotéis, hostels ou pousadas seguras próximas ao seu local.',
    )
  housePoints = Math.min(100, Math.max(0, housePoints))

  if (answers.canLeaveHousingAlone) mobPoints += 40
  if (answers.hasVisitedCountryBefore) mobPoints += 30
  else mobPoints += 15
  if (answers.canBuyEssentialsAlone) mobPoints += 30
  mobPoints = Math.min(100, Math.max(0, mobPoints))

  // 6. Protection Network & Relationship Dynamics (Max 100)
  if (answers.familyFriendsInformedDetailed) networkPoints += 40
  if (answers.knowsHostPersonally === 'yes') networkPoints += 30
  else if (answers.knowsHostPersonally === 'partially') networkPoints += 15
  else
    dependenceFactors.push(
      'Você não conhece pessoalmente as pessoas com quem conviverá na hospedagem.',
    )

  if (
    answers.relationshipDuration === 'more_than_1_year' ||
    answers.relationshipDuration === 'family_or_long_friend'
  ) {
    networkPoints += 30
  } else if (answers.relationshipDuration === '6_to_12_months') {
    networkPoints += 20
  } else {
    networkPoints += 10
    dependenceFactors.push('Relacionamento recente somado a poucos encontros presenciais prévios.')
  }
  networkPoints = Math.min(100, Math.max(0, networkPoints))

  // 7. Pressure & Boundaries check penalties & emergency score
  if (answers.respectsLimits === 'rarely') {
    dependenceFactors.push(
      'Relato de dificuldade de estabelecimento ou respeito a limites pessoais.',
    )
  }
  if (answers.minimizesConcerns === 'frequently') {
    dependenceFactors.push(
      'Tendência de a outra pessoa minimizar suas preocupações legítimas de segurança.',
    )
  }
  if (answers.feelsPressureToAcceptConditions) {
    dependenceFactors.push(
      'Sensação de ter que aceitar termos para não perder a oportunidade da viagem.',
    )
  }
  if (answers.feltNeedToChooseBetweenSafetyAndTrip) {
    dependenceFactors.push(
      'Histórico de ter sentido necessidade de abrir mão de segurança pelo sonho da viagem.',
    )
  }

  // Emergency readiness (Max 100)
  emergPoints = Math.round(
    commPoints * 0.35 +
      housePoints * 0.25 +
      docPoints * 0.25 +
      (answers.hasEmergencyReserve ? 15 : 0),
  )
  emergPoints = Math.min(100, Math.max(0, emergPoints))

  const breakdown: IndependenceBreakdown = {
    documentation: docPoints,
    return: returnPoints,
    finances: finPoints,
    communication: commPoints,
    housing: housePoints,
    mobility: mobPoints,
    protectionNetwork: networkPoints,
    emergency: emergPoints,
  }

  // Calculate weighted overall score
  // Return (25%), Finances (20%), Docs (15%), Comm (15%), Housing/Mob (15%), Network (10%)
  let rawScore =
    returnPoints * 0.25 +
    finPoints * 0.2 +
    docPoints * 0.15 +
    commPoints * 0.15 +
    ((housePoints + mobPoints) / 2) * 0.15 +
    networkPoints * 0.1

  // Penalty adjustments for pressure factors (measuring autonomy, not crime)
  if (answers.canReturnTomorrow === 'no') rawScore -= 15
  if (answers.feelsPressureToAcceptConditions) rawScore -= 8
  if (answers.minimizesConcerns === 'frequently') rawScore -= 6
  if (!answers.hasPhysicalControlOfPassport) rawScore -= 12

  const overallScore = Math.max(5, Math.min(100, Math.round(rawScore)))

  let tier: ScoreTier = 'HIGH'
  let summaryText = ''

  if (overallScore >= 75) {
    tier = 'HIGH'
    summaryText =
      'Você possui uma base sólida de autonomia e capacidade de tomada de decisão independente. Manter seus check-ins e contatos ativos completará sua proteção.'
  } else if (overallScore >= 45) {
    tier = 'MODERATE'
    summaryText =
      'Você possui alguma estrutura de autonomia, mas existem pontos de dependência financeira, retorno ou hospedagem que devem ser resolvidos antes do embarque.'
  } else {
    tier = 'LOW'
    summaryText =
      'Sua autonomia prática durante a viagem está reduzida. Existem múltiplos fatores de dependência que podem dificultar sua capacidade de sair sozinho(a) caso necessário.'
  }

  return {
    overallScore,
    tier,
    summaryText,
    breakdown,
    identifiedDependenceFactors: Array.from(new Set(dependenceFactors)),
    recommendedActions: Array.from(new Set(recommendations)),
  }
}
