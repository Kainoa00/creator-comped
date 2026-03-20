'use client'

import { useState } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

interface LocalMenuItem {
  id: string
  name: string
  price: number
  itemLimit: number
}

interface MenuCategory {
  id: string
  name: string
  categoryLimit: number
  items: LocalMenuItem[]
  isExpanded: boolean
}

const initialCategories: MenuCategory[] = [
  {
    id: '1',
    name: 'Pizza',
    categoryLimit: 2,
    isExpanded: true,
    items: [
      { id: '1-1', name: 'Margherita Pizza', price: 18, itemLimit: 1 },
      { id: '1-2', name: 'Quattro Formaggi', price: 22, itemLimit: 1 },
      { id: '1-3', name: 'Pepperoni', price: 20, itemLimit: 1 },
    ],
  },
  {
    id: '2',
    name: 'Pasta',
    categoryLimit: 2,
    isExpanded: false,
    items: [
      { id: '2-1', name: 'Carbonara', price: 16, itemLimit: 1 },
      { id: '2-2', name: 'Ravioli', price: 18, itemLimit: 1 },
      { id: '2-3', name: 'Lasagna', price: 19, itemLimit: 1 },
    ],
  },
  {
    id: '3',
    name: 'Salads',
    categoryLimit: 1,
    isExpanded: false,
    items: [
      { id: '3-1', name: 'Caesar Salad', price: 12, itemLimit: 1 },
      { id: '3-2', name: 'Caprese Salad', price: 14, itemLimit: 1 },
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
      categoryLimit: 1,
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
      return { ...c, items: [...c.items, { id: `${categoryId}-${Date.now()}`, name: 'New Item', price: 0, itemLimit: 1 }] }
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

  const updateCategoryLimit = (id: string, limit: number) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, categoryLimit: Math.max(1, limit) } : c))
  }

  return (
    <div className="px-4 pt-6 pb-20">
      <DarkHeader title="Edit Menu" subtitle="Categories, items & limits" />

      {/* Add Category Button */}
      <button
        type="button"
        onClick={() => setShowAddCategory(!showAddCategory)}
        className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-sm text-white/60 hover:bg-white/[0.08] transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </button>

      {/* Add Category Input */}
      {showAddCategory && (
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-4 flex gap-2">
          <input
            autoFocus
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Category name"
            aria-label="New category name"
            className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 text-white text-sm font-semibold"
          >
            Add
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-col gap-3 mb-4">
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
              <div className="flex items-center gap-1 mr-2">
                <span className="text-xs text-white/30">Limit</span>
                <input
                  type="number"
                  min="1"
                  value={category.categoryLimit}
                  onChange={(e) => updateCategoryLimit(category.id, parseInt(e.target.value) || 1)}
                  aria-label={`Category limit for ${category.name}`}
                  className="w-12 bg-white/[0.08] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteCategory(category.id)}
                aria-label={`Delete category ${category.name}`}
                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
              </button>
            </div>

            {/* Items */}
            {category.isExpanded && (
              <div className="border-t border-white/[0.05] px-4 py-3 flex flex-col gap-2">
                {category.items.map((item) => (
                  <div key={item.id} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(category.id, item.id, 'name', e.target.value)}
                        aria-label="Item name"
                        className="flex-1 bg-transparent text-sm text-white focus:outline-none border-b border-white/[0.08] pb-0.5"
                      />
                      <button
                        type="button"
                        onClick={() => deleteItem(category.id, item.id)}
                        aria-label={`Delete item ${item.name}`}
                        className="p-1 rounded-lg hover:bg-red-500/20 transition-colors shrink-0"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/30">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(category.id, item.id, 'price', parseFloat(e.target.value) || 0)}
                          aria-label="Item price"
                          className="w-16 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/30">Limit</span>
                        <input
                          type="number"
                          min="1"
                          value={item.itemLimit}
                          onChange={(e) => updateItem(category.id, item.id, 'itemLimit', parseInt(e.target.value) || 1)}
                          aria-label="Item quantity limit"
                          className="w-12 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none"
                        />
                      </div>
                    </div>
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
          saved
            ? 'bg-emerald-500'
            : 'bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600'
        )}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
