# Firebase API Key Error - Panduan Lengkap

## Error yang Terjadi

\`\`\`
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
\`\`\`

## Penyebab Umum

1. **API Key tidak diset** - Environment variable kosong atau tidak ada
2. **API Key salah** - Copy-paste yang salah atau typo
3. **API Key expired** - Key sudah tidak aktif
4. **Nama environment variable salah** - Typo di nama variable
5. **Firebase project tidak aktif** - Project di-disable atau dihapus

## Langkah Perbaikan

### Step 1: Cek Firebase Console

1. **Buka Firebase Console**: https://console.firebase.google.com
2. **Pilih project Anda** (atau buat project baru jika belum ada)
3. **Pastikan project aktif** - tidak ada warning atau error

### Step 2: Dapatkan Konfigurasi yang Benar

1. **Di Firebase Console**, klik ⚙️ **Settings** → **Project settings**
2. **Scroll ke bawah** ke section "Your apps"
3. **Jika belum ada Web App**:
   - Klik **Add app** → pilih **Web** (</> icon)
   - Beri nama app (contoh: "My Web App")
   - **Jangan** centang "Also set up Firebase Hosting"
   - Klik **Register app**

4. **Copy konfigurasi**:
   \`\`\`javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...", // ← Copy ini
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456",
     measurementId: "G-XXXXXXXXXX"
   };
   \`\`\`

### Step 3: Update Environment Variables

1. **Buka file `.env.local`** di root project Anda
2. **Hapus semua** NEXT_PUBLIC_FIREBASE_* variables yang lama
3. **Tambahkan konfigurasi baru**:

\`\`\`bash
# Firebase Configuration - COPY DARI FIREBASE CONSOLE
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-your-actual-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

### Step 4: Validasi Format

Pastikan format setiap field benar:

- **API_KEY**: Harus dimulai dengan `AIza` dan panjang ~39 karakter
- **AUTH_DOMAIN**: Harus berakhir dengan `.firebaseapp.com`
- **PROJECT_ID**: Nama project, tanpa spasi
- **STORAGE_BUCKET**: Harus berakhir dengan `.appspot.com`
- **MESSAGING_SENDER_ID**: Hanya angka, ~12 digit
- **APP_ID**: Format `1:number:web:string`
- **MEASUREMENT_ID**: Dimulai dengan `G-` (opsional)

### Step 5: Restart Development Server

\`\`\`bash
# Stop server (Ctrl+C)
# Kemudian start lagi
npm run dev
# atau
yarn dev
\`\`\`

### Step 6: Test Konfigurasi

Gunakan **Firebase Debug** component di aplikasi untuk memvalidasi semua konfigurasi.

## Troubleshooting Lanjutan

### Jika API Key Masih Invalid

1. **Generate API Key Baru**:
   - Firebase Console → Project Settings
   - Tab **General** → Web API Key
   - Klik **Regenerate** jika perlu

2. **Cek Restrictions**:
   - Google Cloud Console → APIs & Services → Credentials
   - Cari API key Anda
   - Pastikan tidak ada restriction yang memblokir

### Jika Project Tidak Ditemukan

1. **Cek Project Status**:
   - Pastikan project tidak di-suspend
   - Cek billing account jika menggunakan paid features

2. **Cek Permissions**:
   - Pastikan Anda punya akses ke project
   - Minta owner untuk add Anda sebagai editor

### Jika Authentication Tidak Aktif

1. **Enable Authentication**:
   - Firebase Console → Authentication
   - Klik **Get started**
   - Tab **Sign-in method**
   - Enable **Email/Password**

## Validasi Akhir

Setelah semua langkah di atas:

1. ✅ **Firebase Debug** component menunjukkan semua field valid
2. ✅ **Firebase Setup Wizard** berhasil connect
3. ✅ **Authentication** bisa register/login tanpa error
4. ✅ **Firestore** bisa read/write data

## Common Mistakes

❌ **Salah**:
\`\`\`bash
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC..." # Jangan pakai quotes
FIREBASE_API_KEY=AIzaSyC...              # Kurang NEXT_PUBLIC_
NEXT_PUBLIC_FIREBASE_APIKEY=AIzaSyC...   # Kurang underscore
\`\`\`

✅ **Benar**:
\`\`\`bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
\`\`\`

## Backup Plan

Jika masih bermasalah, buat project Firebase baru:

1. **Buat project baru** di Firebase Console
2. **Setup Authentication** dan **Firestore**
3. **Dapatkan konfigurasi baru**
4. **Update environment variables**
5. **Test dengan project baru**

## Contact Support

Jika semua langkah sudah dicoba tapi masih error:

1. **Screenshot** Firebase Debug component
2. **Copy** error message lengkap
3. **Cek** Firebase Console untuk error messages
4. **Pastikan** tidak ada typo di environment variables

Dengan mengikuti panduan ini, error API key seharusnya teratasi! 🔥
