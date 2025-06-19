"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Mail, Calendar, Settings } from "lucide-react"
import { getFirebaseAuth } from "@/lib/firebase-config"
import { signOut, type User as FirebaseUser, onAuthStateChanged } from "firebase/auth"
import BusinessProfile from "./business-profile"

interface UserProfileProps {
  onSignOut?: () => void
}

export default function UserProfile({ onSignOut }: UserProfileProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      const auth = getFirebaseAuth()
      await signOut(auth)
      onSignOut?.()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const getInitials = (name: string | null): string => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: string | null): string => {
    if (!date) return "Unknown"
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading user data...</div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
          <CardDescription>Informasi akun yang sedang login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* existing user profile content */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback className="text-lg">{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.displayName || "User"}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="h-4 w-4" />
                Bergabung: {formatDate(user.metadata.creationTime)}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? "Email Verified" : "Email Not Verified"}
              </Badge>
              <Badge variant="outline">UID: {user.uid.slice(0, 8)}...</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{user.metadata.lastSignInTime ? "Active" : "New"}</p>
              <p className="text-sm text-gray-600">Status</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{user.providerData.length}</p>
              <p className="text-sm text-gray-600">Auth Providers</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <BusinessProfile user={user} />
    </div>
  )
}
