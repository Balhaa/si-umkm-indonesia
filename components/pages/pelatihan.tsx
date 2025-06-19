"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, BookOpen, Award, Play, User } from "lucide-react"
import TrainingDetailModal from "../training-detail-modal"
import type { User as FirebaseUser } from "firebase/auth"

interface PelatihanProps {
  user?: FirebaseUser | null
}

interface TrainingProgram {
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  schedule: string
  participants: number
  maxParticipants: number
  price: string
  category: string
  level: string
  image: string
  status: string
  features: string[]
}

export default function Pelatihan({ user }: PelatihanProps) {
  const [selectedCategory, setSelectedCategory] = useState("semua")
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const categories = [
    { id: "semua", label: "Semua Program" },
    { id: "digital", label: "Digital Marketing" },
    { id: "keuangan", label: "Manajemen Keuangan" },
    { id: "produksi", label: "Produksi & Kualitas" },
    { id: "bisnis", label: "Strategi Bisnis" },
    { id: "teknologi", label: "Teknologi" },
  ]

  const programs: TrainingProgram[] = [
    {
      id: 1,
      title: "Digital Marketing untuk UMKM Pemula",
      description: "Pelajari strategi pemasaran digital yang efektif untuk meningkatkan penjualan UMKM Anda",
      instructor: "Iqbal Habibi",
      duration: "4 minggu",
      schedule: "Setiap Selasa & Kamis, 19:00-21:00",
      participants: 45,
      maxParticipants: 50,
      price: "Gratis",
      category: "digital",
      level: "Pemula",
      image: "https://cdn.prod.website-files.com/5eb6815bc8e0bd376c3cae22/64ad7582af97789efe561056_Gambar%20Digital%20Marketing%20(1).webp",
      status: "Pendaftaran Dibuka",
      features: ["Strategi Media Sosial", "Google My Business", "Content Marketing", "Analisis Performa"],
    },
    {
      id: 2,
      title: "Manajemen Keuangan UMKM",
      description: "Kelola keuangan bisnis dengan baik, dari pencatatan hingga perencanaan investasi",
      instructor: "Budi Santoso, M.Ak",
      duration: "3 minggu",
      schedule: "Setiap Senin & Rabu, 20:00-22:00",
      participants: 32,
      maxParticipants: 40,
      price: "Rp 150.000",
      category: "keuangan",
      level: "Menengah",
      image: "https://lh3.googleusercontent.com/GZ_HiWhQihEP8jHe4oyvHcA9SaPC4r4yBgYFHGjQnyTRsOZ9pKef8L-zYzGxDCppKQ-l4rHkZCeKriygODtEGykhca-gSmsFWEFMk55ZpErvvjSTA6W7tU57Y2S2G0N0NiFWAA9_Mg-6",
      status: "Segera Dimulai",
      features: ["Pembukuan Sederhana", "Analisis Cashflow", "Perencanaan Budget", "Laporan Keuangan"],
    },
    {
      id: 3,
      title: "Strategi Bisnis & Inovasi Produk",
      description: "Kembangkan strategi bisnis yang tepat dan ciptakan inovasi produk yang menarik pasar",
      instructor: "Prof. Ahmad Rahman",
      duration: "6 minggu",
      schedule: "Setiap Sabtu, 09:00-12:00",
      participants: 28,
      maxParticipants: 35,
      price: "Rp 300.000",
      category: "bisnis",
      level: "Lanjutan",
      image: "https://feb.umsu.ac.id/wp-content/uploads/2023/06/inovasi-dalam-pemasaran.jpg",
      status: "Pendaftaran Dibuka",
      features: ["Business Model Canvas", "Market Research", "Product Development", "Competitive Analysis"],
    },
    {
      id: 4,
      title: "E-commerce & Marketplace untuk UMKM",
      description: "Pelajari cara menjual online melalui berbagai platform e-commerce dan marketplace",
      instructor: "Lisa Permata",
      duration: "3 minggu",
      schedule: "Setiap Jumat, 19:30-21:30",
      participants: 38,
      maxParticipants: 45,
      price: "Gratis",
      category: "digital",
      level: "Pemula",
      image: "E-commerce & Marketplace untuk UMKM",
      status: "Pendaftaran Dibuka",
      features: ["Setup Toko Online", "Optimasi Produk", "Customer Service", "Logistik & Pengiriman"],
    },
    {
      id: 5,
      title: "Quality Control & Standar Produk",
      description: "Implementasi kontrol kualitas dan standarisasi produk untuk meningkatkan daya saing",
      instructor: "Ir. Siti Nurhaliza",
      duration: "4 minggu",
      schedule: "Setiap Minggu, 14:00-17:00",
      participants: 15,
      maxParticipants: 25,
      price: "Rp 200.000",
      category: "produksi",
      level: "Menengah",
      image: "https://runmarket.id/wp-content/uploads/2022/07/quality-control-1.jpg",
      status: "Segera Dimulai",
      features: ["Standar Kualitas", "SOP Produksi", "Testing & Validasi", "Sertifikasi Produk"],
    },
    {
      id: 6,
      title: "Teknologi untuk Efisiensi UMKM",
      description: "Manfaatkan teknologi sederhana untuk meningkatkan efisiensi operasional UMKM",
      instructor: "Dedi Kurniawan, S.T",
      duration: "2 minggu",
      schedule: "Setiap Selasa & Kamis, 18:00-20:00",
      participants: 22,
      maxParticipants: 30,
      price: "Rp 100.000",
      category: "teknologi",
      level: "Pemula",
      image: "https://cloudku.id/wp-content/uploads/2023/06/Gambar-artikel-1.png",
      status: "Pendaftaran Dibuka",
      features: ["Aplikasi Manajemen", "Otomasi Sederhana", "Cloud Storage", "Digital Tools"],
    },
  ]

  const filteredPrograms = programs.filter(
    (program) => selectedCategory === "semua" || program.category === selectedCategory,
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendaftaran Dibuka":
        return "bg-green-100 text-green-800"
      case "Segera Dimulai":
        return "bg-yellow-100 text-yellow-800"
      case "Berlangsung":
        return "bg-blue-100 text-blue-800"
      case "Selesai":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Pemula":
        return "bg-green-100 text-green-800"
      case "Menengah":
        return "bg-yellow-100 text-yellow-800"
      case "Lanjutan":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewDetail = (program: TrainingProgram) => {
    setSelectedProgram(program)
    setShowDetailModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Program Pelatihan UMKM</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tingkatkan kemampuan dan keterampilan bisnis Anda melalui program pelatihan yang dirancang khusus untuk UMKM
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Program Tersedia</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2,500+</div>
              <div className="text-sm text-gray-600">Peserta Aktif</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">25+</div>
              <div className="text-sm text-gray-600">Instruktur Ahli</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={program.image || "/placeholder.svg"}
                  alt={program.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                  <Badge className={getLevelColor(program.level)}>{program.level}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600">{program.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {program.instructor}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {program.duration}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {program.schedule}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {program.participants}/{program.maxParticipants} peserta
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Yang akan dipelajari:</div>
                    <div className="grid grid-cols-2 gap-1">
                      {program.features.map((feature, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{program.price}</div>
                    </div>
                    <Button onClick={() => handleViewDetail(program)}>
                      <Play className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Tidak Menemukan Program yang Sesuai?</h2>
          <p className="text-xl text-blue-100 mb-6">
            Hubungi kami untuk konsultasi gratis dan rekomendasi program pelatihan yang tepat untuk bisnis Anda
          </p>
          <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
            Konsultasi Gratis
          </Button>
        </div>

        {/* Training Detail Modal */}
        <TrainingDetailModal
          program={selectedProgram}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedProgram(null)
          }}
          user={user}
        />
      </div>
    </div>
  )
}
