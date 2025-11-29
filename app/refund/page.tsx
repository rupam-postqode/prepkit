import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | PrepKit',
  description: 'Refund policy for PrepKit subscriptions and payments',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
              <p className="text-gray-700 mb-4">
                At PrepKit, we strive to provide high-quality educational content and a seamless learning experience.
                We understand that circumstances may arise where you need to request a refund. This Refund Policy
                outlines the conditions and procedures for requesting refunds for our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Subscription Refunds</h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Monthly Subscriptions</h3>
              <p className="text-gray-700 mb-4">
                For monthly subscription plans, you may request a full refund within 7 days of the initial purchase
                or subscription renewal. Refund requests made after 7 days will not be entertained, except in cases
                of technical issues or service unavailability on our end.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Quarterly and Annual Subscriptions</h3>
              <p className="text-gray-700 mb-4">
                For quarterly and annual subscription plans, you may request a full refund within 14 days of the
                initial purchase. Refund requests made after 14 days will be prorated based on the unused portion
                of your subscription period.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Lifetime Subscriptions</h3>
              <p className="text-gray-700 mb-4">
                Lifetime subscriptions are eligible for refund within 30 days of purchase. After this period,
                refunds are not available as lifetime access is granted permanently.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Eligible Refund Conditions</h2>
              <p className="text-gray-700 mb-4">
                Refunds may be granted under the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Technical Issues:</strong> If you experience persistent technical problems that prevent access to the platform</li>
                <li><strong>Service Unavailability:</strong> If our service is unavailable for more than 24 consecutive hours due to our fault</li>
                <li><strong>Billing Errors:</strong> If you were charged incorrectly or multiple times for the same service</li>
                <li><strong>Account Issues:</strong> If you are unable to access your account due to technical issues on our end</li>
                <li><strong>Content Quality:</strong> If the course content significantly deviates from the advertised description</li>
                <li><strong>Cancellation:</strong> Within the refund windows specified above for voluntary cancellations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Non-Refundable Items</h2>
              <p className="text-gray-700 mb-4">
                The following are generally not eligible for refunds:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Subscriptions that have been active beyond the refund window</li>
                <li>Downloaded or accessed premium content after the refund period</li>
                <li>Services that have been fully consumed or completed</li>
                <li>Refunds requested due to change of mind after content access</li>
                <li>Third-party charges or fees (payment processor fees, bank charges, etc.)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Process</h2>
              <p className="text-gray-700 mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-gray-700 mb-4 ml-4">
                <li>Contact our support team at <strong>support@prepkit.com</strong> with your refund request</li>
                <li>Include your order ID, email address, and reason for the refund request</li>
                <li>Provide any relevant screenshots or documentation supporting your claim</li>
                <li>Our team will review your request within 2-3 business days</li>
                <li>If approved, refunds will be processed within 5-7 business days</li>
                <li>You will receive a confirmation email once the refund is processed</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Refund Methods</h2>
              <p className="text-gray-700 mb-4">
                Refunds will be processed using the original payment method:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Credit/Debit Cards:</strong> Refunds typically appear within 3-5 business days</li>
                <li><strong>UPI:</strong> Refunds are processed within 1-2 business days</li>
                <li><strong>Net Banking:</strong> Refunds may take 3-7 business days depending on your bank</li>
                <li><strong>Wallet Payments:</strong> Refunds are credited back to the original wallet</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Please note that the time for the refund to reflect in your account may vary depending on your
                bank or payment provider's processing time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Partial Refunds</h2>
              <p className="text-gray-700 mb-4">
                In some cases, partial refunds may be offered:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>For subscriptions canceled mid-cycle, prorated refunds may be provided</li>
                <li>If you have accessed some content, a partial refund may be calculated</li>
                <li>Technical issues affecting only part of the service may result in partial refunds</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Account Termination</h2>
              <p className="text-gray-700 mb-4">
                Upon processing a refund:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Your subscription will be immediately terminated</li>
                <li>Access to premium content will be revoked</li>
                <li>Your account may be downgraded to a free tier if applicable</li>
                <li>Progress data may be retained for potential future reactivation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you are not satisfied with our refund decision:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Contact our escalation team at <strong>escalations@prepkit.com</strong></li>
                <li>Provide additional documentation or evidence</li>
                <li>Our management team will review the case within 5 business days</li>
                <li>Final decisions will be communicated via email</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately
                upon posting on our website. Your continued use of our services after changes are posted constitutes
                your acceptance of the modified policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For refund requests or questions about this policy, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> support@prepkit.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                <p className="text-gray-700"><strong>Address:</strong> [Your Business Address]</p>
                <p className="text-gray-700"><strong>Response Time:</strong> Within 24 hours for refund requests</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
