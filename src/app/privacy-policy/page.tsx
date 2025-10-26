import Link from 'next/link'
import Image from 'next/image'
import { Shield, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
                <p className="text-green-500 text-[10px] sm:text-xs">Steel Trading Platform</p>
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
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Last Updated: January 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-green max-w-none">
            <div className="space-y-8">
              {/* Information */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Information</h2>
                <p className="text-gray-300 leading-relaxed">
                  SRTraders is a platform where business entities facilitate the trading of steel scraps and recyclable materials. 
                  SRTraders understands the importance of privacy and also the importance of maintaining the confidentiality of personal information. 
                  Our Privacy Policy applies to all the products and services which are being provided by us, and also sets out how we may collect, 
                  disclose and use the personal information (name, address, localization, business details, etc.) of users. Users may use our services 
                  and products via Website, Mobile Application, or by calling the Customer Support Team. By using our website, you hereby consent to 
                  our Privacy policy and agree to its Terms and conditions.
                </p>
              </section>

              {/* Collection of Information */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Collection of Information</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>Your privacy is important to us and we have taken steps to ensure that we don't collect more information from you than is necessary for you to utilize our services and to protect your account.</li>
                  <li>We may collect your personal information at the time of registration like name, address, mobile number, email address, company name, GST number, account number, IFSC code, bank name, and branch name, and also the location of the user on the Website or Mobile Application.</li>
                  <li>We record & maintain the activities which are being performed by the users on the site including trading activities, invoice generation, and document uploads.</li>
                  <li>During the registration users need to provide the mandatory information in certain categories like business data (registration information, account information, GST details, etc.) or personal data (name, contact number, address, etc.). If the user does not provide the mandatory information then we may not be able to complete the process of registration and then we will also not be able to deliver our services to the users.</li>
                </ol>
              </section>

              {/* Use of Personal Data */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Use of Personal Data</h2>
                <p className="text-gray-300 mb-4">If the user is providing us any Personal Data then that means the user is giving us rights to use their information for the following purposes:</p>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>Verifying the identity of users;</li>
                  <li>Verifying the eligibility to register as a user of this Site;</li>
                  <li>This registration will provide you a user ID for our site and our site will maintain and manage your registration;</li>
                  <li>We will provide you a customer service that will respond to your queries, feedback, claims, or disputes;</li>
                  <li>Facilitating the communication between buyers and sellers of steel scraps and materials on the Site;</li>
                  <li>Processing transactions, generating invoices, and maintaining trading records;</li>
                  <li>We may use your name, phone number, business address, and email address to provide notices, updates, product alerts, communications, and other marketing materials to you relating to services offered by us on the Site by an opt-in mechanism in which by clicking into the checkbox you give us your consent for your personal data and if you don't want to provide us your personal data you can use opt-out mechanism in which you can withdraw your consent.</li>
                  <li>This disclosure is being done as it may be required for any of the above purposes or as required by law or in respect of any claims or potential claims brought against us.</li>
                </ol>
              </section>

              {/* Disclosure of Personal Data */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Disclosure of Personal Data</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>When necessary, we may also disclose and transfer users' Personal Data to our professional advisers, law enforcement agencies, insurers, government, and other organizations.</li>
                  <li>Any Personal Data supplied by the user will be retained by us and will be accessible by our employees, any Service Providers engaged by us, and third parties.</li>
                  <li>We may share the user's Account Information with banks to enable the user's transactions to determine the user's credit worthiness and, in the process of such determination; we may need to make such Account Information available to banks or credit agencies.</li>
                  <li>We have implemented security controls and associated procedures to keep your Account Information and other Personal Data secure from malicious users or intruders. These controls provide a reasonable assurance that the minimum-security requirements are in place. These controls do not guarantee that such controls can eliminate all of the risks of data-theft, data loss, or misuse of data.</li>
                </ol>
              </section>

              {/* Cookies */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
                <p className="text-gray-300 mb-4">
                  We use "cookies" to store specific information about users and also track the user's visits to the Site. A "cookie" is a small amount of data that is sent to the user's browser and stored on the user's system hard drive. A cookie can be sent to the user's system hard drive only if the user will access the site using that system. If the user does not de-activate or erase the cookie, each time user uses the same computer to access the Site, our web servers will be notified of the user's visit to the Site and in turn, we may have knowledge of the user's visit and the pattern of your usage. Generally, we use cookies to identify users and also enable us to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>Access user Registration Information or Account Information because of which users do not have to re-enter it;</li>
                  <li>Assist our partners to track user visits to the Site and process transactions;</li>
                  <li>Track the progress and complete trading operations.</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  Users can determine if and how a cookie will be accepted by configuring the browser that is installed in the system user is using to access the Site. By setting up the preferences in the browser user can accept all cookies or choose to be notified when a cookie is sent or choose to reject all cookies. If the user rejects all cookies by choosing the cookie-disabling function in their own browser then the user may be required to re-enter information on the Sites more often and certain features of the Sites may be unavailable.
                </p>
              </section>

              {/* Minors */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Minors</h2>
                <p className="text-gray-300">
                  The Site and its contents are not targeted at minors (those under the age of 18) and we do not intend to provide any of our services to minors. However, we have no way of distinguishing the age of individuals who access our Site. If a minor has provided us with personal information without parental or guardian consent, the parent or guardian should contact us at the email address given below to remove the information. Email ID: <a href="mailto:info@Srtraders.co.in" className="text-green-500 hover:text-green-400 transition-colors">info@Srtraders.co.in</a>
                </p>
              </section>

              {/* Security Measures */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Security Measures</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li>We provide reasonable security to prevent unauthorized access to the site, for maintaining the accuracy of the data, and to ensure the correct use of the information we hold.</li>
                  <li>For registered users of the Sites, your Registration Information and Account Information (if any) can be viewed and edited through your account, which is protected by a password.</li>
                  <li>We recommend that you do not divulge your password to anyone. Our personnel will never ask you for your password in an unsolicited phone call or in an unsolicited email.</li>
                  <li>If you share a computer with others, you should not choose to save your log-in information (e.g., user ID and password) on that shared computer.</li>
                  <li>Remember to sign out of your account and close your browser window when you have finished your session.</li>
                  <li>No data transmission over the Internet or any wireless network can be guaranteed to be perfectly secure. As a result, while we try to protect the information we hold for you, we cannot guarantee the security of any information you transmit to us and you do so at your own risk.</li>
                </ol>
              </section>

              {/* Changes to Privacy Policy */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Changes to this Privacy Policy</h2>
                <p className="text-gray-300">
                  Any changes to this Privacy Policy will be communicated by us posting an amended and restated Privacy Policy on the Site. You agree that any information we hold will be governed by the latest version of the Privacy Policy.
                </p>
              </section>

              {/* Feedback */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Your Feedback</h2>
                <p className="text-gray-300">
                  We welcome your input regarding our Privacy Policy and any comments on the services we provide to you. You may send us your comments and responses by email to <a href="mailto:info@Srtraders.co.in" className="text-green-500 hover:text-green-400 transition-colors">info@Srtraders.co.in</a>
                </p>
              </section>

              {/* Grievance Officer */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Grievance Officer</h2>
                <p className="text-gray-300 mb-4">
                  In accordance with the Information Technology Act, 2000 and the rules made thereunder, the name and contact details of the Grievance Officer are provided below. You may contact the Grievance Officer to address any discrepancies and grievances you may have with respect to your Information with SRTraders. The Grievance Officer will redress your grievances expeditiously.
                </p>
                <div className="bg-black/30 p-4 rounded-lg border border-green-600/30">
                  <p className="text-white font-semibold mb-2">Contact Information:</p>
                  <p className="text-gray-300"><span className="text-green-500">Email:</span> info@Srtraders.co.in</p>
                  <p className="text-gray-300"><span className="text-green-500">Phone:</span> +91 - 9092473805</p>
                  <p className="text-gray-300 mt-2">
                    <span className="text-green-500">Address:</span> S.No/11A, Utchir magaliamman kovil Street, Kayalpattinam - 628204, Tamil Nadu, India
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

