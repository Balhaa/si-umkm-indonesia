# Setup Firebase Tanpa Storage (Gratis)

## Overview

Panduan ini menjelaskan cara menggunakan Firebase hanya dengan Auth dan Firestore untuk menghindari biaya upgrade ke Blaze plan yang diperlukan untuk Firebase Storage.

## Yang Digunakan (Gratis)

✅ **Firebase Authentication** - Gratis hingga 50,000 MAU  
✅ **Cloud Firestore** - Gratis hingga 50,000 reads/writes per hari  
❌ **Firebase Storage** - Memerlukan upgrade ke Blaze plan  

## Alternatif untuk File Upload

### 1. Base64 Storage di Firestore

**Kelebihan:**
- Tidak perlu layanan eksternal
- Data tersimpan di Firestore
- Mudah diimplementasi

**Kekurangan:**
- Batasan ukuran (max 1MB per dokumen)
- Menggunakan quota Firestore
- Tidak efisien untuk file besar

**Implementasi:**
\`\`\`javascript
// Simpan file sebagai base64 di Firestore
const fileData = {
  name: file.name,
  type: file.type,
  base64Data: base64String,
  ownerId: userId,
  createdAt: serverTimestamp()
}

await addDoc(collection(db, "files"), fileData)
\`\`\`

### 2. External URL Storage

**Kelebihan:**
- Tidak ada batasan ukuran
- File tersimpan di layanan yang sudah ada
- Gratis jika menggunakan layanan gratis

**Kekurangan:**
- Bergantung pada layanan eksternal
- Link bisa expired
- Kurang kontrol atas file

**Implementasi:**
\`\`\`javascript
// Simpan URL eksternal di Firestore
const fileData = {
  name: fileName,
  url: externalUrl,
  ownerId: userId,
  createdAt: serverTimestamp()
}

await addDoc(collection(db, "file_metadata"), fileData)
\`\`\`

## Layanan File Gratis yang Direkomendasikan

### 1. Cloudinary
- **Gratis:** 25GB bandwidth/bulan
- **Fitur:** Image/video optimization, transformasi otomatis
- **API:** Mudah diintegrasikan
- **Link:** https://cloudinary.com

### 2. Imgur
- **Gratis:** Upload gambar unlimited
- **Fitur:** API sederhana, hosting gambar
- **Cocok untuk:** Gambar dan meme
- **Link:** https://imgur.com

### 3. Supabase Storage
- **Gratis:** 1GB storage
- **Fitur:** S3-compatible, CDN global
- **Cocok untuk:** Alternative Firebase Storage
- **Link:** https://supabase.com

### 4. Vercel Blob
- **Gratis:** Tier gratis tersedia
- **Fitur:** Terintegrasi dengan Next.js
- **Cocok untuk:** Aplikasi Next.js di Vercel
- **Link:** https://vercel.com/storage/blob

## Struktur Data Firestore

### Collection: file_metadata
\`\`\`javascript
{
  id: "auto-generated",
  name: "document.pdf",
  type: "application/pdf", // untuk base64
  size: 1024000, // untuk base64
  base64Data: "data:application/pdf;base64,JVBERi0xLjQ...", // untuk base64
  url: "https://external-service.com/file.pdf", // untuk URL
  ownerId: "user-uid",
  uploadMethod: "base64" | "url",
  createdAt: timestamp,
  updatedAt: timestamp
}
\`\`\`

### Collection: posts (dengan file attachment)
\`\`\`javascript
{
  id: "post-id",
  title: "Post Title",
  content: "Post content",
  authorId: "user-uid",
  attachments: [
    {
      fileId: "file-metadata-id",
      name: "attachment.pdf",
      type: "base64" | "url"
    }
  ],
  createdAt: timestamp
}
\`\`\`

## Security Rules (Firestore Only)

\`\`\`javascript
// file_metadata collection
match /file_metadata/{fileId} {
  allow read: if isAuthenticated() && 
                 (resource.data.ownerId == request.auth.uid || isAdmin());
  allow create: if isAuthenticated() && 
                   request.resource.data.ownerId == request.auth.uid;
  allow update: if isAuthenticated() && 
                   resource.data.ownerId == request.auth.uid;
  allow delete: if isAuthenticated() && 
                   (resource.data.ownerId == request.auth.uid || isAdmin());
}
\`\`\`

## Implementasi di React

### Upload Component
\`\`\`tsx
const handleFileUpload = async (file: File) => {
  // Untuk base64
  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64Data = e.target?.result as string
    
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      base64Data,
      ownerId: user.uid,
      uploadMethod: "base64",
      createdAt: serverTimestamp()
    }
    
    await addDoc(collection(db, "file_metadata"), fileData)
  }
  reader.readAsDataURL(file)
}
\`\`\`

### Display Component
\`\`\`tsx
const FileDisplay = ({ fileId }: { fileId: string }) => {
  const [fileData, setFileData] = useState(null)
  
  useEffect(() => {
    const fetchFile = async () => {
      const docRef = doc(db, "file_metadata", fileId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setFileData(docSnap.data())
      }
    }
    
    fetchFile()
  }, [fileId])
  
  if (!fileData) return <div>Loading...</div>
  
  if (fileData.uploadMethod === "base64") {
    return <img src={fileData.base64Data || "/placeholder.svg"} alt={fileData.name} />
  } else {
    return <a href={fileData.url} target="_blank">{fileData.name}</a>
  }
}
\`\`\`

## Batasan dan Pertimbangan

### Firestore Limits (Free Tier)
- **Dokumen:** 50,000 reads per hari
- **Writes:** 20,000 writes per hari
- **Storage:** 1GB total
- **Ukuran dokumen:** Max 1MB per dokumen

### Base64 Considerations
- File 1MB = ~1.37MB base64 (overhead 37%)
- Gunakan untuk file kecil saja (gambar thumbnail, dokumen ringan)
- Tidak cocok untuk video atau file besar

### External URL Considerations
- Link bisa expired atau berubah
- Tidak ada kontrol penuh atas file
- Perlu validasi URL secara berkala

## Best Practices

1. **Hybrid Approach:** Gunakan base64 untuk file kecil, URL untuk file besar
2. **Compression:** Kompres gambar sebelum convert ke base64
3. **Validation:** Validasi tipe dan ukuran file di client dan server
4. **Caching:** Cache file data untuk mengurangi Firestore reads
5. **Cleanup:** Hapus file yang tidak terpakai secara berkala

## Migration Path

Jika nanti ingin upgrade ke Firebase Storage:

1. Export data dari `file_metadata` collection
2. Upload file ke Firebase Storage
3. Update referensi dari base64/URL ke Storage URL
4. Update security rules untuk Storage
5. Hapus base64 data dari Firestore

## Monitoring Usage

Pantau penggunaan Firestore di Firebase Console:
- **Firestore Usage:** Database > Usage tab
- **Authentication:** Authentication > Usage tab
- **Quotas:** Project Settings > Usage and billing

Jika mendekati limit, pertimbangkan:
- Optimasi query
- Caching di client
- Upgrade ke Blaze plan
- Migrasi ke alternatif lain
