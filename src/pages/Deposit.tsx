import React, { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../utils/api';
import { useRequireAuth } from '../hooks/useRequireAuth';

export const Deposit = () => {
  const isAuthenticated = useRequireAuth();
  const { user } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  const [focusedInput, setFocusedInput] = useState('');

  // Background Particle Generation
  useEffect(() => {
    const generateParticles = () => {
      const particleCount = 100;
      const newParticles = Array.from({ length: particleCount }, (_, index) => (
        <div
          key={index}
          className="absolute bg-white/10 rounded-full"
          style={{
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 5}s infinite alternate`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const handleFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput('');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.transactions.create({
        userId: user.id,
        amount: Number(amount),
        transactionId,
        status: 'pending',
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit deposit request. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0">
        {particles}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black opacity-70"></div>
      </div>

      {/* Soft Glowing Effects */}
      <div className="absolute -top-1/4 -right-1/4 w-2/3 h-2/3 bg-blue-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-green-900/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl bg-gray-900/80 rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-gray-800">
          <div className="text-center mb-8">
            <Coins className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">
              Deposit Funds
            </h2>
            <p className="text-gray-400 text-sm">Add funds to your account</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-6">
              {error}
            </div>
          )}

          {!submitted ? (
            <>
              <div className="mb-12 text-center">
                <div className="relative inline-block">
                  <img
                    src="https://i.postimg.cc/cCvXThyW/image.png"
                    alt="Payment Method"
                    className="mx-auto w-[220px] h-[220px] object-cover bg-white p-3 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                  />
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-xl blur-md"></div>
                </div>
                <p className="mt-6 text-gray-400 text-sm">
                  Scan or use the payment method shown <br/>
                  ( We Won't accept payments below 100₹ )
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group">
                  <label 
                    htmlFor="amount" 
                    className="block text-sm font-medium text-gray-300 mb-2 transition-all group-hover:text-blue-400"
                  >
                    Amount to Deposit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onFocus={() => handleFocus('amount')}
                      onBlur={handleBlur}
                      className="mt-1 block w-full px-4 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-700
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                        hover:bg-gray-800 hover:border-gray-600"
                      required
                      min="1"
                      placeholder="Enter amount..."
                    />
                    <div className={`absolute inset-0 -z-10 bg-blue-500/10 rounded-xl blur-lg transition-opacity duration-300 
                      ${focusedInput === 'amount' ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                </div>

                <div className="relative group mt-8">
                  <label 
                    htmlFor="transactionId" 
                    className="block text-sm font-medium text-gray-300 mb-2 transition-all group-hover:text-blue-400"
                  >
                    Transaction ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      onFocus={() => handleFocus('transactionId')}
                      onBlur={handleBlur}
                      className="mt-1 block w-full px-4 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-700
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                        hover:bg-gray-800 hover:border-gray-600"
                      required
                      placeholder="Enter transaction ID..."
                    />
                    <div className={`absolute inset-0 -z-10 bg-blue-500/10 rounded-xl blur-lg transition-opacity duration-300 
                      ${focusedInput === 'transactionId' ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 px-6 rounded-xl
                    hover:from-blue-800 hover:to-blue-950 transform transition-all duration-200 hover:scale-[1.02]
                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 mt-8
                    shadow-lg hover:shadow-blue-500/20"
                >
                  Submit Deposit
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-500/20 text-green-300 p-6 rounded-xl border border-green-500/30">
                <p className="text-2xl mb-2 font-bold">Deposit Successful!</p>
                <p className="text-sm mb-1">Transaction ID: <span className="font-mono">{transactionId}</span></p>
                <p className="text-sm">Amount: {amount} funds</p>
              </div>
              <p className="text-gray-400 text-sm">
                Your funds will be added to your balance once the transaction is verified.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};