'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Truck, 
  Shield, 
  Users,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Building2, 
  Factory, 
  Package,
  Recycle,
  FileCheck,
  Warehouse,
  Award,
  Leaf,
  Target,
  UserCheck,
  Home,
  Building,
  FileStack
} from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your inquiry! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', company: '', message: '' })
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <Image
                  src="/srtraders-logo.png"
                  alt="SRTraders Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-white font-bold text-base sm:text-xl">SRTraders</h1>
                <p className="text-green-500 text-[10px] sm:text-xs">Scrap Buyers & Dealers</p>
              </div>
            </Link>

            {/* Right Side Navigation */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/about">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hidden md:inline-flex text-sm sm:text-base px-2 sm:px-4"
                >
                  About Us
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hidden sm:inline-flex text-sm sm:text-base px-2 sm:px-4"
                onClick={scrollToContact}
              >
                Contact
              </Button>
              <Link href="/auth/signin">
                <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10 text-xs sm:text-base px-3 sm:px-4 py-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="hidden sm:block">
                <Button className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-base px-3 sm:px-4">
                  For Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-visible mt-16">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-28">
          <div className="max-w-6xl mx-auto">
            {/* Main Heading */}
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                SR Traders — 
                <span className="block text-green-500 mt-2 sm:mt-3">Trusted Scrap Buyers in Tamil Nadu</span>
          </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                We buy, process, and supply all types of ferrous and non-ferrous scrap with transparent pricing, on-time pickup, and complete GST compliance.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-12 max-w-5xl mx-auto">
              {/* Mission Card */}
              <div className="group relative bg-gradient-to-br from-green-600/10 to-green-800/5 backdrop-blur-sm border border-green-600/30 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 hover:border-green-500/50 transition-all duration-300 min-h-[140px] sm:min-h-[160px]">
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-green-500/20 group-hover:text-green-500/30 transition-colors">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4 bg-green-600/20 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-green-400 font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">Our Mission</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base pr-6 sm:pr-8 md:pr-0">
                    "To build a cleaner and more sustainable environment by offering efficient scrap collection and recycling solutions that benefit both our clients and the community."
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="group relative bg-gradient-to-br from-blue-600/10 to-blue-800/5 backdrop-blur-sm border border-blue-600/30 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 hover:border-blue-500/50 transition-all duration-300 min-h-[140px] sm:min-h-[160px]">
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-blue-500/20 group-hover:text-blue-500/30 transition-colors">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4 bg-blue-600/20 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <h3 className="text-blue-400 font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">Our Vision</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base pr-6 sm:pr-8 md:pr-0">
                    "To become Tamil Nadu's most reliable and eco-friendly scrap trading company — providing transparent pricing, fast logistics, and sustainable recycling for a better tomorrow."
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:shadow-green-600/40 transition-all w-full sm:w-auto"
                onClick={scrollToContact}
              >
                Sell Your Scrap
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-transparent border-green-500 text-green-500 hover:bg-green-500/10 w-full sm:w-auto"
                onClick={scrollToContact}
              >
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              About <span className="text-green-500">SR Traders</span>
            </h2>
            <div className="text-gray-300 space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed">
              <p>
                <span className="text-green-500 font-semibold">SR Traders</span> is a Tuticorin-based scrap trading company operating across Tamil Nadu. 
                We specialize in buying and recycling <span className="text-white font-medium">metal scrap</span>, <span className="text-white font-medium">industrial scrap</span>, and <span className="text-white font-medium">machinery waste</span>, 
                offering transparent rates and professional service for every transaction.
              </p>
              <p>
                With years of experience, our company ensures <span className="text-green-500 font-medium">timely pickups</span>, 
                proper weighing, and <span className="text-green-500 font-medium">instant payments</span> — making us a trusted partner 
                for factories, industries, and local traders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Geographic Presence */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              <span className="text-white">Our </span>
              <span className="text-green-500">Presence</span>
              <span className="text-white"> Across Tamil Nadu</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-green-500 font-semibold mb-2">In India</p>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg px-4">
              SRTraders has established its services in{' '}
              <span className="text-green-500 font-semibold">15 major cities of Tamil Nadu</span>{' '}
              and is now expanding its reach in other parts of the state.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8">
              {['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 
                'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Thanjavur', 
                'Dindigul', 'Kanchipuram', 'Karur', 'Nagercoil', 'Tirunelveli'].map((city) => (
                <div 
                  key={city}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-green-600/10 border border-green-600/30 rounded-full text-green-500 font-medium hover:bg-green-600/20 transition-colors text-sm sm:text-base"
                >
                  {city}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Our Services
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Comprehensive scrap trading solutions for all your needs.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12">

              {/* Scrap Collection & Procurement */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 sm:p-8 hover:border-green-600/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">Scrap Collection & Procurement</h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      We buy ferrous and non-ferrous scrap directly from factories, construction sites, and local dealers with fair pricing and immediate payment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Transportation & Logistics */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 sm:p-8 hover:border-green-600/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30">
                    <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">Transportation & Logistics</h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      With GPS-enabled vehicles, we provide on-time collection and safe transportation for all types of scrap materials.
                    </p>
                  </div>
                </div>
              </div>

              {/* Processing & Sorting */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 sm:p-8 hover:border-green-600/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/30">
                    <Recycle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">Processing & Sorting</h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      All collected scrap is properly sorted, graded, and processed to meet industrial recycling standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Industrial & Bulk Supply */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 sm:p-8 hover:border-green-600/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/30">
                    <Factory className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">Industrial & Bulk Supply</h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      We supply graded scrap materials to foundries, smelting units, and recycling industries across Tamil Nadu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Why Choose <span className="text-green-500">SR Traders</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                Your trusted partner for all scrap trading needs
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 p-4 sm:p-6 bg-black/30 rounded-lg border border-gray-800 hover:border-green-600/50 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Transparent Digital Weighing</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Accurate measurements you can trust</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 p-4 sm:p-6 bg-black/30 rounded-lg border border-gray-800 hover:border-green-600/50 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Competitive Pricing</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Best rates in the market</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 p-4 sm:p-6 bg-black/30 rounded-lg border border-gray-800 hover:border-green-600/50 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Immediate Payments</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Cash, Bank Transfer, or UPI</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-4 p-4 sm:p-6 bg-black/30 rounded-lg border border-gray-800 hover:border-green-600/50 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Reliable Pickup Service</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">On-time collection guaranteed</p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="flex items-start gap-4 p-4 sm:p-6 bg-black/30 rounded-lg border border-gray-800 hover:border-green-600/50 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">GST-Compliant Invoices</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Full documentation for every transaction</p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="flex items-start gap-4 p-4 sm:p-6 bg-black/30 rounded-lg border border-gray-800 hover:border-green-600/50 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Environmental Responsibility</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Sustainable recycling practices</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                onClick={scrollToContact}
              >
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Showcase */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Trusted by Leading
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-green-500 font-semibold mb-2">Steel Industry Partners</p>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg px-4">
              Collaborating with industry leaders to drive excellence in steel trading
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Partners Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-center">
              {/* Agni Steels */}
              <a 
                href="https://agnisteels.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-16 sm:h-20 md:h-24 relative flex items-center justify-center">
                  <Image
                    src="/partners/agnisteels.png"
                    alt="Agni Steels"
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                  />
                </div>
              </a>

              {/* Arise Steel */}
              <a 
                href="https://www.arisesteel.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-16 sm:h-20 md:h-24 relative flex items-center justify-center">
                  <Image
                    src="/partners/arisesteel-.png"
                    alt="Arise Steel"
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                  />
                </div>
              </a>

              {/* Metstar */}
              <a 
                href="https://metstar.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-16 sm:h-20 md:h-24 relative flex items-center justify-center">
                  <Image
                    src="/partners/metstar.png"
                    alt="Metstar Industries"
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                  />
                </div>
              </a>

              {/* Ambica Steels */}
              <a 
                href="https://ambicasteels.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-16 sm:h-20 md:h-24 relative flex items-center justify-center">
                  <Image
                    src="/partners/ambicasteels.png"
                    alt="Ambica Steels"
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                  />
                </div>
              </a>

              {/* DCW Limited */}
              <a 
                href="https://dcwltd.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-16 sm:h-20 md:h-24 relative flex items-center justify-center">
                  <Image
                    src="/partners/dcw_ltd_logo.jpg"
                    alt="DCW Limited"
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                  />
                </div>
              </a>

              {/* NLC India */}
              <a 
                href="https://www.nlcindia.in/website/en/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-16 sm:h-20 md:h-24 relative flex items-center justify-center">
                  <Image
                    src="/partners/nlcindia.webp"
                    alt="NLC India Limited"
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                  />
                </div>
              </a>

              {/* VinFast Auto */}
              <a 
                href="https://vinfastauto.in/en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-16 sm:h-20 md:h-24 relative flex items-center justify-center">
                  <Image
                    src="/partners/VinFast.jpg"
                    alt="VinFast Auto India"
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                  />
                </div>
              </a>
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <p className="text-gray-500 text-sm sm:text-base">
                And many more industry partners across Tamil Nadu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Get in Touch <span className="text-green-500">With Us</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                Any question or remarks? Just write us a message!
              </p>
        </div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
              {/* Contact Form */}
              <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
            <CardHeader>
                  <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fill up the form and our Team will get back to you within 24 hours
                  </CardDescription>
            </CardHeader>
            <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Your full name"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="your@email.com"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="+91 XXX XXX XXXX"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-gray-300">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your company name"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-300">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="Tell us about your requirements..."
                        rows={4}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      Send Message
                    </Button>
                  </form>
            </CardContent>
          </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-600/10 rounded-lg border border-green-600/30">
                        <Phone className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-white">Phone</h3>
                        <a href="tel:+919092473805" className="text-gray-300 hover:text-green-500 transition-colors">
                          +91 - 9092473805
                        </a>
                        <p className="text-sm text-gray-500 mt-1">Mon-Fri 9am to 6pm</p>
                      </div>
                    </div>
            </CardContent>
          </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-600/10 rounded-lg border border-green-600/30">
                        <Mail className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-white">Email</h3>
                        <a href="mailto:info@Srtraders.co.in" className="text-gray-300 hover:text-green-500 transition-colors">
                          info@Srtraders.co.in
                        </a>
                        <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                      </div>
                    </div>
            </CardContent>
          </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-600/10 rounded-lg border border-green-600/30">
                        <MapPin className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-white">Office</h3>
                        <p className="text-gray-300">
                          S R TRADERS<br />
                          111/A Utchini Magaliamman Kovil Street,<br />
                          Kayalpattinam, Tuticorin - 628204,<br />
                          Tamil Nadu, India<br />
                          <span className="text-xs text-gray-400 mt-1 block">GSTIN/UIN: 33APHPR5704E1Z2</span>
                          <span className="text-xs text-gray-400 mt-1 block">Code: 33</span>
                        </p>
                      </div>
                    </div>
            </CardContent>
          </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4">SRTraders</h3>
              <p className="text-xs sm:text-sm">
                Transforming steel trading with digital innovation and sustainable practices.
              </p>
        </div>

            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link href="/auth/signin" className="hover:text-green-500 transition-colors">Sign In</Link></li>
                <li><Link href="/about" className="hover:text-green-500 transition-colors">About Us</Link></li>
                <li><button onClick={scrollToContact} className="hover:text-green-500 transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Services</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link href="#" className="hover:text-green-500 transition-colors">Scrap Collection</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">EPR Services</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">Zero Waste</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">CSR Activity</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Legal</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link href="/privacy-policy" className="hover:text-green-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-green-500 transition-colors">Terms & Conditions</Link></li>
              </ul>
          </div>
        </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            <p>&copy; 2025 SRTraders. All rights reserved. Made with ❤️ in India, for the World</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
