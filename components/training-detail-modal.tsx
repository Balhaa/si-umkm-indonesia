"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Calendar, Clock, Users, User, BookOpen, Play, CheckCircle, Star } from "lucide-react"

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

interface TrainingDetailModalProps {
  program: TrainingProgram | null
  isOpen: boolean
  onClose: () => void
  user?: any
}

export default function TrainingDetailModal({ program, isOpen, onClose, user }: TrainingDetailModalProps) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false)

  if (!isOpen || !program) return null

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

  const handleEnroll = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk mendaftar pelatihan")
      return
    }

    setIsEnrolling(true)

    // Simulate enrollment process
    setTimeout(() => {
      setIsEnrolling(false)
      setIsEnrolled(true)
      setEnrollmentSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setEnrollmentSuccess(false)
      }, 3000)
    }, 2000)
  }

  const canEnroll = program.status === "Pendaftaran Dibuka" && program.participants < program.maxParticipants

  // Mock curriculum data
  const curriculum = [
    {
      week: 1,
      title: "Pengenalan dan Dasar-dasar",
      topics: ["Konsep dasar", "Tools yang dibutuhkan", "Setup awal"],
      duration: "2 jam",
    },
    {
      week: 2,
      title: "Implementasi Praktis",
      topics: ["Hands-on practice", "Case study", "Best practices"],
      duration: "2 jam",
    },
    {
      week: 3,
      title: "Strategi Lanjutan",
      topics: ["Advanced techniques", "Optimization", "Troubleshooting"],
      duration: "2 jam",
    },
    {
      week: 4,
      title: "Project dan Evaluasi",
      topics: ["Final project", "Peer review", "Certification"],
      duration: "2 jam",
    },
  ]

  // detail instructor pelatihan
  const instructorDetails = {
    bio: "Praktisi berpengalaman dengan 10+ tahun di bidang digital marketing dan pengembangan UMKM",
    experience: "10+ tahun",
    students: "500+ siswa",
    rating: 4.9,
    expertise: ["Digital Marketing", "E-commerce", "Social Media Strategy", "Content Marketing"],
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative">
            <img src={program.image || "/placeholder.svg"} alt={program.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 mb-2">
                <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                <Badge className={getLevelColor(program.level)}>{program.level}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{program.title}</h1>
              <p className="text-white/90">{program.description}</p>
            </div>
          </div>

          <div className="p-6">
            {/* Enrollment Success Alert */}
            {enrollmentSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  Selamat! Anda berhasil mendaftar untuk pelatihan "{program.title}". Informasi lebih lanjut akan
                  dikirim ke email Anda.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Program Overview */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Program</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">{program.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">Durasi</div>
                      <div className="font-semibold">{program.duration}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">Peserta</div>
                      <div className="font-semibold">
                        {program.participants}/{program.maxParticipants}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">Jadwal</div>
                      <div className="font-semibold text-xs">{program.schedule.split(",")[0]}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">Level</div>
                      <div className="font-semibold">{program.level}</div>
                    </div>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Yang Akan Dipelajari</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Kurikulum</h3>
                  <div className="space-y-4">
                    {curriculum.map((week, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">
                            Minggu {week.week}: {week.title}
                          </h4>
                          <Badge variant="outline">{week.duration}</Badge>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {week.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Instruktur</h3>
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{program.instructor}</h4>
                      <p className="text-gray-600 text-sm mb-3">{instructorDetails.bio}</p>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Pengalaman</div>
                          <div className="font-semibold">{instructorDetails.experience}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Siswa</div>
                          <div className="font-semibold">{instructorDetails.students}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Rating</div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-semibold">{instructorDetails.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-2">Keahlian:</div>
                        <div className="flex flex-wrap gap-2">
                          {instructorDetails.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price & Enrollment */}
                <Card className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{program.price}</div>
                    <div className="text-sm text-gray-500">untuk {program.duration}</div>
                  </div>

                  {isEnrolled ? (
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <div className="font-semibold text-green-800 mb-2">Sudah Terdaftar</div>
                      <div className="text-sm text-gray-600 mb-4">Anda sudah terdaftar dalam program ini</div>
                      <Button variant="outline" className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Akses Materi
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button className="w-full" size="lg" onClick={handleEnroll} disabled={!canEnroll || isEnrolling}>
                        {isEnrolling ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Mendaftar...
                          </>
                        ) : canEnroll ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Daftar Sekarang
                          </>
                        ) : (
                          "Pendaftaran Ditutup"
                        )}
                      </Button>

                      {!user && <p className="text-sm text-gray-500 text-center">Silakan login untuk mendaftar</p>}
                    </div>
                  )}
                </Card>

                {/* Program Details */}
                <Card className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Detail Program</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Jadwal:</span>
                      <span className="font-medium">{program.schedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Durasi:</span>
                      <span className="font-medium">{program.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Level:</span>
                      <span className="font-medium">{program.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Peserta:</span>
                      <span className="font-medium">
                        {program.participants}/{program.maxParticipants}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <Badge className={`${getStatusColor(program.status)} text-xs`}>{program.status}</Badge>
                    </div>
                  </div>
                </Card>

                {/* Contact Support */}
                <Card className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Butuh Bantuan?</h4>
                  <p className="text-sm text-gray-600 mb-4">Hubungi tim support kami untuk informasi lebih lanjut</p>
                  <Button variant="outline" className="w-full">
                    Hubungi Support
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
