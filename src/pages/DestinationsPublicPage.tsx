import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Globe,
  MapPin,
  Phone,
  Building,
  Shield,
  Search,
  ExternalLink,
  HelpCircle,
  Hospital,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DESTINATIONS_CATALOG, COUNTRY_EMERGENCY_CONTACTS } from '@/lib/constants'
import { tripsService } from '@/services/trips'
import { TripDestination } from '@/types/trip'

export const DestinationsPublicPage: React.FC = () => {
  const [destinations, setDestinations] = useState<TripDestination[]>(() =>
    Object.values(DESTINATIONS_CATALOG),
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [expandedCountry, setExpandedCountry] = useState<string | null>('Itália')

  useEffect(() => {
    // Load from PocketBase if available, fallback to local
    tripsService.getDestinations().then((dbList) => {
      if (dbList && dbList.length > 0) {
        setDestinations(dbList)
      }
    })
  }, [])

  const filteredDestinations = destinations.filter((dest) => {
    const q = searchTerm.toLowerCase()
    return (
      dest.country.toLowerCase().includes(q) ||
      dest.city.toLowerCase().includes(q) ||
      dest.consulateEmbassyName.toLowerCase().includes(q)
    )
  })

  const toggleExpand = (country: string) => {
    setExpandedCountry((prev) => (prev === country ? null : country))
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-12 px-4 border-b border-slate-800">
        <div className="container mx-auto max-w-5xl space-y-4 text-center">
          <Badge className="bg-sky-500/20 text-sky-300 border-sky-400/30 text-xs px-3 py-1">
            <Globe className="w-3.5 h-3.5 mr-1" /> Guia Público de Segurança Consular
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Destinos Internacionais & Contatos Consulares
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Consulte previamente números de emergência policial, hospital de referência, plantão
            consular 24h brasileiro e pontos de apoio seguro nos 8 principais destinos.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Buscar por país ou cidade (ex: Itália, Paris, Londres)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-400 pl-10 h-11 text-sm rounded-2xl shadow-lg focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-8 space-y-6">
        {/* Quick Country Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button
            size="sm"
            variant={selectedCountry === null ? 'default' : 'outline'}
            onClick={() => {
              setSelectedCountry(null)
              setSearchTerm('')
            }}
            className="text-xs h-8 rounded-xl font-semibold"
          >
            Todos ({destinations.length})
          </Button>
          {destinations.map((d) => (
            <Button
              key={d.country}
              size="sm"
              variant={expandedCountry === d.country ? 'default' : 'outline'}
              onClick={() => {
                setExpandedCountry(d.country)
                const element = document.getElementById(`dest-${d.country}`)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }}
              className="text-xs h-8 rounded-xl whitespace-nowrap"
            >
              {d.country}
            </Button>
          ))}
        </div>

        {/* Destination Cards List */}
        <div className="space-y-4">
          {filteredDestinations.map((dest) => {
            const isExpanded = expandedCountry === dest.country
            const extraContacts =
              COUNTRY_EMERGENCY_CONTACTS[dest.country] ||
              COUNTRY_EMERGENCY_CONTACTS[dest.country.replace(/\s+/g, '')]

            return (
              <Card
                id={`dest-${dest.country}`}
                key={dest.country}
                className={`border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-sky-300 shadow-md ring-1 ring-sky-300 bg-white'
                    : 'border-slate-200 shadow-xs hover:border-slate-300 bg-white'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(dest.country)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none bg-gradient-to-r from-transparent via-slate-50/50 to-transparent hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-black text-sm border border-sky-200 shrink-0">
                      {dest.countryCode || dest.country.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          {dest.country}
                        </h2>
                        <span className="text-xs text-slate-500 font-medium">({dest.city})</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Polícia: <strong>{dest.policeNumber}</strong> • Plantão Consular 24h:{' '}
                        <strong className="text-sky-700">{dest.consulateEmergency24h}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-semibold text-sky-700 hidden sm:inline-flex"
                    >
                      {isExpanded ? 'Ocultar Detalhes' : 'Ver Guia Completo'}
                    </Button>
                    <div className="p-1 rounded-lg bg-slate-100 text-slate-600">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <CardContent className="p-5 pt-0 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {/* Emergency & Police block */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                          <Phone className="w-3.5 h-3.5 text-red-600" /> Números Locais de
                          Emergência
                        </h3>
                        <div className="space-y-2 text-xs text-slate-700">
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Polícia Local:</span>
                            <span className="font-bold text-slate-900">{dest.policeNumber}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Emergência Médica / SAMU:</span>
                            <span className="font-bold text-slate-900">
                              {dest.medicalEmergencyNumber}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Número Único Geral:</span>
                            <span className="font-bold text-slate-900">
                              {dest.generalEmergencyNumber}
                            </span>
                          </div>
                          {extraContacts?.womenHelpline && (
                            <div className="flex justify-between py-1 border-b border-slate-200">
                              <span className="text-slate-500">Linha de Apoio à Mulher:</span>
                              <span className="font-bold text-purple-700">
                                {extraContacts.womenHelpline}
                              </span>
                            </div>
                          )}
                          {extraContacts?.referenceHospital && (
                            <div className="pt-1">
                              <span className="text-slate-500 block text-[11px]">
                                Hospital de Referência:
                              </span>
                              <span className="font-semibold text-slate-800 text-[11px]">
                                {extraContacts.referenceHospital}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Consulate Details block */}
                      <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-3">
                        <h3 className="text-xs font-bold text-sky-900 flex items-center gap-1.5 uppercase tracking-wider">
                          <Building className="w-3.5 h-3.5 text-sky-700" /> Apoio Consular
                          Brasileiro
                        </h3>
                        <div className="space-y-2 text-xs text-slate-700">
                          <div>
                            <span className="text-slate-500 text-[11px] block">Representação:</span>
                            <span className="font-bold text-slate-900">
                              {dest.consulateEmbassyName}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px] block">Endereço:</span>
                            <span className="text-slate-800 font-medium">
                              {dest.consulateAddress || dest.city}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-t border-sky-200/80">
                            <span className="text-slate-500">Telefone Geral:</span>
                            <span className="font-semibold text-slate-900">
                              {dest.consulatePhone || 'Consulte o site oficial'}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-t border-sky-200/80">
                            <span className="text-slate-500">Plantão 24h (Emergências):</span>
                            <span className="font-bold text-sky-800">
                              {dest.consulateEmergency24h}
                            </span>
                          </div>
                          {dest.consulateEmail && (
                            <div className="flex justify-between py-1 border-t border-sky-200/80">
                              <span className="text-slate-500">E-mail:</span>
                              <span className="text-slate-700 font-mono text-[11px]">
                                {dest.consulateEmail}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Safe Havens Points */}
                    {dest.safeHavens && dest.safeHavens.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-600" /> Pontos de Apoio Seguro
                          & Delegacias de Turismo
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {dest.safeHavens.map((sh, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                            >
                              <span className="font-bold text-slate-900 block">{sh.name}</span>
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-white text-slate-700"
                              >
                                {sh.type}
                              </Badge>
                              <p className="text-[11px] text-slate-600 leading-snug pt-1">
                                {sh.notes || sh.address}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tips */}
                    {dest.travelTips && dest.travelTips.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Dicas de Autonomia
                          para {dest.country}
                        </h3>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {dest.travelTips.map((tip, idx) => (
                            <li
                              key={idx}
                              className="p-2.5 rounded-xl bg-sky-50/40 border border-sky-100 flex items-start gap-2"
                            >
                              <span className="text-sky-600 font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA to evaluate personal trip */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold">Vai viajar para um destes destinos?</h3>
            <p className="text-xs text-slate-300">
              Faça sua avaliação de autonomia pedagógica e configure seus guardiões de segurança.
            </p>
          </div>
          <Link to="/cadastro">
            <Button className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs h-10 px-6 rounded-xl">
              Criar Conta Gratuita <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default DestinationsPublicPage
