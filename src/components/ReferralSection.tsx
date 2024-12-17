import React, { useState, useEffect } from 'react';
import { Users, Copy, Award, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../utils/api';

interface ReferralStats {
  totalReferrals: number;
  paidReferrals: number;
  pendingReferrals: number;
  referredUsers: Array<{
    username: string;
    points: number;
    paid: boolean;
  }>;
}

export const ReferralSection = () => {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    const fetchReferralStats = async () => {
      if (user?.peopleReferKey) {
        const referralStats = await api.referrals.getStats(user.peopleReferKey);
        setStats(referralStats);
      }
    };
    fetchReferralStats();
  }, [user?.peopleReferKey]);

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.peopleReferKey || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayedUsers = showAllUsers 
    ? stats?.referredUsers 
    : stats?.referredUsers.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl">
      <div className="flex items-center mb-8 space-x-3">
        <div className="bg-purple-500/10 p-2 rounded-lg">
          <Users className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Referral Program</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referral Code Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-400">Your Referral Code:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={user?.peopleReferKey || ''}
                readOnly
                className="flex-1 bg-gray-700/50 text-white rounded-lg px-4 py-3 font-mono border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-700/20 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">How it works:</h3>
            <ul className="text-gray-400 space-y-3">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-2" />
                <span>Share your referral code with friends</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-2" />
                <span>Friends get 5 points on signup</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-2" />
                <span>You earn 5 points when they reach 100 points</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gray-700/20 rounded-xl p-6 border border-gray-700">
          <h3 className="text-white font-semibold flex items-center mb-6">
            <Award className="w-5 h-5 text-yellow-500 mr-2" />
            Referral Statistics
          </h3>
          
          {stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-500">{stats.totalReferrals}</div>
                  <div className="text-sm text-gray-400 mt-1">Total Referrals</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-500">{stats.paidReferrals}</div>
                  <div className="text-sm text-gray-400 mt-1">Paid Bonuses</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-500">{stats.pendingReferrals}</div>
                  <div className="text-sm text-gray-400 mt-1">Pending</div>
                </div>
              </div>

              {stats.referredUsers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Referred Users</h4>
                  <div className="space-y-2">
                    {displayedUsers?.map((referral) => (
                      <div
                        key={referral.username}
                        className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-white font-medium">{referral.username}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-400">{referral.points} points</span>
                          {referral.paid ? (
                            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full font-medium">
                              Paid
                            </span>
                          ) : (
                            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-medium">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {stats.referredUsers.length > 3 && (
                    <button
                      onClick={() => setShowAllUsers(!showAllUsers)}
                      className="flex items-center space-x-1 text-purple-500 hover:text-purple-400 transition-colors mt-3 text-sm font-medium"
                    >
                      <span>{showAllUsers ? 'Show Less' : 'Show All'}</span>
                      <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${showAllUsers ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-gray-400">Loading statistics...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralSection;