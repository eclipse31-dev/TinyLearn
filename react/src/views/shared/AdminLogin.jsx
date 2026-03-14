import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import '../../styles/login.css';
import backgroundImage from '../../assets/b_sakura-be-editors-637438-rel49a76f54.png';
import logoImage from '../../assets/image-removebg-preview.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password, role: 'admin' }
      );

      // Verify the user has admin role
      const userRoles = response.data.user.roles.map(r => r.role.toLowerCase());
      if (!userRoles.includes('admin')) {
        const errorMsg = 'You don\'t have admin access.';
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      login(response.data.user, response.data.token);
      toast.success(`You have been successfully logged in as ${response.data.user.FName}!`);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMsg);
      toast.error(`Login failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container login-page">
      <div
        className="auth-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="auth-form-side">
        <div className="auth-form-wrapper">

          <div className="auth-header">
            <div className="auth-logo">
              <img src={logoImage} alt="Logo" />
            </div>
            <h1 className="auth-title">Admin Login</h1>
            <p className="auth-subtitle">Administrator Access</p>
          </div>

          <div className="auth-card">
            {error && <p className="error-text">{error}</p>}

            <GoogleLoginButton />

            <div className="divider">
              <span>or</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          <p className="auth-footer">
            Back to{' '}
            <Link to="/login" className="auth-link">
              Login Options
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
