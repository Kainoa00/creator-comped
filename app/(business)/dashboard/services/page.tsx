'use client'

import { useState } from 'react'
import { Plus, Trash2, Image as ImageIcon, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'
import { AnimatedTabs } from '@/components/effects/AnimatedTabs'
import { UtensilsCrossed, Sparkles } from 'lucide-react'

type Tab = 'food' | 'wellness'

// ── Types ──────────────────────────────────────────────────────────────────

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
  description: string
  categoryLimit: number
  items: FoodMenuItem[]
}

interface WellnessService {
  id: string
  name: string
  price: number
  duration: 30 | 60 | 90
  compLimit: number
  appointmentRequired: boolean
  timeSlots: string[]
  maxBookingsPerDay: number
  description: string
}

interface WellnessGroup {
  id: string
  name: string
  description: string
  bookingCap: number
  services: WellnessService[]
}

// ── Demo data ──────────────────────────────────────────────────────────────

const initialFoodCategories: FoodCategory[] = [
  {
    id: '1',
    name: 'Appetizers',
    description: 'Starters and small plates',
    categoryLimit: 2,
    items: [
      { id: '1-1', name: 'Garlic Parmesan Breadsticks', price: 8, compLimit: 1, description: 'Freshly baked with marinara.' },
      { id: '1-2', name: 'Wings', price: 14, compLimit: 1, description: '8 pieces with choice of sauce' },
    ],
  },
  {
    id: '2',
    name: 'Beverages',
    description: 'Drinks and refreshments',
    categoryLimit: 3,
    items: [
      { id: '2-1', name: 'Craft Soda', price: 5, compLimit: 2, description: 'Small production sodas' },
    ],
  },
]

const initialWellnessGroups: WellnessGroup[] = [
  {
    id: 'w1',
    name: 'Hair',
    description: 'Professional hair services',
    bookingCap: 1,
    services: [
      {
        id: 'w1-1',
        name: 'Haircut & Style',
        price: 45,
        duration: 60,
        compLimit: 1,
        appointmentRequired: true,
        timeSlots: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'],
        maxBookingsPerDay: 4,
        description: 'Precision cut and styling',
      },
      {
        id: 'w1-2',
        name: 'Color Treatment',
        price: 120,
        duration: 90,
        compLimit: 1,
        appointmentRequired: true,
        timeSlots: ['10:00 AM', '2:00 PM'],
        maxBookingsPerDay: 4,
        description: '',
      },
    ],
  },
  {
    id: 'w2',
    name: 'Wellness',
    description: 'Relaxation and wellness treatments',
    bookingCap: 2,
    services: [
      {
        id: 'w2-1',
        name: 'Swedish Massage (60 min)',
        price: 90,
        duration: 60,
        compLimit: 1,
        appointmentRequired: true,
        timeSlots: ['10:00 AM', '12:00 PM'],
        maxBookingsPerDay: 3,
        description: '',
      },
    ],
  },
]

// ── Design tokens ──────────────────────────────────────────────────────────

