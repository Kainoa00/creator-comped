'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
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
  items: LocalMenuItem[]
  isExpanded: boolean
}

const initialCategories: MenuCategory[] = [
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
      { id: '2-1', name: 'Build-Your-Own Pizza (12")', price: 18, compLimit: 1, description: 'Hand-tossed crust, 3 toppings.' },
      { id: '2-2', name: 'Pasta of the Day', price: 16, compLimit: 1 },
      { id: '2-3', name: 'The 22 Burger', price: 15, compLimit: 1 },
    ],
  },
  {
    id: '3',
    name: 'Drinks',
    isExpanded: false,
    items: [
      { id: '3-1', name: 'Craft Milkshake', price: 7, compLimit: 2 },
      { id: '3-2', name: 'Lemonade', price: 4, compLimit: 2 },
    ],
  },
]

export default function EditMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const { saved, flash: handleSave } = useSaveFlash()

  const toggleCategory = (id: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, isExpanded: !c.isExpanded } : c))
  }

  const addCategory = () => {
    if (!newCategoryName.trim()) return
    setCategories((prev) => [...prev, {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      isExpanded: true,
      items: [],
    }])
    setNewCategoryName('')
    setShowAddCategory(false)
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const addItem = (categoryId: string) => {
    setCategories((prev) => prev.map((c) => {
      if (c.id !== categoryId) return c
      return {
        ...c,
        items: [...c.items, { id: `${categoryId}-${Date.now()}`, name: 'New Item', price: 0, compLimit: 1 }],
      }
    }))
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories((prev) => prev.map((c) => {
      if (c.id !== categoryId) return c
      return { ...c, items: c.items.filter((i) => i.id !== itemId) }
    }))
  }

  const updateItem = (categoryId: string, itemId: string, field: keyof LocalMenuItem, value: string | number) => {
    setCategories((prev) => prev.map((c) => {
      if (c.id !== categoryId) return c
      return { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, [field]: value } : i) }
    }))
  }

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Edit Menu</h1>
        <p className="text-sm text-white/40 mt-0.5">Food & Drink items and comp limits</p>
      </div>

      {/* Add Category */}
      <button
        type="button"
        onClick={() => setShowAddCategory(!showAddCategory)}
        className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-sm text-white/60 hover:bg-white/[0.08] transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </button>

      {showAddCategory && (
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-4 flex gap-2">
          <input
            autoFocus
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Category name"
            className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            Add
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-col gap-3 mb-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-4 py-3.5">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                {category.isExpanded
                  ? <ChevronDown className="h-4 w-4 text-white/30 shrink-0" />
                  : <ChevronRight className="h-4 w-4 text-white/30 shrink-0" />
                }
                <span className="text-sm font-semibold text-white">{category.name}</span>
                <span className="text-xs text-white/30">({category.items.length})</span>
              </button>
              <button
                type="button"
                onClick={() => deleteCategory(category.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
              </button>
            </div>

            {/* Items */}
            {category.isExpanded && (
              <div className="border-t border-white/[0.05] px-4 py-3 flex flex-col gap-3">
                {category.items.map((item) => (
                  <div key={item.id} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(category.id, item.id, 'name', e.target.value)}
                        placeholder="Item name"
                        className="flex-1 bg-transparent text-sm text-white focus:outline-none border-b border-white/[0.08] pb-0.5 placeholder-white/30"
                      />
                      <button
                        type="button"
                        onClick={() => deleteItem(category.id, item.id)}
                        className="p-1 rounded-lg hover:bg-red-500/20 transition-colors shrink-0"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                    <div className="flex gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/30">Price $</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(category.id, item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-16 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/30">Comp Limit</span>
                        <div className="flex items-center border border-white/[0.08] rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateItem(category.id, item.id, 'compLimit', Math.max(1, item.compLimit - 1))}
                            className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            −
                          </button>
                          <span className="px-2 py-1 text-xs text-white font-semibold min-w-[1.5rem] text-center">{item.compLimit}</span>
                          <button
                            type="button"
                            onClick={() => updateItem(category.id, item.id, 'compLimit', item.compLimit + 1)}
                            className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={item.description ?? ''}
                      onChange={(e) => updateItem(category.id, item.id, 'description', e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-2 py-1.5 text-xs text-white/70 placeholder-white/20 focus:outline-none"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addItem(category.id)}
                  className="w-full py-2.5 border border-dashed border-white/[0.12] rounded-xl text-xs text-white/40 hover:border-white/20 hover:text-white/60 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Item
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

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
