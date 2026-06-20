import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  // Listen for system theme changes (when user hasn't explicitly set a preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!('theme' in localStorage)) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggle = () => setIsDark(!isDark);

  // RTL-aware positioning: knob starts at right (RTL start)
  // Dark = slide left, Light = stay right
  // Button is 56px (w-14), knob is 24px (w-6), travel = 32px
  const knobPosition = isDark
    ? 'left-1'   // dark: knob at left
    : 'right-1'; // light: knob at right (RTL natural start)

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-8 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
    >
      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md transition-all duration-200 ${knobPosition}`}
      >
        <div className="flex items-center justify-center h-full">
          {isDark ? (
            <FiMoon className="text-gray-700 dark:text-gray-300" />
          ) : (
            <FiSun className="text-yellow-500" />
          )}
        </div>
      </div>
    </button>
  );
};
