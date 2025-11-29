import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | PrepKit',
  description: 'Terms and conditions for using PrepKit platform',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using PrepKit (&ldquo;the Platform&rdquo;), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily access the materials (information or software) on PrepKit's platform
                for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
                and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>attempt to decompile or reverse engineer any software contained on PrepKit's platform</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. You are responsible for safeguarding the password and for all activities that occur under
                your account.
              </p>
              <p className="text-gray-700 mb-4">
                You must immediately notify us of any unauthorized uses of your account or any other breaches of security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription Services</h2>
              <p className="text-gray-700 mb-4">
                Some parts of the Platform are billed on a subscription basis ("Subscription(s)"). You will be billed
                in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a
                monthly or annual basis, depending on the type of subscription plan you select.
              </p>
              <p className="text-gray-700 mb-4">
                At the end of each Billing Cycle, your Subscription will automatically renew under the exact same
                conditions unless you cancel it or PrepKit cancels it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Fee Changes</h2>
              <p className="text-gray-700 mb-4">
                PrepKit, in its sole discretion and at any time, may modify the Subscription fees. Any Subscription
                fee change will become effective at the end of the then-current Billing Cycle.
              </p>
              <p className="text-gray-700 mb-4">
                We will provide you with reasonable prior notice of any change in Subscription fees to give you an
                opportunity to terminate your Subscription before such change becomes effective.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Refunds</h2>
              <p className="text-gray-700 mb-4">
                We issue refunds for Contracts within 7 days of the original purchase of the Contract. Refund requests
                made after 7 days will not be entertained except in cases of technical issues or service unavailability
                on our end.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Content</h2>
              <p className="text-gray-700 mb-4">
                Our Platform allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, or other material (&ldquo;Content&rdquo;). You are responsible for the Content that you post on or
                through the Platform.
              </p>
              <p className="text-gray-700 mb-4">
                By posting Content on or through the Platform, You represent and warrant that: (i) the Content is yours
                and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms,
                and (ii) that the posting of your Content on or through the Platform does not violate the privacy rights,
                publicity rights, copyrights, contract rights or any other rights of any person or entity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may not use our Platform:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the Platform immediately, without prior notice
                or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
                not limited to a breach of the Terms.
              </p>
              <p className="text-gray-700 mb-4">
                If you wish to terminate your account, you may simply discontinue using the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> support@prepkit.com</p>
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
