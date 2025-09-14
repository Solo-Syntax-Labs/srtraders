'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'

interface Party {
  id: string
  name: string
}

interface PartySelectorProps {
  value: string
  onValueChange: (partyId: string) => void
  label: string
  placeholder?: string
  error?: string
  required?: boolean
}

export function PartySelector({
  value,
  onValueChange,
  label,
  placeholder = "Select party",
  error,
  required = false
}: PartySelectorProps) {
  const [parties, setParties] = useState<Party[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchParties()
  }, [search])

  const fetchParties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      
      const response = await fetch(`/api/parties?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setParties(data.parties || [])
      }
    } catch (error) {
      console.error('Error fetching parties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateParty = async (name: string) => {
    try {
      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        const { party } = await response.json()
        setParties(prev => [...prev, party])
        onValueChange(party.id)
      }
    } catch (error) {
      console.error('Error creating party:', error)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`party-${label}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <select
          id={`party-${label}`}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">{placeholder}</option>
          {parties.map((party) => (
            <option key={party.id} value={party.id}>
              {party.name}
            </option>
          ))}
        </select>
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Quick Add Party */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Quick add new party"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={() => {
            if (search.trim()) {
              handleCreateParty(search.trim())
              setSearch('')
            }
          }}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  )
}
