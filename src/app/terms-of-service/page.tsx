import NavBar from "@/components/NavBar";
import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-100 dark:bg-gray-900">
      <BackgroundAnimation />
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Terms of Service</h1>
          <p className="mb-4 text-gray-700 dark:text-gray-200">Effective Date: 2024-08-23</p>
          <p className="mb-4 text-gray-700 dark:text-gray-200">Welcome to AIDesign! These Terms of Service (&quot;Terms&quot;) govern your use of the AIDesign website located at https://aidesign.click. (&quot;Website&quot;), including all content, services, and products available at or through the website.</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-white">1. Acceptance of Terms</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">By accessing or using our Website, you agree to be bound by these Terms, including our Privacy Policy. If you disagree with any part of the terms, then you do not have permission to access the Website.</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-white">2. Use of the Website</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">AIDesign provides an AI-powered image generation service. These services are provided to you subject to our pricing plans and terms.</p>
          
          <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-white">2.1 Ownership of Generated Content</h3>
          <p className="mb-4 text-gray-700 dark:text-gray-200">The ownership of any images or content generated using AIDesign&apos;s services belongs to the person who created it, subject to the terms outlined herein.</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-white">3. User Data</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">In order to provide our services, we collect certain personal information from our users. Our use of your personal information is governed by our Privacy Policy.</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-white">4. Prohibited Uses</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">You agree not to use the Website:</p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 dark:text-gray-200">
            <li>For any unlawful purpose.</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others.</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate.</li>
            <li>To submit false or misleading information.</li>
            <li>To upload or transmit viruses or any other type of malicious code.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-white">5. Changes to Terms</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-white">6. Contact Us</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">If you have any questions about these Terms, please contact us at YOURMail@example.com.</p>
        </div>
      </div>
    </div>
  );
}