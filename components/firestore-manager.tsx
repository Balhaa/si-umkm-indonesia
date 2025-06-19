"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Database, Trash2, Edit, Save, X } from "lucide-react"
import { getFirebaseDb } from "@/lib/firebase-config"
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore"

interface Post {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: any
  updatedAt: any
}

interface FirestoreManagerProps {
  userId: string
  userName: string
}

export default function FirestoreManager({ userId, userName }: FirestoreManagerProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  })

  const [editPost, setEditPost] = useState({
    title: "",
    content: "",
  })

  useEffect(() => {
    const db = getFirebaseDb()
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[]

      setPosts(postsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError("Title dan content harus diisi")
      return
    }

    try {
      const db = getFirebaseDb()
      await addDoc(collection(db, "posts"), {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        authorId: userId,
        authorName: userName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      setSuccess("Post berhasil ditambahkan!")
      setNewPost({ title: "", content: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Add post error:", error)
      setError("Gagal menambahkan post")
    }
  }

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    setError("")
    setSuccess("")

    if (!editPost.title.trim() || !editPost.content.trim()) {
      setError("Title dan content harus diisi")
      return
    }

    try {
      const db = getFirebaseDb()
      await updateDoc(doc(db, "posts", editingId), {
        title: editPost.title.trim(),
        content: editPost.content.trim(),
        updatedAt: serverTimestamp(),
      })

      setSuccess("Post berhasil diupdate!")
      setEditingId(null)
      setEditPost({ title: "", content: "" })
    } catch (error) {
      console.error("Update post error:", error)
      setError("Gagal mengupdate post")
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Yakin ingin menghapus post ini?")) return

    setError("")
    setSuccess("")

    try {
      const db = getFirebaseDb()
      await deleteDoc(doc(db, "posts", postId))
      setSuccess("Post berhasil dihapus!")
    } catch (error) {
      console.error("Delete post error:", error)
      setError("Gagal menghapus post")
    }
  }

  const startEdit = (post: Post) => {
    setEditingId(post.id)
    setEditPost({
      title: post.title,
      content: post.content,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditPost({ title: "", content: "" })
  }

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "Unknown"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading posts...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Firestore Data Manager
          </CardTitle>
          <CardDescription>Kelola data posts di Firestore database</CardDescription>
        </CardHeader>
        <CardContent>
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Post Baru
            </Button>
          ) : (
            <form onSubmit={handleAddPost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-title">Title</Label>
                <Input
                  id="new-title"
                  value={newPost.title}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Masukkan judul post"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-content">Content</Label>
                <Textarea
                  id="new-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Masukkan isi post"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Post
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Batal
                </Button>
              </div>
            </form>
          )}

          {/* Status Messages */}
          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Posts ({posts.length})</h3>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Belum ada posts. Tambahkan post pertama Anda!
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                {editingId === post.id ? (
                  <form onSubmit={handleEditPost} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-title-${post.id}`}>Title</Label>
                      <Input
                        id={`edit-title-${post.id}`}
                        value={editPost.title}
                        onChange={(e) => setEditPost((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`edit-content-${post.id}`}>Content</Label>
                      <Textarea
                        id={`edit-content-${post.id}`}
                        value={editPost.content}
                        onChange={(e) => setEditPost((prev) => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Update
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
                        <X className="mr-2 h-4 w-4" />
                        Batal
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-semibold">{post.title}</h4>
                      <div className="flex gap-1">
                        {post.authorId === userId && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => startEdit(post)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{post.authorName}</Badge>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      {post.updatedAt && post.createdAt !== post.updatedAt && (
                        <span className="text-xs">Edited: {formatDate(post.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
