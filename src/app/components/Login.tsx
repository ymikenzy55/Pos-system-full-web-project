import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { LogIn, Eye, EyeOff, Loader2, Store } from 'lucide-react';

export const Login = () => {
  const { login, register } = useStore();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', firstName: '', lastName: '', shopName: '' });

  const validateLoginForm = () => {
    const newErrors = { email: '', password: '', firstName: '', lastName: '', shopName: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateRegisterForm = () => {
    const newErrors = { email: '', password: '', firstName: '', lastName: '', shopName: '' };
    let isValid = true;

    if (!firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!shopName) {
      newErrors.shopName = 'Shop name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegisterMode) {
      if (!validateRegisterForm()) return;
      
      setIsLoading(true);
      try {
        await register({
          firstName,
          lastName,
          email,
          password,
          shopName,
          shopAddress,
          shopPhone,
        });
      } catch (error) {
        console.error('Registration failed:', error);
      }
      setIsLoading(false);
    } else {
      if (!validateLoginForm()) return;
      
      setIsLoading(true);
      try {
        await login(email, password);
      } catch (error) {
        console.error('Login failed:', error);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] to-[#F5F1E8] px-4 py-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Diagonal Slashes */}
        <div className="absolute top-20 left-10 w-32 h-1 bg-[#5D4037] opacity-10 rotate-45"></div>
        <div className="absolute top-32 left-20 w-24 h-1 bg-[#8D6E63] opacity-15 rotate-45"></div>
        <div className="absolute bottom-40 right-16 w-40 h-1 bg-[#5D4037] opacity-10 -rotate-45"></div>
        <div className="absolute bottom-28 right-28 w-28 h-1 bg-[#8D6E63] opacity-15 -rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-1 bg-[#5D4037] opacity-10 rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/4 w-32 h-1 bg-[#8D6E63] opacity-15 -rotate-12"></div>
        
        {/* Dotted Patterns */}
        <div className="absolute top-16 right-20">
          <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#5D4037] opacity-20"></div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-20 left-16">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8D6E63] opacity-25"></div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 left-12">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#5D4037] opacity-15"></div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/4 right-12">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8D6E63] opacity-20"></div>
            ))}
          </div>
        </div>
        
        {/* Large Decorative Circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#5D4037] opacity-5"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#8D6E63] opacity-5"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5D4037] text-white mb-4 shadow-lg">
            {isRegisterMode ? <Store size={40} /> : <LogIn size={40} />}
          </div>
          <h1 className="text-4xl font-bold text-[#3E2723] mb-2">Best Supermarket</h1>
          <p className="text-[#8D6E63]">
            {isRegisterMode ? 'Create your admin account' : 'Sign in to continue'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E6E0D4] p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#5D4037] mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setErrors({ ...errors, firstName: '' });
                      }}
                      placeholder="John"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.firstName ? 'border-red-500' : 'border-[#E6E0D4]'
                      } focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all bg-[#FDFBF7]`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#5D4037] mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setErrors({ ...errors, lastName: '' });
                      }}
                      placeholder="Doe"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.lastName ? 'border-red-500' : 'border-[#E6E0D4]'
                      } focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all bg-[#FDFBF7]`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-[#5D4037] mb-2">
                    Shop Name
                  </label>
                  <input
                    id="shopName"
                    type="text"
                    value={shopName}
                    onChange={(e) => {
                      setShopName(e.target.value);
                      setErrors({ ...errors, shopName: '' });
                    }}
                    placeholder="My Supermarket"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.shopName ? 'border-red-500' : 'border-[#E6E0D4]'
                    } focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all bg-[#FDFBF7]`}
                  />
                  {errors.shopName && (
                    <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shopAddress" className="block text-sm font-medium text-[#5D4037] mb-2">
                    Shop Address (Optional)
                  </label>
                  <input
                    id="shopAddress"
                    type="text"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all bg-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label htmlFor="shopPhone" className="block text-sm font-medium text-[#5D4037] mb-2">
                    Shop Phone (Optional)
                  </label>
                  <input
                    id="shopPhone"
                    type="tel"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    placeholder="+1-555-0100"
                    className="w-full px-4 py-3 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all bg-[#FDFBF7]"
                  />
                </div>
              </>
            )}

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
              className="w-full bg-[#5D4037] text-white py-3 rounded-xl font-semibold hover:bg-[#4E342E] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {isRegisterMode ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                isRegisterMode ? 'Create Admin Account' : 'Sign In'
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};
