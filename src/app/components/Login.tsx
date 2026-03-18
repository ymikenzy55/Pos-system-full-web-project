import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] to-[#F5F1E8] px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5D4037] text-white mb-4 shadow-lg">
            <LogIn size={40} />
          </div>
          <h1 className="text-4xl font-bold text-[#3E2723] mb-2">Bean & Brew POS</h1>
          <p className="text-[#8D6E63]">Sign in to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E6E0D4] p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5D4037] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: '' });
                }}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-[#E6E0D4]'
                } focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all bg-[#FDFBF7]`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5D4037] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.password ? 'border-red-500' : 'border-[#E6E0D4]'
                  } focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all bg-[#FDFBF7] pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#5D4037] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5D4037] text-white py-3 rounded-xl font-semibold hover:bg-[#4E342E] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
