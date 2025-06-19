"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Star, MapPin, User, Calendar, Heart, Share2, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: string
  seller: string
  location: string
  rating: number
  reviews: number
  badge: string
  createdAt?: any
  ownerName?: string
}

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!isOpen || !product) return null

  // Mock additional images for demo
  const images = [product.image, "/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"]

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Terlaris":
        return "bg-red-100 text-red-800"
      case "Eksklusif":
        return "bg-purple-100 text-purple-800"
      case "Premium":
        return "bg-yellow-100 text-yellow-800"
      case "Organik":
        return "bg-green-100 text-green-800"
      case "Handmade":
        return "bg-blue-100 text-blue-800"
      case "Single Origin":
        return "bg-orange-100 text-orange-800"
      case "Baru":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "Baru-baru ini"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Mock reviews for demo
  const mockReviews = [
    {
      name: "Sari Dewi",
      rating: 5,
      comment: "Produk sangat berkualitas dan sesuai dengan deskripsi. Pengiriman juga cepat!",
      date: "2 hari yang lalu",
    },
    {
      name: "Ahmad Rizki",
      rating: 4,
      comment: "Bagus, tapi kemasan bisa diperbaiki lagi. Overall recommended!",
      date: "1 minggu yang lalu",
    },
    {
      name: "Maya Sari",
      rating: 5,
      comment: "Sudah order berkali-kali, selalu puas dengan kualitasnya.",
      date: "2 minggu yang lalu",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Detail Produk</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <Badge className={`absolute top-4 left-4 ${getBadgeColor(product.badge)}`}>{product.badge}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-4 right-4 ${isFavorite ? "text-red-500" : "text-gray-500"}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                    <span className="ml-1 text-gray-500">({product.reviews} ulasan)</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.location}
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-4">{product.price}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                  <div>
                    <div className="text-sm text-gray-500">Penjual</div>
                    <div className="font-medium flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {product.seller}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Ditambahkan</div>
                    <div className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(product.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Hubungi Penjual
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Bagikan
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Heart className="mr-2 h-4 w-4" />
                      Simpan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ulasan Pembeli</h3>
            <div className="space-y-4">
              {mockReviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">{review.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{review.name}</div>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  <p className="text-gray-600 ml-11">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
