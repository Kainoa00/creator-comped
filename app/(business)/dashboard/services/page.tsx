'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

type Tab = 'food' | 'wellness'

interface FoodMenuItem {
  id: string
  name: string
  price: number
  compLimit: number
  description?: string
}

interface FoodCategory {
  id: string
  name: string
  items: FoodMenuItem[]
  isExpanded: boolean
}

interface WellnessService {
  id: string
  name: string
  price: number
  duration: 30 | 60 | 90
  compLimit: number
  appointmentRequired: boolean
}

interface WellnessGroup {
  id: string
  name: string
  bookingCap: number
  services: WellnessService[]
  isExpanded: boolean
}

const initialFoodCategories: FoodCategory[] = [
  {
    id: '1',
    name: 'Appetizers',
    isExpanded: true,
    items: [
      { id: '1-1', name: 'Garlic Parmesan Breadsticks', price: 8, compLimit: 1, description: 'Freshly baked with marinara.' },
      { id: '1-2', name: 'Loaded Nachos', price: 12, compLimit: 1 },
    ],
  },
  {
    id: '2',
    name: 'Entrees',
    isExpanded: false,
    items: [
      { id: '2-1', name: 'Build-Your-Own Pizza (12")', price: 18, compLimit: 1 },
      { id: '2-2', name: 'Pasta of the Day', price: 16, compLimit: 1 },
    ],
  },
  {
    id: '3',
    name: 'Drinks',
    isExpanded: false,
    items: [
      { id: '3-1', name: 'Craft Milkshake', price: 7, compLimit: 2 },
    ],
  },
]

