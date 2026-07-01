import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4">
      <div className="w-full max-w-md bg-[#111111] border border-[#222222] p-10 rounded-none shadow-xl animate-apple-slide">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-white text-black font-display font-bold flex items-center justify-center text-xl mb-4">
            ET
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-white uppercase">
            SIGN IN
          </h1>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-semibold">
            Track Wealth / Control Expenses
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-955/30 border border-red-900/50 text-red-400 text-xs font-semibold uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-600">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL@EXAMPLE.COM"
                className="w-full pl-11 pr-4 py-3 brand-input rounded-none text-white placeholder-zinc-750 text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-600">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 brand-input rounded-none text-white placeholder-zinc-750 text-sm focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 btn-brand-primary rounded-none font-bold text-sm tracking-widest cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'ENTER'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Not a member?   
          <Link to="/register" className="text-white hover:underline">
            Join Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
