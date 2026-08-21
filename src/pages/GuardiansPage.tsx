import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Shield,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lock,
  Eye,
  Mail,
  Phone,
  Globe,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { useTrip } from '../context/TripContext'
import { GuardianContact, GuardianAccessType } from '../types/trip'

export const GuardiansPage: React.FC = () => {
  const { currentTrip, addGuardian, removeGuardian, updateGuardian } = useTrip()
  const { guardians } = currentTrip

  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    country: 'Brasil',
    accessType: 'security' as GuardianAccessType,
    notifyOnCheckin: true,
    receiveMissedCheckinAlert: true,
    receiveFullItinerary: false,
    notes: '',
  })

  const maxGuardians = 5
  const canAddMore = guardians.length < maxGuardians

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) return

    addGuardian({
      name: formData.name,
      relationship: formData.relationship,
      phone: formData.phone,
      email: formData.email,
      country: formData.country,
      accessType: formData.accessType,
      notifyOnCheckin: formData.notifyOnCheckin,
      receiveMissedCheckinAlert: formData.receiveMissedCheckinAlert,
      receiveFullItinerary: formData.receiveFullItinerary,
      notes: formData.notes,
    })

    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      country: 'Brasil',
      accessType: 'security',
      notifyOnCheckin: true,
      receiveMissedCheckinAlert: true,
      receiveFullItinerary: false,
      notes: '',
    })
    setIsOpenAdd(false)
  }

  const getAccessTypeBadge = (type: GuardianAccessType) => {
    switch (type) {
      case 'emergency':
        return (
          <Badge className="bg-red-600 text-white font-bold text-[10px]">
            Nível: Emergência Total
          </Badge>
        )
      case 'security':
        return (
          <Badge className="bg-sky-600 text-white font-bold text-[10px]">
            Nível: Segurança Preventiva
          </Badge>
        )
      default:
        return (
          <Badge className="bg-slate-600 text-white font-bold text-[10px]">Nível: Básico</Badge>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 border-sky-300 bg-sky-50 text-sky-800 font-semibold"
          >
            Rede de Confiança
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Meus Guardians de Segurança
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Cadastre até 5 pessoas de total confiança. Você controla exatamente o que cada uma pode
            visualizar.
          </p>
        </div>

        {/* Add Modal */}
        <Dialog open={isOpenAdd} onOpenChange={setIsOpenAdd}>
          <DialogTrigger asChild>
            <Button
              disabled={!canAddMore}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-10 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>
                Cadastrar Guardian ({guardians.length}/{maxGuardians})
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900">
                Novo Guardian de Confiança
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Pessoa que receberá alertas caso seu check-in falhe ou em emergências
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="gName" className="font-semibold">
                    Nome Completo
                  </Label>
                  <Input
                    id="gName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Mariana Silva"
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="gRel" className="font-semibold">
                    Grau de Parentesco / Relação
                  </Label>
                  <Input
                    id="gRel"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="Ex: Irmã, Mãe, Melhor amigo"
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="gPhone" className="font-semibold">
                    Telefone / WhatsApp
                  </Label>
                  <Input
                    id="gPhone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+55 11 99999-9999"
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="gEmail" className="font-semibold">
                    E-mail
                  </Label>
                  <Input
                    id="gEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="gCountry" className="font-semibold">
                  País onde o Guardian reside
                </Label>
                <Input
                  id="gCountry"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Brasil"
                  className="h-9 text-xs"
                />
              </div>

              {/* Access Levels */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <Label className="font-bold text-slate-900 block">Tipo de Acesso Autorizado</Label>
                <RadioGroup
                  value={formData.accessType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, accessType: v as GuardianAccessType })
                  }
                  className="space-y-2"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="basic" id="acc-basic" className="mt-0.5" />
                    <Label htmlFor="acc-basic" className="cursor-pointer">
                      <strong className="block text-slate-800">Básico:</strong>
                      <span className="text-slate-500 text-[11px]">
                        Recebe apenas confirmações voluntárias de que você está bem.
                      </span>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="security" id="acc-sec" className="mt-0.5" />
                    <Label htmlFor="acc-sec" className="cursor-pointer">
                      <strong className="block text-slate-800">Segurança (Recomendado):</strong>
                      <span className="text-slate-500 text-[11px]">
                        Recebe alertas preventivos se você perder um check-in programado.
                      </span>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="emergency" id="acc-emerg" className="mt-0.5" />
                    <Label htmlFor="acc-emerg" className="cursor-pointer">
                      <strong className="block text-slate-800">Emergência Total:</strong>
                      <span className="text-slate-500 text-[11px]">
                        Recebe dados de passagens, endereço e localização em modo de risco imediato.
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-1">
                <Label htmlFor="gNotes" className="font-semibold">
                  Instrução especial ou observação
                </Label>
                <Input
                  id="gNotes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Tem cópia do meu passaporte; avisar se eu passar 12h sem responder"
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpenAdd(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Salvar Guardian
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Philosophy Banner on Privacy vs Vigilance */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-sky-400">
          <Lock className="w-4 h-4" />
          <span>GARANTIA DE NÃO-VIGILÂNCIA</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          O SafeTrip é uma rede de apoio e proteção, não um rastreador abusivo. Nenhum Guardian tem
          acesso em tempo real à sua localização ou comunicações sem o seu comando explícito ou sem
          o protocolo de ausência não respondido.
        </p>
      </div>

      {/* Guardians List */}
      <div className="space-y-4">
        {guardians.map((guardian) => (
          <Card key={guardian.id} className="border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{guardian.name}</h3>
                  <Badge
                    variant="outline"
                    className="text-xs bg-slate-100 text-slate-700 font-medium"
                  >
                    {guardian.relationship}
                  </Badge>
                  {getAccessTypeBadge(guardian.accessType)}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {guardian.phone}
                  </span>
                  {guardian.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {guardian.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" /> {guardian.country}
                  </span>
                </div>

                {guardian.notes && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong>Nota:</strong> {guardian.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeGuardian(guardian.id)}
                  className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remover
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {guardians.length === 0 && (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-700">Nenhum Guardian cadastrado</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Cadastre pelo menos 1 pessoa de confiança para receber confirmações periódicas e
              garantir socorro caso você fique incomunicável.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-slate-200">
        <Link to="/checklist" className="text-xs text-slate-500 hover:text-slate-800">
          ← Voltar para o Checklist
        </Link>
        <Link to="/checkin">
          <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-10 px-6 rounded-xl">
            Avançar para Sistema de Check-in →
          </Button>
        </Link>
      </div>
    </div>
  )
}
