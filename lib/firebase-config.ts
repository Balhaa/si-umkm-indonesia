import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Default configuration using your Firebase project
const defaultConfig: FirebaseConfig = {
  apiKey: "AIzaSyDt_juz6iHiv3v7wX0wQAd-HrEanrpA34o",
  authDomain: "si-umkm-indonesia-e712b.firebaseapp.com",
  projectId: "si-umkm-indonesia-e712b",
  storageBucket: "si-umkm-indonesia-e712b.firebasestorage.app",
  messagingSenderId: "456055407759",
  appId: "1:456055407759:web:6748715a14fc7c924edcfa",
  measurementId: "G-XY3YT9H9ZS",
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

export function initializeFirebase(config?: FirebaseConfig): {
  app: FirebaseApp
  auth: Auth
  db: Firestore
} {
  try {
    const firebaseConfig = config || defaultConfig

    // Validate required fields
    const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
    const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof FirebaseConfig])

    if (missingFields.length > 0) {
      throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(", ")}`)
    }

    // Initialize Firebase app if not already initialized
    if (!app || getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }

    // Initialize services
    if (!auth) {
      auth = getAuth(app)
    }

    if (!db) {
      db = getFirestore(app)
    }

    return { app, auth, db }
  } catch (error) {
    console.error("Firebase initialization failed:", error)
    throw error
  }
}

// Export individual services with lazy initialization
export function getFirebaseAuth(): Auth {
  if (!auth) {
    const { auth: newAuth } = initializeFirebase()
    return newAuth
  }
  return auth
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    const { db: newDb } = initializeFirebase()
    return newDb
  }
  return db
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const { app: newApp } = initializeFirebase()
    return newApp
  }
  return app
}

// Test connection function
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const { auth, db } = initializeFirebase()

    // Test auth connection
    if (!auth) {
      throw new Error("Auth service not initialized")
    }

    // Test firestore connection
    if (!db) {
      throw new Error("Firestore service not initialized")
    }

    return true
  } catch (error) {
    console.error("Firebase connection test failed:", error)
    return false
  }
}
