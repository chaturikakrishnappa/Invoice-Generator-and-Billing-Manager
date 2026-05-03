import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, FileText } from 'lucide-react';
import api from '../services/api';
import { loginSuccess } from '../store/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', formData);
      dispatch(loginSuccess(response.data));
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -left-20 top-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-[400px] w-full z-10">
        
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <FileText size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">InvoicePro+</h1>
          </div>
          <p className="text-sm text-gray-500">Smart Invoicing, Simplified</p>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back 👋</h2>
          <p className="text-sm text-gray-500">Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                className={`w-full pl-10 pr-3 py-2.5 bg-white border ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'} rounded-lg focus:outline-none focus:ring-1 transition-all text-sm text-gray-800`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`w-full pl-10 pr-10 py-2.5 bg-white border ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'} rounded-lg focus:outline-none focus:ring-1 transition-all text-sm text-gray-800`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>



          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center mt-2 disabled:opacity-70 text-sm shadow-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center justify-center relative">
          <div className="border-t border-gray-200 w-full absolute"></div>
          <span className="bg-white px-3 text-gray-400 text-xs relative z-10">or</span>
        </div>
        
        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
