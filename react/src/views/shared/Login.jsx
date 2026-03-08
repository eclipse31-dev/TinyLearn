import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { isDemoAccount, getDemoUser, demoCredentials } from '../../data/dummyData';
import '../../styles/login.css';
import backgroundImage from '../../assets/b_sakura-be-editors-637438-rel49a76f54.png';
import logoImage from '../../assets/image-removebg-preview.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if it's a demo account
      if (isDemoAccount(email)) {
        const demoUser = getDemoUser(email);
        const validPassword = Object.values(demoCredentials).find(
          cred => cred.email === email
        )?.password;

        if (password === validPassword) {
          // Demo mode - no backend connection
          login(demoUser, 'demo-token-' + demoUser.user_ID);
          localStorage.setItem('demoMode', 'true');
          navigate('/dashboard');
          return;
        } else {
          setError('Invalid demo credentials. Use password: demo123');
          setLoading(false);
          return;
        }
      }

      // Regular login with backend
      localStorage.removeItem('demoMode');
      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password }
      );

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
            <h1 className="auth-title">Login</h1>
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
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
