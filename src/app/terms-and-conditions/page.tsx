import Link from 'next/link'
import Image from 'next/image'
import { FileText, ArrowLeft } from 'lucide-react'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
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
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full mb-4">
              <FileText className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Last Updated: January 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-green max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Information</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>Please read the terms and conditions carefully which is located on the website (SRTraders). The terms, guidelines, privacy policy, and other documents are made available by the website from time to time. In the case of any conflict between these terms or documents, the term will have an overriding effect. This agreement sets out the legally binding agreement between the user of the website and SRTraders. SRTraders is a platform where business entities facilitate the trading of steel scraps and recyclable materials. SRTraders understands the importance of privacy and also the importance of maintaining the confidentiality of personal information. Our Privacy Policy is applied to all the products and services which are being provided by us, and also sets out how we may collect, disclose and use the personal information (name, address, company details, transaction history, etc.) of users. Users may use our services and products via Website, Mobile Application, or by calling the Customer Support Team. By using our website, you hereby consent to our Privacy policy and agree to its Terms and conditions.</li>
                  <li>By accessing or using the website in any manner like visiting, browsing, or surfing the site you agree to be bound by these terms.</li>
                  <li>These terms and rights (any) may not be transferred or assigned by the user but may be assigned by the website without restriction. Any attempted transfer or assignment in violation shall be null or void.</li>
                </ol>
              </section>

              {/* Acceptance of Terms */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms of Use</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>By using or by browsing the website you are agreeing or accepting the terms, as amended from time to time with or without the notice.</li>
                  <li>This website is owned and operated by SRTraders and it reserves the right to modify or discontinue, temporarily or permanently at any time with or without notice. You agree that the website shall not be liable to you or to any third party for any suspension or discontinuance of the website services.</li>
                  <li>SRTraders or the website management may modify these terms and conditions from time to time and these changes would be reflected on the website with the updated version of the terms or also may reflect in applications or to you via e-mail and you agree to be bound to the changes of these terms when you use our website or website services.</li>
                  <li>When you register an account on our website and upload, submit, and enter any information to the website then you shall be deemed to have agreed to and understand the terms.</li>
                  <li>The website also uses cookies and by using the website you agree and give us consent for the use of cookies in accordance with the terms of the privacy policy.</li>
                </ol>
                <div className="mt-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
                  <p className="text-white font-semibold">IF YOU DO NOT AGREE TO THESE TERMS OF USE, THEN YOU MAY NOT USE THE WEBSITE</p>
                </div>
              </section>

              {/* Services */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Services</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>SRTraders is operated in the steel trading and scrap industry which means that it deals in location, transportation, commerce, treatment, recycling, and exploitation of the steel scrap materials, metal scraps, and other recyclable materials among others. It provides its visitor an online platform that allows the users to trade directly and execute deals that are offered by SRTraders.co.in from time to time.</li>
                  <li>Registered users can see their profiles, transaction history, invoice records, and past performance information which the website allows. This website provides an e-commerce platform for users for steel scrap transactions and related services.</li>
                  <li>For our scrap collection and trading services, you must provide your accurate information like name, business address, mobile number, GST details, etc. Your transactions will be processed as per the scheduled date provided by you while submitting the request. You can modify or cancel your request at any time before processing. The rates of all materials are subject to market conditions and will be communicated at the time of transaction. For specific pricing and terms, you can contact us directly.</li>
                </ol>
              </section>

              {/* Obligations */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">The Obligation of SRTraders</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>The website is a service-based platform, the sole purpose of which is to provide a space, where the traders and businesses related to the steel scrap industry can connect, communicate, and conduct transactions efficiently.</li>
                  <li>SRTraders makes reasonable efforts to ensure that the website is available at all times, however, we cannot guarantee uninterrupted access or that the site will be error-free.</li>
                  <li>We will provide customer support for technical issues, transaction queries, and general assistance through our designated support channels.</li>
                  <li>SRTraders will maintain the confidentiality of user information in accordance with our Privacy Policy and applicable laws.</li>
                  <li>We reserve the right to refuse service to any user who violates these terms or engages in fraudulent or illegal activities.</li>
                </ol>
              </section>

              {/* User Registration */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">User Registration and Account</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>To access certain features of our platform, you must complete the registration form which shall require you to provide personal and business information including but not limited to name, contact details, company information, and GST details.</li>
                  <li>You warrant all activities that occur under your account (any transaction, invoice generation, clicking to accept any terms & conditions, or making any payment for any services) will be deemed to have been authorized by you as a user, hence you warrant to have full authority for the associated disclosure.</li>
                  <li>You represent that you have full authority to accept these terms, to grant any license and authorization, and to perform any of your obligations. You also undertake to use the website and its services for business purposes only.</li>
                  <li>You should not allow another person to use your account to access the website.</li>
                  <li>You should inform us immediately at the time of unauthorized access of your account. You can write us at: <a href="mailto:info@Srtraders.co.in" className="text-green-500 hover:text-green-400 transition-colors">info@Srtraders.co.in</a></li>
                </ol>
              </section>

              {/* Transaction & Cancellation Policy */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Transaction & Cancellation Policy</h2>
                <p className="text-gray-300 mb-4">
                  Accepting or canceling the scrap trading service depends upon whether the services are available to the user or not and whether the material meets the specified quality standards. SRTraders has its rights in which it can accept or refuse the request initiated by the user. A user can also initiate the request or cancel the request as per their requirements before processing begins, for this, no charges will be applicable. Once the transaction is confirmed and materials are collected or payment is processed, the user cannot cancel the request. As per the Indian laws, illegal trades or activities are not allowed, if any activity takes place then strict action can be taken as per the court of law.
                </p>
              </section>

              {/* User IDs and Passwords */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">User IDs, Passwords and Account Deletion</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>The website provides your User ID and Password during registration so you must not use your account ID name in connection with the impersonation of any person or business entity.</li>
                  <li>You shall maintain the confidentiality of your password for which you should be responsible only.</li>
                  <li>During registration the data or personal information we collect is subject to the terms of our Privacy Policy.</li>
                  <li>We may suspend, cancel or deactivate your account at any time in the sole discretion without notice as well as any other explanation if we detect fraudulent activity or violation of terms.</li>
                  <li>You may also cancel your account on the website by emailing us at <a href="mailto:info@Srtraders.co.in" className="text-green-500 hover:text-green-400 transition-colors">info@Srtraders.co.in</a></li>
                </ol>
              </section>

              {/* User Conduct */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">User Conduct and Prohibited Activities</h2>
                <p className="text-gray-300 mb-4">Users agree:</p>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>Not to access the website or its services using a third-party's account without the express consent of the account holder;</li>
                  <li>Not to use the website for illegal purposes or fraudulent transactions;</li>
                  <li>Not to commit any act of infringement on the website with respect to the content, trademarks, or intellectual property;</li>
                  <li>Not to attempt to gain unauthorized access to another computer system through the website;</li>
                  <li>Not to upload or transmit viruses or other harmful files which are destructive in nature;</li>
                  <li>Not to use the website in a way that may cause damage to the website's availability or accessibility;</li>
                  <li>Not to engage in any activity that could harm the reputation or business interests of SRTraders or its partners.</li>
                </ol>
              </section>

              {/* Effect of Breach */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Effect of Breach by User</h2>
                <p className="text-gray-300">
                  If any factual breach by any user for any cause, SRTraders shall have the right to impose a penalty, restrict, refuse or ban any and all current or future use of any other service provided by SRTraders. Additionally, we may pursue legal action to recover damages or enforce compliance with these terms.
                </p>
              </section>

              {/* Trademarks */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Trademarks and Intellectual Property</h2>
                <p className="text-gray-300">
                  The website, its logos, "SRTraders" name, and its other registered trademarks belong to SRTraders. SRTraders, the website, and the management of the website give no permission to you for the use of these trademarks and such use may constitute an infringement of Intellectual Property Rights. All content, features, and functionality on the website are owned by SRTraders and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                <p className="text-gray-300">
                  SRTraders shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services. We are not responsible for the quality, accuracy, or legality of materials traded through our platform, though we make reasonable efforts to verify users and transactions.
                </p>
              </section>

              {/* Amendments */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Amendments</h2>
                <p className="text-gray-300">
                  SRTraders hereby reserves the right to update, modify, change, amend, terminate or discontinue the Website, the terms, and policy at any time and at its sole and final discretion. SRTraders may change the website's functionalities and applicable changes at any time. Any changes to these terms will be displayed on the website and we may also notify you through the website or by email. Your use of our services after the effective date of any update either by an account registration or simple use thereby indicates your acceptance thereof.
                </p>
              </section>

              {/* Governing Law */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Governing Law and Jurisdiction</h2>
                <p className="text-gray-300">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Tamil Nadu, India.
                </p>
              </section>

              {/* Contact */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                <p className="text-gray-300 mb-4">
                  For any inquiries or complaints regarding the service or website, please contact:
                </p>
                <div className="bg-black/30 p-4 rounded-lg border border-green-600/30">
                  <p className="text-white font-semibold mb-2">SRTraders</p>
                  <p className="text-gray-300"><span className="text-green-500">Website:</span> www.srtraders.co.in</p>
                  <p className="text-gray-300"><span className="text-green-500">Phone:</span> +91 - 9092473805</p>
                  <p className="text-gray-300"><span className="text-green-500">Email:</span> <a href="mailto:info@Srtraders.co.in" className="hover:text-green-400 transition-colors">info@Srtraders.co.in</a></p>
                  <p className="text-gray-300 mt-2">
                    <span className="text-green-500">Address:</span> S R TRADERS, 111/A Utchini Magaliamman Kovil Street, Kayalpattinam, Tuticorin - 628204, Tamil Nadu, India
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    <span className="text-green-500">GSTIN/UIN:</span> 33APHPR5704E1Z2
                  </p>
                  <p className="text-gray-300 mt-2">
                    <span className="text-green-500">Code:</span> 33
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 SRTraders. All rights reserved. Made with ❤️ in India, for the World
          </p>
        </div>
      </footer>
    </div>
  )
}

