import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/theme-toggle.css';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
