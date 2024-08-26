import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 mt-auto relative z-50 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Copyright */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Image src="/logo.png" alt="AiDesign Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold">AIDesign</span>
            </div>
            <p className="text-sm text-gray-600">© {currentYear} AIDesign. All rights reserved.</p>
            <p className="text-sm text-gray-600 mt-2">AI-powered image generation for everyone.</p>
          </div>

          {/* Friendly Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Guess you like</h3>
            <ul className="text-sm text-gray-600">
              <li className="mb-1"><a href="https://audio-editor.site/?ref=aidesign" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Free Audio Editor</a></li>
              <li className="mb-1"><a href="https://github.com/chenyibai9527/AIDesign-ideogram-api" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Github</a></li>
              <li className="mb-1"><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Vercel</a></li>
            </ul>
          </div>

          {/* Support Email */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Support</h3>
            <p className="text-sm text-gray-600">
              Email: <a href="mailto:YOURMail@example.com" className="hover:text-gray-900">YOURMail@example.com</a>
            </p>
          </div>

          {/* Legal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Legal</h3>
            <ul className="text-sm text-gray-600">
              <li className="mb-1">
                <Link href="/terms-of-service" className="hover:text-gray-900">Terms of Service</Link>
              </li>
              <li className="mb-1">
                <Link href="/privacy-policy" className="hover:text-gray-900">Privacy Policy</Link>
              </li>
              <li className="mb-1">
                <Link href="/refund-policy" className="hover:text-gray-900">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}