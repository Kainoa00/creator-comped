'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { getMenuItemsForRestaurant, DEMO_RESTAURANTS } from '@/lib/demo-data'
import { cn, deepClone } from '@/lib/utils'
import type { MenuItem } from '@/lib/types'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon,
  Package,
  DollarSign,
} from 'lucide-react'

const restaurant = DEMO_RESTAURANTS[0]

function makeBlankItem(): Omit<MenuItem, 'id' | 'created_at'> {
  return {
    restaurant_id: restaurant.id,
    name: '',
    description: '',
    image_url: null,
    max_qty_per_order: 1,
    estimated_cogs: null,
    active: true,
  }
}

export default function CompMenuPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [items, setItems] = useState<MenuItem[]>(() =>
    deepClone(getMenuItemsForRestaurant(restaurant.id))
  )
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null)
  const [formData, setFormData] = useState<Omit<MenuItem, 'id' | 'created_at'>>(makeBlankItem())
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const isNew = selectedId === 'new'
  const editingItem = isNew ? null : items.find((i) => i.id === selectedId) ?? null

  function openNew() {
    setSelectedId('new')
    setFormData(makeBlankItem())
    setFormErrors({})
  }

  function openEdit(item: MenuItem) {
    setSelectedId(item.id)
    setFormData({
      restaurant_id: item.restaurant_id,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      max_qty_per_order: item.max_qty_per_order,
      estimated_cogs: item.estimated_cogs,
      active: item.active,
    })
    setFormErrors({})
  }

  function closeForm() {
    setSelectedId(null)
    setFormErrors({})
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = 'Name is required'
    if (formData.max_qty_per_order < 1 || formData.max_qty_per_order > 10)
      errs.max_qty = 'Must be 1–10'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))

    if (isNew) {
      const newItem: MenuItem = {
        ...formData,
        id: `item-demo-${Date.now()}`,
        created_at: new Date().toISOString(),
      }
      setItems((prev) => [...prev, newItem])
      toast({ type: 'success', title: 'Item added', message: formData.name })
    } else if (selectedId) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === selectedId ? { ...i, ...formData } : i
        )
      )
      toast({ type: 'success', title: 'Item updated', message: formData.name })
    }

    setSaving(false)
    closeForm()
  }

  function handleToggleActive(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, active: !i.active } : i
      )
    )
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (selectedId === id) closeForm()
    setDeleteConfirm(null)
    toast({ type: 'info', title: 'Item removed' })
  }

  return (
    <div className="p-6">
      <div className="cc-inner">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/restaurant/manager')}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Comp Menu</h1>
              <p className="text-sm text-slate-500">
                {items.filter((i) => i.active).length} active item{items.filter(i => i.active).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-cc-accent hover:bg-cc-accent-dark text-white rounded-xl px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* ── Left: Items List ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              {items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
                  <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">No items yet</p>
                  <Button variant="outline" size="sm" onClick={openNew}>Add first item</Button>
                </div>
              ) : (
                <>
                  <ul>
                    {items.map((item, i) => (
                      <li
                        key={item.id}
                        className={cn(
                          'flex items-center gap-3 px-4 py-4 cursor-pointer transition-all',
                          i < items.length - 1 && 'border-b border-slate-100',
                          selectedId === item.id
                            ? 'border-l-2 border-cc-accent bg-blue-50/40'
                            : 'hover:bg-slate-50'
                        )}
                        onClick={() => openEdit(item)}
                      >
                        {/* Active toggle */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleActive(item.id) }}
                          className="shrink-0 text-slate-300 hover:text-cc-accent transition-colors"
                        >
                          {item.active ? (
                            <ToggleRight className="h-6 w-6 text-cc-accent" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-slate-300" />
                          )}
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm font-semibold truncate',
                            item.active ? 'text-slate-900' : 'text-slate-400 line-through'
                          )}>
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Max {item.max_qty_per_order}/order
                            {item.estimated_cogs ? ` · $${item.estimated_cogs.toFixed(2)} COGS` : ''}
                          </p>
                        </div>

                        {!item.active && (
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Off</span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Add item shortcut */}
                  <button
                    onClick={openNew}
                    className="w-full border-t-2 border-dashed border-slate-200 p-4 text-center text-sm font-semibold text-cc-accent hover:border-cc-accent hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4 inline mr-1.5" />
                    Add Item
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Edit Form ── */}
          <div className="lg:col-span-3">
            {selectedId ? (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-5">
                  {isNew ? 'New Item' : `Edit: ${editingItem?.name}`}
                </h2>

                <div className="flex flex-col gap-4">
                  <Input
                    label="Name *"
                    placeholder='e.g. Build-Your-Own Pizza (12")'
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    error={formErrors.name}
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe the item..."
                    rows={3}
                    value={formData.description ?? ''}
                    onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
                  />

                  <Input
                    label="Image URL"
                    placeholder="https://..."
                    value={formData.image_url ?? ''}
                    onChange={(e) =>
                      setFormData((d) => ({ ...d, image_url: e.target.value || null }))
                    }
                    leftAddon={<ImageIcon className="h-4 w-4" />}
                  />

                  {/* Image preview */}
                  {formData.image_url && (
                    <div className="rounded-xl overflow-hidden border border-slate-100 h-32 w-full bg-slate-50">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                        Max qty per order
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.max_qty_per_order}
                        onChange={(e) =>
                          setFormData((d) => ({
                            ...d,
                            max_qty_per_order: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)),
                          }))
                        }
                        className={cn(
                          'w-full h-11 rounded-xl bg-white border text-slate-900 text-sm px-3',
                          'focus:outline-none focus:ring-2 focus:ring-cc-accent/10 focus:border-cc-accent',
                          'transition-colors duration-150',
                          formErrors.max_qty ? 'border-red-400' : 'border-slate-200'
                        )}
                      />
                      {formErrors.max_qty && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.max_qty}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                        Est. COGS per unit
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <DollarSign className="h-4 w-4" />
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.estimated_cogs ?? ''}
                          onChange={(e) =>
                            setFormData((d) => ({
                              ...d,
                              estimated_cogs: e.target.value ? parseFloat(e.target.value) : null,
                            }))
                          }
                          className={cn(
                            'w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm pl-8 pr-3',
                            'focus:outline-none focus:ring-2 focus:ring-cc-accent/10 focus:border-cc-accent',
                            'transition-colors duration-150'
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Active</p>
                      <p className="text-xs text-slate-400">Creators can select this item</p>
                    </div>
                    <button
                      onClick={() => setFormData((d) => ({ ...d, active: !d.active }))}
                      className="transition-colors"
                    >
                      {formData.active ? (
                        <ToggleRight className="h-8 w-8 text-cc-accent" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Form actions */}
                <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-100">
                  {!isNew && (
                    <button
                      onClick={() => setDeleteConfirm(selectedId!)}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete item
                    </button>
                  )}
                  <div className="flex items-center gap-3 ml-auto">
                    <Button variant="ghost" size="md" onClick={closeForm}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="md" loading={saving} onClick={handleSave}>
                      {isNew ? 'Add Item' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
                <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <Pencil className="h-5 w-5 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-900">Select an item to edit</p>
                <p className="text-sm text-slate-400">
                  Or click &quot;Add Item&quot; to create a new menu item
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Item?"
        description="This cannot be undone."
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{' '}
          <strong className="text-slate-900">
            {items.find((i) => i.id === deleteConfirm)?.name}
          </strong>
          ? Past redemptions using this item will not be affected.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm!)}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
