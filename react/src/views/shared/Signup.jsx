import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/signup.css';
import backgroundImage from '../../assets/b_sakura-be-editors-637438-rel49a76f54.png';
import logoImage from '../../assets/image-removebg-preview.png';

export default function Signup() {
  const [FName, setFName] = useState('');
  const [LName, setLName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('student'); // ✅ NEW
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/register',
        {
          FName,
          LName,
          username,
          email,
          password,
          password_confirmation: passwordConfirmation,
          role, // ✅ SEND ROLE
        }
      );

      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError(
          err.response?.data?.message ||
            'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container signup-page">
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
            <h1 className="auth-title">Sign Up</h1>
            <p className="auth-subtitle">Create your account</p>
          </div>

          <div className="auth-card">
            {error && (
              <div className="error-message">
                <p className="error-text">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  required
                  value={FName}
                  onChange={(e) => setFName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  required
                  value={LName}
                  onChange={(e) => setLName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* ✅ ROLE DROPDOWN */}
              <div className="form-group">
                <label className="form-label">Register As</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-input"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          </div>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}