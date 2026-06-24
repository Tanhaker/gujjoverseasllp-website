'use client'

import { Trash2 } from 'lucide-react'

export function DeleteProductButton() {
  return (
    <button 
      type="submit" 
      className="text-red-600 hover:text-red-900 transition-colors"
      onClick={(e) => {
        if (!confirm('Are you sure you want to delete this product?')) {
          e.preventDefault()
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </button>
  )
}
