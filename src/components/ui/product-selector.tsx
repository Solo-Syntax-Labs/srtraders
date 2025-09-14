'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Check, X } from 'lucide-react'

interface Product {
  id: string
  name: string
}

interface ProductSelectorProps {
  value?: string
  onValueChange: (productId: string) => void
  error?: string
}

export function ProductSelector({ value, onValueChange, error }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddNew, setShowAddNew] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [addingProduct, setAddingProduct] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    if (!newProductName.trim()) return

    setAddingProduct(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProductName.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newProduct = data.product
        setProducts(prev => [...prev, newProduct].sort((a, b) => a.name.localeCompare(b.name)))
        onValueChange(newProduct.id)
        setNewProductName('')
        setShowAddNew(false)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error adding product')
    } finally {
      setAddingProduct(false)
    }
  }

  const handleCancelAdd = () => {
    setNewProductName('')
    setShowAddNew(false)
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Product *</Label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label>Product *</Label>
      
      {showAddNew ? (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter new product name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddProduct()
                }
              }}
              disabled={addingProduct}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddProduct}
              disabled={!newProductName.trim() || addingProduct}
            >
              {addingProduct ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelAdd}
              disabled={addingProduct}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <select
            value={value || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddNew(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}
