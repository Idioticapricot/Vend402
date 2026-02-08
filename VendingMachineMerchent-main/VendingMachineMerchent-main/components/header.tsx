"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthModal } from "./auth-modal"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, UserIcon, Settings, Wallet } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { isConnected, requestAccess } from "@stellar/freighter-api"

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<any>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchWalletBalance = async (address: string) => {
    try {
      const response = await fetch(`/api/wallet/balance?address=${address}`)
      const data = await response.json()
      if (response.ok) {
        setWalletBalance(data.balance)
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        // Get user from database
        const userResponse = await fetch(`/api/user?email=${session.user.email}`)
        const userData = await userResponse.json()
        if (userData.user) {
          setDbUser(userData.user)
          fetchWalletBalance(userData.user.wallet_address)
        }
      }

      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (event === "SIGNED_IN" && session?.user) {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: session.user })
        })
        const userData = await response.json()
        setDbUser(userData.user)
        if (userData.user?.wallet_address) {
          fetchWalletBalance(userData.user.wallet_address)
        }
        setIsAuthModalOpen(false)
      } else if (event === "SIGNED_OUT") {
        setDbUser(null)
        setWalletBalance(null)
        toast.success("Successfully signed out!")
        router.push("/")
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error("Failed to sign out")
        console.error("Sign out error:", error)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Sign out error:", error)
    }
  }

  const getUserInitials = (user: User) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
    }
    return user.email?.charAt(0).toUpperCase() || "U"
  }

  const getUserDisplayName = (user: User) => {
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  return (
    <>
      <header className="border-b border-slate-800 bg-[#0B1121]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group pl-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Wallet className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Vend402</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {/* Navigation items removed as requested */}
          </nav>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <>
                {dbUser && (
                  <div className="hidden md:flex items-center space-x-2 bg-background/50 rounded-lg px-3 py-2">
                    {dbUser.is_custodial ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                        onClick={async () => {
                          try {
                            const isFreighterConnected = await isConnected()
                            if (!isFreighterConnected) {
                              toast.error("Freighter wallet not found. Please install it.")
                              return
                            }
                            const accessObj = await requestAccess()
                            if (accessObj.error) {
                              console.error("Freighter access error:", accessObj.error)
                              toast.error("Access denied: " + accessObj.error)
                              return
                            }

                            const walletAddress = accessObj.address
                            console.log("Freighter connected, address:", walletAddress)

                            const response = await fetch('/api/user/wallet', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                email: user.email,
                                walletAddress
                              })
                            })

                            const data = await response.json()

                            if (response.ok) {
                              setDbUser(prev => ({
                                ...prev,
                                wallet_address: walletAddress,
                                is_custodial: false
                              }))
                              fetchWalletBalance(walletAddress)
                              toast.success("Wallet connected successfully!")
                            } else {
                              console.error("API Error updating wallet:", data)
                              toast.error("Failed to save wallet: " + (data.error || "Unknown error"))
                            }
                          } catch (error) {
                            console.error("Wallet connection error details:", error)
                            toast.error("Connection failed. Check console for details.")
                          }
                        }}
                      >
                        <Wallet className="h-3 w-3 mr-2" />
                        Connect Wallet
                      </Button>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div className="font-mono text-xs text-muted-foreground">
                            {dbUser.wallet_address?.slice(0, 8)}...{dbUser.wallet_address?.slice(-6)}
                          </div>
                          <div className="font-medium">
                            {walletBalance !== null ? `${walletBalance.toFixed(2)} XLM` : 'Loading...'}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || "/placeholder.svg"}
                          alt={getUserDisplayName(user)}
                        />
                        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{getUserDisplayName(user)}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                        {dbUser && (
                          <>
                            <p className="text-xs font-mono text-muted-foreground mt-1">
                              {dbUser.wallet_address?.slice(0, 12)}...{dbUser.wallet_address?.slice(-8)}
                            </p>
                            <p className="text-xs font-medium text-green-600">
                              {walletBalance !== null ? `${walletBalance.toFixed(4)} XLM` : 'Loading...'}
                            </p>

                            {dbUser.is_custodial && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2 h-7 text-xs"
                                onClick={async (e) => {
                                  // ... existing click handler ...
                                  e.preventDefault()
                                  try {
                                    const isFreighterConnected = await isConnected()
                                    if (!isFreighterConnected) {
                                      toast.error("Freighter wallet not found. Please install it.")
                                      return
                                    }
                                    const accessObj = await requestAccess()
                                    if (accessObj.error) {
                                      toast.error(accessObj.error)
                                      return
                                    }
                                    const walletAddress = accessObj.address

                                    const response = await fetch('/api/user/wallet', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        email: user.email,
                                        walletAddress
                                      })
                                    })

                                    if (response.ok) {
                                      setDbUser(prev => ({
                                        ...prev,
                                        wallet_address: walletAddress,
                                        is_custodial: false
                                      }))
                                      fetchWalletBalance(walletAddress)
                                      toast.success("Wallet connected successfully!")
                                    }
                                  } catch (error) {
                                    console.error("Wallet connection error:", error)
                                  }
                                }}
                              >
                                <Wallet className="w-3 h-3 mr-2" />
                                Connect Freighter
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>Login</Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
