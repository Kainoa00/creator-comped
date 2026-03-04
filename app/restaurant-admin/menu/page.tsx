'use client'

import { useState } from 'react'
import { Plus, Trash2, Upload, ChevronDown, ChevronRight } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  price: number
  itemLimit: number
}

interface MenuCategory {
  id: string
  name: string
  categoryLimit: number
  items: MenuItem[]
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

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map((cat) =>
      cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
    ))
  }

  const addCategory = () => {
    if (!newCategoryName.trim()) return
    const newCategory: MenuCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      categoryLimit: 1,
      isExpanded: true,
      items: [],
    }
    setCategories([...categories, newCategory])
    setNewCategoryName('')
  }

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId))
  }

  const addItem = (categoryId: string) => {
    setCategories(categories.map((cat) => {
      if (cat.id === categoryId) {
        const newItem: MenuItem = {
          id: `${categoryId}-${Date.now()}`,
          name: 'New Item',
          price: 0,
          itemLimit: 1,
        }
        return { ...cat, items: [...cat.items, newItem] }
      }
      return cat
    }))
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map((cat) => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
      }
      return cat
    }))
  }

  const updateCategoryLimit = (categoryId: string, limit: number) => {
    setCategories(categories.map((cat) =>
      cat.id === categoryId ? { ...cat, categoryLimit: Math.max(1, limit) } : cat
    ))
  }

  const updateItem = (categoryId: string, itemId: string, field: keyof MenuItem, value: string | number) => {
    setCategories(categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          ),
        }
      }
      return cat
    }))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Menu</h1>
        <p className="text-white/70">Manage categories, items, prices, and limits</p>
      </div>

      {/* Add Category */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-6">
        <h3 className="font-semibold mb-4">Add Category</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition"
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <button
            onClick={addCategory}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden"
          >
            {/* Category Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-3 flex-1"
                >
                  {category.isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <span className="text-white/50 text-sm">({category.items.length} items)</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-white/70">Category Limit:</label>
                    <input
                      type="number"
                      min="1"
                      value={category.categoryLimit}
                      onChange={(e) => updateCategoryLimit(category.id, parseInt(e.target.value))}
                      className="w-20 px-3 py-1 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Items */}
            {category.isExpanded && (
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/5 rounded-xl p-4 flex items-center gap-4"
                    >
                      <button className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition">
                        <Upload className="w-5 h-5" />
                      </button>

                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(category.id, item.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500"
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-white/70">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(category.id, item.id, 'price', parseFloat(e.target.value))}
                          className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">Limit:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.itemLimit}
                          onChange={(e) => updateItem(category.id, item.id, 'itemLimit', parseInt(e.target.value))}
                          className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <button
                        onClick={() => deleteItem(category.id, item.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addItem(category.id)}
                  className="w-full py-3 border border-dashed border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition flex items-center justify-center gap-2 text-white/70"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end gap-4">
        <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
          Cancel
        </button>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition">
          Save Changes
        </button>
      </div>
    </div>
  )
}
