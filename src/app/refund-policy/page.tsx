import React from 'react';
import NavBar from '@/components/NavBar';
import BackgroundAnimation from '@/components/BackgroundAnimation';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen relative bg-gray-100 dark:bg-gray-900">
      <BackgroundAnimation />
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Refund Policy</h1>
          <div className="space-y-4 text-gray-700 dark:text-gray-200">
            <p>We are committed to providing the highest quality service to our customers. Here is our refund policy:</p>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">1. Refund Conditions</h2>
            <p>We will consider refund requests under the following circumstances:</p>
            <ul className="list-disc pl-5">
              <li>Service not provided</li>
              <li>Significant discrepancy between service quality and description</li>
              <li>Technical issues preventing service usage</li>
            </ul>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">2. Refund Process</h2>
            <p>To request a refund, please follow these steps:</p>
            <ol className="list-decimal pl-5">
              <li>Contact our customer support team</li>
              <li>Explain the reason for the refund</li>
              <li>Provide relevant order information</li>
            </ol>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">3. Refund Timeline</h2>
            <p>Once a refund request is approved, we will process the refund within 5-10 business days.</p>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">4. Exceptions</h2>
            <p>Certain special circumstances may fall outside our standard refund policy. These cases will be considered individually.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;