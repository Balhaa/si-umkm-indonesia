"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, ImageIcon, FileText, Link } from "lucide-react"
import { getFirebaseDb } from "@/lib/firebase-config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface FileUploadAlternativesProps {
  userId: string
  onUploadComplete?: (fileData: any) => void
}

export default function FileUploadAlternatives({ userId, onUploadComplete }: FileUploadAlternativesProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [base64Data, setBase64Data] = useState<string>("")
  const [externalUrl, setExternalUrl] = useState<string>("")
  const [uploadMethod, setUploadMethod] = useState<"base64" | "url">("base64")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Batasi ukuran file untuk base64 (max 1MB untuk performa)
      if (file.size > 1024 * 1024) {
        alert("File terlalu besar. Maksimal 1MB untuk upload base64.")
        return
      }

      setSelectedFile(file)

      // Convert ke base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setBase64Data(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBase64Upload = async () => {
    if (!selectedFile || !base64Data) return

    setIsUploading(true)
    try {
      const db = getFirebaseDb()

      const fileData = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        base64Data: base64Data,
        ownerId: userId,
        uploadMethod: "base64",
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "file_metadata"), fileData)

      setUploadStatus("success")
      onUploadComplete?.({ id: docRef.id, ...fileData })

      // Reset form
      setSelectedFile(null)
      setBase64Data("")
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlUpload = async () => {
    if (!externalUrl) return

    setIsUploading(true)
    try {
      const db = getFirebaseDb()

      const fileData = {
        name: externalUrl.split("/").pop() || "external-file",
        url: externalUrl,
        ownerId: userId,
        uploadMethod: "url",
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "file_metadata"), fileData)

      setUploadStatus("success")
      onUploadComplete?.({ id: docRef.id, ...fileData })

      // Reset form
      setExternalUrl("")
    } catch (error) {
      console.error("URL save failed:", error)
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Alternatif Upload File
          </CardTitle>
          <CardDescription>Pilih metode upload file tanpa Firebase Storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Method Selection */}
          <div className="flex gap-4">
            <Button
              variant={uploadMethod === "base64" ? "default" : "outline"}
              onClick={() => setUploadMethod("base64")}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Base64 Upload
            </Button>
            <Button
              variant={uploadMethod === "url" ? "default" : "outline"}
              onClick={() => setUploadMethod("url")}
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              External URL
            </Button>
          </div>

          {uploadMethod === "base64" && (
            <div className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Upload file langsung ke Firestore sebagai base64. Maksimal 1MB per file. Cocok untuk gambar kecil dan
                  dokumen ringan.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="file-input">Pilih File (Max 1MB)</Label>
                <Input id="file-input" type="file" onChange={handleFileSelect} accept="image/*,.pdf,.txt,.doc,.docx" />
              </div>

              {selectedFile && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>
                    <strong>File:</strong> {selectedFile.name}
                  </p>
                  <p>
                    <strong>Ukuran:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <strong>Tipe:</strong> {selectedFile.type}
                  </p>
                </div>
              )}

              <Button onClick={handleBase64Upload} disabled={!selectedFile || isUploading} className="w-full">
                {isUploading ? "Mengupload..." : "Upload sebagai Base64"}
              </Button>
            </div>
          )}

          {uploadMethod === "url" && (
            <div className="space-y-4">
              <Alert>
                <Link className="h-4 w-4" />
                <AlertDescription>
                  Simpan URL file eksternal (Google Drive, Dropbox, dll). File tetap tersimpan di layanan eksternal.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="url-input">URL File Eksternal</Label>
                <Input
                  id="url-input"
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>

              <Button onClick={handleUrlUpload} disabled={!externalUrl || isUploading} className="w-full">
                {isUploading ? "Menyimpan..." : "Simpan URL"}
              </Button>
            </div>
          )}

          {uploadStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">File berhasil diupload!</AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">Upload gagal. Silakan coba lagi.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Alternative Services Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi Layanan File Gratis</CardTitle>
          <CardDescription>Alternatif layanan untuk menyimpan file secara gratis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Cloudinary</h3>
              <p className="text-sm text-gray-600">25GB gratis per bulan. Cocok untuk gambar dan video.</p>
              <a
                href="https://cloudinary.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                cloudinary.com
              </a>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Imgur</h3>
              <p className="text-sm text-gray-600">Upload gambar gratis dengan API sederhana.</p>
              <a
                href="https://imgur.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                imgur.com
              </a>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Supabase Storage</h3>
              <p className="text-sm text-gray-600">1GB gratis. Alternative yang bagus untuk Firebase Storage.</p>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                supabase.com
              </a>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Vercel Blob</h3>
              <p className="text-sm text-gray-600">Terintegrasi dengan Next.js. Ada tier gratis.</p>
              <a
                href="https://vercel.com/storage/blob"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                vercel.com/storage/blob
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
