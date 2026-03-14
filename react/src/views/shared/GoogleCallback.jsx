import { useEffect, useRef, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    const token = searchParams.get('token');
    const userData = searchParams.get('user');
    const error = searchParams.get('error');

    console.log('=== GoogleCallback ===');
    console.log('Token:', token ? 'present' : 'missing');
    console.log('User:', userData ? 'present' : 'missing');
    console.log('Error:', error);

    if (error) {
      console.error('OAuth error:', error);
      toast.error(`Google authentication failed: ${error}`);
      navigate('/login?error=' + encodeURIComponent(error));
      hasProcessed.current = true;
      return;
    }

    if (!token || !userData) {
      console.error('Missing token or user data');
      toast.error('Failed to authenticate with Google. Please try again.');
      navigate('/login?error=Missing authentication data');
      hasProcessed.current = true;
      return;
    }

    try {
      // Parse user data
      let user = JSON.parse(decodeURIComponent(userData));
      
      console.log('Parsed user:', user);
      
      // Ensure roles is array of objects
      if (user.roles && Array.isArray(user.roles)) {
        if (typeof user.roles[0] === 'string') {
          user.roles = user.roles.map(role => ({ role }));
        }
      } else {
        user.roles = [{ role: 'student' }];
      }
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Stored in localStorage');
      
      // Update context
      login(user, token);
      
      console.log('Login called, redirecting to dashboard');
      
      // Show success message
      toast.success(`You have been successfully logged in with Google as ${user.FName}!`);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Error:', err);
      toast.error(`Failed to process Google authentication: ${err.message}`);
      navigate('/login?error=' + encodeURIComponent(err.message));
    }

    hasProcessed.current = true;
  }, [searchParams, navigate, login, toast]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Logging in with Google...</p>
    </div>
  );
}
