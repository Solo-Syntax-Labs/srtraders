'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Truck, Shield, Cloud } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Invoice Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your truck load invoice management with our comprehensive solution. 
            Track invoices, manage documents, and organize product information all in one place.
          </p>
          <div className="space-x-4">
            <Link href="/auth/signin">
              <Button size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track truck load invoices with detailed product information and pricing
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Cloud className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Document Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Store documents in Supabase Storage or Google Drive with seamless integration
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Truck Load Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor truck arrivals, driver information, and delivery details
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Secure Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Google OAuth and credential-based authentication for secure access
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Invoice Management</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Create and manage truck load invoices</li>
                <li>• Track invoice status and payments</li>
                <li>• Add multiple products per invoice</li>
                <li>• Set project names and quality grades</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Document Handling</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Upload to Supabase Storage or Google Drive</li>
                <li>• Organize documents by invoice</li>
                <li>• Support for multiple file types</li>
                <li>• Secure access control</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Create your account today and streamline your invoice management process.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="px-8 py-3">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}