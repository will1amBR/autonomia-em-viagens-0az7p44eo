import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plane,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Building,
  HelpCircle,
  ArrowRight,
  Shield,
  Info,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { useTrip } from '../context/TripContext'

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentTrip, updateTripDetails, updateTripAssessment } = useTrip()

  const [formData, setFormData] = useState({
    title: currentTrip.title || 'Minha Próxima Viagem Internacional',
    destinationCountry: currentTrip.destinationCountry || 'Itália',
    destinationCity: currentTrip.destinationCity || 'Roma',
    departureDate: currentTrip.departureDate || '2025-06-10',
    returnDate: currentTrip.returnDate || '2025-06-25',
    tripReason: currentTrip.tripReason || 'Turismo e convite',
    accommodationType: currentTrip.accommodationType || 'Casa de anfitrião / Apartamento',
    accommodationAddress: currentTrip.accommodationAddress || 'Via Nazionale, 114',
    whoIsPaying: currentTrip.whoIsPaying || 'Outra pessoa pagando a maior parte',
    travelingWith: currentTrip.travelingWith || 'Acompanhante conhecido recentemente',
    hostResponsiblePerson: currentTrip.hostResponsiblePerson || 'Marco B.',
    destinationContact: currentTrip.destinationContact || '+39 345 000 0000',
    hasVisitedBefore: currentTrip.assessment.hasVisitedCountryBefore ? 'yes' : 'no',
    knowsHostPersonally: currentTrip.assessment.knowsHostPersonally || 'partially',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateTripDetails({
      title: formData.title,
      destinationCountry: formData.destinationCountry,
      destinationCity: formData.destinationCity,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      tripReason: formData.tripReason,
      accommodationType: formData.accommodationType,
      accommodationAddress: formData.accommodationAddress,
      whoIsPaying: formData.whoIsPaying,
      travelingWith: formData.travelingWith,
      hostResponsiblePerson: formData.hostResponsiblePerson,
      destinationContact: formData.destinationContact,
    })

    updateTripAssessment({
      ...currentTrip.assessment,
      hasVisitedCountryBefore: formData.hasVisitedBefore === 'yes',
      knowsHostPersonally:
        (formData.knowsHostPersonally as 'yes' | 'no' | 'partially') || 'partially',
    })

    // Advance to assessment step
    navigate('/assessment')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
          Passo 1 de 2
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Cadastrar Informações da Viagem
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Reúna os dados básicos sobre destino, datas e contatos. Essas informações ficarão salvas
          em seu dispositivo para consulta offline.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plane className="w-4 h-4 text-sky-600" /> Destino e Datas
            </CardTitle>
            <CardDescription className="text-xs">Onde e quando a viagem acontecerá</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                Identificação da Viagem
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Férias em Roma, Viagem a Lisboa"
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="destinationCountry" className="text-xs font-semibold">
                  País de Destino
                </Label>
                <select
                  id="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Itália">Itália</option>
                  <option value="França">França</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Espanha">Espanha</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Japão">Japão</option>
                  <option value="Outro">Outro País Internacional</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="destinationCity" className="text-xs font-semibold">
                  Cidade Principal
                </Label>
                <Input
                  id="destinationCity"
                  value={formData.destinationCity}
                  onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                  placeholder="Ex: Roma, Paris, Orlando"
                  required
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="departureDate" className="text-xs font-semibold">
                  Data de Saída / Embarque
                </Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="returnDate" className="text-xs font-semibold">
                  Data Prevista de Retorno
                </Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  required
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tripReason" className="text-xs font-semibold">
                Motivo da Viagem
              </Label>
              <Input
                id="tripReason"
                value={formData.tripReason}
                onChange={(e) => setFormData({ ...formData, tripReason: e.target.value })}
                placeholder="Ex: Turismo, Convite de conhecido, Estudo, etc"
                className="h-10 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Accommodation & Host Details */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" /> Hospedagem e Anfitrião
            </CardTitle>
            <CardDescription className="text-xs">
              Quem controla o local de permanência e quais são os endereços
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="accommodationType" className="text-xs font-semibold">
                  Tipo de Hospedagem
                </Label>
                <Input
                  id="accommodationType"
                  value={formData.accommodationType}
                  onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                  placeholder="Ex: Hotel, Airbnb, Casa de outra pessoa"
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="accommodationAddress" className="text-xs font-semibold">
                  Endereço Completo
                </Label>
                <Input
                  id="accommodationAddress"
                  value={formData.accommodationAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, accommodationAddress: e.target.value })
                  }
                  placeholder="Rua, número, bairro, código postal"
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="hostResponsiblePerson" className="text-xs font-semibold">
                  Pessoa Responsável / Anfitrião
                </Label>
                <Input
                  id="hostResponsiblePerson"
                  value={formData.hostResponsiblePerson}
                  onChange={(e) =>
                    setFormData({ ...formData, hostResponsiblePerson: e.target.value })
                  }
                  placeholder="Nome de quem reservou ou te receberá"
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="destinationContact" className="text-xs font-semibold">
                  Contato no Destino (Telefone/WhatsApp)
                </Label>
                <Input
                  id="destinationContact"
                  value={formData.destinationContact}
                  onChange={(e) => setFormData({ ...formData, destinationContact: e.target.value })}
                  placeholder="+XX (DDD) XXXXX-XXXX"
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="whoIsPaying" className="text-xs font-semibold">
                  Quem está pagando as despesas?
                </Label>
                <Input
                  id="whoIsPaying"
                  value={formData.whoIsPaying}
                  onChange={(e) => setFormData({ ...formData, whoIsPaying: e.target.value })}
                  placeholder="Ex: Eu mesmo, Outra pessoa integralmente, Dividido"
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="travelingWith" className="text-xs font-semibold">
                  Com quem está viajando?
                </Label>
                <Input
                  id="travelingWith"
                  value={formData.travelingWith}
                  onChange={(e) => setFormData({ ...formData, travelingWith: e.target.value })}
                  placeholder="Ex: Sozinho(a), Conhecido recente, Amigo, Familiar"
                  className="h-10 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Initial Autonomy Diagnostic Questions */}
        <Card className="border-slate-200 shadow-sm bg-sky-50/40">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <HelpCircle className="w-4 h-4 text-sky-700" /> Perguntas de Contexto Pré-Avaliação
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Isso nos ajuda a calibrar a pontuação de familiaridade e mobilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-5">
            {/* Q1 */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-800">
                Você já esteve neste país anteriormente?
              </Label>
              <RadioGroup
                value={formData.hasVisitedBefore}
                onValueChange={(val) => setFormData({ ...formData, hasVisitedBefore: val })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="visit-yes" />
                  <Label htmlFor="visit-yes" className="text-xs font-normal cursor-pointer">
                    Sim, já estive
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="visit-no" />
                  <Label htmlFor="visit-no" className="text-xs font-normal cursor-pointer">
                    Não, primeira vez
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Q2 */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-800">
                Você conhece pessoalmente as pessoas com quem ficará hospedado(a)?
              </Label>
              <RadioGroup
                value={formData.knowsHostPersonally}
                onValueChange={(val: 'yes' | 'no' | 'partially') =>
                  setFormData({ ...formData, knowsHostPersonally: val })
                }
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="host-yes" />
                  <Label htmlFor="host-yes" className="text-xs font-normal cursor-pointer">
                    Sim, conheço bem pessoalmente
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partially" id="host-partially" />
                  <Label htmlFor="host-partially" className="text-xs font-normal cursor-pointer">
                    Parcialmente (poucos encontros ou online)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="host-no" />
                  <Label htmlFor="host-no" className="text-xs font-normal cursor-pointer">
                    Não conheço pessoalmente
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/onboarding')}
            className="text-xs text-slate-600"
          >
            ← Voltar
          </Button>

          <Button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 h-11 rounded-xl flex items-center gap-2 shadow-md shadow-sky-600/20"
          >
            <span>Avançar para Avaliação de Autonomia</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
