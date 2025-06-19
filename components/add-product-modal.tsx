"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Upload, Plus, Save } from "lucide-react"
import { getFirebaseDb } from "@/lib/firebase-config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import type { User as FirebaseUser } from "firebase/auth"

interface AddProductModalProps {
  user: FirebaseUser
  isOpen: boolean
  onClose: () => void
  onProductAdded: () => void
}

export default function AddProductModal({ user, isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "makanan",
    location: "",
    businessName: "",
  })

  const categories = [
    { id: "makanan", label: "Makanan & Minuman" },
    { id: "fashion", label: "Fashion & Aksesoris" },
    { id: "kerajinan", label: "Kerajinan Tangan" },
    { id: "teknologi", label: "Teknologi" },
    { id: "kesehatan", label: "Kesehatan & Kecantikan" },
    { id: "pertanian", label: "Pertanian & Perikanan" },
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran gambar maksimal 2MB")
        return
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar")
        return
      }

      setImageFile(file)
      setError("")

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: keyof typeof productData, value: string) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("") // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validasi
      if (!productData.name.trim()) {
        throw new Error("Nama produk harus diisi")
      }

      if (!productData.description.trim()) {
        throw new Error("Deskripsi produk harus diisi")
      }

      if (!productData.price.trim()) {
        throw new Error("Harga produk harus diisi")
      }

      if (!productData.businessName.trim()) {
        throw new Error("Nama bisnis harus diisi")
      }

      if (!productData.location.trim()) {
        throw new Error("Lokasi harus diisi")
      }

      // Convert image to base64 if exists
      let imageBase64 = ""
      if (imageFile) {
        const reader = new FileReader()
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(imageFile)
        })
      }

      const db = getFirebaseDb()

      // Generate random rating and reviews for demo
      const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)
      const reviews = Math.floor(Math.random() * 100) + 1

      // Format price
      const numericPrice = Number.parseInt(productData.price.replace(/\D/g, ""))
      const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`

      const productPayload = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: formattedPrice,
        category: productData.category,
        seller: productData.businessName.trim(),
        location: productData.location.trim(),
        rating: Number.parseFloat(rating),
        reviews: reviews,
        badge: "Baru",
        image: imageBase64 || "/placeholder.svg?height=200&width=300",
        ownerId: user.uid,
        ownerName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      }

      console.log("Saving product:", productPayload)

      await addDoc(collection(db, "products"), productPayload)

      setSuccess("Produk berhasil ditambahkan!")

      // Reset form
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "makanan",
        location: "",
        businessName: "",
      })
      setImageFile(null)
      setImagePreview("")

      // Notify parent component
      onProductAdded()

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setSuccess("")
      }, 2000)
    } catch (error: any) {
      console.error("Add product error:", error)
      setError(error.message || "Gagal menambahkan produk")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const handlePriceChange = (value: string) => {
    const formatted = formatPrice(value)
    handleInputChange("price", formatted)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Tambah Produk Baru
              </CardTitle>
              <CardDescription>Tambahkan produk UMKM Anda ke katalog</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Produk</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview("")
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Klik untuk upload gambar</p>
                    <p className="text-sm text-gray-500">PNG, JPG hingga 2MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk *</Label>
                <Input
                  id="name"
                  value={productData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Contoh: Keripik Singkong Original"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <select
                  id="category"
                  value={productData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Produk *</Label>
              <Textarea
                id="description"
                value={productData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Deskripsikan produk Anda dengan detail..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp) *</Label>
                <Input
                  id="price"
                  value={productData.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="15.000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Nama Bisnis *</Label>
                <Input
                  id="businessName"
                  value={productData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="Contoh: UMKM Berkah Jaya"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi *</Label>
              <Input
                id="location"
                value={productData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Contoh: Malang, Jawa Timur"
                required
              />
            </div>

            {/* Status Messages */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Tambah Produk
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
