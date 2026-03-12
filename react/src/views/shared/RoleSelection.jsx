import { Link } from 'react-router-dom';
import { Users, BookOpen, Shield } from 'lucide-react';
import '../../styles/role-selection.css';
import backgroundImage from '../../assets/b_sakura-be-editors-637438-rel49a76f54.png';
import logoImage from '../../assets/image-removebg-preview.png';

export default function RoleSelection() {
  return (
    <div className="auth-container role-selection-page">
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
            <h1 className="auth-title">Welcome to TinyLearn</h1>
            <p className="auth-subtitle">Select your login type</p>
          </div>

          <div className="role-selection-card">
            <div className="role-options">
              <Link to="/login/student" className="role-option student">
                <div className="role-option-icon">
                  <Users size={32} color="#3b82f6" />
                </div>
                <div className="role-option-content">
                  <h3>Student Login</h3>
                  <p>Access your courses and assignments</p>
                </div>
              </Link>

              <Link to="/login/teacher" className="role-option teacher">
                <div className="role-option-icon">
                  <BookOpen size={32} color="#8b5cf6" />
                </div>
                <div className="role-option-content">
                  <h3>Teacher Login</h3>
                  <p>Manage your classes and grades</p>
                </div>
              </Link>

              <Link to="/admin-login" className="role-option admin">
                <div className="role-option-icon">
                  <Shield size={32} color="#f59e0b" />
                </div>
                <div className="role-option-content">
                  <h3>Admin Login</h3>
                  <p>System administration</p>
                </div>
              </Link>
            </div>
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
