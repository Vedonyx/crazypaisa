import React from 'react';
import { Diamond, Shield, Trophy, Mail, Send, MessageCircle, Globe } from 'lucide-react';

const CasinoContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0933] via-[#2c0d4f] to-[#110022] text-gray-100">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Diamond className="mx-auto mb-4 text-purple-400" size={64} />
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            VIP Support Contact
          </h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Experience our premium service. Connect with our exclusive VIP support team for immediate assistance.
          </p>
        </div>

        {/* Support Details */}
        <div className="bg-[#2a1042] border border-purple-900/30 rounded-2xl p-8 space-y-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-purple-300 mb-4">Support Details</h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center space-x-4 bg-[#3a1555] p-4 rounded-xl">
              <Mail className="text-purple-400" size={32} />
              <div>
                <h3 className="font-semibold text-purple-200">Email</h3>
                <p className="text-gray-400 text-sm">crazy.paisaa007@gmail.com</p>
              </div>
            </div>

            {/* Discord */}
            <div className="flex items-center space-x-4 bg-[#3a1555] p-4 rounded-xl">
              <MessageCircle className="text-purple-400" size={32} />
              <div>
                <h3 className="font-semibold text-purple-200">Discord Server</h3>
                <p className="text-gray-400 text-sm">
                  <a href="https://discord.gg/KUAFa2Yj9d" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                    Join Our Discord
                  </a>
                </p>
              </div>
            </div>

            {/* Telegram */}
            <div className="flex items-center space-x-4 bg-[#3a1555] p-4 rounded-xl">
              <Send className="text-purple-400" size={32} />
              <div>
                <h3 className="font-semibold text-purple-200">Telegram</h3>
                <p className="text-gray-400 text-sm">
                  <a href="https://t.me/+neBVnh8YCSwwYjM1" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                    t.me/+neBVnh8YCSwwYjM1
                  </a>
                </p>
              </div>
            </div>

            {/* Social Media */}
            {/* <div className="flex items-center space-x-4 bg-[#3a1555] p-4 rounded-xl">
              <Globe className="text-purple-400" size={32} />
              <div>
                <h3 className="font-semibold text-purple-200">Social Media</h3>
                <p className="text-gray-400 text-sm">
                  Follow us on{' '}
                  <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                    Instagram
                  </a>{' '}
                  and{' '}
                  <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                    Twitter
                  </a>
                </p>
              </div>
            </div> */}
          </div>

          {/* Closing Statement */}
          <div className="mt-6 bg-purple-900/20 p-4 rounded-xl">
            <p className="text-gray-300 italic">
              "Your satisfaction is our highest priority. Reach out to us anytime, and we’ll be there to assist you!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoContactPage;
