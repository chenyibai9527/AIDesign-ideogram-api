"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { loadStripe } from "@stripe/stripe-js";
import { signIn } from "next-auth/react";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { FaCrown, FaRocket, FaStar } from "react-icons/fa";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Plan = "free" | "pro" | "premiere";

export default function BuyCreditsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handlePurchase = async (plan: Plan) => {
    if (!session) {
      signIn("google", { callbackUrl: '/pricing' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        const result = await stripe!.redirectToCheckout({
          sessionId: sessionId,
        });
        if (result.error) {
          alert(result.error.message);
        }
      } else {
        const data = await response.json();
        alert(`Failed to create checkout session: ${data.error}`);
      }
    } catch (error) {
      alert("An error occurred while creating the checkout session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation />
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Power Up Your AI Design Journey</h1>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Free Plan */}
          <div className="w-full md:w-1/3 bg-white bg-opacity-70 backdrop-blur-lg shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Free</h2>
                <FaStar className="text-yellow-400 text-2xl" />
              </div>
              <p className="text-gray-600 mb-4">Get started with basic features</p>
              <p className="text-3xl font-bold mb-4 text-gray-800">$0<span className="text-sm font-normal"></span></p>
              <ul className="mb-6 text-gray-700 flex-grow">
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  3 Credits
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Basic features
                </li>
              </ul>
              <button
                className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
                disabled
              >
                Activated
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="w-full md:w-1/3 bg-white bg-opacity-70 backdrop-blur-lg shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 border-2 border-[#4E904D]">
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#4E904D]">Pro Pack</h2>
                <FaRocket className="text-[#4E904D] text-2xl" />
              </div>
              <p className="text-gray-600 mb-4">More credits for your projects</p>
              <p className="text-3xl font-bold mb-4 text-[#4E904D]">$9.99<span className="text-sm font-normal"> one-time</span></p>
              <ul className="mb-6 text-gray-700 flex-grow">
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  100 credits
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  No expiration on credits
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Priority generation
                </li>
              </ul>
              <button
                onClick={() => handlePurchase('pro')}
                disabled={isLoading}
                className="w-full bg-[#4E904D] text-white py-2 px-4 rounded-lg hover:bg-[#3E7A3D] focus:outline-none focus:ring-2 focus:ring-[#4E904D] focus:ring-opacity-50 transition duration-200"
              >
                {isLoading ? 'Processing...' : 'Buy Pro Pack'}
              </button>
            </div>
          </div>

          {/* Premiere Plan */}
          <div className="w-full md:w-1/3 bg-white bg-opacity-70 backdrop-blur-lg shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-600">Premiere Pack</h2>
                <FaCrown className="text-purple-600 text-2xl" />
              </div>
              <p className="text-gray-600 mb-4">Ultimate creative freedom</p>
              <p className="text-3xl font-bold mb-4 text-purple-600">$29.99<span className="text-sm font-normal"> one-time</span></p>
              <ul className="mb-6 text-gray-700 flex-grow">
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  310 credits
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  No expiration on credits
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Exclusive premium features
                </li>
              </ul>
              <button
                onClick={() => handlePurchase('premiere')}
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200"
              >
                {isLoading ? 'Processing...' : 'Buy Premiere Pack'}
              </button>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16 bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-700">How do credits work?</h3>
              <p className="text-gray-600">Credits are used to generate images. One credit allows you to create one image. Credits from purchased packs do not expire and can be used at any time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700">Can I buy multiple packs?</h3>
              <p className="text-gray-600">Yes, you can purchase multiple credit packs. The credits will be added to your account and can be used as needed.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700">What happens if I use all my credits?</h3>
              <p className="text-gray-600">Once you&apos;ve used all your credits, you won&apos;t be able to generate new images until you purchase additional credits.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700">What is your refund policy?</h3>
              <p className="text-gray-600">We offer a limited refund policy to ensure customer satisfaction while protecting our service integrity:</p>
              <ul className="list-disc pl-5 mt-2 text-gray-600">
                <li>Refund requests must be made within 10 days of purchase.</li>
                <li>Refunds are only eligible for unused credits or ungenerated images.</li>
                <li>To request a refund, please email YOURMail@example.com with your account email and reason for the refund.</li>
                <li>We will review refund requests within 5 business days.</li>
                <li>Approved refunds will be processed through the original payment method.</li>
              </ul>
              <p className="mt-2 text-gray-600">For any questions about our refund policy, please contact YOURMail@example.com.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards and PayPal. Payment is processed securely through Stripe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}