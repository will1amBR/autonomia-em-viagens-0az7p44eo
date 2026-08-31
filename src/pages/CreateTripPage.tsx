import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plane,
  Calendar,
  MapPin,
  Users,
  Building,
  Shield,
  ArrowRight,
  Info,
  DollarSign,
  Phone,
  FileText,
  UserCheck,
  Home,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { DESTINATIONS_CATALOG, COUNTRY_EMERGENCY_CONTACTS } from '../lib/constants'
import { useTrip } from '../context/TripContext'
import { useToast } from '../hooks/use-toast'

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate()
  const { createTrip } = useTrip()
  const { toast } = useToast()

  // Form State
  const [title, setTitle] = useState('')
  const [selectedDestinationKey, setSelectedDestinationKey] = useState('Portugal')
  const [originCity, setOriginCity] = useState('São Paulo, Brasil')
  const [transitCountries, setTransitCountries] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  // Accommodation & Host Details (Maximized traveler information)
  const [accommodationType, setAccommodationType] = useState('hotel')
  const [accommodationAddress, setAccommodationAddress] = useState('')
  const [destinationContact, setDestinationContact] = useState('')
  const [whoIsPaying, setWhoIsPaying] = useState('Eu mesmo(a)')
  const [travelingWith, setTravelingWith] = useState('Sozinho(a)')

  // Detailed Host & Companion Data
  const [hostResponsiblePerson, setHostResponsiblePerson] = useState('')
  const [hostRelationship, setHostRelationship] = useState('')
  const [hostPhone, setHostPhone] = useState('')
  const [hostDocument, setHostDocument] = useState('')
  const [companionDetails, setCompanionDetails] = useState('')
  const [quickNotes, setQuickNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedDest =
    DESTINATIONS_CATALOG[selectedDestinationKey] || DESTINATIONS_CATALOG['Portugal']
  const destEmergency =
    COUNTRY_EMERGENCY_CONTACTS[selectedDestinationKey] || COUNTRY_EMERGENCY_CONTACTS['Portugal']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !departureDate || !returnDate) {
      toast({
        title: 'Preencha os campos obrigatórios',
        description: 'Título, data de partida e retorno são necessários.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createTrip({
        title: title.trim(),
        destinationCountry: selectedDest.country,
        destinationCity: selectedDest.city,
        originCity: originCity.trim() || 'Brasil',
        transitCountries: transitCountries.trim(),
        departureDate,
        returnDate,
        accommodationType: accommodationType as any,
        accommodationAddress: accommodationAddress.trim(),
        destinationContact: destinationContact.trim() || hostPhone.trim(),
        whoIsPaying,
        travelingWith,
        hostResponsiblePerson: hostResponsiblePerson.trim(),
        hostRelationship: hostRelationship.trim(),
        hostPhone: hostPhone.trim(),
        hostDocument: hostDocument.trim(),
        companionDetails: companionDetails.trim(),
        accommodationDetails: {
          responsibleName: hostResponsiblePerson.trim(),
          responsiblePhone: hostPhone.trim(),
          responsibleDocument: hostDocument.trim(),
          relationship: hostRelationship.trim(),
          companionNotes: companionDetails.trim(),
        },
        quickNotes: quickNotes.trim(),
        tripReason: quickNotes.trim() || companionDetails.trim() || 'Viagem Internacional',
      })
      toast({
        title: 'Viagem cadastrada com sucesso!',
        description: 'Agora realize o diagnóstico de autonomia para personalizar suas proteções.',
      })

      // Go to assessment / quiz
      navigate('/assessment')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao cadastrar viagem',
        description: err.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge className="bg-sky-100 text-sky-800 border-sky-300 text-xs font-semibold">
            <Plane className="w-3.5 h-3.5 mr-1 text-sky-600" /> Cadastro de Rota & Hospedagem
          </Badge>
          <span className="text-xs text-slate-500 font-medium">14 Destinos Verificados</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Planejar Nova Viagem Segura
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Coletamos as informações essenciais de rota, acomodação e anfitrião para que você tenha
          respaldo total e autonomia durante toda a estadia.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Trip Details */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plane className="w-4 h-4 text-sky-600" /> 1. Destino e Período da Viagem
            </CardTitle>
            <CardDescription className="text-xs">
              Escolha o país de destino e as datas de ida e volta.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="trip-title" className="text-xs font-semibold text-slate-700">
                Título ou Apelido da Viagem *
              </Label>
              <Input
                id="trip-title"
                required
                placeholder="Ex: Intercâmbio em Portugal, Férias em Roma, Trabalho em Berlim"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Destination Selector */}
              <div className="space-y-1.5">
                <Label htmlFor="trip-dest" className="text-xs font-semibold text-slate-700">
                  País de Destino (Consulados Verificados) *
                </Label>
                <select
                  id="trip-dest"
                  value={selectedDestinationKey}
                  onChange={(e) => setSelectedDestinationKey(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {Object.entries(DESTINATIONS_CATALOG).map(([key, d]) => (
                    <option key={key} value={key}>
                      {d.country} ({d.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Origin City */}
              <div className="space-y-1.5">
                <Label htmlFor="trip-origin" className="text-xs font-semibold text-slate-700">
                  Cidade de Origem (Embarque)
                </Label>
                <Input
                  id="trip-origin"
                  placeholder="Ex: São Paulo, Rio de Janeiro, Brasília"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="trip-start" className="text-xs font-semibold text-slate-700">
                  Data de Ida / Embarque *
                </Label>
                <Input
                  id="trip-start"
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="trip-end" className="text-xs font-semibold text-slate-700">
                  Data Prevista de Retorno *
                </Label>
                <Input
                  id="trip-end"
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="h-10 text-xs"
                />{' '}
              </div>
            </div>

            {/* Transit Countries */}
            <div className="space-y-1.5">
              <Label htmlFor="trip-transit" className="text-xs font-semibold text-slate-700">
                Países de Conexão ou Escala (opcional):
              </Label>
              <Input
                id="trip-transit"
                placeholder="Ex: Escala em Madri (Espanha) ou Frankfurt (Alemanha)"
                value={transitCountries}
                onChange={(e) => setTransitCountries(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            {/* Live Destination Info Card */}
            {destEmergency && (
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-sky-950">
                <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    Dados Consulares de {destEmergency.country} já vinculados à sua viagem:
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Emergência Local: <strong>{destEmergency.generalEmergencyNumber}</strong> |
                    Plantão Consular 24h: <strong>{destEmergency.consulateEmergency24h}</strong>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Accommodation & Host Details (Detailed information) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" /> 2. Hospedagem & Dados do Anfitrião
            </CardTitle>
            <CardDescription className="text-xs">
              Registrar o endereço completo e dados de quem irá recebê-lo(a) garante autonomia e
              respaldo caso ocorra qualquer imprevisto.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="acc-type" className="text-xs font-semibold text-slate-700">
                  Tipo de Acomodação:
                </Label>
                <select
                  id="acc-type"
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="hotel">Hotel / Pousada</option>
                  <option value="airbnb">Airbnb / Aluguel por Temporada</option>
                  <option value="family_friends">Casa de Familiares / Amigos</option>
                  <option value="hostel">Hostel / Albergue</option>
                  <option value="other">Outro (Alojamento / Residência Universitária)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="acc-contact" className="text-xs font-semibold text-slate-700">
                  Telefone / Recepção da Hospedagem:
                </Label>
                <Input
                  id="acc-contact"
                  placeholder="Ex: +351 21 000 0000"
                  value={destinationContact}
                  onChange={(e) => setDestinationContact(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="acc-address" className="text-xs font-semibold text-slate-700">
                Endereço Completo da Hospedagem:
              </Label>
              <Input
                id="acc-address"
                placeholder="Rua, número, complemento, bairro, cidade e código postal"
                value={accommodationAddress}
                onChange={(e) => setAccommodationAddress(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            {/* WITH WHOM ARE YOU STAYING? (HOST & COMPANIONS) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <UserCheck className="w-4 h-4 text-sky-600" />
                <span>Com quem você irá ficar? (Dados do Anfitrião / Responsável)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="host-name" className="text-xs font-semibold text-slate-700">
                    Nome da Pessoa / Anfitrião:
                  </Label>
                  <Input
                    id="host-name"
                    placeholder="Ex: Carlos Silva ou Gerência do Hotel"
                    value={hostResponsiblePerson}
                    onChange={(e) => setHostResponsiblePerson(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="host-rel" className="text-xs font-semibold text-slate-700">
                    Relação com o Anfitrião:
                  </Label>
                  <Input
                    id="host-rel"
                    placeholder="Ex: Amigo, Contratante de Trabalho, Parente, Locador"
                    value={hostRelationship}
                    onChange={(e) => setHostRelationship(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="host-phone" className="text-xs font-semibold text-slate-700">
                    Telefone / WhatsApp do Anfitrião:
                  </Label>
                  <Input
                    id="host-phone"
                    placeholder="Ex: +351 91 000 0000"
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="host-doc" className="text-xs font-semibold text-slate-700">
                    Documento / Identificação do Anfitrião (opcional):
                  </Label>
                  <Input
                    id="host-doc"
                    placeholder="Ex: Passaporte / ID / NIF"
                    value={hostDocument}
                    onChange={(e) => setHostDocument(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="comp-details" className="text-xs font-semibold text-slate-700">
                  Companheiros de Viagem / Outras pessoas no local:
                </Label>
                <Input
                  id="comp-details"
                  placeholder="Ex: Viajando com colega de trabalho Mariana; mais 2 hóspedes no apartamento"
                  value={companionDetails}
                  onChange={(e) => setCompanionDetails(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Financial Independence & Relationship Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="who-pays" className="text-xs font-semibold text-slate-700">
                  Quem financia as despesas e passagens?
                </Label>
                <select
                  id="who-pays"
                  value={whoIsPaying}
                  onChange={(e) => setWhoIsPaying(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Eu mesmo(a)">Eu mesmo(a) (Recursos próprios)</option>
                  <option value="Familiar / Parentes">Familiar / Parentes</option>
                  <option value="Empresa / Empregador">Empresa / Empregador</option>
                  <option value="Amigo / Conhecido">Amigo / Conhecido</option>
                  <option value="Terceiro / Financiamento informal">
                    Terceiro / Financiamento informal
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="travel-with" className="text-xs font-semibold text-slate-700">
                  Companhia durante o trajeto:
                </Label>
                <select
                  id="travel-with"
                  value={travelingWith}
                  onChange={(e) => setTravelingWith(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Sozinho(a)">Sozinho(a)</option>
                  <option value="Com amigos / conhecidos">Com amigos / conhecidos</option>
                  <option value="Com familiares">Com familiares</option>
                  <option value="Em grupo de excursão / trabalho">
                    Em grupo de excursão / trabalho
                  </option>
                  <option value="Com pessoa recém-conhecida">Com pessoa recém-conhecida</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="trip-notes" className="text-xs font-semibold text-slate-700">
                Observações Adicionais / Anotações Pessoais:
              </Label>
              <Textarea
                id="trip-notes"
                rows={3}
                placeholder="Ex: Voo com parada de 4h em Lisboa. Reserva confirmada sob número #1234."
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold h-12 px-8 rounded-2xl text-xs sm:text-sm shadow-lg shadow-sky-900/20"
          >
            {isSubmitting ? (
              'Salvando Viagem...'
            ) : (
              <>
                Salvar Viagem & Ir para Avaliação de Autonomia{' '}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateTripPage
