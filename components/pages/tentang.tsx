"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Heart, Users, Award, TrendingUp, CheckCircle } from "lucide-react"

export default function Tentang() {
  const stats = [
    { label: "UMKM Terdaftar", value: "2,500+", icon: Users },
    { label: "Program Pelatihan", value: "50+", icon: Award },
    { label: "Tingkat Kepuasan", value: "95%", icon: TrendingUp },
    { label: "Kota Terjangkau", value: "100+", icon: Target },
  ]

  const team = [
    {
      name: "Iqbal Habibi",
      position: "Direktur Eksekutif",
      image: "https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
      description: "Ahli Informasi dalam pengembangan UMKM",
    },
    {
      name: "Iqbal Habibi",
      position: "Kepala Program",
      image: "https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
      description: "Spesialis manajemen bisnis dan pengembangan program pelatihan",
    },
    {
      name: "Safira Habibah",
      position: "Kepala Digital",
      image: "https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
      description: "Expert digital marketing dengan fokus pada transformasi digital UMKM",
    },
    {
      name: "Safira Habibah",
      position: "Kepala Kemitraan",
      image: "https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
      description: "Membangun jaringan kemitraan strategis untuk mendukung ekosistem UMKM",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Pemberdayaan",
      description: "Kami berkomitmen memberdayakan UMKM Indonesia untuk mencapai potensi terbaiknya",
    },
    {
      icon: Users,
      title: "Kolaborasi",
      description: "Membangun ekosistem yang saling mendukung antara sesama pelaku UMKM",
    },
    {
      icon: Award,
      title: "Kualitas",
      description: "Memberikan layanan dan program berkualitas tinggi untuk hasil yang optimal",
    },
    {
      icon: TrendingUp,
      title: "Inovasi",
      description: "Terus berinovasi dalam menghadirkan solusi terdepan untuk UMKM",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Pendirian SI UMKM Indonesia",
      description: "Dimulai sebagai inisiatif untuk mendukung UMKM di era digital",
    },
    {
      year: "2021",
      title: "1,000 UMKM Pertama",
      description: "Mencapai milestone 1,000 UMKM yang bergabung dalam platform",
    },
    {
      year: "2022",
      title: "Ekspansi Program Pelatihan",
      description: "Meluncurkan 25+ program pelatihan komprehensif",
    },
    {
      year: "2023",
      title: "Jaringan Nasional",
      description: "Menjangkau 100+ kota di seluruh Indonesia",
    },
    {
      year: "2024",
      title: "2,500+ UMKM Aktif",
      description: "Mencapai komunitas 2,500+ UMKM dengan tingkat kepuasan 95%",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-blue-500/20 text-blue-100 border-blue-400 mb-4">Tentang Kami</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Memajukan UMKM Indonesia</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              SI UMKM Indonesia adalah platform digital yang didedikasikan untuk memberdayakan dan mengembangkan Usaha
              Mikro, Kecil, dan Menengah di seluruh Indonesia melalui teknologi, pelatihan, dan jaringan kolaboratif.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Misi Kami</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Memberdayakan UMKM Indonesia melalui penyediaan platform digital yang komprehensif, program pelatihan
                berkualitas, dan jaringan kolaboratif yang mendukung pertumbuhan berkelanjutan dan daya saing di pasar
                global.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Platform digital terintegrasi</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Program pelatihan berkualitas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Jaringan kolaboratif nasional</span>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Visi Kami</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Menjadi platform terdepan dalam ekosistem UMKM Indonesia yang menghubungkan, memberdayakan, dan
                mengakselerasi pertumbuhan usaha mikro, kecil, dan menengah untuk berkontribusi signifikan terhadap
                perekonomian nasional.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Platform terdepan di Indonesia</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Ekosistem UMKM yang kuat</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Kontribusi ekonomi nasional</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
            <p className="text-xl text-gray-600">
              Prinsip-prinsip yang memandu setiap langkah kami dalam melayani UMKM Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perjalanan Kami</h2>
            <p className="text-xl text-gray-600">
              Milestone penting dalam perjalanan membangun ekosistem UMKM Indonesia
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                </div>
                <Card className="flex-1 p-6">
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="mr-3">
                      {milestone.year}
                    </Badge>
                    <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                  </div>
                  <p className="text-gray-600">{milestone.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tim Kami</h2>
            <p className="text-xl text-gray-600">
              Profesional berpengalaman yang berdedikasi untuk kemajuan UMKM Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Bergabunglah dengan Komunitas UMKM Terbesar di Indonesia</h2>
          <p className="text-xl text-blue-100 mb-8">
            Jadilah bagian dari gerakan memajukan UMKM Indonesia dan rasakan dampak positifnya untuk bisnis Anda
          </p>
        </div>
      </section>
    </div>
  )
}
