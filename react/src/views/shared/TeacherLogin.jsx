import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import '../../styles/login.css';
import '../../styles/google-login.css';
import backgroundImage from '../../assets/b_sakura-be-editors-637438-rel49a76f54.png';
import logoImage from '../../assets/image-removebg-preview.png';

export default function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password, role: 'teacher' }
      );

      // Verify the user has teacher role
      const userRoles = response.data.user.roles.map(r => r.role.toLowerCase());
      if (!userRoles.includes('teacher')) {
        setError('You don\'t have teacher access.');
        setLoading(false);
        return;
      }

      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid credentials. Please try again.'
      );
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
            <h1 className="auth-title">Teacher Login</h1>
            <p className="auth-subtitle">Welcome back</p>
          </div>

          <div className="auth-card">
            {error && <p className="error-text">{error}</p>}

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

            <div className="divider">
              <span>or</span>
            </div>

            <GoogleLoginButton />
          </div>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>

          <p className="auth-footer">
            <Link to="/login" className="auth-link">
              Back to Login Options
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
