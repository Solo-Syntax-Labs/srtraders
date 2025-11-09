'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Target, TrendingUp, ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
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
              <Link href="/">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white text-sm sm:text-base px-2 sm:px-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10 text-xs sm:text-base px-3 sm:px-4 py-2">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
                About <span className="text-green-500">SR Traders</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
                Your trusted partner for sustainable scrap trading in Tamil Nadu
              </p>
            </div>

            {/* Our Story Section */}
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center sm:text-left">
                <span className="text-green-500">Our</span> Story
              </h2>
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                  <span className="text-green-500 font-semibold">SR Traders</span> is a Tuticorin-based scrap trading company operating across Tamil Nadu. 
                  We specialize in buying and recycling <span className="text-white font-medium">metal scrap</span>, <span className="text-white font-medium">industrial scrap</span>, and <span className="text-white font-medium">machinery waste</span>, 
                  offering transparent rates and professional service for every transaction.
                </p>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  With years of experience, our company ensures <span className="text-green-500 font-medium">timely pickups</span>, 
                  proper weighing, and <span className="text-green-500 font-medium">instant payments</span> — making us a trusted partner 
                  for factories, industries, and local traders throughout the region.
                </p>
              </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
                Our <span className="text-green-500">Mission & Vision</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {/* Mission */}
                <div className="group relative bg-gradient-to-br from-green-600/10 to-green-800/5 backdrop-blur-sm border border-green-600/30 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-green-500/20 group-hover:text-green-500/30 transition-colors">
                    <Target className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 mb-4 bg-green-600/20 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="text-green-400 font-bold text-sm uppercase tracking-wider">Our Mission</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg pr-8">
                      "To build a cleaner and more sustainable environment by offering efficient scrap collection and recycling solutions that benefit both our clients and the community."
                    </p>
                  </div>
                </div>

                {/* Vision */}
                <div className="group relative bg-gradient-to-br from-blue-600/10 to-blue-800/5 backdrop-blur-sm border border-blue-600/30 rounded-2xl p-6 sm:p-8 hover:border-blue-500/50 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-blue-500/20 group-hover:text-blue-500/30 transition-colors">
                    <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 mb-4 bg-blue-600/20 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider">Our Vision</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg pr-8">
                      "To become Tamil Nadu's most reliable and eco-friendly scrap trading company — providing transparent pricing, fast logistics, and sustainable recycling for a better tomorrow."
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Leadership Section */}
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
                <span className="text-green-500">Leadership</span> & Legacy
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                {/* S. Rajendran */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-600/50 transition-all">
                  <div className="relative h-80 sm:h-96 bg-gradient-to-b from-gray-800 to-gray-900">
                    <Image
                      src="/team/rajendran.png"
                      alt="S. Rajendran - Chairman & Managing Director"
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">S. Rajendran</h3>
                    <p className="text-green-500 font-semibold mb-4 text-sm sm:text-base">Chairman & Managing Director</p>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      With decades of experience and strong business leadership, Mr. S. Rajendran has been the driving force behind SR Traders. 
                      Under his guidance, the company has built a reputation for trust, transparency, and long-term partnerships across Tamil Nadu. 
                      His vision focuses on creating a sustainable and organized scrap trading network while ensuring fair value for clients and the community.
                    </p>
                  </div>
                </div>

                {/* V. Sermadurai */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-600/50 transition-all">
                  <div className="relative h-80 sm:h-96 bg-gradient-to-b from-gray-800 to-gray-900">
                    <Image
                      src="/team/sermadurai.png"
                      alt="V. Sermadurai - Founder's Guide & Business Mentor"
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">V. Sermadurai</h3>
                    <p className="text-green-500 font-semibold mb-4 text-sm sm:text-base">Founder's Guide & Business Mentor (Late)</p>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      The late Mr. V. Sermadurai served as a guiding light for SR Traders. His traditional business values, discipline, and community commitment 
                      continue to inspire the company's growth. His vision of honesty, consistency, and respect for customers remains the foundation on which 
                      SR Traders operates today.
                    </p>
                  </div>
                </div>

                {/* R Bala Subramanian */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-600/50 transition-all">
                  <div className="relative h-80 sm:h-96 bg-gradient-to-b from-gray-800 to-gray-900">
                    <Image
                      src="/team/bala-subramanian.png"
                      alt="R Bala Subramanian - Managing Director"
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">R Bala Subramanian</h3>
                    <p className="text-green-500 font-semibold mb-4 text-sm sm:text-base">Managing Director</p>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      As Managing Director, Mr. R Bala Subramanian brings operational excellence and strategic vision to SR Traders. 
                      His commitment to quality service and sustainable practices has been instrumental in expanding the company's reach across Tamil Nadu.
                    </p>
                  </div>
                </div>

                {/* R Ashwin */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-600/50 transition-all">
                  <div className="relative h-80 sm:h-96 bg-gradient-to-b from-gray-800 to-gray-900">
                    <Image
                      src="/team/ashwin.png"
                      alt="R Ashwin - Independent Director and Legal"
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">R Ashwin</h3>
                    <p className="text-green-500 font-semibold mb-4 text-sm sm:text-base">Independent Director and Legal</p>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      Mr. R Ashwin oversees legal and compliance matters at SR Traders, ensuring all operations adhere to regulatory standards. 
                      His expertise in legal frameworks and business ethics strengthens the company's commitment to transparent and compliant trading practices.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Legacy Section */}
            <section className="mb-12">
              <div className="bg-gradient-to-br from-green-600/10 to-green-800/5 border border-green-600/30 rounded-2xl p-8 sm:p-10 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                  Our <span className="text-green-500">Legacy</span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto">
                  Rooted in the wisdom of <span className="text-white font-medium">V. Sermadurai</span> and strengthened under the leadership of <span className="text-white font-medium">S. Rajendran</span>, 
                  SR Traders stands as a proud family-driven enterprise dedicated to professional service, fair pricing, and environmental responsibility. 
                  We continue to honor our founding values while embracing modern practices to serve our clients and community better.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

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
                <li><Link href="/" className="hover:text-green-500 transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-green-500 transition-colors">About Us</Link></li>
                <li><Link href="/auth/signin" className="hover:text-green-500 transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Contact</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>Phone: <a href="tel:+919092473805" className="hover:text-green-500 transition-colors">+91 - 9092473805</a></li>
                <li>Email: <a href="mailto:info@Srtraders.co.in" className="hover:text-green-500 transition-colors">info@Srtraders.co.in</a></li>
                <li className="text-gray-400 leading-relaxed">111/A Utchini Magaliamman Kovil Street,<br />Kayalpattinam, Tuticorin - 628204<br />Tamil Nadu, India</li>
                <li className="text-gray-500 text-xs">GSTIN: 33APHPR5704E1Z2</li>
                <li className="text-gray-500 text-xs">Code: 33</li>
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

