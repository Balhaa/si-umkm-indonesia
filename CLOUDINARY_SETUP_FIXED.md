# Cloudinary Setup Guide - Fixed untuk Unsigned Uploads

## Error yang Diperbaiki

❌ **Error sebelumnya:**
- `Use filename parameter is not allowed when using unsigned upload`
- `Upload preset must be whitelisted for unsigned uploads`

✅ **Solusi:**
- Hapus parameter yang tidak diizinkan
- Konfigurasi upload preset dengan benar

## Step 1: Buat Account Cloudinary

1. Kunjungi [cloudinary.com](https://cloudinary.com)
2. Klik "Sign Up for Free"
3. Daftar dengan email atau GitHub
4. Verifikasi email Anda

## Step 2: Setup Upload Preset (PENTING!)

Ini adalah langkah yang paling penting untuk menghindari error:

### A. Buat Upload Preset Baru

1. Login ke Cloudinary Dashboard
2. Pergi ke **Settings** → **Upload**
3. Scroll ke bagian **Upload presets**
4. Klik **Add upload preset**

### B. Konfigurasi Upload Preset

**Basic Settings:**
- **Preset name**: `web_upload` (atau nama lain yang mudah diingat)
- **Signing Mode**: **Unsigned** ⚠️ PENTING!
- **Use filename**: **NO** ⚠️ Jangan dicentang!
- **Unique filename**: **YES** ✅ Centang ini
- **Overwrite**: **NO** (opsional)

**Folder & Public ID:**
- **Folder**: Kosongkan (akan diset dari client)
- **Public ID**: Kosongkan (akan auto-generate)

**Upload Control:**
- **Resource type**: **Auto-detect**
- **Allowed formats**: `jpg,png,gif,webp` (atau kosongkan untuk semua)
- **Max file size**: `10485760` (10MB dalam bytes)
- **Max image width**: `2000` (opsional)
- **Max image height**: `2000` (opsional)

**Transformations (Opsional):**
- **Incoming transformation**: Kosongkan
- **Eager transformations**: Kosongkan (akan dihandle di client)

### C. Save Upload Preset

Klik **Save** dan catat nama preset yang Anda buat.

## Step 3: Environment Variables

Tambahkan ke file `.env.local`:

\`\`\`bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=web_upload
\`\`\`

**Catatan:**
- Ganti `your-cloud-name-here` dengan Cloud Name Anda
- Ganti `web_upload` dengan nama preset yang Anda buat
- Untuk unsigned uploads, kita TIDAK perlu API Key dan Secret

## Step 4: Parameter yang Diizinkan untuk Unsigned Upload

Hanya parameter berikut yang diizinkan untuk unsigned uploads:

✅ **Diizinkan:**
- `upload_preset` (wajib)
- `public_id`
- `folder`
- `tags`
- `context`
- `metadata`
- `face_coordinates`
- `custom_coordinates`
- `callback`
- `public_id_prefix`

❌ **TIDAK Diizinkan:**
- `use_filename`
- `unique_filename`
- `overwrite`
- `resource_type` (kecuali untuk video)
- `transformation`

## Step 5: Implementasi Upload yang Benar

\`\`\`javascript
const uploadToCloudinary = async (file, userId) => {
  const formData = new FormData()
  
  // Parameter wajib
  formData.append('file', file)
  formData.append('upload_preset', 'web_upload') // Nama preset Anda
  
  // Parameter opsional yang diizinkan
  formData.append('folder', `users/${userId}`)
  formData.append('public_id_prefix', `${userId}_`)
  formData.append('tags', 'user_upload,web')
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/your-cloud-name/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Upload failed')
  }
  
  return await response.json()
}
\`\`\`

## Step 6: Troubleshooting Upload Preset

Jika masih error "Upload preset must be whitelisted":

### A. Cek Signing Mode
1. Pergi ke **Settings** → **Upload**
2. Cari preset Anda
3. Klik **Edit**
4. Pastikan **Signing Mode** = **Unsigned**
5. **Save** lagi

### B. Test Upload Preset
Test dengan curl:

\`\`\`bash
curl -X POST \
  https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@/path/to/test-image.jpg" \
  -F "upload_preset=web_upload"
\`\`\`

### C. Cek Preset Name
Pastikan nama preset di environment variable sama persis dengan yang di dashboard.

## Step 7: Advanced Configuration (Opsional)

### A. Auto-Optimization di Upload Preset

Di upload preset settings:
- **Quality**: `auto:good`
- **Format**: `auto`
- **Fetch format**: `auto`

### B. Content Moderation

Enable di upload preset:
- **Moderation**: `manual` atau `webpurify`
- **Notification URL**: URL webhook Anda

### C. Backup & Versioning

- **Backup**: `true` (untuk backup otomatis)
- **Versioning**: `true` (untuk version control)

## Step 8: Monitoring & Debugging

### A. Enable Debug Mode

\`\`\`javascript
const uploadWithDebug = async (file, userId) => {
  console.log('Upload starting:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    userId: userId,
    preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  })
  
  try {
    const result = await uploadToCloudinary(file, userId)
    console.log('Upload success:', result)
    return result
  } catch (error) {
    console.error('Upload failed:', {
      error: error.message,
      fileName: file.name,
      preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    })
    throw error
  }
}
\`\`\`

### B. Check Network Tab

Di browser DevTools → Network tab:
1. Cari request ke `cloudinary.com`
2. Cek request payload
3. Cek response error details

## Step 9: Common Errors & Solutions

### Error: "Upload preset must be whitelisted"
**Solusi:**
- Pastikan Signing Mode = Unsigned
- Cek nama preset di environment variable
- Tunggu beberapa menit setelah save preset

### Error: "Use filename parameter is not allowed"
**Solusi:**
- Hapus parameter `use_filename` dari FormData
- Gunakan `public_id_prefix` sebagai gantinya

### Error: "Invalid upload preset"
**Solusi:**
- Cek typo di nama preset
- Pastikan preset sudah di-save
- Refresh browser dan coba lagi

### Error: "File size too large"
**Solusi:**
- Set max file size di upload preset
- Validasi ukuran file di client
- Compress image sebelum upload

## Step 10: Production Checklist

✅ Upload preset configured dengan Signing Mode = Unsigned  
✅ Environment variables set dengan benar  
✅ File size validation di client  
✅ Error handling implemented  
✅ Progress tracking working  
✅ Firestore integration working  
✅ Responsive URLs generated  

## Backup Plan: Signed Uploads

Jika unsigned uploads tidak bekerja, gunakan signed uploads:

### A. Setup API Route

\`\`\`javascript
// pages/api/cloudinary/signature.js
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default function handler(req, res) {
  const { folder, public_id } = req.body
  
  const timestamp = Math.round(new Date().getTime() / 1000)
  
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, public_id },
    process.env.CLOUDINARY_API_SECRET
  )
  
  res.json({ signature, timestamp })
}
\`\`\`

### B. Client-side Signed Upload

\`\`\`javascript
const uploadSigned = async (file, userId) => {
  // Get signature from API
  const signatureResponse = await fetch('/api/cloudinary/signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      folder: `users/${userId}`,
      public_id: `${userId}_${Date.now()}`
    })
  })
  
  const { signature, timestamp } = await signatureResponse.json()
  
  // Upload with signature
  const formData = new FormData()
  formData.append('file', file)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp)
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
  formData.append('folder', `users/${userId}`)
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )
  
  return await response.json()
}
\`\`\`

Dengan panduan ini, error upload Cloudinary seharusnya sudah teratasi!
\`\`\`

Mari saya juga buat komponen untuk test upload preset:
