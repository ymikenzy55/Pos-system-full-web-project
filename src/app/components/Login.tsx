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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] to-[#F5F1E8] px-4 py-8">
      <div className="w-full max-w-md">
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

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrors({ email: '', password: '', firstName: '', lastName: '', shopName: '' });
              }}
              className="text-[#5D4037] hover:underline text-sm font-medium"
            >
              {isRegisterMode ? 'Already have an account? Sign in' : 'Need to create an admin account? Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
