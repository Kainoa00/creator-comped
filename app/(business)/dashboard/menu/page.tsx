'use client'

import { useState } from 'react'
import { Plus, Trash2, Image as ImageIcon, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

interface LocalMenuItem {
  id: string
  name: string
  price: number
  compLimit: number
  description?: string
}

interface MenuCategory {
  id: string
  name: string
  description: string
  categoryLimit?: number
  items: LocalMenuItem[]
}

const initialCategories: MenuCategory[] = [
  {
    id: '1',
    name: 'Appetizers',
    description: 'Start your meal right',
    categoryLimit: 2,
    items: [
      { id: '1-1', name: 'Truffle Fries', price: 12, compLimit: 1 },
      { id: '1-2', name: 'Caesar Salad', price: 14, compLimit: 1 },
    ],
  },
  {
    id: '2',
    name: 'Entrees',
    description: 'Main course selections',
    categoryLimit: 1,
    items: [
      { id: '2-1', name: 'Build-Your-Own Pizza (12")', price: 18, compLimit: 1, description: 'Hand-tossed crust, 3 toppings.' },
      { id: '2-2', name: 'Pasta of the Day', price: 16, compLimit: 1 },
    ],
  },
  {
    id: '3',
    name: 'Drinks',
    description: 'Beverages and refreshments',
    items: [
      { id: '3-1', name: 'Craft Milkshake', price: 7, compLimit: 2 },
    ],
  },
]

const fieldClass = 'w-full bg-white/[0.06] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/15'
const gradientLabel = { background: 'linear-gradient(90deg, #8B5CF6 0%, #4A90E2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }

export default function EditMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)
  const { saved, flash: handleSave } = useSaveFlash()

  const addCategory = () =>
    setCategories((prev) => [...prev, { id: Date.now().toString(), name: 'New Category', description: '', items: [] }])

  const deleteCategory = (id: string) =>
    setCategories((prev) => prev.filter((c) => c.id !== id))

  const updateCategory = (id: string, field: keyof MenuCategory, value: string | number | undefined) =>
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c))

  const addItem = (catId: string) =>
    setCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : {
        ...c,
        items: [...c.items, { id: `${catId}-${Date.now()}`, name: 'New Item', price: 0, compLimit: 1 }],
      }
    ))

  const deleteItem = (catId: string, itemId: string) =>
    setCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: c.items.filter((i) => i.id !== itemId) }
    ))

  const updateItem = (catId: string, itemId: string, field: keyof LocalMenuItem, value: string | number) =>
    setCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, [field]: value } : i) }
    ))

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Edit Menu</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage categories, items, and limits</p>
      </div>

      {/* Category list */}
      <div className="flex flex-col gap-5 mb-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-4">
            {/* Category name + trash */}
            <div className="flex items-start gap-2 mb-3">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                className={`${fieldClass} flex-1`}
                placeholder="Category name"
              />
              <button
                type="button"
                onClick={() => deleteCategory(cat.id)}
                className="mt-0.5 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>

            {/* Description */}
            <input
              type="text"
              value={cat.description}
              onChange={(e) => updateCategory(cat.id, 'description', e.target.value)}
              className={`${fieldClass} mb-3`}
              placeholder="Category description"
            />

            {/* Quantity Limit */}
            <div className="mb-4">
              <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>
                Category Quantity Limit (optional)
              </p>
              <input
                type="number"
                min={1}
                value={cat.categoryLimit ?? ''}
                onChange={(e) => updateCategory(cat.id, 'categoryLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                className={fieldClass}
                placeholder="No limit"
              />
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3">
              {cat.items.map((item) => (
                <div key={item.id} className="bg-white/[0.04] border border-white/[0.05] rounded-2xl p-3">
                  {/* Image + name + trash */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                      <ImageIcon className="h-6 w-6 text-white/20" />
                    </div>
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(cat.id, item.id, 'name', e.target.value)}
                        className={`${fieldClass} flex-1`}
                        placeholder="Item name"
                      />
                      <button
                        type="button"
                        onClick={() => deleteItem(cat.id, item.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Price + Comp Limit */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Price ($)</p>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(cat.id, item.id, 'price', parseFloat(e.target.value) || 0)}
                        className={fieldClass}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Comp Limit</p>
                      <input
                        type="number"
                        min="1"
                        value={item.compLimit}
                        onChange={(e) => updateItem(cat.id, item.id, 'compLimit', parseInt(e.target.value) || 1)}
                        className={fieldClass}
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <input
                    type="text"
                    value={item.description ?? ''}
                    onChange={(e) => updateItem(cat.id, item.id, 'description', e.target.value)}
                    className={fieldClass}
                    placeholder="Optional description"
                  />
                </div>
              ))}
            </div>

            {/* Add Item */}
            <button
              type="button"
              onClick={() => addItem(cat.id)}
              className="w-full mt-3 py-3.5 bg-white/[0.04] border border-white/[0.05] rounded-2xl text-sm text-white/40 hover:bg-white/[0.07] hover:text-white/60 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>
        ))}
      </div>

      {/* Add Category */}
      <button
        type="button"
        onClick={addCategory}
        className="w-full py-3.5 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-sm text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center justify-center gap-2 mb-6"
      >
        <Plus className="h-4 w-4" /> Add Category
      </button>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        className={cn('w-full py-4 rounded-2xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2', saved ? 'bg-emerald-500' : '')}
        style={saved ? {} : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        <Save className="h-4 w-4" />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
