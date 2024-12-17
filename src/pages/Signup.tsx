import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../utils/api';

export const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldValidation, setFieldValidation] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
  });
  const [usernameError, setUsernameError] = useState('');

  const inputRefs = {
    name: useRef(null),
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
    referralCode: useRef(null),
  };

  const validateUsername = (username: string) => {
    // Basic username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    if (!usernameRegex.test(username)) {
      setUsernameError('Username must be 3-16 characters, using letters, numbers, or underscore');
      setFieldValidation(prev => ({ ...prev, username: false }));
      return false;
    }
    
    // Add any additional username validation logic here
    setUsernameError('');
    setFieldValidation(prev => ({ ...prev, username: true }));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate all required fields before submission
    const requiredFields = ['name', 'username', 'email', 'password'];
    const isValid = requiredFields.every(field => {
      if (field === 'username') {
        return validateUsername(formData.username);
      }
      return formData[field].trim() !== '';
    });

    if (!isValid) {
      setError('Please correct the errors in the form');
      setIsLoading(false);
      return;
    }

    try {
      const newUser = await api.auth.register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode,
        winningChances: 45,
      });
      
      login(newUser);
      navigate('/play');
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate individual fields
    if (name === 'username') {
      validateUsername(value);
    } else if (['name', 'email', 'password'].includes(name)) {
      setFieldValidation(prev => ({
        ...prev,
        [name]: value.trim() !== ''
      }));
    }
  };

  const handleFocus = (fieldName: string) => {
    if (inputRefs[fieldName].current) {
      inputRefs[fieldName].current.classList.add('border-purple-500', 'ring-2', 'ring-purple-300');
    }
  };

  const handleBlur = (fieldName: string) => {
    if (inputRefs[fieldName].current) {
      inputRefs[fieldName].current.classList.remove('border-purple-500', 'ring-2', 'ring-purple-300');
    }
  };

  const inputFields = [
    { 
      name: 'name', 
      label: 'Full Name', 
      type: 'text', 
      placeholder: 'Enter your full name' 
    },
    { 
      name: 'username', 
      label: 'Username', 
      type: 'text', 
      placeholder: 'Choose a unique username' 
    },
    { 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      placeholder: 'Enter your email' 
    },
    { 
      name: 'password', 
      label: 'Password', 
      type: 'password', 
      placeholder: 'Create a strong password' 
    },
    { 
      name: 'referralCode', 
      label: 'Referral Code', 
      type: 'text', 
      placeholder: 'Optional referral code' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2a] to-[#2a2a3a] flex items-center justify-center px-4 overflow-hidden relative perspective-1000">
      {/* 3D Background Effects - Same as previous version */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Layered Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a3a]/30 via-[#2a2a4a]/20 to-[#3a3a5a]/10 opacity-50"></div>
        
        {/* Floating 3D Particles */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => {
            const size = Math.random() * 15 + 2;
            const delay = Math.random() * 10;
            const duration = Math.random() * 20 + 10;
            const depth = Math.random() * 300 - 150;
            
            return (
              <div 
                key={i} 
                className="absolute bg-purple-500/20 rounded-full transform-3d animate-float-particle"
                style={{
                  left: `${Math.random() * 120 - 10}%`,
                  top: `${Math.random() * 120 - 10}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `translateZ(${depth}px)`,
                  opacity: Math.random() * 0.5 + 0.2
                }}
              />
            );
          })}
        </div>

        {/* Geometric 3D Shapes */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => {
            const shapes = [
              'polygon(50% 0%, 0% 100%, 100% 100%)',
              'circle(50% at 50% 50%)',
              'ellipse(40% 50% at 50% 50%)'
            ];
            
            return (
              <div 
                key={i} 
                className="absolute bg-purple-500/10 opacity-20 animate-shape-morph"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 200 + 50}px`,
                  height: `${Math.random() * 200 + 50}px`,
                  clipPath: shapes[Math.floor(Math.random() * shapes.length)],
                  animationDelay: `${Math.random() * 10}s`,
                  transform: `rotate(${Math.random() * 360}deg) translateZ(${Math.random() * 200 - 100}px)`
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Signup Container */}
      <div className="max-w-md w-full bg-[#121228] rounded-3xl shadow-2xl shadow-purple-900/30 p-10 border border-purple-900/20 relative z-10 transform transition-all duration-500 hover:scale-[1.02]">
        <div className="text-center mb-10">
          <UserPlus className="w-20 h-20 text-purple-500 mx-auto mb-6 
            transform transition-all duration-300 
            animate-pulse" />
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 
            animate-text-shimmer">
            Create Account
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-xl mb-8 animate-shake flex items-center space-x-3">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {inputFields.map((field) => (
            <div key={field.name} className="relative group">
              <label 
                htmlFor={field.name} 
                className="block text-md font-medium text-gray-300 mb-2 
                  transition-all duration-300 
                  group-hover:text-purple-300"
              >
                {field.label}
                {field.name !== 'referralCode' && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  ref={inputRefs[field.name]}
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onFocus={() => handleFocus(field.name)}
                  onBlur={() => handleBlur(field.name)}
                  required={field.name !== 'referralCode'}
                  placeholder={field.placeholder}
                  className={`
                    mt-1 block w-full rounded-xl bg-gray-800/50 
                    border ${
                      field.name === 'username' && usernameError 
                        ? 'border-red-500 animate-shake' 
                        : field.name !== 'referralCode' && fieldValidation[field.name] 
                        ? 'border-green-500' 
                        : 'border-purple-900/30'
                    }
                    text-white py-3.5 px-4 text-md
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                    transition-all duration-300 ease-in-out 
                    placeholder-gray-500 
                    hover:bg-gray-800/70`}
                />
                {field.name === 'username' && usernameError && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 
                    flex items-center space-x-2">
                    <AlertCircle className="text-red-500 w-6 h-6 
                      animate-pulse-slow" />
                  </div>
                )}
                {field.name !== 'referralCode' && fieldValidation[field.name] && field.name !== 'username' && (
                  <CheckCircle2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-6 h-6" />
                )}
              </div>
              {field.name === 'username' && usernameError && (
                <p className="text-red-500 text-sm mt-1 animate-shake">
                  {usernameError}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-700 hover:to-pink-700 
            text-white py-4 px-6 rounded-xl 
            transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed 
            flex items-center justify-center 
            space-x-4 
            shadow-lg hover:shadow-xl 
            shadow-purple-500/30 hover:shadow-purple-500/50
            active:scale-95 text-lg font-semibold"
          >
            {isLoading ? (
              <div className="animate-spin w-6 h-6 border-3 border-t-white border-l-white border-r-transparent border-b-transparent rounded-full"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-md">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 
            hover:from-purple-500 hover:to-pink-700 
            font-bold transition-all duration-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};