const fieldClass = 'w-full bg-white/[0.06] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/15'
const gradientLabel = { background: 'linear-gradient(90deg, #8B5CF6 0%, #4A90E2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }

// ── Page ───────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('food')
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>(initialFoodCategories)
  const [wellnessGroups, setWellnessGroups] = useState<WellnessGroup[]>(initialWellnessGroups)
  const [addingSlot, setAddingSlot] = useState<string | null>(null) // serviceId
  const [newSlotTime, setNewSlotTime] = useState('')
  const { saved, flash: handleSave } = useSaveFlash()

  // ── Food handlers ────────────────────────────────────────────────────────
  const addFoodCategory = () =>
    setFoodCategories((prev) => [...prev, { id: Date.now().toString(), name: 'New Category', description: '', categoryLimit: 2, items: [] }])
  const deleteFoodCat = (id: string) => setFoodCategories((prev) => prev.filter((c) => c.id !== id))
  const updateFoodCat = (id: string, field: keyof FoodCategory, value: string | number) =>
    setFoodCategories((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c))
  const addFoodItem = (catId: string) =>
    setFoodCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: [...c.items, { id: `${catId}-${Date.now()}`, name: 'New Item', price: 0, compLimit: 1, description: '' }] }
    ))
  const deleteFoodItem = (catId: string, itemId: string) =>
    setFoodCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: c.items.filter((i) => i.id !== itemId) }
    ))
  const updateFoodItem = (catId: string, itemId: string, field: keyof FoodMenuItem, value: string | number) =>
    setFoodCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, [field]: value } : i) }
    ))

  // ── Wellness handlers ────────────────────────────────────────────────────
  const addWellnessGroup = () =>
    setWellnessGroups((prev) => [...prev, { id: Date.now().toString(), name: 'New Group', description: '', bookingCap: 1, services: [] }])
  const deleteGroup = (id: string) => setWellnessGroups((prev) => prev.filter((g) => g.id !== id))
  const updateGroup = (id: string, field: keyof WellnessGroup, value: string | number) =>
    setWellnessGroups((prev) => prev.map((g) => g.id === id ? { ...g, [field]: value } : g))
  const addService = (groupId: string) =>
    setWellnessGroups((prev) => prev.map((g) =>
      g.id !== groupId ? g : {
        ...g,
        services: [...g.services, { id: `${groupId}-${Date.now()}`, name: 'New Service', price: 0, duration: 60, compLimit: 1, appointmentRequired: false, timeSlots: [], maxBookingsPerDay: 1, description: '' }],
      }
    ))
  const deleteService = (groupId: string, serviceId: string) =>
    setWellnessGroups((prev) => prev.map((g) =>
      g.id !== groupId ? g : { ...g, services: g.services.filter((s) => s.id !== serviceId) }
    ))
  const updateService = (groupId: string, serviceId: string, field: keyof WellnessService, value: string | number | boolean | string[]) =>
    setWellnessGroups((prev) => prev.map((g) =>
      g.id !== groupId ? g : { ...g, services: g.services.map((s) => s.id === serviceId ? { ...s, [field]: value } : s) }
    ))
  const removeTimeSlot = (groupId: string, serviceId: string, slot: string) => {
    setWellnessGroups((prev) => prev.map((g) =>
      g.id !== groupId ? g : {
        ...g,
        services: g.services.map((s) =>
          s.id !== serviceId ? s : { ...s, timeSlots: s.timeSlots.filter((t) => t !== slot) }
        ),
      }
    ))
  }
  const confirmAddSlot = (groupId: string, serviceId: string) => {
    if (!newSlotTime.trim()) { setAddingSlot(null); return }
    // Format HH:MM → 12h
    const [h, m] = newSlotTime.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    const label = `${h12}:${String(m).padStart(2, '0')} ${ampm}`
    updateService(groupId, serviceId, 'timeSlots',
      [...(wellnessGroups.find((g) => g.id === groupId)?.services.find((s) => s.id === serviceId)?.timeSlots ?? []), label]
    )
    setNewSlotTime('')
    setAddingSlot(null)
  }

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Services</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage categories, items, and comp limits</p>
      </div>

      {/* Tabs */}
      <AnimatedTabs
        tabs={[
          { key: 'food', label: 'Food & Drink', icon: <UtensilsCrossed className="h-4 w-4" /> },
          { key: 'wellness', label: 'Beauty & Wellness', icon: <Sparkles className="h-4 w-4" /> },
        ]}
        activeKey={activeTab}
        onTabChange={(k) => setActiveTab(k as Tab)}
        layoutId="services-tab"
        className="mb-6"
      />

      {/* ── Food & Drink ──────────────────────────────────────────────────── */}
      {activeTab === 'food' && (
        <>
          <div className="flex flex-col gap-4 mb-4">
            {foodCategories.map((cat) => (
              <div key={cat.id} className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-start gap-2 mb-3">
                  <input type="text" value={cat.name} onChange={(e) => updateFoodCat(cat.id, 'name', e.target.value)} className={`${fieldClass} flex-1`} placeholder="Category name" />
                  <button type="button" onClick={() => deleteFoodCat(cat.id)} className="mt-0.5 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
                <input type="text" value={cat.description} onChange={(e) => updateFoodCat(cat.id, 'description', e.target.value)} className={`${fieldClass} mb-3`} placeholder="Category description" />
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Category Quantity Limit</p>
                  <input type="number" min={1} value={cat.categoryLimit} onChange={(e) => updateFoodCat(cat.id, 'categoryLimit', parseInt(e.target.value) || 1)} className={fieldClass} />
                </div>
                <div className="flex flex-col gap-3">
                  {cat.items.map((item) => (
                    <div key={item.id} className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3">
                      <div className="flex gap-3">
                        <div className="w-[72px] h-[72px] rounded-2xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                          <ImageIcon className="h-6 w-6 text-white/20" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                          <div className="flex items-center gap-2">
                            <input type="text" value={item.name} onChange={(e) => updateFoodItem(cat.id, item.id, 'name', e.target.value)} className={`${fieldClass} flex-1`} placeholder="Item name" />
                            <button type="button" onClick={() => deleteFoodItem(cat.id, item.id)} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0">
                              <Trash2 className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <input type="number" min="0" step="0.01" value={item.price} onChange={(e) => updateFoodItem(cat.id, item.id, 'price', parseFloat(e.target.value) || 0)} className={`${fieldClass} flex-1`} placeholder="Price" />
                            <input type="number" min="1" value={item.compLimit} onChange={(e) => updateFoodItem(cat.id, item.id, 'compLimit', parseInt(e.target.value) || 1)} className={`${fieldClass} flex-1`} placeholder="Limit" />
                          </div>
                          <input type="text" value={item.description ?? ''} onChange={(e) => updateFoodItem(cat.id, item.id, 'description', e.target.value)} className={fieldClass} placeholder="Item description" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addFoodItem(cat.id)} className="w-full mt-3 py-3.5 bg-white/[0.04] border border-white/[0.06] rounded-2xl text-sm text-white/50 hover:bg-white/[0.07] hover:text-white/70 transition-colors flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addFoodCategory} className="w-full py-3.5 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-sm text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center justify-center gap-2 mb-6">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </>
      )}

      {/* ── Beauty & Wellness ─────────────────────────────────────────────── */}
      {activeTab === 'wellness' && (
        <>
          <div className="flex flex-col gap-4 mb-4">
            {wellnessGroups.map((group) => (
              <div key={group.id} className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-4">
                {/* Group name + trash */}
                <div className="flex items-start gap-2 mb-3">
                  <input type="text" value={group.name} onChange={(e) => updateGroup(group.id, 'name', e.target.value)} className={`${fieldClass} flex-1`} placeholder="Group name" />
                  <button type="button" onClick={() => deleteGroup(group.id)} className="mt-0.5 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>

                {/* Description */}
                <input type="text" value={group.description} onChange={(e) => updateGroup(group.id, 'description', e.target.value)} className={`${fieldClass} mb-3`} placeholder="Group description" />

                {/* Service Booking Cap */}
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Service Booking Cap</p>
                  <input type="number" min={1} value={group.bookingCap} onChange={(e) => updateGroup(group.id, 'bookingCap', parseInt(e.target.value) || 1)} className={fieldClass} />
                </div>

                {/* Service cards */}
                <div className="flex flex-col gap-3">
                  {group.services.map((svc) => (
                    <div key={svc.id} className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
                      {/* Image + name + trash */}
                      <div className="flex gap-3 mb-4">
                        <div className="w-[72px] h-[72px] rounded-2xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                          <ImageIcon className="h-6 w-6 text-white/20" />
                        </div>
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <input type="text" value={svc.name} onChange={(e) => updateService(group.id, svc.id, 'name', e.target.value)} className={`${fieldClass} flex-1`} placeholder="Service name" />
                          <button type="button" onClick={() => deleteService(group.id, svc.id)} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0">
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>

                      {/* Price + Duration */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Price</p>
                          <input type="number" min="0" value={svc.price} onChange={(e) => updateService(group.id, svc.id, 'price', parseFloat(e.target.value) || 0)} className={fieldClass} placeholder="0" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Duration (minutes)</p>
                          <select
                            value={svc.duration}
                            onChange={(e) => updateService(group.id, svc.id, 'duration', parseInt(e.target.value) as 30 | 60 | 90)}
                            className={`${fieldClass} appearance-none`}
                          >
                            <option value={30} className="bg-[#1a1a1a]">30 min</option>
                            <option value={60} className="bg-[#1a1a1a]">60 min</option>
                            <option value={90} className="bg-[#1a1a1a]">90 min</option>
                          </select>
                        </div>
                      </div>

                      {/* Comp Limit + Appointment Required */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Comp Limit</p>
                          <input type="number" min="1" value={svc.compLimit} onChange={(e) => updateService(group.id, svc.id, 'compLimit', parseInt(e.target.value) || 1)} className={fieldClass} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Appointment Required</p>
                          <button
                            type="button"
                            onClick={() => updateService(group.id, svc.id, 'appointmentRequired', !svc.appointmentRequired)}
                            className={`${fieldClass} flex items-center gap-2 text-left`}
                          >
                            <div className={cn(
                              'w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors',
                              svc.appointmentRequired ? 'bg-blue-500' : 'bg-white/10 border border-white/20'
                            )}>
                              {svc.appointmentRequired && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-white">Yes</span>
                          </button>
                        </div>
                      </div>

                      {/* Available Time Slots */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-2" style={gradientLabel}>Available Time Slots</p>
                        {svc.timeSlots.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {svc.timeSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => removeTimeSlot(group.id, svc.id, slot)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs font-medium text-white hover:bg-red-500/20 hover:border-red-500/30 transition-colors group"
                              >
                                <Clock className="h-3 w-3 text-white/50 group-hover:text-red-400" />
                                {slot}
                                <X className="h-2.5 w-2.5 text-white/30 group-hover:text-red-400" />
                              </button>
                            ))}
                          </div>
                        )}

                        {addingSlot === svc.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              autoFocus
                              value={newSlotTime}
                              onChange={(e) => setNewSlotTime(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') confirmAddSlot(group.id, svc.id); if (e.key === 'Escape') setAddingSlot(null) }}
                              className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                            />
                            <button type="button" onClick={() => confirmAddSlot(group.id, svc.id)} className="px-3 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}>Add</button>
                            <button type="button" onClick={() => setAddingSlot(null)} className="px-3 py-2 rounded-xl text-xs text-white/40 bg-white/[0.05] border border-white/[0.08]">Cancel</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setAddingSlot(svc.id); setNewSlotTime('') }}
                            className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" /> Add Time Slot
                          </button>
                        )}
                      </div>

                      {/* Max Bookings Per Day */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Max Bookings Per Day</p>
                        <input type="number" min="1" value={svc.maxBookingsPerDay} onChange={(e) => updateService(group.id, svc.id, 'maxBookingsPerDay', parseInt(e.target.value) || 1)} className={fieldClass} />
                      </div>

                      {/* Description */}
                      <input type="text" value={svc.description} onChange={(e) => updateService(group.id, svc.id, 'description', e.target.value)} className={fieldClass} placeholder="Service description" />
                    </div>
                  ))}
                </div>

                {/* Add Service */}
                <button type="button" onClick={() => addService(group.id)} className="w-full mt-3 py-3.5 bg-white/[0.04] border border-white/[0.06] rounded-2xl text-sm text-white/50 hover:bg-white/[0.07] hover:text-white/70 transition-colors flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> Add Service
                </button>
              </div>
            ))}
          </div>

          {/* Add Group */}
          <button type="button" onClick={addWellnessGroup} className="w-full py-3.5 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-sm text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center justify-center gap-2 mb-6">
            <Plus className="h-4 w-4" /> Add Group
          </button>
        </>
      )}

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        className={cn('w-full py-4 rounded-2xl text-white font-bold text-sm transition-all', saved ? 'bg-emerald-500' : '')}
        style={saved ? {} : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
