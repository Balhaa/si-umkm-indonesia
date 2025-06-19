"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { initializeFirebase, testFirebaseConnection } from "@/lib/firebase-config"

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

export default function FirebaseSetupWizard() {
  const [config, setConfig] = useState<FirebaseConfig>({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = (field: keyof FirebaseConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    setConnectionStatus("idle")
    setErrorMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      // Validate required fields
      const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
      const missingFields = requiredFields.filter((field) => !config[field as keyof FirebaseConfig])

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      }

      // Initialize Firebase with the provided config
      initializeFirebase(config)

      // Test the connection
      const isConnected = await testFirebaseConnection()

      if (isConnected) {
        setConnectionStatus("success")
      } else {
        throw new Error("Failed to establish connection to Firebase services")
      }
    } catch (error) {
      console.error("Setup failed:", error)
      setConnectionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case "success":
        return "Firebase connected successfully! All services are ready."
      case "error":
        return errorMessage || "Failed to connect to Firebase. Please check your configuration."
      default:
        return "Enter your Firebase configuration to get started."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Firebase Setup Wizard
              {getStatusIcon()}
            </CardTitle>
            <CardDescription>
              Configure your Firebase project settings to enable authentication, database, and storage services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertDescription>{getStatusMessage()}</AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => handleInputChange("apiKey", e.target.value)}
                    placeholder="Enter your Firebase API key"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authDomain">Auth Domain *</Label>
                  <Input
                    id="authDomain"
                    value={config.authDomain}
                    onChange={(e) => handleInputChange("authDomain", e.target.value)}
                    placeholder="your-project.firebaseapp.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectId">Project ID *</Label>
                  <Input
                    id="projectId"
                    value={config.projectId}
                    onChange={(e) => handleInputChange("projectId", e.target.value)}
                    placeholder="your-project-id"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storageBucket">Storage Bucket *</Label>
                  <Input
                    id="storageBucket"
                    value={config.storageBucket}
                    onChange={(e) => handleInputChange("storageBucket", e.target.value)}
                    placeholder="your-project.appspot.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messagingSenderId">Messaging Sender ID *</Label>
                  <Input
                    id="messagingSenderId"
                    value={config.messagingSenderId}
                    onChange={(e) => handleInputChange("messagingSenderId", e.target.value)}
                    placeholder="123456789012"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appId">App ID *</Label>
                  <Input
                    id="appId"
                    value={config.appId}
                    onChange={(e) => handleInputChange("appId", e.target.value)}
                    placeholder="1:123456789012:web:abcdef123456"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurementId">Measurement ID (Optional)</Label>
                <Input
                  id="measurementId"
                  value={config.measurementId}
                  onChange={(e) => handleInputChange("measurementId", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test Firebase Connection"
                )}
              </Button>
            </form>

            {connectionStatus === "success" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Setup Complete!</h3>
                <p className="text-green-700 text-sm">
                  Your Firebase configuration is working correctly. You can now use:
                </p>
                <ul className="list-disc list-inside text-green-700 text-sm mt-2 space-y-1">
                  <li>Firebase Authentication</li>
                  <li>Cloud Firestore Database</li>
                </ul>
                <p className="text-green-700 text-sm mt-2">
                  <strong>Note:</strong> Firebase Storage tidak diaktifkan untuk menghindari biaya upgrade. Gunakan
                  alternatif upload file yang tersedia.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
