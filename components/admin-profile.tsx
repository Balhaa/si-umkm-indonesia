"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Shield, Mail, Calendar, Settings, Users, ShoppingBag, BookOpen, BarChart3 } from "lucide-react"

interface AdminProfileProps {
  user: any
  onSignOut?: () => void
}

export default function AdminProfile({ user, onSignOut }: AdminProfileProps) {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      // For admin, we just call the onSignOut callback
      onSignOut?.()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  const adminStats = [
    { label: "Total Pengguna", value: "2,500+", icon: Users, color: "text-blue-600" },
    { label: "Produk Aktif", value: "15,000+", icon: ShoppingBag, color: "text-green-600" },
    { label: "Program Pelatihan", value: "50+", icon: BookOpen, color: "text-purple-600" },
    { label: "Tingkat Kepuasan", value: "95%", icon: BarChart3, color: "text-orange-600" },
  ]

  const adminPermissions = [
    "Kelola semua pengguna UMKM",
    "Moderasi produk dan konten",
    "Akses laporan dan analitik",
    "Kelola program pelatihan",
    "Konfigurasi sistem",
    "Backup dan restore data",
  ]

  return (
    <div className="space-y-6">
      {/* Admin Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Profil Administrator
          </CardTitle>
          <CardDescription>Informasi akun administrator sistem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback className="text-lg bg-red-100 text-red-600">
                <Shield className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">Administrator</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="h-4 w-4" />
                Login terakhir: {new Date().toLocaleDateString("id-ID")}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                <Shield className="h-3 w-3 mr-1" />
                Super Admin
              </Badge>
              <Badge variant="outline">ID: {user.uid?.slice(0, 8) || "admin"}...</Badge>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan
            </Button>
            <Button variant="destructive" onClick={handleSignOut} disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Keluar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Platform</CardTitle>
          <CardDescription>Ringkasan performa platform SI UMKM Indonesia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Hak Akses Administrator</CardTitle>
          <CardDescription>Daftar izin dan akses yang dimiliki akun administrator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {adminPermissions.map((permission, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">{permission}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
          <CardDescription>Detail teknis dan status sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Versi Platform:</span>
                <span className="font-medium">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="font-medium">Firebase Firestore</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Authentication:</span>
                <span className="font-medium">Firebase Auth</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status Server:</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Backup Terakhir:</span>
                <span className="font-medium">{new Date().toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">99.9%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
