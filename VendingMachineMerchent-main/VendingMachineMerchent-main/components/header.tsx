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
        toast.success("Successfully signed in!")
        router.push("/dashboard")
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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
            <span className="text-xl font-bold">Algorandi</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <>
                {dbUser && (
                  <div className="hidden md:flex items-center space-x-2 bg-background/50 rounded-lg px-3 py-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-mono text-xs text-muted-foreground">
                        {dbUser.wallet_address?.slice(0, 8)}...{dbUser.wallet_address?.slice(-6)}
                      </div>
                      <div className="font-medium">
                        {walletBalance !== null ? `${walletBalance.toFixed(2)} ALGO` : 'Loading...'}
                      </div>
                    </div>
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
                            <p className="text-xs font-mono text-muted-foreground">
                              {dbUser.wallet_address?.slice(0, 12)}...{dbUser.wallet_address?.slice(-8)}
                            </p>
                            <p className="text-xs font-medium text-green-600">
                              {walletBalance !== null ? `${walletBalance.toFixed(4)} ALGO` : 'Loading balance...'}
                            </p>
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
