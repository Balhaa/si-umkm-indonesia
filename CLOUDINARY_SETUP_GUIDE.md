# Cloudinary Setup Guide - Upload Gambar Gratis

## Overview

Cloudinary adalah layanan cloud untuk manajemen gambar dan video dengan tier gratis yang sangat generous. Perfect sebagai alternatif Firebase Storage.

## Cloudinary Free Tier Benefits

✅ **25GB bandwidth per bulan**  
✅ **25,000 transformasi per bulan**  
✅ **10GB storage**  
✅ **CDN global**  
✅ **Optimasi otomatis**  
✅ **Responsive images**  
✅ **Format conversion (WebP, AVIF)**  

## Step 1: Buat Account Cloudinary

1. Kunjungi [cloudinary.com](https://cloudinary.com)
2. Klik "Sign Up for Free"
3. Daftar dengan email atau GitHub
4. Verifikasi email Anda

## Step 2: Dapatkan Credentials

Setelah login, di Dashboard Cloudinary:

1. **Cloud Name**: Terlihat di bagian atas dashboard
2. **API Key**: Di section "Account Details"
3. **API Secret**: Di section "Account Details" (untuk server-side)

## Step 3: Setup Upload Preset

Upload preset diperlukan untuk unsigned uploads (client-side):

1. Pergi ke **Settings** → **Upload**
2. Scroll ke **Upload presets**
3. Klik **Add upload preset**
4. Konfigurasi:
   - **Preset name**: `unsigned_preset` (atau nama lain)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `users` (opsional, untuk organisasi)
   - **Use filename**: `Yes`
   - **Unique filename**: `Yes`
   - **Auto tagging**: `Yes` (opsional)
5. Klik **Save**

## Step 4: Environment Variables

Tambahkan ke file `.env.local`:

\`\`\`bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
\`\`\`

**Note:** 
- `NEXT_PUBLIC_*` variables bisa diakses di client-side
- `CLOUDINARY_API_SECRET` hanya untuk server-side operations

## Step 5: Implementasi di Next.js

### Basic Upload Function

\`\`\`javascript
const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'unsigned_preset')
  formData.append('cloud_name', 'your-cloud-name')
  
  const response = await fetch(
    \`https://api.cloudinary.com/v1_1/your-cloud-name/image/upload\`,
    {
      method: 'POST',
      body: formData
    }
  )
  
  return await response.json()
}
\`\`\`

### Dengan Transformasi

\`\`\`javascript
// Upload dengan auto-optimization
formData.append('quality', 'auto')
formData.append('fetch_format', 'auto')
formData.append('folder', \`users/\${userId}\`)
\`\`\`

## Step 6: Responsive Images

Cloudinary secara otomatis generate berbagai ukuran:

\`\`\`javascript
const generateResponsiveUrls = (publicId) => ({
  thumbnail: \`https://res.cloudinary.com/your-cloud-name/image/upload/c_fill,w_150,h_150,q_auto,f_webp/\${publicId}\`,
  small: \`https://res.cloudinary.com/your-cloud-name/image/upload/c_scale,w_400,q_auto,f_auto/\${publicId}\`,
  medium: \`https://res.cloudinary.com/your-cloud-name/image/upload/c_scale,w_800,q_auto,f_auto/\${publicId}\`,
  large: \`https://res.cloudinary.com/your-cloud-name/image/upload/c_scale,w_1200,q_auto,f_auto/\${publicId}\`
})
\`\`\`

## Step 7: Firestore Integration

Simpan metadata di Firestore:

\`\`\`javascript
const saveToFirestore = async (cloudinaryResult, userId) => {
  const db = getFirebaseDb()
  
  await addDoc(collection(db, 'cloudinary_images'), {
    publicId: cloudinaryResult.public_id,
    secureUrl: cloudinaryResult.secure_url,
    originalFilename: cloudinaryResult.original_filename,
    format: cloudinaryResult.format,
    width: cloudinaryResult.width,
    height: cloudinaryResult.height,
    bytes: cloudinaryResult.bytes,
    responsiveUrls: generateResponsiveUrls(cloudinaryResult.public_id),
    ownerId: userId,
    createdAt: serverTimestamp()
  })
}
\`\`\`

## Advanced Features

### 1. Auto-Optimization

Cloudinary otomatis:
- Convert ke format terbaik (WebP, AVIF)
- Compress sesuai device
- Resize sesuai viewport
- Lazy loading

### 2. Transformations

\`\`\`javascript
// Crop dan resize
\`c_fill,w_300,h_200\`

// Blur background
\`e_blur_faces\`

// Auto enhance
\`e_auto_color,e_auto_contrast\`

// Watermark
\`l_watermark,o_50\`
\`\`\`

### 3. Video Support

Cloudinary juga support video (dalam free tier):

\`\`\`javascript
// Upload video
const uploadVideo = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'video_preset')
  formData.append('resource_type', 'video')
  
  const response = await fetch(
    \`https://api.cloudinary.com/v1_1/your-cloud-name/video/upload\`,
    { method: 'POST', body: formData }
  )
  
  return await response.json()
}
\`\`\`

## Security Best Practices

### 1. Upload Restrictions

Di Upload Preset settings:
- **Allowed formats**: jpg, png, webp, gif
- **Max file size**: 10MB
- **Max image width/height**: 2000px
- **Auto tagging**: Enable untuk content moderation

### 2. Folder Organization

\`\`\`javascript
// Organize by user and date
const folder = \`users/\${userId}/\${new Date().getFullYear()}/\${new Date().getMonth() + 1}\`
formData.append('folder', folder)
\`\`\`

### 3. Content Moderation

Enable di Cloudinary dashboard:
- **Auto-moderation**: Detect inappropriate content
- **Manual review**: Queue suspicious uploads
- **Webhook notifications**: Get notified of moderation results

## Monitoring Usage

### Cloudinary Dashboard

Monitor di **Dashboard** → **Usage**:
- Bandwidth usage
- Storage usage
- Transformations count
- API calls

### Alerts

Setup alerts untuk:
- 80% bandwidth usage
- 80% storage usage
- Approaching transformation limits

## Cost Optimization Tips

### 1. Smart Transformations

\`\`\`javascript
// Use q_auto untuk optimal quality/size balance
\`q_auto\`

// Use f_auto untuk format terbaik
\`f_auto\`

// Lazy load images
\`fl_lazy\`
\`\`\`

### 2. Caching Strategy

\`\`\`javascript
// Cache transformed images
const getCachedUrl = (publicId, transformation) => {
  const cacheKey = \`\${publicId}_\${transformation}\`
  return localStorage.getItem(cacheKey) || generateUrl(publicId, transformation)
}
\`\`\`

### 3. Cleanup Strategy

\`\`\`javascript
// Delete unused images (server-side)
const deleteFromCloudinary = async (publicId) => {
  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId })
  })
  
  return response.json()
}
\`\`\`

## Troubleshooting

### Common Issues

1. **Upload Failed**: Check upload preset configuration
2. **CORS Error**: Ensure unsigned uploads are enabled
3. **Quota Exceeded**: Monitor usage in dashboard
4. **Slow Loading**: Use appropriate transformations

### Debug Mode

\`\`\`javascript
// Enable debug logging
const uploadWithDebug = async (file) => {
  console.log('Uploading:', file.name, file.size)
  
  try {
    const result = await uploadToCloudinary(file)
    console.log('Upload success:', result)
    return result
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
\`\`\`

## Migration from Other Services

### From Firebase Storage

1. Export existing file URLs
2. Download files programmatically
3. Upload to Cloudinary
4. Update database references
5. Delete from Firebase Storage

### From Local Storage

1. Create upload script
2. Batch upload with rate limiting
3. Update database references
4. Verify all uploads successful

## Next Steps

1. **Setup Webhooks**: Get notified of upload events
2. **Implement AI Features**: Auto-tagging, content analysis
3. **Add Video Support**: Extend to video uploads
4. **Performance Monitoring**: Track loading times
5. **A/B Testing**: Test different optimization strategies

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Transformation Reference](https://cloudinary.com/documentation/image_transformation_reference)
- [React SDK](https://cloudinary.com/documentation/react_integration)
- [Next.js Examples](https://github.com/cloudinary/cloudinary-examples)
\`\`\`

Terakhir, mari saya update halaman utama untuk menampilkan komponen Cloudinary:

```typescriptreact file="app/page.tsx"
[v0-no-op-code-block-prefix]import FirebaseSetupWizard from "../components/firebase-setup-wizard"
import CloudinaryUpload from "../components/cloudinary-upload"
import CloudinaryGallery from "../components/cloudinary-gallery"

export default function Page() {
  // Mock user ID - dalam aplikasi nyata, ambil dari authentication
  const mockUserId = "demo-user-123"

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firebase + Cloudinary Setup
          </h1>
          <p className="text-gray-600">
            Setup Firebase untuk auth & database, Cloudinary untuk image storage
          </p>
        </div>

        {/* Firebase Setup */}
        <FirebaseSetupWizard />

        {/* Cloudinary Upload */}
        <CloudinaryUpload 
          userId={mockUserId}
          onUploadComplete={(result) => {
            console.log("Upload completed:", result)
          }}
        />

        {/* Cloudinary Gallery */}
        <CloudinaryGallery userId={mockUserId} />
      </div>
    </div>
  )
}
