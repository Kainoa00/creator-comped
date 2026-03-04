'use client'

import { useState } from 'react'
import { Upload, Lock, MapPin, Info } from 'lucide-react'

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    logo: null as string | null,
    name: 'Restaurant Name',
    address: '123 Main Street, City, State 12345',
    phone: '(555) 123-4567',
    email: 'contact@restaurant.com',
    website: 'https://restaurant.com',
    description:
      'Welcome to our restaurant! We serve authentic Italian cuisine with fresh, locally-sourced ingredients.',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddressDropdown, setShowAddressDropdown] = useState(false)

  const addressSuggestions = [
    '123 Main Street, City, State 12345',
    '456 Oak Avenue, City, State 12345',
    '789 Pine Road, City, State 12345',
  ].filter((addr) => addr.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleLogoUpload = () => {
    alert('Logo upload would open file picker here')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
        <p className="text-white/70">Update your restaurant information</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Logo Upload */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Restaurant Logo</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Upload className="w-8 h-8 text-white/30" />
              )}
            </div>
            <div className="flex-1">
              <button
                onClick={handleLogoUpload}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition"
              >
                Upload Logo
              </button>
              <p className="text-sm text-white/50 mt-2">Recommended size: 512x512px, PNG or JPG</p>
            </div>
          </div>
        </div>

        {/* Restaurant Name (Locked) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 relative">
          <div className="absolute top-4 right-4">
            <Lock className="w-5 h-5 text-white/30" />
          </div>
          <h3 className="font-semibold mb-4">Restaurant Name</h3>
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50">
            {formData.name}
          </div>
          <p className="text-sm text-white/50 mt-2">Contact support to change restaurant name</p>
        </div>

        {/* Address with Autocomplete */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Address</h3>
          <div className="relative">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={searchTerm || formData.address}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowAddressDropdown(true)
                }}
                onFocus={() => setShowAddressDropdown(true)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="Search for address..."
              />
            </div>

            {showAddressDropdown && searchTerm && addressSuggestions.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowAddressDropdown(false)}
                />
                <div className="absolute w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                  {addressSuggestions.map((addr, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setFormData({ ...formData, address: addr })
                        setSearchTerm('')
                        setShowAddressDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-white/50" />
                        <span>{addr}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Phone (Locked) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 relative">
          <div className="absolute top-4 right-4">
            <Lock className="w-5 h-5 text-white/30" />
          </div>
          <h3 className="font-semibold mb-4">Phone Number</h3>
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50">
            {formData.phone}
          </div>
          <p className="text-sm text-white/50 mt-2">Contact support to change phone number</p>
        </div>

        {/* Email (Locked) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 relative">
          <div className="absolute top-4 right-4">
            <Lock className="w-5 h-5 text-white/30" />
          </div>
          <h3 className="font-semibold mb-4">Email</h3>
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50">
            {formData.email}
          </div>
          <p className="text-sm text-white/50 mt-2">Contact support to change email address</p>
        </div>

        {/* Website (Locked) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 relative">
          <div className="absolute top-4 right-4">
            <Lock className="w-5 h-5 text-white/30" />
          </div>
          <h3 className="font-semibold mb-4">Website</h3>
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50">
            {formData.website}
          </div>
          <p className="text-sm text-white/50 mt-2">Contact support to change website URL</p>
        </div>

        {/* Description */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Description</h3>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition h-32 resize-none"
            placeholder="Tell creators about your restaurant..."
          />
        </div>

        {/* Support Footnote */}
        <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white/90">
            <strong>Need to update locked fields?</strong> Contact our support team at{' '}
            <a href="mailto:support@creatorcomped.com" className="text-orange-500 hover:text-orange-400">
              support@creatorcomped.com
            </a>{' '}
            for assistance with name, phone, email, or website changes.
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
            Cancel
          </button>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
