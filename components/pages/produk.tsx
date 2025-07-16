"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, MapPin, Eye, Plus } from "lucide-react"
import { getFirebaseDb } from "@/lib/firebase-config"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import type { User as FirebaseUser } from "firebase/auth"
import AddProductModal from "../add-product-modal"
import ProductDetailModal from "../product-detail-modal"

interface ProdukProps {
  user?: FirebaseUser | null
}

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
  ownerId?: string
  ownerName?: string
  createdAt?: any
}

export default function Produk({ user }: ProdukProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("semua")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const categories = [
    { id: "semua", label: "Semua Kategori" },
    { id: "makanan", label: "Makanan & Minuman" },
    { id: "fashion", label: "Fashion & Aksesoris" },
    { id: "kerajinan", label: "Kerajinan Tangan" },
    { id: "teknologi", label: "Teknologi" },
    { id: "kesehatan", label: "Kesehatan & Kecantikan" },
    { id: "pertanian", label: "Pertanian & Perikanan" },
  ]

  // Default products (will be shown if no products in database)
  const defaultProducts: Product[] = [
    {
      id: "default-1",
      name: "Keripik Singkong Original",
      description: "Keripik singkong renyah dengan bumbu tradisional khas Jawa Timur",
      price: "Rp 15.000",
      image: "https://blog.tokowahab.com/wp-content/uploads/2024/07/Cara-Membuat-Resep-Keripik-Singkong-Original-Praktis-3-Bahan-Saja.jpg",
      category: "makanan",
      seller: "UMKM Berkah Jaya",
      location: "Malang, Jawa Timur",
      rating: 4.8,
      reviews: 124,
      badge: "Terlaris",
    },
    {
      id: "default-2",
      name: "Tas Rajut Handmade",
      description: "Tas rajut cantik buatan tangan dengan motif tradisional Indonesia",
      price: "Rp 85.000",
      image: "https://img.id.my-best.com/product_images/b864103b2020aa85bc20ddc2644b2234.png?ixlib=rails-4.3.1&q=70&lossless=0&w=800&h=800&fit=clip&s=74d7cb48c75080e9defc15ea481ceb3d",
      category: "fashion",
      seller: "Rajut Nusantara",
      location: "Yogyakarta",
      rating: 4.9,
      reviews: 89,
      badge: "Eksklusif",
    },
    {
      id: "default-3",
      name: "Batik Tulis Premium",
      description: "Batik tulis asli dengan motif parang barong, dikerjakan oleh pengrajin berpengalaman",
      price: "Rp 350.000",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkHN-iU0shJYy7fL5_uFy3WZRdbbkHDcJTJg&s",
      category: "fashion",
      seller: "Batik Heritage",
      location: "Solo, Jawa Tengah",
      rating: 5.0,
      reviews: 67,
      badge: "Premium",
    },
    {
      id: "default-4",
      name: "Teh Hijau Organik",
      description: "teh hijau organik dari perkebunan lokal, kaya antioksidan dan rasa segar",
      price: "Rp 350.000",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Q71leY1uNENGZhyMdvqIkD4sipJQOsfTp4rsdO8-GjqL6daInA3UP2R7UfRoh1zv20M&usqp=CAU",
      category: "minuman",
      seller: "UMKM Teh Sehat Gunungsari",
      location: "Pemalang, Jawa Tengah",
      rating: 5.0,
      reviews: 10,
      badge: "Premium",
    },
    {
      id: "default-5",
      name: "kobis segar organik",
      description: "Kobis segar organik dari petani lokal, kaya serat dan vitamin Desa Gunungsari",
      price: "Rp 50.000",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3vEgwcd3DNeDFqInCKo_BZ4NFyEQwRcbsAQ&s",
      category: "sayuran",
      seller: "UMKM Pertanian Sayur Gunungsari",
      location: "Pemalang, Jawa Tengah",
      rating: 5.0,
      reviews: 10,
      badge: "Premium",
    },
  ]

  useEffect(() => {
    const db = getFirebaseDb()
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]

        // Combine user products with default products
        const allProducts = [...productsData, ...defaultProducts]
        setProducts(allProducts)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching products:", error)
        // If error, show default products
        setProducts(defaultProducts)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "semua" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product)
    setShowDetailModal(true)
  }

  const handleProductAdded = () => {
    // Products will be automatically updated via onSnapshot
    console.log("Product added successfully")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Produk UMKM</h1>
            <p className="text-gray-600">Temukan produk berkualitas dari UMKM terbaik di seluruh Indonesia</p>
          </div>

          {/* Add Product Button - Only show for logged in users */}
          {user && (
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredProducts.length} produk
            {searchTerm && ` untuk "${searchTerm}"`}
            {selectedCategory !== "semua" &&
              ` dalam kategori ${categories.find((c) => c.id === selectedCategory)?.label}`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className={`absolute top-2 left-2 ${getBadgeColor(product.badge)}`}>{product.badge}</Badge>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">{product.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">{product.seller}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {product.location}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline" onClick={() => handleViewDetail(product)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
          </div>
        )}

        {/* Add Product Modal */}
        {user && (
          <AddProductModal
            user={user}
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onProductAdded={handleProductAdded}
          />
        )}

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedProduct(null)
          }}
        />
      </div>
    </div>
  )
}
