"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus, AlertTriangle, Building2, Shield } from "lucide-react"
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase-config"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

interface AuthComponentsProps {
  onAuthSuccess?: (user: FirebaseUser, userType: "admin" | "umkm") => void
}

export default function AuthComponents({ onAuthSuccess }: AuthComponentsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userType, setUserType] = useState<"umkm" | "admin">("umkm")

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Admin credentials - untuk demo
  const ADMIN_CREDENTIALS = {
    email: "admin@siumkm.com",
    password: "admin123",
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Check if admin login
      if (userType === "admin") {
        if (loginForm.email !== ADMIN_CREDENTIALS.email || loginForm.password !== ADMIN_CREDENTIALS.password) {
          throw new Error("Email atau password admin salah")
        }

        // Create mock admin user object
        const mockAdminUser = {
          uid: "admin-uid",
          email: ADMIN_CREDENTIALS.email,
          displayName: "Administrator",
          emailVerified: true,
        } as FirebaseUser

        setSuccess("Login admin berhasil! Selamat datang Administrator.")
        onAuthSuccess?.(mockAdminUser, "admin")
        setLoginForm({ email: "", password: "" })
        setIsLoading(false)
        return
      }

      // Regular UMKM login
      const auth = getFirebaseAuth()
      const userCredential = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)

      // Check if user exists in Firestore
      const db = getFirebaseDb()
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))

      if (!userDoc.exists()) {
        // Create user document if doesn't exist
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: userCredential.user.displayName || "User UMKM",
          email: userCredential.user.email,
          userType: "umkm",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true,
        })
      }

      setSuccess("Login berhasil! Selamat datang kembali.")
      onAuthSuccess?.(userCredential.user, "umkm")

      // Reset form
      setLoginForm({ email: "", password: "" })
    } catch (error: any) {
      console.error("Login error:", error)
      setError(getAuthErrorMessage(error.code, error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Password tidak cocok")
      setIsLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError("Password minimal 6 karakter")
      setIsLoading(false)
      return
    }

    try {
      const auth = getFirebaseAuth()
      const db = getFirebaseDb()

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password)

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: registerForm.name,
      })

      // Save user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: registerForm.name,
        email: registerForm.email,
        userType: "umkm", // Always UMKM for registration
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      })

      setSuccess("Registrasi berhasil! Selamat bergabung di SI UMKM Indonesia.")
      onAuthSuccess?.(userCredential.user, "umkm")

      // Reset form
      setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" })
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(getAuthErrorMessage(error.code, error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthErrorMessage = (errorCode: string, originalMessage?: string): string => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Email sudah terdaftar. Silakan gunakan email lain atau login."
      case "auth/weak-password":
        return "Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol."
      case "auth/invalid-email":
        return "Format email tidak valid."
      case "auth/user-not-found":
        return "Email tidak terdaftar. Silakan daftar terlebih dahulu."
      case "auth/wrong-password":
        return "Password salah. Periksa kembali password Anda."
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan login. Coba lagi dalam beberapa menit."
      case "auth/network-request-failed":
        return "Koneksi internet bermasalah. Periksa koneksi Anda."
      default:
        return `Terjadi kesalahan: ${originalMessage || "Silakan coba lagi."}`
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">SI UMKM Indonesia</CardTitle>
        <CardDescription>Masuk atau daftar untuk mengakses platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="register">Daftar</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            {/* User Type Selection */}
            <div className="space-y-3 mb-4">
              <Label>Login sebagai:</Label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    userType === "umkm" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="umkm"
                    checked={userType === "umkm"}
                    onChange={(e) => setUserType(e.target.value as "umkm" | "admin")}
                    className="text-blue-600"
                  />
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Pelaku UMKM</span>
                </label>
                <label
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    userType === "admin" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={userType === "admin"}
                    onChange={(e) => setUserType(e.target.value as "umkm" | "admin")}
                    className="text-blue-600"
                  />
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Administrator</span>
                </label>
              </div>
            </div>

            {/* Admin Info */}
            {/* Hapus seluruh section ini:
            {userType === "admin" && (
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-blue-800">
                  <strong>Login Admin:</strong>
                  <br />
                  Email: admin@siumkm.com
                  <br />
                  Password: admin123
                </AlertDescription>
              </Alert>
            )} */}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="nama@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Memproses...
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Masuk
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <User className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Pendaftaran hanya untuk <strong>Pelaku UMKM</strong>. Admin tidak perlu mendaftar.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="nama@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (min. 6 karakter)"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Mendaftar...
                  </div>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Daftar Sekarang
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Status Messages */}
        {error && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Dengan mendaftar, Anda menyetujui</p>
          <p>
            <a href="#" className="text-blue-600 hover:underline">
              Syarat & Ketentuan
            </a>{" "}
            dan{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Kebijakan Privasi
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
