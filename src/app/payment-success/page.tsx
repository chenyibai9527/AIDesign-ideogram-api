"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function PaymentSuccessPage() {
  const [message, setMessage] = useState("Processing your payment...");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/confirm-payment?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMessage(
              `Payment successful! ${data.credits} credits have been added to your account.`
            );
          } else {
            setMessage(
              "There was an error processing your payment. Please contact support."
            );
          }
        })
        .catch(() => {
          setMessage(
            "There was an error confirming your payment. Please contact support."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8"
        >
          <div className="text-center">
            {isLoading ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4E904D] mx-auto"></div>
            ) : (
              <FaCheckCircle className="text-6xl text-[#4E904D] mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Payment Status</h1>
            <p className="text-lg mb-8 text-gray-600">{message}</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-center"
          >
            <button
              onClick={() => router.push("/generate")}
              className="bg-[#4E904D] text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:bg-[#3E7A3D] transition duration-300 ease-in-out flex items-center justify-center mx-auto"
            >
              Back to Create
              <FaArrowRight className="ml-2" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}