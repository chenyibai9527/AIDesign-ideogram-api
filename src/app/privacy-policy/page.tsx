import NavBar from "@/components/NavBar";
import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen relative bg-gray-100 dark:bg-gray-900">
      <BackgroundAnimation />
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Privacy Policy</h1>
          <p className="mb-4 text-gray-700 dark:text-gray-200">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">1. Introduction</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">
            AIDesign (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website aidesign.site (the &ldquo;Website&rdquo;) or use our AI image generation service.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">2. Information We Collect</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">We collect information that you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:</p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 dark:text-gray-200">
            <li>Name and email address</li>
            <li>Payment information</li>
            <li>User-generated content (e.g., prompts for image generation)</li>
            <li>Communication data (e.g., when you contact our support team)</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">3. Use of Google Analytics</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">
            We use Google Analytics, a web analytics service provided by Google, Inc. (&ldquo;Google&rdquo;) to help us understand how users interact with our Website. Google Analytics uses cookies to collect information such as how often users visit the site, what pages they visit, and what other sites they used prior to coming to our site.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-200">
            We use the information we get from Google Analytics to improve our Website and services. Google Analytics collects only the IP address assigned to you on the date you visit our site, rather than your name or other identifying information.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-200">
            You can prevent Google Analytics from recognizing you on return visits to this site by disabling cookies on your browser or by using Google&apos;s opt-out browser add-on, available at https://tools.google.com/dlpage/gaoptout.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">4. How We Use Your Information</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">We use the information we collect to:</p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 dark:text-gray-200">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">5. Data Security</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">We implement appropriate technical and organizational measures to maintain the security of your personal information, including encryption of sensitive data and regular security assessments.</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">6. Your Rights</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. Please contact us if you wish to exercise these rights.</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">7. Changes to This Privacy Policy</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date at the top of this Privacy Policy.</p>
          
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">8. Contact Us</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">If you have any questions about this Privacy Policy, please contact us at YOURMail@example.com.</p>
        </div>
      </div>
    </div>
  );
}