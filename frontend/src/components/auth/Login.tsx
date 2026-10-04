import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import gaumsaLogo from '../../assets/images/gaumsa-logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Please enter your password');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gau-msa-primary to-gau-msa-secondary p-3 sm:p-4 overflow-hidden">
      <div className="w-full max-w-md max-h-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Scrollable content wrapper */}
        <div className="overflow-y-auto p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
          
          {/* Logo */}
          <div className="flex justify-center flex-shrink-0">
            <img 
              src={gaumsaLogo} 
              alt="GAUMSA Logo" 
              className="h-14 sm:h-16 md:h-20 w-auto object-contain"
            />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gau-msa-primary">
              Welcome to GAUMSA
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Sign in to access the Muslim student community
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}
          
          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  className="appearance-none block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                  placeholder="student@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="appearance-none block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-gau-msa-primary focus:ring-gau-msa-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-xs sm:text-sm">
                <a href="#" className="font-medium text-gau-msa-primary hover:text-gau-msa-secondary">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gau-msa-primary hover:bg-gau-msa-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gau-msa-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>
            <div className="mt-2 sm:mt-3 text-center">
              <a href="/register" className="font-medium text-gau-msa-primary hover:text-gau-msa-secondary text-sm">
                Register now
              </a>
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="text-[10px] sm:text-xs text-gray-500 italic leading-tight">
              "Whoever follows a path in search of knowledge, Allah will make easy for him a path to Paradise."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;