"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Database, Shield, Cloud } from "lucide-react"

export default function ProjectInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          SI UMKM Indonesia
        </CardTitle>
        <CardDescription>Sistem Informasi UMKM Indonesia - Full Stack Application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="font-semibold">Authentication</h4>
              <p className="text-sm text-gray-600">Firebase Auth</p>
              <Badge variant="default" className="mt-1">
                Active
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Database className="h-8 w-8 text-green-600" />
            <div>
              <h4 className="font-semibold">Database</h4>
              <p className="text-sm text-gray-600">Cloud Firestore</p>
              <Badge variant="default" className="mt-1">
                Active
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Cloud className="h-8 w-8 text-purple-600" />
            <div>
              <h4 className="font-semibold">File Storage</h4>
              <p className="text-sm text-gray-600">Cloudinary</p>
              <Badge variant="secondary" className="mt-1">
                Optional
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Project Features</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ User Registration & Login</li>
            <li>✅ Real-time Data Management</li>
            <li>✅ CRUD Operations</li>
            <li>✅ User Profile Management</li>
            <li>✅ Image Upload (Optional)</li>
            <li>✅ Responsive Design</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
