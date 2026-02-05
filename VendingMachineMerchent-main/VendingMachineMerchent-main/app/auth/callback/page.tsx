"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed')
          router.push('/')
          return
        }

        if (data.session) {
          await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: data.session.user })
          })
          toast.success('Successfully signed in!')
          router.push('/dashboard')
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        toast.error('An unexpected error occurred')
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}
