import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import '../styles/breadcrumb.css';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap = {
    dashboard: 'Dashboard',
    courses: 'Courses',
    resources: 'Resources',
    schedules: 'Schedules',
    discussion: 'Discussion',
    settings: 'Settings',
    users: 'Users',
    create: 'Create',
    edit: 'Edit',
  };

  if (pathnames.length === 0 || pathnames[0] === 'login' || pathnames[0] === 'signup') {
    return null;
  }

  return (
    <nav className="breadcrumb">
      <Link to="/dashboard" className="breadcrumb-item">
        <Home size={16} color="#ec4899" style={{ display: 'inline', marginRight: '6px' }} />
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbNameMap[name] || name;

        return (
          <span key={routeTo} className="breadcrumb-wrapper">
            <span className="breadcrumb-separator">/</span>
            {isLast ? (
              <span className="breadcrumb-item active">{displayName}</span>
            ) : (
              <Link to={routeTo} className="breadcrumb-item">
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
