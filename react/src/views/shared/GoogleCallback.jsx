import { useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed.current) {
      console.log('GoogleCallback: Already processed, skipping');
      return;
    }
    hasProcessed.current = true;

    const handleCallback = async () => {
      try {
        console.log('GoogleCallback: Component mounted');
        
        const token = searchParams.get('token');

        console.log('GoogleCallback: token=', token ? 'exists' : 'missing');

        if (!token) {
          console.log('No token in URL');
          navigate('/login');
          return;
        }

        try {
          console.log('Fetching auth data from backend...');
          
          // Call backend API to get auth data
          const response = await axios.get('http://localhost:8000/api/auth/google/data', {
            params: { token }
          });
          
          console.log('Auth data received from backend');
          
          const user = response.data.user;
          const authToken = response.data.token;

          console.log('User roles:', user.roles);
          console.log('Logging in user');
          login(user, authToken);
          
          console.log('Redirecting to dashboard...');
          navigate('/dashboard');
        } catch (apiError) {
          console.error('Error fetching auth data:', apiError);
          console.error('Error details:', apiError.message);
          if (apiError.response) {
            console.error('Response status:', apiError.response.status);
            console.error('Response data:', apiError.response.data);
          }
          navigate('/login');
        }
      } catch (error) {
        console.error('Callback error:', error);
        console.error('Error details:', error.message);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, login, searchParams]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Logging in with Google...</p>
    </div>
  );
}
