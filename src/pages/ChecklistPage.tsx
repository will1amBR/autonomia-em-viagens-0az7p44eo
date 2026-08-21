import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckSquare,
  Shield,
  FileText,
  CreditCard,
  Phone,
  Plane,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Info,
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
import { useTrip } from '../context/TripContext'
import { ChecklistItem } from '../types/trip'

export const ChecklistPage: React.FC = () => {
  const { currentTrip, toggleChecklistItem, addChecklistItem } = useTrip()
  const { checklist } = currentTrip

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeItemModal, setActiveItemModal] = useState<ChecklistItem | null>(null)

  const [newTitle, setNewTitle] = useState('')
  const [newReason, setNewReason] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const categories = [
    { id: 'all', label: 'Todos os Itens' },
    { id: 'documentacao', label: 'Documentação' },
    { id: 'retorno', label: 'Passagem & Retorno' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'comunicacao', label: 'Comunicação' },
    { id: 'seguranca', label: 'Rede & Segurança' },
    { id: 'destino', label: 'Destino & Consulado' },
  ]

  const filteredItems =
    selectedCategory === 'all'
      ? checklist
      : checklist.filter((item) => item.category === selectedCategory)

  const completedCount = checklist.filter((i) => i.completed).length
  const totalCount = checklist.length
  const percent = Math.round((completedCount / totalCount) * 100)

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addChecklistItem({
      title: newTitle,
      category: 'seguranca',
      whyItMatters: newReason || 'Importante para manter minha liberdade de escolha.',
    })
    setNewTitle('')
    setNewReason('')
    setIsAddOpen(false)
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
            Plano de Segurança Ativo
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Checklist Interativo Pré-Embarque
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Cada item concluído garante que você possa tomar decisões independentes e retornar com
            segurança.
          </p>
        </div>

        {/* Add custom item modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-10 rounded-xl flex items-center gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Adicionar Item Próprio</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Adicionar Medida de Segurança
              </DialogTitle>
              <DialogDescription className="text-xs">
                Insira uma ação específica que você queira garantir antes de viajar.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddNew} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="customTitle" className="text-xs font-semibold">
                  Título do Item
                </Label>
                <Input
                  id="customTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Deixar chave extra com meu irmão, Salvar app de táxi"
                  required
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customReason" className="text-xs font-semibold">
                  Por que isso garante sua autonomia?
                </Label>
                <Input
                  id="customReason"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Ex: Garante que poderei me locomover sozinho no destino."
                  className="h-10 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-sky-600 text-white font-bold">
                  Salvar Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Summary Card */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">
              Status do Plano
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-300 text-[11px] border border-emerald-400/30">
              {completedCount} de {totalCount} Concluídos ({percent}%)
            </Badge>
          </div>
          <p className="text-xs text-slate-300">
            Itens marcados representam passos práticos já resolvidos para sua proteção e liberdade.
          </p>
        </div>

        <Link to="/guardians">
          <Button
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800 text-xs h-9"
          >
            Configurar Guardians →
          </Button>
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Interactive Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all ${
              item.completed
                ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(item.id)}
                  id={`chk-${item.id}`}
                  className="w-5 h-5 mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <label
                    htmlFor={`chk-${item.id}`}
                    className={`text-sm font-bold block cursor-pointer ${
                      item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </label>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
              </div>

              {/* Detail explainer button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveItemModal(item)}
                className="h-7 text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 flex-shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Por que importa?</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Explainer Modal */}
      {activeItemModal && (
        <Dialog open={!!activeItemModal} onOpenChange={() => setActiveItemModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-600" /> {activeItemModal.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Entenda o impacto prático deste item na sua autonomia
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 text-sky-950 space-y-1">
                <span className="font-bold text-sky-900 block">Por que este item é essencial:</span>
                <p className="leading-relaxed">{activeItemModal.whyItMatters}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 space-y-1">
                <span className="font-bold text-slate-900 block">Dica prática de execução:</span>
                <p className="leading-relaxed">{activeItemModal.actionTip}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveItemModal(null)}
                className="text-xs"
              >
                Fechar
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toggleChecklistItem(activeItemModal.id)
                  setActiveItemModal(null)
                }}
                className={`text-xs font-bold ${
                  activeItemModal.completed
                    ? 'bg-slate-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {activeItemModal.completed
                  ? 'Desmarcar como concluído'
                  : 'Marcar como concluído agora'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
