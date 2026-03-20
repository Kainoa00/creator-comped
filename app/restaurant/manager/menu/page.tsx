'use client'

import { useState } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { useMenuItems } from '@/lib/hooks/useRestaurantData'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import { cn } from '@/lib/utils'
import { Plus, Pencil, Check, X, Eye, EyeOff } from 'lucide-react'
import type { MenuItem } from '@/lib/types'

const restaurant = DEMO_RESTAURANTS[0]

export default function ManagerMenuPage() {
  const { menuItems, setMenuItems } = useMenuItems(restaurant.id)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<MenuItem>>({})
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', description: '', estimated_cogs: '', max_qty_per_order: '2' })

  function startEdit(item: MenuItem) {
    setEditingId(item.id)
    setEditDraft({ name: item.name, description: item.description ?? '', estimated_cogs: item.estimated_cogs, max_qty_per_order: item.max_qty_per_order, active: item.active })
  }

  function saveEdit(item: MenuItem) {
    setMenuItems((prev) => prev.map((m) => m.id === item.id ? { ...m, ...editDraft } : m))
    setEditingId(null)
  }

  function toggleActive(id: string) {
    setMenuItems((prev) => prev.map((m) => m.id === id ? { ...m, active: !m.active } : m))
  }

  function handleAddItem() {
    if (!newItem.name.trim()) return
    const item: MenuItem = {
      id: `item-new-${Date.now()}`,
      restaurant_id: restaurant.id,
      name: newItem.name,
      description: newItem.description || null,
      image_url: null,
      max_qty_per_order: parseInt(newItem.max_qty_per_order) || 2,
      estimated_cogs: parseFloat(newItem.estimated_cogs) || null,
      active: true,
      created_at: new Date().toISOString(),
    }
    setMenuItems((prev) => [...prev, item])
    setNewItem({ name: '', description: '', estimated_cogs: '', max_qty_per_order: '2' })
    setShowAddSheet(false)
  }

  const active = menuItems.filter((m) => m.active)
  const inactive = menuItems.filter((m) => !m.active)

  return (
    <div className="px-4 pt-6 pb-6">
      <DarkHeader
        title="Comp Menu"
        subtitle={`${active.length} active items`}
        backHref="/restaurant/manager"
        right={
          <button
            onClick={() => setShowAddSheet(true)}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center"
          >
            <Plus className="h-5 w-5 text-white" />
          </button>
        }
      />

      <div className="flex flex-col gap-3 mb-6">
        {active.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            draft={editDraft}
            onEdit={() => startEdit(item)}
            onSave={() => saveEdit(item)}
            onCancel={() => setEditingId(null)}
            onDraftChange={(d) => setEditDraft((p) => ({ ...p, ...d }))}
            onToggleActive={() => toggleActive(item.id)}
          />
        ))}
        {active.length === 0 && (
          <div className="text-center py-10 text-white/30">
            <p className="text-sm">No active items yet</p>
          </div>
        )}
      </div>

      {inactive.length > 0 && (
        <>
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Inactive</p>
          <div className="flex flex-col gap-3">
            {inactive.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                draft={editDraft}
                onEdit={() => startEdit(item)}
                onSave={() => saveEdit(item)}
                onCancel={() => setEditingId(null)}
                onDraftChange={(d) => setEditDraft((p) => ({ ...p, ...d }))}
                onToggleActive={() => toggleActive(item.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Add Item Sheet */}
      {showAddSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddSheet(false)} />
          <div className="relative bg-[#111] rounded-t-3xl border-t border-white/[0.08] p-6 pb-10">
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <h3 className="text-lg font-bold text-white mb-5">Add Menu Item</h3>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Item name *"
                value={newItem.name}
                onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
              />
              <input
                placeholder="Description (optional)"
                value={newItem.description}
                onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Est. cost ($)"
                  type="number"
                  value={newItem.estimated_cogs}
                  onChange={(e) => setNewItem((p) => ({ ...p, estimated_cogs: e.target.value }))}
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                />
                <input
                  placeholder="Max qty"
                  type="number"
                  value={newItem.max_qty_per_order}
                  onChange={(e) => setNewItem((p) => ({ ...p, max_qty_per_order: e.target.value }))}
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddSheet(false)}
                className="flex-1 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/60 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.name.trim()}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 text-white font-bold disabled:opacity-40"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuItemCardProps {
  item: MenuItem
  isEditing: boolean
  draft: Partial<MenuItem>
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDraftChange: (d: Partial<MenuItem>) => void
  onToggleActive: () => void
}

function MenuItemCard({ item, isEditing, draft, onEdit, onSave, onCancel, onDraftChange, onToggleActive }: MenuItemCardProps) {
  return (
    <div className={cn(
      'bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4',
      !item.active && 'opacity-50'
    )}>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            value={draft.name ?? ''}
            onChange={(e) => onDraftChange({ name: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
            placeholder="Name"
          />
          <input
            value={draft.description ?? ''}
            onChange={(e) => onDraftChange({ description: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white/60 focus:outline-none focus:border-white/20"
            placeholder="Description"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={draft.estimated_cogs ?? ''}
              onChange={(e) => onDraftChange({ estimated_cogs: parseFloat(e.target.value) || null })}
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
              placeholder="Cost $"
            />
            <input
              type="number"
              value={draft.max_qty_per_order ?? ''}
              onChange={(e) => onDraftChange({ max_qty_per_order: parseInt(e.target.value) || 1 })}
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
              placeholder="Max qty"
            />
          </div>
          <div className="flex gap-2 mt-1">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm font-medium flex items-center justify-center gap-1.5">
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button onClick={onSave} className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center justify-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
            {item.description && <p className="text-xs text-white/40 mt-0.5 truncate">{item.description}</p>}
            <div className="flex items-center gap-3 mt-1.5">
              {item.estimated_cogs && (
                <span className="text-xs text-white/40">${item.estimated_cogs.toFixed(2)}</span>
              )}
              <span className="text-xs text-white/30">Max {item.max_qty_per_order}/order</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onToggleActive} className="h-8 w-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white transition-colors">
              {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button onClick={onEdit} className="h-8 w-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
