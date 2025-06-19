"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Copy, Eye, EyeOff } from "lucide-react"

export default function FirebaseDebug() {
  const [showSecrets, setShowSecrets] = useState(false)

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  }

  const requiredFields = [
    { key: "apiKey", label: "API Key", required: true },
    { key: "authDomain", label: "Auth Domain", required: true },
    { key: "projectId", label: "Project ID", required: true },
    { key: "storageBucket", label: "Storage Bucket", required: true },
    { key: "messagingSenderId", label: "Messaging Sender ID", required: true },
    { key: "appId", label: "App ID", required: true },
    { key: "measurementId", label: "Measurement ID", required: false },
  ]

  const validateField = (key: string, value: string, required: boolean) => {
    if (required && !value) return "missing"
    if (!value) return "optional"

    // Validate format
    switch (key) {
      case "apiKey":
        return value.startsWith("AIza") && value.length > 30 ? "valid" : "invalid"
      case "authDomain":
        return value.includes(".firebaseapp.com") ? "valid" : "invalid"
      case "projectId":
        return value.length > 0 && !value.includes(" ") ? "valid" : "invalid"
      case "storageBucket":
        return value.includes(".appspot.com") ? "valid" : "invalid"
      case "messagingSenderId":
        return /^\d+$/.test(value) && value.length > 10 ? "valid" : "invalid"
      case "appId":
        return value.startsWith("1:") && value.includes(":web:") ? "valid" : "invalid"
      case "measurementId":
        return !value || value.startsWith("G-") ? "valid" : "invalid"
      default:
        return "valid"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-100 text-green-800">✓ Valid</Badge>
      case "invalid":
        return <Badge variant="destructive">✗ Invalid</Badge>
      case "missing":
        return <Badge variant="destructive">✗ Missing</Badge>
      case "optional":
        return <Badge variant="secondary">- Optional</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const maskValue = (value: string, show: boolean) => {
    if (!value) return "NOT SET"
    if (show) return value
    return value.slice(0, 8) + "..." + value.slice(-4)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const allValid = requiredFields.every((field) => {
    const value = firebaseConfig[field.key as keyof typeof firebaseConfig]
    const status = validateField(field.key, value, field.required)
    return status === "valid" || (!field.required && status === "optional")
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Firebase Configuration Debug
        </CardTitle>
        <CardDescription>Debug dan validasi konfigurasi Firebase Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={allValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={allValid ? "text-green-800" : "text-red-800"}>
            {allValid
              ? "✅ Semua konfigurasi Firebase valid!"
              : "❌ Ada masalah dengan konfigurasi Firebase. Periksa field yang bermasalah di bawah."}
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center">
          <h4 className="font-medium">Environment Variables</h4>
          <Button variant="ghost" size="sm" onClick={() => setShowSecrets(!showSecrets)}>
            {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showSecrets ? "Hide" : "Show"} Values
          </Button>
        </div>

        <div className="space-y-3">
          {requiredFields.map((field) => {
            const value = firebaseConfig[field.key as keyof typeof firebaseConfig]
            const status = validateField(field.key, value, field.required)

            return (
              <div key={field.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">NEXT_PUBLIC_FIREBASE_{field.key.toUpperCase()}</code>
                    {field.required && <span className="text-red-500 text-xs">*required</span>}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {field.label}: {maskValue(value, showSecrets)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(status)}
                  {value && (
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(value)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {!allValid && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Cara memperbaiki:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Buka Firebase Console: https://console.firebase.google.com</li>
                <li>Pilih project Anda</li>
                <li>Klik ⚙️ Settings → Project settings</li>
                <li>Scroll ke "Your apps" → pilih Web app</li>
                <li>Copy konfigurasi dan paste ke file .env.local</li>
                <li>Restart development server</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Sample .env.local format:</h4>
          <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
            <div>NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...</div>
            <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com</div>
            <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id</div>
            <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com</div>
            <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012</div>
            <div>NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456</div>
            <div>NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
