import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | PrepKit',
  description: 'Privacy policy for PrepKit platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to PrepKit (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy
                and ensuring the security of your personal information. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our platform.
              </p>
              <p className="text-gray-700 mb-4">
                By using PrepKit, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We may collect personally identifiable information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Name and email address</li>
                <li>Profile information (target companies, experience level, preferred programming language)</li>
                <li>Payment information (processed securely through Razorpay)</li>
                <li>Account credentials</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Usage Data</h3>
              <p className="text-gray-700 mb-4">
                We automatically collect certain information when you use our platform:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>IP address and location information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our platform</li>
                <li>Lesson progress and completion data</li>
                <li>Device information and screen resolution</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform.
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>To provide and maintain our service</li>
                <li>To process payments and manage subscriptions</li>
                <li>To personalize your learning experience</li>
                <li>To communicate with you about updates, promotions, and support</li>
                <li>To analyze usage patterns and improve our platform</li>
                <li>To ensure platform security and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform (payment processors, analytics providers, etc.)</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                <li><strong>With Your Consent:</strong> We will share information only with your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication procedures</li>
                <li>Secure payment processing through Razorpay</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no method of transmission over the internet or electronic storage is 100% secure.
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only as long as necessary for the purposes outlined in this Privacy Policy,
                unless a longer retention period is required by law. When we no longer need your information, we will securely
                delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If we become aware that we have collected personal information
                from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure
                that such transfers comply with applicable data protection laws and implement appropriate safeguards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                Our platform may contain links to third-party websites or services that are not owned or controlled by us.
                We are not responsible for the privacy practices of these third parties. We encourage you to review
                the privacy policies of any third-party services you use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date. We will also
                provide additional notice (such as email notification) for material changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@prepkit.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                <p className="text-gray-700"><strong>Address:</strong> [Your Business Address]</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