const initialWellnessGroups: WellnessGroup[] = [
  {
    id: 'w1',
    name: 'Hair',
    bookingCap: 3,
    isExpanded: true,
    services: [
      { id: 'w1-1', name: 'Blowout', price: 55, duration: 60, compLimit: 1, appointmentRequired: true },
      { id: 'w1-2', name: 'Color & Cut', price: 120, duration: 90, compLimit: 1, appointmentRequired: true },
    ],
  },
  {
    id: 'w2',
    name: 'Wellness',
    bookingCap: 2,
    isExpanded: false,
    services: [
      { id: 'w2-1', name: 'Swedish Massage (60 min)', price: 90, duration: 60, compLimit: 1, appointmentRequired: true },
      { id: 'w2-2', name: 'Facial', price: 75, duration: 60, compLimit: 1, appointmentRequired: false },
    ],
  },
]

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('food')
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>(initialFoodCategories)
  const [wellnessGroups, setWellnessGroups] = useState<WellnessGroup[]>(initialWellnessGroups)
  const [showAddFoodCat, setShowAddFoodCat] = useState(false)
  const [newFoodCatName, setNewFoodCatName] = useState('')
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const { saved, flash: handleSave } = useSaveFlash()

  // Food handlers
  const toggleFoodCat = (id: string) =>
    setFoodCategories((prev) => prev.map((c) => c.id === id ? { ...c, isExpanded: !c.isExpanded } : c))
  const addFoodCategory = () => {
    if (!newFoodCatName.trim()) return
    setFoodCategories((prev) => [...prev, { id: Date.now().toString(), name: newFoodCatName.trim(), isExpanded: true, items: [] }])
    setNewFoodCatName('')
    setShowAddFoodCat(false)
  }
  const deleteFoodCat = (id: string) => setFoodCategories((prev) => prev.filter((c) => c.id !== id))
  const addFoodItem = (catId: string) =>
    setFoodCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: [...c.items, { id: `${catId}-${Date.now()}`, name: 'New Item', price: 0, compLimit: 1 }] }
    ))
  const deleteFoodItem = (catId: string, itemId: string) =>
    setFoodCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: c.items.filter((i) => i.id !== itemId) }
    ))
  const updateFoodItem = (catId: string, itemId: string, field: keyof FoodMenuItem, value: string | number) =>
    setFoodCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, [field]: value } : i) }
    ))

  // Wellness handlers
  const toggleWellnessGroup = (id: string) =>
    setWellnessGroups((prev) => prev.map((g) => g.id === id ? { ...g, isExpanded: !g.isExpanded } : g))
  const addGroup = () => {
    if (!newGroupName.trim()) return
    setWellnessGroups((prev) => [...prev, { id: Date.now().toString(), name: newGroupName.trim(), bookingCap: 2, isExpanded: true, services: [] }])
    setNewGroupName('')
    setShowAddGroup(false)
  }
  const deleteGroup = (id: string) => setWellnessGroups((prev) => prev.filter((g) => g.id !== id))
  const updateGroupCap = (id: string, cap: number) =>
    setWellnessGroups((prev) => prev.map((g) => g.id === id ? { ...g, bookingCap: Math.max(1, cap) } : g))
  const addService = (groupId: string) =>
    setWellnessGroups((prev) => prev.map((g) =>
      g.id !== groupId ? g : {
        ...g,
        services: [...g.services, { id: `${groupId}-${Date.now()}`, name: 'New Service', price: 0, duration: 60, compLimit: 1, appointmentRequired: false }],
      }
    ))
  const deleteService = (groupId: string, serviceId: string) =>
    setWellnessGroups((prev) => prev.map((g) =>
      g.id !== groupId ? g : { ...g, services: g.services.filter((s) => s.id !== serviceId) }
    ))
  const updateService = (groupId: string, serviceId: string, field: keyof WellnessService, value: string | number | boolean) =>
    setWellnessGroups((prev) => prev.map((g) =>
      g.id !== groupId ? g : { ...g, services: g.services.map((s) => s.id === serviceId ? { ...s, [field]: value } : s) }
    ))

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Services</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage your offerings and comp limits</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl mb-6">
        {(['food', 'wellness'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize',
              activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/60'
            )}
            style={activeTab === tab ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' } : {}}
          >
            {tab === 'food' ? 'Food & Drink' : 'Beauty & Wellness'}
          </button>
        ))}
      </div>

      {/* Food & Drink Tab */}
      {activeTab === 'food' && (
        <>
          <button
            type="button"
            onClick={() => setShowAddFoodCat(!showAddFoodCat)}
            className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-sm text-white/60 hover:bg-white/[0.08] transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>

          {showAddFoodCat && (
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-4 flex gap-2">
              <input
                autoFocus
                value={newFoodCatName}
                onChange={(e) => setNewFoodCatName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFoodCategory()}
                placeholder="Category name"
                className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none"
              />
              <button type="button" onClick={addFoodCategory} className="px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}>
                Add
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 mb-6">
            {foodCategories.map((cat) => (
              <div key={cat.id} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3.5">
                  <button type="button" onClick={() => toggleFoodCat(cat.id)} className="flex items-center gap-2 flex-1 text-left">
                    {cat.isExpanded ? <ChevronDown className="h-4 w-4 text-white/30" /> : <ChevronRight className="h-4 w-4 text-white/30" />}
                    <span className="text-sm font-semibold text-white">{cat.name}</span>
                    <span className="text-xs text-white/30">({cat.items.length})</span>
                  </button>
                  <button type="button" onClick={() => deleteFoodCat(cat.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
                {cat.isExpanded && (
                  <div className="border-t border-white/[0.05] px-4 py-3 flex flex-col gap-3">
                    {cat.items.map((item) => (
                      <div key={item.id} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateFoodItem(cat.id, item.id, 'name', e.target.value)}
                            className="flex-1 bg-transparent text-sm text-white focus:outline-none border-b border-white/[0.08] pb-0.5"
                          />
                          <button type="button" onClick={() => deleteFoodItem(cat.id, item.id)} className="p-1 rounded-lg hover:bg-red-500/20 transition-colors shrink-0">
                            <Trash2 className="h-3 w-3 text-red-400" />
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-white/30">Price $</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateFoodItem(cat.id, item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-16 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-white/30">Comp Limit</span>
                            <div className="flex items-center border border-white/[0.08] rounded-lg overflow-hidden">
                              <button type="button" onClick={() => updateFoodItem(cat.id, item.id, 'compLimit', Math.max(1, item.compLimit - 1))} className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors">−</button>
                              <span className="px-2 py-1 text-xs text-white font-semibold min-w-[1.5rem] text-center">{item.compLimit}</span>
                              <button type="button" onClick={() => updateFoodItem(cat.id, item.id, 'compLimit', item.compLimit + 1)} className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addFoodItem(cat.id)} className="w-full py-2.5 border border-dashed border-white/[0.12] rounded-xl text-xs text-white/40 hover:border-white/20 hover:text-white/60 transition-colors flex items-center justify-center gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Add Item
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Beauty & Wellness Tab */}
      {activeTab === 'wellness' && (
        <>
          <button
            type="button"
            onClick={() => setShowAddGroup(!showAddGroup)}
            className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-sm text-white/60 hover:bg-white/[0.08] transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Service Group
          </button>

          {showAddGroup && (
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-4 flex gap-2">
              <input
                autoFocus
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                placeholder="Group name (e.g. Hair, Nails)"
                className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none"
              />
              <button type="button" onClick={addGroup} className="px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}>
                Add
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 mb-6">
            {wellnessGroups.map((group) => (
              <div key={group.id} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3.5">
                  <button type="button" onClick={() => toggleWellnessGroup(group.id)} className="flex items-center gap-2 flex-1 text-left">
                    {group.isExpanded ? <ChevronDown className="h-4 w-4 text-white/30" /> : <ChevronRight className="h-4 w-4 text-white/30" />}
                    <span className="text-sm font-semibold text-white">{group.name}</span>
                    <span className="text-xs text-white/30">({group.services.length})</span>
                  </button>
                  <div className="flex items-center gap-1 mr-2">
                    <span className="text-xs text-white/30">Booking Cap</span>
                    <input
                      type="number"
                      min="1"
                      value={group.bookingCap}
                      onChange={(e) => updateGroupCap(group.id, parseInt(e.target.value) || 1)}
                      className="w-12 bg-white/[0.08] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none"
                    />
                  </div>
                  <button type="button" onClick={() => deleteGroup(group.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>

                {group.isExpanded && (
                  <div className="border-t border-white/[0.05] px-4 py-3 flex flex-col gap-3">
                    {group.services.map((svc) => (
                      <div key={svc.id} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="text"
                            value={svc.name}
                            onChange={(e) => updateService(group.id, svc.id, 'name', e.target.value)}
                            className="flex-1 bg-transparent text-sm text-white focus:outline-none border-b border-white/[0.08] pb-0.5"
                          />
                          <button type="button" onClick={() => deleteService(group.id, svc.id)} className="p-1 rounded-lg hover:bg-red-500/20 transition-colors shrink-0">
                            <Trash2 className="h-3 w-3 text-red-400" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-white/30">Price $</span>
                            <input
                              type="number"
                              min="0"
                              value={svc.price}
                              onChange={(e) => updateService(group.id, svc.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-16 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-white/30">Duration</span>
                            <select
                              value={svc.duration}
                              onChange={(e) => updateService(group.id, svc.id, 'duration', parseInt(e.target.value) as 30 | 60 | 90)}
                              className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                            >
                              <option value={30}>30 min</option>
                              <option value={60}>60 min</option>
                              <option value={90}>90 min</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-white/30">Comp Limit</span>
                            <div className="flex items-center border border-white/[0.08] rounded-lg overflow-hidden">
                              <button type="button" onClick={() => updateService(group.id, svc.id, 'compLimit', Math.max(1, svc.compLimit - 1))} className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors">−</button>
                              <span className="px-2 py-1 text-xs text-white font-semibold min-w-[1.5rem] text-center">{svc.compLimit}</span>
                              <button type="button" onClick={() => updateService(group.id, svc.id, 'compLimit', svc.compLimit + 1)} className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors">+</button>
                            </div>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={svc.appointmentRequired}
                            onChange={(e) => updateService(group.id, svc.id, 'appointmentRequired', e.target.checked)}
                            className="w-4 h-4 rounded accent-orange-500"
                          />
                          <span className="text-xs text-white/60">Appointment Required</span>
                        </label>
                      </div>
                    ))}
                    <button type="button" onClick={() => addService(group.id)} className="w-full py-2.5 border border-dashed border-white/[0.12] rounded-xl text-xs text-white/40 hover:border-white/20 hover:text-white/60 transition-colors flex items-center justify-center gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Add Service
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className={cn(
          'w-full py-4 rounded-2xl text-white font-bold text-sm transition-all',
          saved ? 'bg-emerald-500' : ''
        )}
        style={saved ? {} : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
