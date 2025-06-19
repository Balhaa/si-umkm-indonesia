"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  ShoppingBag,
  BookOpen,
  TrendingUp,
  Search,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  BarChart3,
  Shield,
  X,
  Save,
  Star,
  MapPin,
  Calendar,
} from "lucide-react"
import { getFirebaseDb } from "@/lib/firebase-config"
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"

interface AdminDashboardProps {
  user: any
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalTrainings: 6, // Static for now
    activeUsers: 0,
  })

  const [users, setUsers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState("")

  const categories = [
    { id: "makanan", label: "Makanan & Minuman" },
    { id: "fashion", label: "Fashion & Aksesoris" },
    { id: "kerajinan", label: "Kerajinan Tangan" },
    { id: "teknologi", label: "Teknologi" },
    { id: "kesehatan", label: "Kesehatan & Kecantikan" },
    { id: "pertanian", label: "Pertanian & Perikanan" },
  ]

  useEffect(() => {
    const db = getFirebaseDb()

    // Listen to users
    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"))
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setUsers(usersData)
      setStats((prev) => ({
        ...prev,
        totalUsers: usersData.length,
        activeUsers: usersData.filter((u) => u.isActive).length,
      }))
    })

    // Listen to products
    const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"))
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProducts(productsData)
      setStats((prev) => ({
        ...prev,
        totalProducts: productsData.length,
      }))
      setLoading(false)
    })

    return () => {
      unsubscribeUsers()
      unsubscribeProducts()
    }
  }, [])

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const db = getFirebaseDb()
      await updateDoc(doc(db, "users", userId), {
        isActive: !currentStatus,
      })
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return

    try {
      const db = getFirebaseDb()
      await deleteDoc(doc(db, "products", productId))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product)
    setShowViewModal(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct({ ...product })
    setShowEditModal(true)
    setUpdateError("")
    setUpdateSuccess("")
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateError("")
    setUpdateSuccess("")

    try {
      if (!editingProduct.name.trim()) {
        throw new Error("Nama produk harus diisi")
      }

      const db = getFirebaseDb()
      const updateData = {
        name: editingProduct.name.trim(),
        description: editingProduct.description.trim(),
        price: editingProduct.price,
        category: editingProduct.category,
        seller: editingProduct.seller.trim(),
        location: editingProduct.location.trim(),
        badge: editingProduct.badge,
        updatedAt: new Date(),
      }

      await updateDoc(doc(db, "products", editingProduct.id), updateData)
      setUpdateSuccess("Produk berhasil diperbarui!")

      setTimeout(() => {
        setShowEditModal(false)
        setUpdateSuccess("")
      }, 2000)
    } catch (error: any) {
      console.error("Error updating product:", error)
      setUpdateError(error.message || "Gagal memperbarui produk")
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "Tidak diketahui"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data admin...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Dashboard Administrator
            </h1>
            <p className="text-red-100 mt-1">Kelola platform SI UMKM Indonesia</p>
          </div>
          <div className="text-right">
            <p className="text-red-100 text-sm">Login sebagai</p>
            <p className="font-semibold">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Kelola Pengguna</div>
            <div className="text-sm text-gray-500">Aktivasi & monitoring</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Moderasi Produk</div>
            <div className="text-sm text-gray-500">Review & approve</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Program Pelatihan</div>
            <div className="text-sm text-gray-500">Kelola & monitor</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Laporan</div>
            <div className="text-sm text-gray-500">Analytics & insights</div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{stats.activeUsers} aktif</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Produk</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Terus bertambah</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Program Pelatihan</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrainings}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600">Aktif berjalan</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pengguna Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                {((stats.activeUsers / stats.totalUsers) * 100 || 0).toFixed(0)}% dari total
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Platform</CardTitle>
          <CardDescription>Kelola pengguna, produk, dan konten platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Pengguna ({stats.totalUsers})</TabsTrigger>
              <TabsTrigger value="products">Produk ({stats.totalProducts})</TabsTrigger>
              <TabsTrigger value="analytics">Analitik</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredUsers.map((userData) => (
                  <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{userData.name || "Nama tidak tersedia"}</div>
                        <div className="text-sm text-gray-500">{userData.email}</div>
                        <div className="text-xs text-gray-400">Bergabung: {formatDate(userData.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={userData.isActive ? "default" : "secondary"}>
                        {userData.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserStatus(userData.id, userData.isActive)}
                      >
                        {userData.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.seller} • {product.price}
                        </div>
                        <div className="text-xs text-gray-400">
                          Ditambahkan: {formatDate(product.createdAt)} • Oleh: {product.ownerName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getBadgeColor(product.badge)}>{product.badge}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleViewProduct(product)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistik Pengguna</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Pengguna:</span>
                        <span className="font-semibold">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pengguna Aktif:</span>
                        <span className="font-semibold text-green-600">{stats.activeUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pengguna Nonaktif:</span>
                        <span className="font-semibold text-red-600">{stats.totalUsers - stats.activeUsers}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistik Produk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Produk:</span>
                        <span className="font-semibold">{stats.totalProducts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Produk Baru:</span>
                        <span className="font-semibold text-blue-600">
                          {products.filter((p) => p.badge === "Baru").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kategori Terpopuler:</span>
                        <span className="font-semibold">Makanan & Minuman</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detail Produk</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowViewModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
                    <Badge className={`mt-2 ${getBadgeColor(selectedProduct.badge)}`}>{selectedProduct.badge}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{selectedProduct.price}</div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{selectedProduct.rating}</span>
                      <span className="ml-1 text-gray-500">({selectedProduct.reviews} ulasan)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedProduct.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(selectedProduct.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Deskripsi</h4>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-500">Penjual</div>
                  <div className="font-medium">{selectedProduct.seller}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Kategori</div>
                  <div className="font-medium">
                    {categories.find((c) => c.id === selectedProduct.category)?.label || selectedProduct.category}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Produk</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nama Produk</Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Kategori</Label>
                    <select
                      id="edit-category"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
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

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Deskripsi</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Harga</Label>
                    <Input
                      id="edit-price"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-badge">Badge</Label>
                    <select
                      id="edit-badge"
                      value={editingProduct.badge}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Baru">Baru</option>
                      <option value="Terlaris">Terlaris</option>
                      <option value="Eksklusif">Eksklusif</option>
                      <option value="Premium">Premium</option>
                      <option value="Organik">Organik</option>
                      <option value="Handmade">Handmade</option>
                      <option value="Single Origin">Single Origin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-seller">Nama Penjual</Label>
                    <Input
                      id="edit-seller"
                      value={editingProduct.seller}
                      onChange={(e) => setEditingProduct({ ...editingProduct, seller: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Lokasi</Label>
                    <Input
                      id="edit-location"
                      value={editingProduct.location}
                      onChange={(e) => setEditingProduct({ ...editingProduct, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {updateError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{updateError}</AlertDescription>
                  </Alert>
                )}

                {updateSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{updateSuccess}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isUpdating} className="flex-1">
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
