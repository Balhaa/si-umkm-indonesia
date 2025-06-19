"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Save, Edit, Building2 } from "lucide-react"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { getFirebaseApp } from "@/lib/firebase-config"
import type { User as FirebaseUser } from "firebase/auth"

interface BusinessProfileProps {
  user: FirebaseUser
}

interface BusinessData {
  businessName: string
  category: string
  description: string
  address: string
  phone: string
  website: string
  status: string
}

export default function BusinessProfile({ user }: BusinessProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    status: "active",
  })

  useEffect(() => {
    loadBusinessProfile()
  }, [user])

  const loadBusinessProfile = async () => {
    try {
      const app = getFirebaseApp()
      const db = getFirestore(app)
      const docRef = doc(db, "business_profiles", user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setBusinessData(docSnap.data() as BusinessData)
      }
    } catch (error) {
      console.error("Error loading business profile:", error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const app = getFirebaseApp()
      const db = getFirestore(app)
      const docRef = doc(db, "business_profiles", user.uid)

      await setDoc(docRef, {
        ...businessData,
        updatedAt: new Date().toISOString(),
        userId: user.uid,
        userEmail: user.email,
      })

      setIsEditing(false)
      alert("Profil bisnis berhasil disimpan!")
    } catch (error) {
      console.error("Error saving business profile:", error)
      alert("Gagal menyimpan profil bisnis. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    setBusinessData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const categories = [
    "Makanan & Minuman",
    "Fashion & Pakaian",
    "Kerajinan Tangan",
    "Teknologi",
    "Jasa",
    "Pertanian",
    "Perdagangan",
    "Lainnya",
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <CardTitle>Profil Bisnis</CardTitle>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
          >
            {isEditing ? (
              "Batal"
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          {isEditing ? "Edit informasi bisnis UMKM Anda" : "Informasi lengkap tentang bisnis UMKM Anda"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Nama Bisnis</Label>
              {isEditing ? (
                <Input
                  id="businessName"
                  value={businessData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="Masukkan nama bisnis"
                />
              ) : (
                <p className="text-gray-900 font-medium mt-1">{businessData.businessName || "Belum diatur"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Kategori Bisnis</Label>
              {isEditing ? (
                <Select value={businessData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori bisnis" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-900 mt-1">{businessData.category || "Belum diatur"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={businessData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Masukkan nomor telepon"
                />
              ) : (
                <p className="text-gray-900 mt-1">{businessData.phone || "Belum diatur"}</p>
              )}
            </div>

            <div>
              <Label>Status Bisnis</Label>
              <div className="mt-1">
                <Badge variant={businessData.status === "active" ? "default" : "secondary"}>
                  {businessData.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Alamat</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={businessData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              ) : (
                <div className="flex items-start text-gray-900 mt-1">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{businessData.address || "Belum diatur"}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              {isEditing ? (
                <Input
                  id="website"
                  value={businessData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://website-anda.com"
                />
              ) : (
                <p className="text-gray-900 mt-1">
                  {businessData.website ? (
                    <a
                      href={businessData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {businessData.website}
                    </a>
                  ) : (
                    "Belum diatur"
                  )}
                </p>
              )}
            </div>

            <div>
              <Label>Email Kontak</Label>
              <p className="text-gray-900 mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Deskripsi Bisnis</Label>
          {isEditing ? (
            <Textarea
              id="description"
              value={businessData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Ceritakan tentang bisnis Anda..."
              rows={4}
            />
          ) : (
            <p className="text-gray-900 mt-1">{businessData.description || "Belum ada deskripsi"}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Profil
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
              Batal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
