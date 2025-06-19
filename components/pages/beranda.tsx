"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Award, ArrowRight, CheckCircle, Star } from "lucide-react"

interface BerandaProps {
  onLoginClick: () => void
  onRegisterClick: () => void
  isLoggedIn?: boolean
}

export default function Beranda({ onLoginClick, onRegisterClick, isLoggedIn = false }: BerandaProps) {
  const stats = [
    { label: "UMKM Terdaftar", value: "2,500+", icon: Users },
    { label: "Produk Terdaftar", value: "15,000+", icon: TrendingUp },
    { label: "Program Pelatihan", value: "50+", icon: Award },
  ]

  const features = [
    {
      title: "Manajemen Produk",
      description: "Kelola katalog produk UMKM Anda dengan mudah dan efisien",
      icon: "📦",
    },
    {
      title: "Program Pelatihan",
      description: "Akses berbagai program pelatihan untuk mengembangkan bisnis",
      icon: "🎓",
    },
    {
      title: "Analisis Bisnis",
      description: "Dapatkan insight mendalam tentang performa bisnis Anda",
      icon: "📊",
    },
    {
      title: "Jaringan UMKM",
      description: "Terhubung dengan sesama pelaku UMKM di seluruh Indonesia",
      icon: "🤝",
    },
  ]

  const testimonials = [
    {
      name: "Sari Dewi",
      business: "Kerajinan Tangan Bali",
      content:
        "Platform ini sangat membantu saya dalam mengelola bisnis kerajinan. Fitur-fiturnya lengkap dan mudah digunakan.",
      rating: 5,
    },
    {
      name: "Ahmad Rizki",
      business: "Kuliner Tradisional",
      content:
        "Dengan SI UMKM Indonesia, saya bisa lebih fokus mengembangkan produk karena administrasi jadi lebih mudah.",
      rating: 5,
    },
    {
      name: "Maya Sari",
      business: "Fashion Lokal",
      content: "Program pelatihannya sangat bermanfaat. Saya jadi lebih paham tentang digital marketing untuk UMKM.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400">Platform Digital UMKM Indonesia</Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Wujudkan Impian
                  <span className="text-yellow-300"> UMKM</span> Anda
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Platform terpadu untuk mengelola, mengembangkan, dan memajukan bisnis UMKM Anda dengan teknologi
                  modern dan dukungan komprehensif.
                </p>
              </div>

              {/* Hanya tampilkan tombol jika belum login */}
              {!isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                    onClick={onRegisterClick}
                  >
                    Mulai Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-700"
                    onClick={onLoginClick}
                  >
                    Masuk ke Akun
                  </Button>
                </div>
              )}

              <div className="flex items-center space-x-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Gratis untuk semua UMKM Indonesia</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Dukungan 24/7 dari tim ahli</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Pelatihan dan mentoring bisnis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Akses ke jaringan UMKM nasional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Lengkap untuk UMKM Modern</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dapatkan semua tools yang Anda butuhkan untuk mengelola dan mengembangkan bisnis UMKM dalam satu platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dipercaya oleh Ribuan UMKM</h2>
            <p className="text-xl text-gray-600">
              Dengarkan cerita sukses dari para pelaku UMKM yang telah bergabung dengan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.business}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Hanya tampilkan jika belum login */}
      {!isLoggedIn && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mengembangkan UMKM Anda?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Bergabunglah dengan ribuan UMKM lainnya dan rasakan perbedaannya hari ini juga
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                onClick={onRegisterClick}
              >
                Daftar Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-700"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
