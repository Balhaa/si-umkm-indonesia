"use client"

import { useState, useEffect } from "react"
import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth"
import { getFirebaseAuth } from "../lib/firebase-config"
import Navbar from "../components/navbar"
import AuthComponents from "../components/auth-components"
import UserProfile from "../components/user-profile"
import AdminProfile from "../components/admin-profile"
import UMKMDashboard from "../components/umkm-dashboard"
import AdminDashboard from "../components/admin-dashboard"
import Beranda from "../components/pages/beranda"
import Produk from "../components/pages/produk"
import Pelatihan from "../components/pages/pelatihan"
import Tentang from "../components/pages/tentang"

export default function Page() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userType, setUserType] = useState<"admin" | "umkm" | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState("beranda")
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  useEffect(() => {
    try {
      const auth = getFirebaseAuth()
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // Only set user if it's not admin (admin doesn't use Firebase Auth)
        if (userType !== "admin") {
          setUser(user)
        }
        setLoading(false)
        if (user && userType === "umkm") {
          setShowAuth(false)
          setCurrentPage("dashboard")
        }
      })

      return () => unsubscribe()
    } catch (error) {
      console.error("Firebase auth initialization error:", error)
      setLoading(false)
    }
  }, [userType])

  const handleLoginClick = () => {
    setAuthMode("login")
    setShowAuth(true)
  }

  const handleRegisterClick = () => {
    setAuthMode("register")
    setShowAuth(true)
  }

  const handleAuthSuccess = (user: FirebaseUser, type: "admin" | "umkm") => {
    setUser(user)
    setUserType(type)
    setShowAuth(false)
    setCurrentPage("dashboard")
  }

  const handleSignOut = () => {
    if (userType === "admin") {
      // For admin, just clear the state
      setUser(null)
      setUserType(null)
      setCurrentPage("beranda")
    } else {
      // For UMKM users, sign out from Firebase
      try {
        const auth = getFirebaseAuth()
        auth.signOut().then(() => {
          setUser(null)
          setUserType(null)
          setCurrentPage("beranda")
        })
      } catch (error) {
        console.error("Sign out error:", error)
        // Fallback: clear state anyway
        setUser(null)
        setUserType(null)
        setCurrentPage("beranda")
      }
    }
  }

  const renderPage = () => {
    if (showAuth) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AuthComponents onAuthSuccess={handleAuthSuccess} />
            <div className="text-center mt-4">
              <button onClick={() => setShowAuth(false)} className="text-blue-600 hover:underline text-sm">
                ← Kembali ke beranda
              </button>
            </div>
          </div>
        </div>
      )
    }

    switch (currentPage) {
      case "beranda":
        return (
          <Beranda
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            isLoggedIn={user !== null || userType === "admin"}
          />
        )
      case "produk":
        return <Produk user={user} />
      case "pelatihan":
        return <Pelatihan user={user} />
      case "tentang":
        return <Tentang />
      case "profil":
        return user ? (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              {userType === "admin" ? (
                <AdminProfile user={user} onSignOut={handleSignOut} />
              ) : (
                <UserProfile onSignOut={handleSignOut} />
              )}
            </div>
          </div>
        ) : (
          <Beranda onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
        )
      case "dashboard":
        return user ? (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
              {userType === "admin" ? <AdminDashboard user={user} /> : <UMKMDashboard user={user} />}
            </div>
          </div>
        ) : (
          <Beranda onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
        )
      default:
        return <Beranda onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {!showAuth && (
        <Navbar
          user={user}
          userType={userType}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSignOut={handleSignOut}
        />
      )}
      {renderPage()}
    </div>
  )
}
