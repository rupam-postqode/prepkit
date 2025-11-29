import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | PrepKit',
  description: 'Get in touch with PrepKit support team',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email Support</h3>
                    <p className="text-gray-600">support@prepkit.com</p>
                    <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone Support</h3>
                    <p className="text-gray-600">+91-XXXXXXXXXX</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9 AM - 6 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Business Address</h3>
                    <p className="text-gray-600">[Your Business Address]</p>
                    <p className="text-gray-600">[City, State, PIN Code]</p>
                    <p className="text-gray-600">India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Categories */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">How Can We Help?</h2>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Technical Support</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Issues with login, video playback, course access, or platform functionality
                  </p>
                  <p className="text-indigo-600 text-sm">📧 tech-support@prepkit.com</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Billing & Payments</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Subscription issues, payment failures, refunds, or billing inquiries
                  </p>
                  <p className="text-indigo-600 text-sm">📧 billing@prepkit.com</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Content & Courses</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Course content questions, progress tracking, or learning path recommendations
                  </p>
                  <p className="text-indigo-600 text-sm">📧 content@prepkit.com</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Partnerships & Business</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Business inquiries, partnerships, or enterprise solutions
                  </p>
                  <p className="text-indigo-600 text-sm">📧 partnerships@prepkit.com</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">General Inquiries</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    General questions, feedback, or suggestions about PrepKit
                  </p>
                  <p className="text-indigo-600 text-sm">📧 hello@prepkit.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Times */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Response Times</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-medium text-gray-900">Urgent Issues</h3>
                <p className="text-sm text-gray-600">Within 4 hours</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📧</div>
                <h3 className="font-medium text-gray-900">General Support</h3>
                <p className="text-sm text-gray-600">Within 24 hours</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🤝</div>
                <h3 className="font-medium text-gray-900">Business Inquiries</h3>
                <p className="text-sm text-gray-600">Within 48 hours</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              For urgent technical issues outside business hours, please check our
              <a href="/help" className="text-indigo-600 hover:text-indigo-500 ml-1">Help Center</a> for
              immediate solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
