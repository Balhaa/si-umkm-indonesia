"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Menu, User, LogOut, Shield } from "lucide-react"

interface NavbarProps {
  user: any
  userType?: "admin" | "umkm" | null
  onLoginClick: () => void
  onRegisterClick: () => void
  currentPage: string
  onPageChange: (page: string) => void
  onSignOut?: () => void
}

export default function Navbar({
  user,
  userType,
  onLoginClick,
  onRegisterClick,
  currentPage,
  onPageChange,
  onSignOut,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = () => {
    onSignOut?.()
  }

  const navItems = [
    { id: "beranda", label: "Beranda" },
    { id: "produk", label: "Produk" },
    { id: "pelatihan", label: "Program Pelatihan" },
    { id: "tentang", label: "Tentang" },
  ]

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            onPageChange(item.id)
            if (mobile) setIsOpen(false)
          }}
          className={`${
            mobile ? "block w-full text-left px-4 py-2" : "px-3 py-2"
          } text-sm font-medium transition-colors hover:text-blue-600 ${
            currentPage === item.id ? "text-blue-600" : "text-gray-700"
          }`}
        >
          {item.label}
        </button>
      ))}
    </>
  )

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SI UMKM Indonesia</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLinks />
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard Button */}
                <button
                  onClick={() => onPageChange("dashboard")}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                    currentPage === "dashboard" ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {userType === "admin" ? (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Dashboard</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </>
                  )}
                </button>

                {/* Profile Button */}
                <button
                  onClick={() => onPageChange("profil")}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                    currentPage === "profil" ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profil</span>
                </button>

                {/* Logout Button */}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={onLoginClick}>
                  Masuk
                </Button>
                <Button size="sm" onClick={onRegisterClick}>
                  Daftar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <NavLinks mobile />

                  {user ? (
                    <div className="border-t pt-4 space-y-2">
                      {/* Dashboard Button Mobile */}
                      <button
                        onClick={() => {
                          onPageChange("dashboard")
                          setIsOpen(false)
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                      >
                        {userType === "admin" ? (
                          <>
                            <Shield className="h-4 w-4" />
                            <span>Dashboard Admin</span>
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4" />
                            <span>Dashboard</span>
                          </>
                        )}
                      </button>

                      {/* Profile Button Mobile */}
                      <button
                        onClick={() => {
                          onPageChange("profil")
                          setIsOpen(false)
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                      >
                        <User className="h-4 w-4" />
                        <span>Profil</span>
                      </button>

                      {/* Logout Button Mobile */}
                      <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Keluar
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t pt-4 space-y-2">
                      <Button variant="ghost" size="sm" onClick={onLoginClick} className="w-full">
                        Masuk
                      </Button>
                      <Button size="sm" onClick={onRegisterClick} className="w-full">
                        Daftar
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
