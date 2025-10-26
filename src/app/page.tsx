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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:shadow-green-500/70 transition-shadow">
                <span className="text-white text-lg sm:text-xl font-bold">SR</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-base sm:text-xl">SRTraders</h1>
                <p className="text-green-500 text-[10px] sm:text-xs">Steel Trading Platform</p>
              </div>
            </Link>

            {/* Right Side Navigation */}
            <div className="flex items-center gap-2 sm:gap-4">
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
                Got Steel Scrap?
                <span className="block text-green-500 mt-2 sm:mt-3">Trade it with us.</span>
          </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                Complete digital platform for steel traders, manufacturers, and logistics partners.
                Join us in building a sustainable future through circular economy.
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
                    "We endeavour to become a chemical powerhouse by growing in a globally competitive market 
                    with a focus on the environment and community by optimising the use of all available resources."
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
                    To enhance stakeholder value by innovating and diversifying into synergistic businesses 
                    while emphasising the <span className="text-green-400 font-semibold">4Rs (Reduce, Reuse, Recycle and Recover)</span> as 
                    we continue to practice social responsibility.
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
                Contact Us
              </Button>
            <Link href="/auth/signin" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-transparent border-green-500 text-green-500 hover:bg-green-500/10 w-full">
                  For Business
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mb-2">Our Eco-System Towards</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-green-500">Sustainability</span> & Circular Economy
            </h2>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Circular Diagram */}
            <div className="flex justify-center">
              <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
                {/* Center Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 sm:border-3 md:border-4 border-green-600 flex items-center justify-center shadow-2xl shadow-green-500/20">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">SR</div>
                      <div className="text-xs sm:text-sm text-green-500">Traders</div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Icons */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
                
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Recycle className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
                
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Factory className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>

                <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                  <circle
                    cx="200"
                    cy="200"
                    r="140"
                    fill="none"
                    stroke="rgb(34 197 94)"
                    strokeWidth="2"
                    strokeDasharray="10 5"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-300 space-y-4 sm:space-y-6 px-4 sm:px-0">
              <p className="text-base sm:text-lg leading-relaxed">
                <span className="text-green-500 font-semibold">SRTraders</span> with its deep understanding 
                of the steel trading ecosystem has developed sustainable strategies & digital solutions to 
                manage operations efficiently & cost-effectively.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Contributing to closing the loop of the steel supply chain & achieving a{' '}
                <span className="text-green-500 font-semibold">circular economy</span> while infusing{' '}
                <span className="text-green-500 font-semibold">sustainability</span> into business practices.
              </p>
              <div className="pt-2 sm:pt-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-4 sm:px-6">
                  Learn More →
                </Button>
              </div>
            </div>
          </div>

          {/* Target Audiences */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-600/20 flex items-center justify-center border-2 border-green-600">
                <Truck className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Empowering</h3>
              <h4 className="text-xl font-bold text-green-500 mb-3">Logistics Companies</h4>
              <p className="text-gray-400 text-sm">
                By providing comprehensive fleet management and real-time tracking to streamline operations.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-600/20 flex items-center justify-center border-2 border-green-600">
                <Factory className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Enabling</h3>
              <h4 className="text-xl font-bold text-green-500 mb-3">Steel Manufacturers</h4>
              <p className="text-gray-400 text-sm">
                To manage production, track inventory, and coordinate shipments with integrated systems.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-600/20 flex items-center justify-center border-2 border-green-600">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Supporting</h3>
              <h4 className="text-xl font-bold text-green-500 mb-3">Steel Traders</h4>
              <p className="text-gray-400 text-sm">
                With powerful tools for trading operations, pricing analytics, and secure documentation.
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
              Attaining <span className="text-green-500">sustainable solutions</span> with ease.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto">
                <TabsList className="inline-flex bg-gray-900/50 border border-gray-800 p-1 gap-1 flex-nowrap">
                  <TabsTrigger 
                    value="all" 
                    className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded transition-all whitespace-nowrap"
                  >
                    <span className="mr-1 sm:mr-2">☰</span>
                    <span className="hidden sm:inline">All services</span>
                    <span className="sm:hidden">All</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="individuals" 
                    className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded transition-all whitespace-nowrap"
                  >
                    <span className="mr-1 sm:mr-2">👤</span>
                    <span className="hidden sm:inline">For Individuals</span>
                    <span className="sm:hidden">Individuals</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="organisations" 
                    className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded transition-all whitespace-nowrap"
                  >
                    <span className="mr-1 sm:mr-2">🏢</span>
                    <span className="hidden sm:inline">For Organisations</span>
                    <span className="sm:hidden">Orgs</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* All Services Tab */}
              <TabsContent value="all">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Scrap Collection */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                        <Package className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Scrap Collection</h3>
                        <p className="text-gray-400 text-sm">
                          Digitised solution for the door-to-door free pickup of 40+ recyclables
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EPR Service */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">EPR Service</h3>
                        <p className="text-gray-400 text-sm">
                          The Kabadiwala as a registered PRO, official collection & recycling partner helps in the compliance process of EPR.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Zero Waste Services */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                        <Leaf className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Zero waste services</h3>
                        <p className="text-gray-400 text-sm">
                          Serving the Institutes/Offices/Events in achieving their zero waste goals.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Zero Waste Society */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                        <Home className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Zero Waste Society</h3>
                        <p className="text-gray-400 text-sm">
                          Serving the Residential Societies in achieving their zero waste goals.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shredding Service */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                        <FileStack className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Shredding service</h3>
                        <p className="text-gray-400 text-sm">
                          Aiding Businesses in the safe & secure disposal of their confidential documents.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dismantling Service */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30">
                        <Building className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Dismantling service</h3>
                        <p className="text-gray-400 text-sm">
                          Providing holistic approach to implement circular solutions to the scrap disposal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Scrapping Service */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/30">
                        <Truck className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Vehicle Scrapping Service</h3>
                        <p className="text-gray-400 text-sm">
                          Assisting people in getting rid of their old vehicles sustainably
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Circular Economy Services */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/30">
                        <Recycle className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Circular Economy Services</h3>
                        <p className="text-gray-400 text-sm">
                          Planning, designing, and successfully executing brand's CSR campaigns as per their objectives.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CSR Activity */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/30">
                        <Award className="w-6 h-6 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">CRS Activity</h3>
                        <p className="text-gray-400 text-sm">
                          Planning, designing, and successfully executing brand's CSR campaigns as per their objectives.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Material Recovery Facility */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/30">
                        <Warehouse className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Material Recovery Facility</h3>
                        <p className="text-gray-400 text-sm">
                          Collaborating to provide waste management services to ULB owned Material Recovery Facilities.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* IEC Activity */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center border border-teal-500/30">
                        <Target className="w-6 h-6 text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">IEC Activity</h3>
                        <p className="text-gray-400 text-sm">
                          Designing effective & innovative campaigns under IEC for bringing behavioral change in the masses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* For Individuals Tab */}
              <TabsContent value="individuals">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Scrap Collection */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                        <Package className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Scrap Collection</h3>
                        <p className="text-gray-400 text-sm">
                          Digitised solution for the door-to-door free pickup of 40+ recyclables
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Zero Waste Society */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                        <Home className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Zero Waste Society</h3>
                        <p className="text-gray-400 text-sm">
                          Serving the Residential Societies in achieving their zero waste goals.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Scrapping Service */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/30">
                        <Truck className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Vehicle Scrapping Service</h3>
                        <p className="text-gray-400 text-sm">
                          Assisting people in getting rid of their old vehicles sustainably
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* For Organisations Tab */}
              <TabsContent value="organisations">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* EPR Service */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">EPR Service</h3>
                        <p className="text-gray-400 text-sm">
                          The Kabadiwala as a registered PRO, official collection & recycling partner helps in the compliance process of EPR.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shredding Service */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                        <FileStack className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Shredding service</h3>
                        <p className="text-gray-400 text-sm">
                          Aiding Businesses in the safe & secure disposal of their confidential documents.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Circular Economy Services */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/30">
                        <Recycle className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Circular Economy Services</h3>
                        <p className="text-gray-400 text-sm">
                          Planning, designing, and successfully executing brand's CSR campaigns as per their objectives.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Zero Waste Services */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                        <Leaf className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Zero waste services</h3>
                        <p className="text-gray-400 text-sm">
                          Serving the Institutes/Offices/Events in achieving their zero waste goals.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dismantling Service */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30">
                        <Building className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Dismantling service</h3>
                        <p className="text-gray-400 text-sm">
                          Providing holistic approach to implement circular solutions to the scrap disposal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CSR Activity */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/30">
                        <Award className="w-6 h-6 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">CRS Activity</h3>
                        <p className="text-gray-400 text-sm">
                          Planning, designing, and successfully executing brand's CSR campaigns as per their objectives.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Material Recovery Facility */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/30">
                        <Warehouse className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">Material Recovery Facility</h3>
                        <p className="text-gray-400 text-sm">
                          Collaborating to provide waste management services to ULB owned Material Recovery Facilities.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* IEC Activity */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center border border-teal-500/30">
                        <Target className="w-6 h-6 text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">IEC Activity</h3>
                        <p className="text-gray-400 text-sm">
                          Designing effective & innovative campaigns under IEC for bringing behavioral change in the masses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-12">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                onClick={scrollToContact}
              >
                Contact Us
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
                          S.No/11A, Utchir magaliamman kovil Street,<br />
                          Kayalpattinam - 628204,<br />
                          Tamil Nadu, India
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
                <li><Link href="#" className="hover:text-green-500 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">Contact</Link></li>
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
                <li><Link href="#" className="hover:text-green-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">Cookie Policy</Link></li>
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
