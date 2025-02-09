import React from 'react';
import { motion } from 'framer-motion';

interface TwitterRiskMetricsProps {
  riskMetrics: {
    riskScore: number;
    metrics: {
      accountAge: number;
      engagementRate: number;
      followerCount: number;
      tweetCount: number;
      isVerified: boolean;
    };
    riskLevel: string;
  };
}

const TwitterRiskMetrics: React.FC<TwitterRiskMetricsProps> = ({ riskMetrics }) => {
  const getRiskColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <img src="/icons/twitter-x.svg" alt="Twitter" className="w-6 h-6 mr-2" />
        Twitter Risk Analysis
      </h3>

      {/* Risk Score Gauge */}
      <div className="mb-6">
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${riskMetrics.riskScore}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${getRiskColor(riskMetrics.riskScore)}`}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-green-500">Low Risk</span>
          <span className="text-yellow-500">Medium Risk</span>
          <span className="text-red-500">High Risk</span>
        </div>
      </div>

      {/* Risk Score and Level */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-3xl font-bold">
          {riskMetrics.riskScore}
          <span className="text-sm text-gray-500 ml-1">/ 100</span>
        </div>
        <div className={`px-4 py-2 rounded-full font-semibold ${
          riskMetrics.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
          riskMetrics.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {riskMetrics.riskLevel} Risk
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Account Age</div>
          <div className="text-lg font-semibold">
            {riskMetrics.metrics.accountAge} days
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Engagement Rate</div>
          <div className="text-lg font-semibold">
            {(riskMetrics.metrics.engagementRate * 100).toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Followers</div>
          <div className="text-lg font-semibold">
            {riskMetrics.metrics.followerCount.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Tweet Count</div>
          <div className="text-lg font-semibold">
            {riskMetrics.metrics.tweetCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Verification Badge */}
      {riskMetrics.metrics.isVerified && (
        <div className="mt-4 flex items-center text-blue-500">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified Account
        </div>
      )}
    </div>
  );
};

export default TwitterRiskMetrics; 