// cakes-and-crunches SPA core app

const { HashRouter, Routes, Route, Link, useNavigate, useParams, useLocation, Navigate } = ReactRouterDOM;
const { useState, useEffect, useContext, createContext, useRef } = React;

// -------------------------------------------------------------------
// REACT ICON HELPER (Renders clean vector SVGs with tailwind classes)
// -------------------------------------------------------------------
function Icon({ name, className = "w-5 h-5", ...props }) {
  const icons = {
    dashboard: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    ),
    customers: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    allergies: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    diet: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    ),
    ingredients: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    ),
    products: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    ),
    orders: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    ),
    notifications: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    ),
    admin: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
    reports: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-1a1 1 0 00-1-1h-2a1 1 0 00-1 1v3h4v-3z" />
    ),
    logout: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    ),
    edit: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    ),
    delete: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    warning: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ),
    close: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ),
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    sun: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
    ),
    moon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    ),
    info: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    filter: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    ),
    download: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    ),
    clock: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    eye: (
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </g>
    ),
    eyeOff: (
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L3 3m12 12l9 9M21 12a9 9 0 01-1.562 3.028" />
      </g>
    )
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...props}
    >
      {icons[name] || (
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      )}
    </svg>
  );
}

// -------------------------------------------------------------------
// AUTHENTICATION & NOTIFICATION CONTEXT PROVIDER
// -------------------------------------------------------------------
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch Current Logged-in User & Initial State
  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.authenticated) {
        setUser(res.data.user);
        // Add Authorization header defaults for post-login requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.user.id}`;
        fetchNotifications();
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await axios.get('/api/notifications');
      setNotifs(res.data.notifications);
      setUnreadNotifsCount(res.data.unread_count);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Check Dark Mode preference
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      showToast('Espresso Dark Mode activated', 'info');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      showToast('Creamy Light Mode activated', 'info');
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      setUser(res.data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.user.id}`;
      showToast(`Welcome back, ${res.data.user.full_name || username}!`, 'success');
      fetchNotifications();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      showToast(msg, 'danger');
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      showToast('Logged out successfully', 'info');
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  };

  const markNotificationRead = async (nid) => {
    try {
      await axios.post(`/api/notifications/${nid}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const readAllNotifications = async () => {
    try {
      await axios.post('/api/notifications/read-all');
      fetchNotifications();
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, darkMode, toggleDarkMode,
      notifs, unreadNotifsCount, fetchNotifications, markNotificationRead, readAllNotifications,
      toasts, showToast, checkAuth
    }}>
      {children}
      {/* Toast Render Panel */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg animate-slide-up bg-white dark:bg-bakery-900 ${
              t.type === 'success' ? 'border-green-500/30 text-green-600 dark:text-green-400 bg-green-50/55' :
              t.type === 'warning' ? 'border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-50/55' :
              t.type === 'danger' ? 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-50/55' :
              'border-bakery-100 text-bakery-700 dark:text-bakery-200 dark:border-bakery-800'
            }`}
          >
            <Icon
              name={t.type === 'success' ? 'check' : t.type === 'danger' ? 'warning' : t.type === 'warning' ? 'warning' : 'info'}
              className="w-5 h-5 flex-shrink-0"
            />
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

// -------------------------------------------------------------------
// LAYOUT & WRAPPERS
// -------------------------------------------------------------------
function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', role: 'staff' },
    { label: 'Customers', path: '/customers', icon: 'customers', role: 'staff' },
    { label: 'Ingredients', path: '/ingredients', icon: 'ingredients', role: 'staff' },
    { label: 'Products', path: '/products', icon: 'products', role: 'staff' },
    { label: 'Place Order', path: '/orders/new', icon: 'plus', role: 'staff', highlight: true },
    { label: 'Orders List', path: '/orders', icon: 'orders', role: 'staff' },
    { label: 'Reports Hub', path: '/reports', icon: 'reports', role: 'staff' },
    { label: 'Admin Settings', path: '/admin', icon: 'admin', role: 'admin' },
  ];

  return (
    <div className="w-64 min-h-screen bg-bakery-900 text-white flex flex-col justify-between border-r border-bakery-800">
      <div>
        {/* Title */}
        <div className="p-6 border-b border-bakery-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bakery-500 flex items-center justify-center text-white font-bold text-lg font-serif">
              C&C
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Cakes & Crunches</h1>
              <p className="text-xs text-bakery-100/60 font-medium">Allergy Safety System</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            if (item.role === 'admin' && user?.role !== 'admin') return null;
            
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive 
                    ? 'bg-bakery-500 text-white shadow-md shadow-bakery-500/10' 
                    : item.highlight
                    ? 'bg-bakery-800 text-bakery-100 hover:bg-bakery-700/80 border border-dashed border-bakery-500/30'
                    : 'text-bakery-100/70 hover:bg-bakery-800 hover:text-white'
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-bakery-800 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-bakery-700 flex items-center justify-center">
            <Icon name="user" className="w-5 h-5 text-bakery-100" />
          </div>
          <div>
            <p className="text-xs font-semibold truncate max-w-[120px]">{user?.full_name || user?.username}</p>
            <span className="text-[10px] uppercase font-bold tracking-wider text-bakery-100/40">
              {user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-bakery-800/50 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/10 transition-colors"
        >
          <Icon name="logout" className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function Header({ title }) {
  const { user, darkMode, toggleDarkMode, notifs, unreadNotifsCount, markNotificationRead, readAllNotifications } = useContext(AuthContext);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  return (
    <header className="h-16 border-b border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 flex items-center justify-between px-8 relative">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-xl bg-bakery-50 hover:bg-bakery-100 dark:bg-bakery-800/40 dark:hover:bg-bakery-800/80 border border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 flex items-center justify-center transition-colors"
        >
          <Icon name={darkMode ? 'sun' : 'moon'} className="w-5 h-5" />
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className="w-10 h-10 rounded-xl bg-bakery-50 hover:bg-bakery-100 dark:bg-bakery-800/40 dark:hover:bg-bakery-800/80 border border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 flex items-center justify-center transition-colors relative"
          >
            <Icon name="notifications" className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-white dark:ring-bakery-900">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {showNotifPanel && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)}></div>
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 shadow-xl z-50 animate-slide-up flex flex-col">
                <div className="p-4 border-b border-bakery-100 dark:border-bakery-800 flex justify-between items-center bg-bakery-50/50 dark:bg-bakery-900/50">
                  <h3 className="font-bold text-xs">Notifications</h3>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={readAllNotifications}
                      className="text-[10px] text-bakery-500 hover:text-bakery-600 font-bold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="divide-y divide-bakery-50 dark:divide-bakery-800/40 overflow-y-auto flex-1">
                  {notifs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-bakery-700 dark:text-bakery-300">
                      No notifications
                    </div>
                  ) : (
                    notifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs cursor-pointer hover:bg-bakery-50/40 dark:hover:bg-bakery-800/10 flex items-start gap-2.5 transition-colors ${
                          !n.read ? 'bg-bakery-100/20 dark:bg-bakery-800/20 font-medium' : ''
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.type === 'danger' ? 'bg-red-500' :
                          n.type === 'warning' ? 'bg-orange-500' :
                          n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-bakery-700 dark:text-bakery-200">{n.message}</p>
                          <span className="text-[10px] text-bakery-600 dark:text-bakery-400 mt-1 block">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function PageWrapper({ title, children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-bakery-50 dark:bg-[#120907]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header title={title} />
        <main className="p-8 flex-1 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: LOGIN
// -------------------------------------------------------------------
function LoginView() {
  const { login, user, showToast } = useContext(AuthContext);
  const [mode, setMode] = useState('login'); // 'login' or 'request-setup'
  const [loginType, setLoginType] = useState('staff'); // 'staff' or 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const success = await login(username, password);
      if (success) navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/request-setup', { email: emailInput });
      showToast(res.data.message, 'success');
      
      // If it is our seeded admin, we help the user by automatically filling in the link!
      if (emailInput === 'admin@cakesandcrunches.com') {
        showToast('Demo link copied/available! Redirecting to setup password...', 'info');
        setTimeout(() => {
          window.location.hash = `#/set-password?email=${emailInput}&token=setup-token-admin`;
        }, 1500);
      } else {
        setError('Check your backend console logs for the simulated activation link.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send setup link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bakery-50 dark:bg-bakery-900 px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="gradient-blob -top-20 -left-20"></div>
      <div className="gradient-blob -bottom-20 -right-20"></div>
      
      <div className="w-full max-w-md p-8 rounded-2xl border border-bakery-100 dark:border-bakery-800 bg-white/80 dark:bg-bakery-900/80 backdrop-blur-md shadow-2xl animate-slide-up">
        {mode === 'login' ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex w-16 h-16 rounded-full bg-bakery-500 items-center justify-center text-white font-bold text-3xl font-serif shadow-lg shadow-bakery-500/20 mb-3">
                C
              </div>
              <h2 className="text-2xl font-bold font-serif text-bakery-700 dark:text-bakery-100">Cakes & Crunches</h2>
              <p className="text-sm text-bakery-700 dark:text-bakery-300 mt-1">Customer Allergy & Dietary Preference Profile System</p>
            </div>

            <div className="flex p-1 bg-bakery-50 dark:bg-bakery-950 rounded-xl mb-6 border border-bakery-100/50 dark:border-bakery-800/30">
              <button
                type="button"
                onClick={() => { setLoginType('staff'); setUsername(''); setPassword(''); setError(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  loginType === 'staff'
                    ? 'bg-white dark:bg-bakery-800 text-bakery-600 dark:text-bakery-100 shadow-sm'
                    : 'text-bakery-700 dark:text-bakery-400 hover:text-bakery-600'
                }`}
              >
                Staff Login
              </button>
              <button
                type="button"
                onClick={() => { setLoginType('admin'); setUsername(''); setPassword(''); setError(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  loginType === 'admin'
                    ? 'bg-white dark:bg-bakery-800 text-bakery-600 dark:text-bakery-100 shadow-sm'
                    : 'text-bakery-700 dark:text-bakery-400 hover:text-bakery-600'
                }`}
              >
                Admin Login
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-600 dark:text-red-400">
                <Icon name="warning" className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 block mb-1.5">
                  {loginType === 'admin' ? 'Email Address' : 'Username'}
                </label>
                <input
                  type={loginType === 'admin' ? 'email' : 'text'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={loginType === 'admin' ? 'admin@cakesandcrunches.com' : 'Enter staff username'}
                  className="w-full px-4 py-3 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/30 focus:border-bakery-500 transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 block">
                    Password
                  </label>
                  {loginType === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setMode('request-setup')}
                      className="text-xs text-bakery-500 hover:underline font-bold"
                    >
                      Setup Admin Password
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/30 focus:border-bakery-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-bakery-400 hover:text-bakery-600 dark:text-bakery-600 dark:hover:text-bakery-400 focus:outline-none transition-colors"
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-bakery-500 text-white font-semibold text-sm hover:bg-bakery-600 shadow-md shadow-bakery-500/20 active:translate-y-px transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>


          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex w-16 h-16 rounded-full bg-bakery-500 items-center justify-center text-white font-bold text-3xl font-serif shadow-lg shadow-bakery-500/20 mb-3">
                🛡️
              </div>
              <h2 className="text-2xl font-bold font-serif text-bakery-700 dark:text-bakery-100">Admin Activation</h2>
              <p className="text-sm text-bakery-700 dark:text-bakery-300 mt-1">Request password setup link for administrator</p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-600 dark:text-red-400">
                <Icon name="warning" className="w-5 h-5 flex-shrink-0 text-red-500" />
                <span className="break-all">{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestSetup} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 block mb-1.5">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@cakesandcrunches.com"
                  className="w-full px-4 py-3 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/30 focus:border-bakery-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-bakery-500 text-white font-semibold text-sm hover:bg-bakery-600 shadow-md shadow-bakery-500/20 active:translate-y-px transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Send Password Setup Link</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode('login')}
                className="text-xs text-bakery-500 hover:underline font-bold"
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: DASHBOARD
// -------------------------------------------------------------------
function DashboardView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const allergyChartRef = useRef(null);
  const statusChartRef = useRef(null);
  const { showToast } = useContext(AuthContext);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading stats', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Set up charts in useEffect
  useEffect(() => {
    if (!stats) return;

    let allergyChartInst = null;
    let statusChartInst = null;

    // 1. Bar Chart: Allergies
    if (allergyChartRef.current) {
      // Mock allergy frequencies for display
      const labels = ['Milk', 'Egg', 'Peanut', 'Tree Nuts', 'Soy', 'Wheat', 'Gluten', 'Sesame'];
      const data = [4, 3, 5, 2, 1, 2, 3, 1]; // matching seeds loosely + UI look
      
      allergyChartInst = new Chart(allergyChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Allergy Frequency',
            data,
            backgroundColor: 'rgba(214, 123, 80, 0.75)',
            borderColor: 'rgb(214, 123, 80)',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Pie Chart: Order status distribution
    if (statusChartRef.current) {
      const statuses = Object.keys(stats.status_counts);
      const counts = Object.values(stats.status_counts);
      
      statusChartInst = new Chart(statusChartRef.current, {
        type: 'doughnut',
        data: {
          labels: statuses,
          datasets: [{
            data: counts,
            backgroundColor: [
              'rgba(234, 179, 8, 0.8)',   // Pending (Yellow)
              'rgba(249, 115, 22, 0.8)',  // Preparing (Orange)
              'rgba(59, 130, 246, 0.8)',   // Completed (Blue)
              'rgba(34, 197, 94, 0.8)',   // Delivered (Green)
              'rgba(239, 68, 68, 0.8)'    // Cancelled (Red)
            ],
            borderColor: 'transparent',
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
          }
        }
      });
    }

    return () => {
      if (allergyChartInst) allergyChartInst.destroy();
      if (statusChartInst) statusChartInst.destroy();
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Customers', value: stats.total_customers, icon: 'customers', color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Total Orders Placed', value: stats.total_orders, icon: 'orders', color: 'bg-bakery-100 text-bakery-700 dark:bg-bakery-800/40 dark:text-bakery-500' },
    { label: 'Allergic Profiles', value: stats.cust_with_allergies, icon: 'allergies', color: 'bg-red-500/10 text-red-500' },
    { label: 'Diet Preferences', value: stats.cust_with_diets, icon: 'diet', color: 'bg-green-500/10 text-green-600' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {statCards.map((c, i) => (
          <div key={i} className="bakery-card flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-bakery-800 dark:text-bakery-200 dark:text-bakery-600 dark:text-bakery-400">
                {c.label}
              </p>
              <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{c.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.color}`}>
              <Icon name={c.icon} className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action & Stat Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Actions */}
        <div className="bakery-card flex flex-col gap-4 shadow-sm">
          <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase">Quick Command Bar</h3>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/orders/new"
              className="flex items-center gap-3 p-3 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-bakery-500/10 active:translate-y-px transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <Icon name="plus" className="w-5 h-5" />
              </div>
              <span>Create New Order</span>
            </Link>

            <Link
              to="/customers"
              className="flex items-center gap-3 p-3 bg-white hover:bg-bakery-50 dark:bg-bakery-800 dark:hover:bg-bakery-700/80 text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 border border-bakery-100 dark:border-bakery-800 rounded-xl font-semibold text-sm active:translate-y-px transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-bakery-500/10 flex items-center justify-center text-bakery-500">
                <Icon name="customers" className="w-5 h-5" />
              </div>
              <span>Manage Customers</span>
            </Link>

            <Link
              to="/ingredients"
              className="flex items-center gap-3 p-3 bg-white hover:bg-bakery-50 dark:bg-bakery-800 dark:hover:bg-bakery-700/80 text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 border border-bakery-100 dark:border-bakery-800 rounded-xl font-semibold text-sm active:translate-y-px transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                <Icon name="ingredients" className="w-5 h-5" />
              </div>
              <span>Ingredient Catalog</span>
            </Link>
          </div>
        </div>

        {/* Middle: Allergy distribution bar chart */}
        <div className="bakery-card lg:col-span-2 shadow-sm flex flex-col">
          <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4">Common Allergies</h3>
          <div className="relative h-44 flex-1">
            <canvas ref={allergyChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Tables and Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bakery-card lg:col-span-2 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase">Recent Orders</h3>
            <Link to="/orders" className="text-xs font-bold text-bakery-500 hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-bakery-50 dark:border-bakery-800/40 text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 pb-2">
                  <th className="py-2.5">ID</th>
                  <th>Customer</th>
                  <th>Delivery Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bakery-50/50 dark:divide-bakery-800/20 text-sm">
                {stats.recent_orders.map((o) => (
                  <tr key={o.id} className="hover:bg-bakery-50/20 dark:hover:bg-bakery-800/5">
                    <td className="py-3 font-semibold">#{o.id}</td>
                    <td>{o.customer_name}</td>
                    <td>{o.delivery_date}</td>
                    <td className="font-medium">${o.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'Completed' ? 'bg-green-500/10 text-green-600' :
                        o.status === 'Preparing' ? 'bg-orange-500/10 text-orange-500' :
                        o.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order status pie chart */}
        <div className="bakery-card shadow-sm flex flex-col">
          <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4">Order Pipeline</h3>
          <div className="relative h-48 flex-1">
            <canvas ref={statusChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bakery-card shadow-sm flex flex-col">
        <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4">Activity Audit Logs</h3>
        <div className="flex flex-col divide-y divide-bakery-50 dark:divide-bakery-800/40 text-xs">
          {stats.recent_activities.map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <span className={`w-2 h-2 rounded-full mt-1.5 ${
                  log.action === 'Allergy Override' ? 'bg-red-500 animate-pulse' :
                  log.action.includes('Create') ? 'bg-green-500' :
                  log.action.includes('Update') ? 'bg-blue-500' : 'bg-bakery-100/60'
                }`} />
                <div>
                  <p className="font-medium text-bakery-700 dark:text-bakery-200">
                    {log.details}
                  </p>
                  <span className="text-[10px] text-bakery-600 dark:text-bakery-400 font-medium">
                    By {log.username} ({log.user_role})
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-bakery-600 dark:text-bakery-400 flex-shrink-0">
                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: CUSTOMER MANAGEMENT
// -------------------------------------------------------------------
function CustomerListView() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [allergyFilter, setAllergyFilter] = useState('');
  const [dietFilter, setDietFilter] = useState('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editCustId, setEditCustId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    full_name: '', phone: '', email: '', gender: 'Female', dob: '',
    address: '', emergency_contact: '', preferred_contact: 'Phone', notes: ''
  });
  const [allergies, setAllergies] = useState([]); // [{allergy_name: '', severity: 'Moderate', notes: ''}]
  const [diets, setDiets] = useState([]); // Array of strings
  
  const { showToast } = useContext(AuthContext);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/customers', {
        params: { search, allergy: allergyFilter, diet: dietFilter }
      });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading customers', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, allergyFilter, dietFilter]);

  const handleOpenAdd = () => {
    setEditCustId(null);
    setFormData({
      full_name: '', phone: '', email: '', gender: 'Female', dob: '',
      address: '', emergency_contact: '', preferred_contact: 'Phone', notes: ''
    });
    setAllergies([]);
    setDiets([]);
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditCustId(c.id);
    setFormData({
      full_name: c.full_name, phone: c.phone || '', email: c.email || '',
      gender: c.gender || 'Female', dob: c.dob || '', address: c.address || '',
      emergency_contact: c.emergency_contact || '', preferred_contact: c.preferred_contact || 'Phone',
      notes: c.notes || ''
    });
    setAllergies(c.allergies.map(a => ({ allergy_name: a.allergy_name, severity: a.severity, notes: a.notes })));
    setDiets(c.diet_preferences);
    setShowModal(true);
  };

  const handleDelete = async (cid) => {
    try {
      await axios.delete(`/api/customers/${cid}`);
      showToast('Customer deleted successfully', 'success');
      setDeleteConfirmId(null);
      fetchCustomers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'danger');
    }
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) return;

    const payload = {
      ...formData,
      allergies: allergies.filter(a => a.allergy_name.trim() !== ''),
      diet_preferences: diets
    };

    try {
      if (editCustId) {
        await axios.put(`/api/customers/${editCustId}`, payload);
        showToast('Customer updated successfully', 'success');
      } else {
        await axios.post('/api/customers', payload);
        showToast('Customer profile created', 'success');
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'danger');
    }
  };

  // Allergy / Diet fields manipulation helpers
  const handleAddAllergyRow = () => {
    setAllergies([...allergies, { allergy_name: '', severity: 'Moderate', notes: '' }]);
  };
  const handleRemoveAllergyRow = (idx) => {
    setAllergies(allergies.filter((_, i) => i !== idx));
  };
  const handleAllergyChange = (idx, field, val) => {
    const updated = [...allergies];
    updated[idx][field] = val;
    setAllergies(updated);
  };

  const toggleDiet = (pref) => {
    if (diets.includes(pref)) {
      setDiets(diets.filter(d => d !== pref));
    } else {
      setDiets([...diets, pref]);
    }
  };

  const dietOptions = [
    'Vegetarian', 'Vegan', 'Jain', 'Gluten Free', 'Sugar Free', 
    'Dairy Free', 'Eggless', 'Halal', 'Keto', 'Low Carb', 'Low Sugar'
  ];

  const commonAllergiesList = [
    'Milk', 'Egg', 'Peanut', 'Tree Nuts', 'Soy', 'Wheat', 'Gluten', 'Fish', 'Shellfish', 'Sesame', 'Chocolate'
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Filter panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20 focus:border-bakery-500 transition-all"
          />
          <Icon name="search" className="w-5 h-5 text-bakery-400 dark:text-bakery-600 absolute left-3 top-3" />
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
          {/* Allergy Filter */}
          <select
            value={allergyFilter}
            onChange={(e) => setAllergyFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-xs font-semibold focus:outline-none"
          >
            <option value="">All Allergies</option>
            {commonAllergiesList.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Diet Filter */}
          <select
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-xs font-semibold focus:outline-none"
          >
            <option value="">All Diets</option>
            {dietOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl font-bold text-xs shadow-md shadow-bakery-500/10 active:translate-y-px transition-all"
          >
            <Icon name="plus" className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bakery-card text-center p-12 text-bakery-600 dark:text-bakery-400 font-medium">
          No customer profiles found matching filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((c) => (
            <div key={c.id} className="bakery-card flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-base font-serif text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">{c.full_name}</h3>
                    <p className="text-xs text-bakery-600 dark:text-bakery-400 mt-0.5">{c.phone || 'No phone'}</p>
                  </div>
                  
                  {/* Actions dropdown/buttons */}
                  <div className="flex gap-1">
                    <Link
                      to={`/customers/${c.id}`}
                      className="p-1.5 rounded-lg bg-bakery-50 dark:bg-bakery-800/40 text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 hover:bg-bakery-100 hover:text-bakery-700 transition-colors"
                      title="View Details"
                    >
                      <Icon name="eye" className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 rounded-lg bg-bakery-50 dark:bg-bakery-800/40 text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 hover:bg-bakery-500/10 hover:text-bakery-500 transition-colors"
                      title="Edit Customer"
                    >
                      <Icon name="edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setDeleteConfirmId(c.id); setDeleteConfirmName(c.full_name); }}
                      className="p-1.5 rounded-lg bg-bakery-50 dark:bg-bakery-800/40 text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      title="Delete Customer"
                    >
                      <Icon name="delete" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Allergies section */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold text-bakery-700 dark:text-bakery-300 uppercase tracking-wider block mb-1">
                    Allergies
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.allergies.length === 0 ? (
                      <span className="text-xs text-bakery-500 dark:text-bakery-400 italic">None</span>
                    ) : (
                      c.allergies.map((a, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                            a.severity === 'Severe' ? 'badge-severe' :
                            a.severity === 'Moderate' ? 'badge-moderate' : 'badge-safe'
                          }`}
                          title={a.notes}
                        >
                          {a.allergy_name}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Dietary preferences section */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-bakery-700 dark:text-bakery-300 uppercase tracking-wider block mb-1">
                    Dietary
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.diet_preferences.length === 0 ? (
                      <span className="text-xs text-bakery-500 dark:text-bakery-400 italic">None</span>
                    ) : (
                      c.diet_preferences.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-green-500/10 text-green-600 dark:text-green-400">
                          {d}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Notes block */}
              {c.notes && (
                <div className="mt-4 pt-3 border-t border-bakery-50 dark:border-bakery-800/30">
                  <p className="text-xs text-bakery-600 dark:text-bakery-400 line-clamp-2 italic">"{c.notes}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bakery-900 w-full max-w-3xl rounded-2xl border border-bakery-100 dark:border-bakery-800 shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-bakery-50 dark:border-bakery-800/40 flex justify-between items-center bg-bakery-50/20 dark:bg-bakery-900/50">
              <h2 className="text-lg font-bold font-serif text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">
                {editCustId ? 'Modify Customer Profile' : 'New Customer Registration'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-bakery-50 dark:hover:bg-bakery-850">
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveCustomer} className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              {/* Primary fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Undisclosed">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Preferred Contact Method
                  </label>
                  <select
                    value={formData.preferred_contact}
                    onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none"
                  >
                    <option value="Phone">Phone Call</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS Text</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Emergency Contact (e.g., "Jane Doe - 555-0199")
                  </label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    placeholder="Name, Relationship, Phone number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows="2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                  ></textarea>
                </div>
              </div>

              {/* Diet selection */}
              <div className="p-4 border border-bakery-100 dark:border-bakery-800 rounded-xl">
                <span className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-3">
                  Dietary Preferences
                </span>
                <div className="flex flex-wrap gap-2">
                  {dietOptions.map((pref) => {
                    const isSelected = diets.includes(pref);
                    return (
                      <button
                        type="button"
                        key={pref}
                        onClick={() => toggleDiet(pref)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400 shadow-sm'
                            : 'border-bakery-100 dark:border-bakery-800 hover:border-bakery-500 bg-white dark:bg-bakery-900 text-bakery-700 dark:text-bakery-200'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergies list editor */}
              <div className="p-4 border border-bakery-100 dark:border-bakery-800 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400">
                    Food Allergies Registry
                  </span>
                  <button
                    type="button"
                    onClick={handleAddAllergyRow}
                    className="px-2.5 py-1.5 border border-dashed border-bakery-500 text-bakery-500 bg-bakery-500/5 hover:bg-bakery-500/15 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Icon name="plus" className="w-3.5 h-3.5" />
                    <span>Add Allergy</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {allergies.length === 0 ? (
                    <p className="text-xs text-bakery-600 dark:text-bakery-400 italic text-center py-4">No allergies registered for this customer.</p>
                  ) : (
                    allergies.map((al, idx) => (
                      <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-bakery-50/40 dark:bg-bakery-850 p-3 rounded-xl border border-bakery-50 dark:border-bakery-800/40">
                        {/* Selector/Input */}
                        <div className="flex-1 min-w-[150px]">
                          <select
                            value={al.allergy_name}
                            onChange={(e) => handleAllergyChange(idx, 'allergy_name', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-bakery-100 bg-white"
                          >
                            <option value="">-- Choose Allergen --</option>
                            {commonAllergiesList.map(a => <option key={a} value={a}>{a}</option>)}
                            <option value="Other">Other (Type below)</option>
                          </select>
                          {al.allergy_name === 'Other' && (
                            <input
                              type="text"
                              placeholder="Enter custom allergy name"
                              value={al.custom_name || ''}
                              onChange={(e) => {
                                handleAllergyChange(idx, 'custom_name', e.target.value);
                                handleAllergyChange(idx, 'allergy_name', e.target.value);
                              }}
                              className="w-full px-2 py-1.5 mt-2 text-xs rounded-lg border border-bakery-100 bg-white"
                            />
                          )}
                        </div>

                        {/* Severity */}
                        <div className="w-[120px]">
                          <select
                            value={al.severity}
                            onChange={(e) => handleAllergyChange(idx, 'severity', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-bakery-100 bg-white"
                          >
                            <option value="Severe">Severe (Red)</option>
                            <option value="Moderate">Moderate (Orange)</option>
                            <option value="Safe">Safe (Green)</option>
                          </select>
                        </div>

                        {/* Notes */}
                        <div className="flex-1 min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Allergic response notes (e.g. skin rash)"
                            value={al.notes}
                            onChange={(e) => handleAllergyChange(idx, 'notes', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-bakery-100 bg-white"
                          />
                        </div>

                        {/* Delete row */}
                        <button
                          type="button"
                          onClick={() => handleRemoveAllergyRow(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Icon name="delete" className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* General Notes */}
              <div>
                <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                  General Customer Notes / Staff Instructions
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                  placeholder="Preferences, pickup notes, etc."
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm font-semibold hover:bg-bakery-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl font-bold text-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bakery-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-bakery-100 dark:border-bakery-800/50">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <Icon name="warning" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-bakery-700 dark:text-bakery-200">Delete Customer Profile</h3>
            </div>
            <p className="text-sm text-bakery-700 dark:text-bakery-300 mb-6 leading-relaxed">
              Are you sure you want to permanently delete the profile of <strong className="text-bakery-900 dark:text-white">{deleteConfirmName}</strong>? This action will also delete all of their past order history and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-300 hover:bg-bakery-50 dark:hover:bg-bakery-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: CUSTOMER PROFILE DETAIL VIEW
// -------------------------------------------------------------------
function CustomerDetailView() {
  const { cid } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(AuthContext);

  const fetchCustomerDetails = async () => {
    try {
      const res = await axios.get(`/api/customers/${cid}`);
      setCustomer(res.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading customer file', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [cid]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!customer) {
    return <div className="bakery-card text-center p-8">Customer file not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Return button */}
      <div className="mb-2">
        <Link to="/customers" className="text-xs font-bold text-bakery-500 hover:underline flex items-center gap-1">
          &larr; Back to Customers Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General Profile File */}
        <div className="bakery-card shadow-sm flex flex-col gap-5 h-fit">
          <div className="flex items-center gap-4 border-b border-bakery-50 dark:border-bakery-800/40 pb-4">
            <div className="w-14 h-14 rounded-full bg-bakery-500/10 text-bakery-500 flex items-center justify-center font-bold text-2xl font-serif">
              {customer.full_name[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">{customer.full_name}</h2>
              <span className="text-[10px] uppercase font-bold text-bakery-600 dark:text-bakery-400">ID: {customer.id}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-bakery-700 dark:text-bakery-300 font-semibold">Phone:</span>
              <span className="font-medium">{customer.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bakery-700 dark:text-bakery-300 font-semibold">Email:</span>
              <span className="font-medium truncate max-w-[200px]" title={customer.email}>{customer.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bakery-700 dark:text-bakery-300 font-semibold">DOB:</span>
              <span className="font-medium">{customer.dob || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bakery-700 dark:text-bakery-300 font-semibold">Gender:</span>
              <span className="font-medium">{customer.gender || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bakery-700 dark:text-bakery-300 font-semibold">Preferred Contact:</span>
              <span className="font-medium bg-bakery-500/10 text-bakery-500 px-2 py-0.5 rounded-lg text-xs font-bold">
                {customer.preferred_contact}
              </span>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-bakery-700 dark:text-bakery-300 font-semibold">Emergency Contact:</span>
              <span className="font-medium bg-red-500/5 border border-red-500/10 p-2.5 rounded-xl text-xs text-red-600 dark:text-red-400">
                {customer.emergency_contact || 'None registered'}
              </span>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-bakery-700 dark:text-bakery-300 font-semibold">Address:</span>
              <span className="font-medium text-xs text-bakery-700 dark:text-bakery-300">{customer.address || 'No address'}</span>
            </div>
          </div>
        </div>

        {/* Middle/Right columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Allergies & Diets overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allergies file */}
            <div className="bakery-card shadow-sm flex flex-col">
              <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-3">Allergy File</h3>
              <div className="flex flex-col gap-2">
                {customer.allergies.length === 0 ? (
                  <p className="text-xs text-bakery-500 dark:text-bakery-400 italic py-4">No allergy flags registered.</p>
                ) : (
                  customer.allergies.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 border border-bakery-50 dark:border-bakery-800/40 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-bakery-700 dark:text-bakery-200">{a.allergy_name}</span>
                        {a.notes && <p className="text-[10px] text-bakery-600 dark:text-bakery-400 mt-0.5">{a.notes}</p>}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        a.severity === 'Severe' ? 'badge-severe' :
                        a.severity === 'Moderate' ? 'badge-moderate' : 'badge-safe'
                      }`}>
                        {a.severity}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Diet preferences file */}
            <div className="bakery-card shadow-sm flex flex-col">
              <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-3">Diet preferences</h3>
              <div className="flex flex-wrap gap-2">
                {customer.diet_preferences.length === 0 ? (
                  <p className="text-xs text-bakery-500 dark:text-bakery-400 italic py-4">No dietary constraints registered.</p>
                ) : (
                  customer.diet_preferences.map((d, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400">
                      {d}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Customer History: Previous Orders */}
          <div className="bakery-card shadow-sm">
            <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4">Previous Orders</h3>
            <div className="flex flex-col gap-4">
              {customer.order_history.length === 0 ? (
                <p className="text-xs text-bakery-500 dark:text-bakery-400 italic py-4 text-center">No orders placed by this customer.</p>
              ) : (
                customer.order_history.map((o) => (
                  <div key={o.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 border border-bakery-50 dark:border-bakery-800/40 rounded-xl hover:border-bakery-500 transition-colors">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Order #{o.id}</span>
                        <span className="text-xs text-bakery-600 dark:text-bakery-400">on {new Date(o.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {/* Products items in order */}
                      <div className="flex flex-wrap gap-1.5">
                        {o.items.map((it) => (
                          <span key={it.id} className="text-xs bg-bakery-50 dark:bg-bakery-800 text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 px-2 py-1 rounded-lg">
                            {it.product_name} &times; {it.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between items-end gap-2 mt-3 md:mt-0">
                      <span className="text-sm font-bold">${o.total_amount.toFixed(2)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'Completed' ? 'bg-green-500/10 text-green-600' :
                        o.status === 'Preparing' ? 'bg-orange-500/10 text-orange-500' :
                        o.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Profile Activity Timeline */}
          <div className="bakery-card shadow-sm">
            <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4">Profile History Timeline</h3>
            <div className="relative border-l border-bakery-100 dark:border-bakery-800 ml-3 pl-6 flex flex-col gap-4.5">
              {customer.activity_history.length === 0 ? (
                <p className="text-xs text-bakery-500 dark:text-bakery-400 italic py-2 ml-[-6px]">No profile audit history logs.</p>
              ) : (
                customer.activity_history.map((act) => (
                  <div key={act.id} className="relative">
                    <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-bakery-500 ring-4 ring-white dark:ring-bakery-900" />
                    <div>
                      <span className="text-[10px] text-bakery-500 dark:text-bakery-400 font-bold block">
                        {new Date(act.created_at).toLocaleString()}
                      </span>
                      <p className="text-xs font-semibold text-bakery-700 dark:text-bakery-700 dark:text-bakery-200 mt-0.5">{act.action}</p>
                      <p className="text-xs text-bakery-600 dark:text-bakery-400 mt-0.5">{act.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: INGREDIENT CATALOG
// -------------------------------------------------------------------
function IngredientListView() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Dairy', description: '', status: 'Active'
  });
  const [allergensList, setAllergensList] = useState([]);

  const { showToast } = useContext(AuthContext);

  const fetchIngredients = async () => {
    try {
      const res = await axios.get('/api/ingredients', { params: { category: categoryFilter } });
      setIngredients(res.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading ingredients', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [categoryFilter]);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ name: '', category: 'Dairy', description: '', status: 'Active' });
    setAllergensList([]);
    setShowModal(true);
  };

  const handleOpenEdit = (i) => {
    setEditId(i.id);
    setFormData({ name: i.name, category: i.category || 'Dairy', description: i.description || '', status: i.status || 'Active' });
    setAllergensList(i.contains_allergens);
    setShowModal(true);
  };

  const handleDelete = async (iid) => {
    if (!window.confirm("Delete this ingredient from database?")) return;
    try {
      await axios.delete(`/api/ingredients/${iid}`);
      showToast('Ingredient deleted', 'success');
      fetchIngredients();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      ...formData,
      contains_allergens: allergensList
    };

    try {
      if (editId) {
        await axios.put(`/api/ingredients/${editId}`, payload);
        showToast('Ingredient updated', 'success');
      } else {
        await axios.post('/api/ingredients', payload);
        showToast('Ingredient created', 'success');
      }
      setShowModal(false);
      fetchIngredients();
    } catch (err) {
      showToast(err.response?.data?.message || 'Submit failed', 'danger');
    }
  };

  const toggleAllergen = (al) => {
    if (allergensList.includes(al)) {
      setAllergensList(allergensList.filter(a => a !== al));
    } else {
      setAllergensList([...allergensList, al]);
    }
  };

  const categoryOptions = ['Dairy', 'Nuts', 'Sweeteners', 'Grains', 'Fruits', 'Poultry', 'Flavours', 'Other'];
  
  const allergensToSelect = [
    'Milk', 'Egg', 'Peanut', 'Tree Nuts', 'Soy', 'Wheat', 'Gluten', 'Fish', 'Shellfish', 'Sesame', 'Chocolate'
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              categoryFilter === ''
                ? 'bg-bakery-500 border-bakery-500 text-white shadow-md shadow-bakery-500/10'
                : 'border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-200 bg-white dark:bg-bakery-900 hover:border-bakery-500'
            }`}
          >
            All Categories
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                categoryFilter === cat
                  ? 'bg-bakery-500 border-bakery-500 text-white shadow-md shadow-bakery-500/10'
                  : 'border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-200 bg-white dark:bg-bakery-900 hover:border-bakery-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl font-bold text-xs shadow-md shadow-bakery-500/10 transition-all active:translate-y-px"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>New Ingredient</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bakery-card shadow-sm p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bakery-50/50 dark:bg-bakery-900/50 border-b border-bakery-100 dark:border-bakery-800 text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300">
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Allergen Tags</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bakery-50/50 dark:divide-bakery-800/20 text-sm">
                {ingredients.map((ing) => (
                  <tr key={ing.id} className="hover:bg-bakery-50/20 dark:hover:bg-bakery-800/5">
                    <td className="p-4 font-semibold text-bakery-700 dark:text-bakery-200">{ing.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-bakery-500/5 text-bakery-700 dark:text-bakery-300">
                        {ing.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {ing.contains_allergens.length === 0 ? (
                          <span className="text-xs text-bakery-500/80 dark:text-bakery-450 italic">None</span>
                        ) : (
                          ing.contains_allergens.map((al, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-bold badge-severe">
                              {al}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-bakery-700 dark:text-bakery-200 max-w-xs truncate" title={ing.description}>
                      {ing.description || '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ing.status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {ing.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(ing)}
                        className="p-1.5 rounded-lg bg-bakery-50 dark:bg-bakery-800/40 hover:bg-bakery-500/10 hover:text-bakery-500 transition-colors"
                      >
                        <Icon name="edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ing.id)}
                        className="p-1.5 rounded-lg bg-bakery-50 dark:bg-bakery-800/40 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      >
                        <Icon name="delete" className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bakery-900 w-full max-w-lg rounded-2xl border border-bakery-100 dark:border-bakery-800 shadow-2xl flex flex-col animate-slide-up">
            <div className="p-6 border-b border-bakery-50 dark:border-bakery-800/40 flex justify-between items-center">
              <h2 className="text-lg font-bold font-serif text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">
                {editId ? 'Edit Ingredient' : 'New Ingredient File'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-bakery-50">
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                  Ingredient Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none"
                  >
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                    System Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Allergen check */}
              <div>
                <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-2">
                  Allergen Contained Tags
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-3 border border-bakery-50 dark:border-bakery-800 rounded-xl">
                  {allergensToSelect.map((al) => {
                    const isSelected = allergensList.includes(al);
                    return (
                      <button
                        type="button"
                        key={al}
                        onClick={() => toggleAllergen(al)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                          isSelected
                            ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400'
                            : 'border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-bakery-700 dark:text-bakery-200'
                        }`}
                      >
                        {al}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 dark:text-bakery-600 dark:text-bakery-400 block mb-1">
                  Ingredient Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white dark:bg-bakery-900 text-sm font-semibold rounded-xl border border-bakery-100 dark:border-bakery-800 hover:bg-bakery-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl font-bold text-sm"
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: PRODUCTS CATALOG
// -------------------------------------------------------------------
function ProductListView() {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', category: 'Cake', price: '', description: '', status: 'Active'
  });
  // Recipe composition mapping state: list of {ingredient_id: int, notes: str}
  const [recipeIngredients, setRecipeIngredients] = useState([]);

  const { showToast } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const prodRes = await axios.get('/api/products', { params: { category: categoryFilter } });
      setProducts(prodRes.data);
      
      const ingRes = await axios.get('/api/ingredients');
      setIngredients(ingRes.data.filter(i => i.status === 'Active'));
    } catch (err) {
      console.error(err);
      showToast('Error loading products', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryFilter]);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ name: '', category: 'Cake', price: '', description: '', status: 'Active' });
    setRecipeIngredients([]);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditId(p.id);
    setFormData({ name: p.name, category: p.category, price: p.price, description: p.description || '', status: p.status || 'Active' });
    setRecipeIngredients(p.ingredients.map(ri => ({ ingredient_id: ri.ingredient_id, notes: ri.notes })));
    setShowModal(true);
  };

  const handleDelete = async (pid) => {
    try {
      const res = await axios.delete(`/api/products/${pid}`);
      showToast(res.data.message || 'Product deleted', 'success');
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'danger');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || recipeIngredients.length === 0) {
      showToast('Name, price, and at least 1 ingredient are required', 'warning');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      ingredients: recipeIngredients.filter(ri => ri.ingredient_id)
    };

    try {
      if (editId) {
        await axios.put(`/api/products/${editId}`, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await axios.post('/api/products', payload);
        showToast('Product created successfully', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'danger');
    }
  };

  const handleAddRecipeIngredient = () => {
    setRecipeIngredients([...recipeIngredients, { ingredient_id: '', notes: '' }]);
  };
  const handleRemoveRecipeIngredient = (idx) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== idx));
  };
  const handleRecipeIngChange = (idx, field, val) => {
    const updated = [...recipeIngredients];
    updated[idx][field] = val;
    setRecipeIngredients(updated);
  };

  const categoryOptions = ['Cake', 'Brownie', 'Cookie', 'Pastry', 'Cupcake', 'Bread', 'Dessert Box'];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              categoryFilter === ''
                ? 'bg-bakery-500 border-bakery-500 text-white shadow-md shadow-bakery-500/10'
                : 'border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-200 bg-white dark:bg-bakery-900 hover:border-bakery-500'
            }`}
          >
            All Products
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                categoryFilter === cat
                  ? 'bg-bakery-500 border-bakery-500 text-white shadow-md shadow-bakery-500/10'
                  : 'border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-200 bg-white dark:bg-bakery-900 hover:border-bakery-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl font-bold text-xs shadow-md shadow-bakery-500/10 transition-all active:translate-y-px"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            // Aggregate all contains allergens for product card display
            const allAllergens = Array.from(new Set(
              p.ingredients.flatMap(i => i.contains_allergens)
            ));

            return (
              <div key={p.id} className="bakery-card flex flex-col justify-between shadow-sm border-t-4 border-t-bakery-500">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-base font-serif text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">{p.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-bakery-500/5 text-bakery-700 dark:text-bakery-300 font-bold rounded-lg uppercase">
                        {p.category}
                      </span>
                    </div>
                    <span className="text-base font-extrabold text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-bakery-700 dark:text-bakery-200 line-clamp-2 italic mb-4">
                    {p.description || 'No description provided.'}
                  </p>

                  {/* Recipe constituents list */}
                  <div className="mb-4 bg-bakery-50/40 dark:bg-bakery-850 p-2.5 rounded-xl border border-bakery-50 dark:border-bakery-800/40">
                    <span className="text-[10px] font-bold text-bakery-700 dark:text-bakery-300 uppercase tracking-wider block mb-1">
                      Recipe Ingredients
                    </span>
                    <div className="flex flex-col gap-0.5">
                      {p.ingredients.map((ri, i) => (
                        <div key={i} className="text-xs flex justify-between font-medium">
                          <span className="text-bakery-700 dark:text-bakery-200">{ri.ingredient_name}</span>
                          <span className="text-bakery-700 dark:text-bakery-300">{ri.notes || '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {/* Allergen warning tags */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-bakery-700 dark:text-bakery-300 uppercase tracking-wider block mb-1.5">
                      Contains Allergens
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {allAllergens.length === 0 ? (
                        <span className="text-xs text-green-600 dark:text-green-400 italic font-semibold">Safe (Allergen Free)</span>
                      ) : (
                        allAllergens.map((al, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold badge-severe uppercase">
                            {al}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center border-t border-bakery-50 dark:border-bakery-800/40 pt-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {p.status}
                    </span>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-bakery-50 dark:bg-bakery-800/40 hover:bg-bakery-500/10 hover:text-bakery-500 transition-colors"
                      >
                        <Icon name="edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setDeleteConfirmId(p.id); setDeleteConfirmName(p.name); }}
                        className="p-1.5 rounded-lg bg-bakery-50 dark:bg-bakery-800/40 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      >
                        <Icon name="delete" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bakery-900 w-full max-w-2xl rounded-2xl border border-bakery-100 dark:border-bakery-800 shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
            <div className="p-6 border-b border-bakery-50 dark:border-bakery-800/40 flex justify-between items-center">
              <h2 className="text-lg font-bold font-serif text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">
                {editId ? 'Modify Product Specifications' : 'New Product Entry'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-bakery-50">
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
                    Base Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 bg-white dark:bg-bakery-900 text-sm focus:outline-none"
                  >
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
                    Product Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 bg-white dark:bg-bakery-900 text-sm focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
                  Product Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
                ></textarea>
              </div>

              {/* Recipe builder section */}
              <div className="p-4 border border-bakery-100 dark:border-bakery-800 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block">
                    Recipe Composition * (Must have at least 1 ingredient)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddRecipeIngredient}
                    className="px-2.5 py-1.5 border border-dashed border-bakery-500 text-bakery-500 bg-bakery-500/5 hover:bg-bakery-500/15 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Icon name="plus" className="w-3.5 h-3.5" />
                    <span>Add Constituent</span>
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                  {recipeIngredients.length === 0 ? (
                    <p className="text-xs text-bakery-600 dark:text-bakery-400 italic text-center py-4">Add ingredients to formulate the product recipe recipe.</p>
                  ) : (
                    recipeIngredients.map((ri, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <select
                          value={ri.ingredient_id}
                          onChange={(e) => handleRecipeIngChange(idx, 'ingredient_id', parseInt(e.target.value))}
                          className="flex-1 px-2.5 py-2 text-xs rounded-xl border border-bakery-100 bg-white"
                          required
                        >
                          <option value="">-- Choose Ingredient --</option>
                          {ingredients.map(ing => (
                            <option key={ing.id} value={ing.id}>
                              {ing.name} {ing.contains_allergens_raw ? `(${ing.contains_allergens_raw})` : ''}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          placeholder="Usage (e.g. 200g, 3 eggs, frosting)"
                          value={ri.notes}
                          onChange={(e) => handleRecipeIngChange(idx, 'notes', e.target.value)}
                          className="flex-1 px-2.5 py-2 text-xs rounded-xl border border-bakery-100 bg-white"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveRecipeIngredient(idx)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Icon name="delete" className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-white dark:bg-bakery-900 border border-bakery-100 dark:border-bakery-800 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl font-bold text-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bakery-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-bakery-100 dark:border-bakery-800/50">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <Icon name="warning" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-bakery-700 dark:text-bakery-200">Remove Product</h3>
            </div>
            <p className="text-sm text-bakery-700 dark:text-bakery-300 mb-6 leading-relaxed">
              Are you sure you want to remove <strong className="text-bakery-900 dark:text-white">{deleteConfirmName}</strong> from the catalog?
              <br />
              <span className="text-xs text-bakery-500 dark:text-bakery-400 mt-2 block">
                Note: If this product has been ordered previously, it will be marked as Inactive so past order history remains intact.
              </span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-300 hover:bg-bakery-50 dark:hover:bg-bakery-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: PLACE ORDER (REAL-TIME ALLERGY SAFETY DETECTOR)
// -------------------------------------------------------------------
function OrderWizardView() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Allergy check block states
  const [allergyWarnings, setAllergyWarnings] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [overrideAccepted, setOverrideAccepted] = useState(false);

  const { showToast } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWizardData = async () => {
      try {
        const custRes = await axios.get('/api/customers');
        setCustomers(custRes.data);
        const prodRes = await axios.get('/api/products');
        setProducts(prodRes.data.filter(p => p.status === 'Active'));
      } catch (err) {
        console.error(err);
        showToast('Error initializing wizard data', 'danger');
      } finally {
        setLoading(false);
      }
    };
    loadWizardData();
    
    // Default delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Update selected customer object when selection changes
  useEffect(() => {
    if (selectedCustomerId) {
      const match = customers.find(c => c.id === parseInt(selectedCustomerId));
      setSelectedCustomer(match || null);
      setOverrideAccepted(false); // Reset override state
      setAllergyWarnings([]);
    } else {
      setSelectedCustomer(null);
      setOverrideAccepted(false);
      setAllergyWarnings([]);
    }
  }, [selectedCustomerId, customers]);

  // Run real-time check API
  const performAllergyCheck = async () => {
    if (!selectedCustomerId || orderItems.some(i => !i.product_id)) {
      setAllergyWarnings([]);
      return;
    }

    try {
      const res = await axios.post('/api/orders/check', {
        customer_id: parseInt(selectedCustomerId),
        items: orderItems.map(i => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) }))
      });
      
      setAllergyWarnings(res.data.warnings);
      if (res.data.has_warnings && !overrideAccepted) {
        setShowWarningModal(true); // Popup warning immediately
      }
    } catch (err) {
      console.error("Allergy check check failed:", err);
    }
  };

  // Run check whenever customer or items list changes
  useEffect(() => {
    performAllergyCheck();
  }, [selectedCustomerId, orderItems]);

  const handleAddItemRow = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (idx) => {
    setOrderItems(orderItems.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, val) => {
    const updated = [...orderItems];
    updated[idx][field] = val;
    setOrderItems(updated);
  };

  // Calculate Running Total
  const calculateTotal = () => {
    return orderItems.reduce((acc, item) => {
      const prod = products.find(p => p.id === parseInt(item.product_id));
      if (prod) {
        return acc + (prod.price * parseInt(item.quantity || 0));
      }
      return acc;
    }, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || orderItems.some(i => !i.product_id)) {
      showToast('Please select customer and products', 'warning');
      return;
    }

    // Double check warnings block
    if (allergyWarnings.length > 0 && !overrideAccepted) {
      setShowWarningModal(true);
      showToast('🚨 Allergy warning must be explicitly acknowledged.', 'danger');
      return;
    }

    const payload = {
      customer_id: parseInt(selectedCustomerId),
      delivery_date: deliveryDate,
      special_instructions: specialInstructions,
      items: orderItems.map(i => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) })),
      override_accepted: overrideAccepted
    };

    try {
      await axios.post('/api/orders', payload);
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'danger');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Order details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bakery-card shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase">Order Form</h3>
            
            {/* Customer selector */}
            <div>
              <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
                Select Customer Profile *
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 bg-white dark:bg-bakery-900 text-sm focus:outline-none"
                required
              >
                <option value="">-- Search / Choose Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.phone || 'No phone'}) {c.allergies.length > 0 ? `⚠️ ${c.allergies.length} Allergies` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
                  Delivery/Pickup Date *
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 bg-white dark:bg-bakery-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
                  Allergy Safety Override Status
                </label>
                <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  overrideAccepted 
                    ? 'bg-green-500/10 border-green-500 text-green-600' 
                    : allergyWarnings.length > 0 
                    ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse-border'
                    : 'bg-bakery-50/50 dark:bg-bakery-800/40 border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-300'
                }`}>
                  <span>{overrideAccepted ? 'OVERRIDDEN & APPROVED' : allergyWarnings.length > 0 ? 'ALERT! BLOCKED' : 'CLEARED (SAFE)'}</span>
                  {allergyWarnings.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowWarningModal(true)}
                      className="px-2 py-1 rounded bg-red-500 text-white text-[10px]"
                    >
                      Verify Alert
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products selector rows */}
          <div className="bakery-card shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-bakery-50 dark:border-bakery-800/30 pb-2">
              <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase">Order Items</h3>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="px-2.5 py-1.5 border border-dashed border-bakery-500 text-bakery-500 bg-bakery-500/5 hover:bg-bakery-500/15 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Icon name="plus" className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  {/* Select product */}
                  <select
                    value={item.product_id}
                    onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                    className="flex-1 px-2.5 py-2.5 rounded-xl border border-bakery-100 bg-white text-sm"
                    required
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>

                  {/* Quantity */}
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value))}
                    className="w-20 px-2.5 py-2.5 rounded-xl border border-bakery-100 bg-white text-sm text-center"
                    required
                  />

                  {/* Delete row */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    disabled={orderItems.length === 1}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg disabled:opacity-40"
                  >
                    <Icon name="delete" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-bakery-800 dark:text-bakery-300 block mb-1">
              Special Prep Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows="3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-bakery-100 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/20"
              placeholder="e.g. Write 'Happy Birthday' on cake. Safe prep."
            ></textarea>
          </div>
        </div>

        {/* Right Side: Summary & Safety Profile Checkout */}
        <div className="flex flex-col gap-6">
          {/* Customer safety profile checkout */}
          {selectedCustomer && (
            <div className="bakery-card shadow-sm border border-bakery-100 bg-white dark:bg-bakery-900 flex flex-col gap-3">
              <h4 className="font-bold text-xs uppercase text-bakery-700 dark:text-bakery-300 border-b pb-2">Customer Medical Registry</h4>
              
              {/* Allergies list */}
              <div>
                <span className="text-[10px] font-bold text-bakery-700 dark:text-bakery-200 uppercase">Registered Allergies</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCustomer.allergies.length === 0 ? (
                    <span className="text-xs text-green-600 italic font-semibold">None (Clear Allergy File)</span>
                  ) : (
                    selectedCustomer.allergies.map((a, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold ${
                          a.severity === 'Severe' ? 'badge-severe animate-pulse' :
                          a.severity === 'Moderate' ? 'badge-moderate' : 'badge-safe'
                        }`}
                      >
                        {a.allergy_name} ({a.severity})
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Diet preferences */}
              <div className="mt-2">
                <span className="text-[10px] font-bold text-bakery-700 dark:text-bakery-200 uppercase">Dietary Requirements</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCustomer.diet_preferences.length === 0 ? (
                    <span className="text-xs text-bakery-600 dark:text-bakery-400 italic">None</span>
                  ) : (
                    selectedCustomer.diet_preferences.map((d, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-green-500/10 text-green-600">
                        {d}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Box */}
          <div className="bakery-card shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase">Payment Summary</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-bakery-700 dark:text-bakery-200">Order Subtotal</span>
                <span className="font-medium">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bakery-700 dark:text-bakery-200">Taxes & Fees</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="border-t border-bakery-50 dark:border-bakery-800/40 my-2 pt-2 flex justify-between">
                <span className="font-bold text-sm">Grand Total</span>
                <span className="font-black text-lg text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                allergyWarnings.length > 0 && !overrideAccepted
                  ? 'bg-red-600 text-white cursor-not-allowed opacity-75 hover:bg-red-700'
                  : 'bg-bakery-500 text-white hover:bg-bakery-600 shadow-bakery-500/20'
              }`}
            >
              {allergyWarnings.length > 0 && !overrideAccepted 
                ? '⚠️ Allergy Warning Active' 
                : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </form>

      {/* Massive blocking modal warning - ALLERGY DETECTED */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bakery-900 border-2 border-red-500 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col p-6 animate-slide-up text-center">
            
            <div className="w-16 h-16 bg-red-500/10 border border-red-500 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-4 animate-bounce">
              ⚠️
            </div>

            <h2 className="text-xl font-extrabold text-red-600 dark:text-red-500 uppercase tracking-wide">
              🚨 ALLERGY WARNING
            </h2>
            
            <p className="text-xs text-bakery-700 dark:text-bakery-200 mt-2">
              The automated bakery check has identified immediate ingredient allergy conflicts for customer{' '}
              <strong className="text-bakery-700 dark:text-bakery-200">{selectedCustomer?.full_name}</strong>.
            </p>

            {/* List conflicts */}
            <div className="my-5 flex flex-col gap-2.5 max-h-56 overflow-y-auto">
              {allergyWarnings.map((w, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-left text-xs ${
                    w.severity === 'Severe' 
                      ? 'bg-red-500/5 border-red-500/35 text-red-700 dark:text-red-400' 
                      : 'bg-orange-500/5 border-orange-500/35 text-orange-700 dark:text-orange-400'
                  }`}
                >
                  <div className="flex justify-between font-bold text-xs uppercase mb-1">
                    <span>{w.product_name}</span>
                    <span className="px-2 py-0.5 rounded bg-black/10">{w.severity} Danger</span>
                  </div>
                  <p className="mt-1">
                    This item contains ingredient <strong className="underline">{w.ingredient_name}</strong> which contains/is allergen{' '}
                    <strong>{w.allergen}</strong>.
                  </p>
                  <p className="mt-1 font-medium text-[11px] bg-white/40 dark:bg-black/10 px-2 py-1 rounded">
                    <strong>Medical file:</strong> {w.allergy_notes || 'No specific response notes recorded.'}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setOverrideAccepted(true);
                  setShowWarningModal(false);
                  showToast('⚠️ Allergen warning overridden. Verification logged.', 'warning');
                }}
                className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/10 transition-colors"
              >
                Acknowledge and Override Warning (Log Audit Trail)
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowWarningModal(false);
                  setOrderItems([{ product_id: '', quantity: 1 }]); // Reset items to let them choose again
                  showToast('Order modification triggered.', 'info');
                }}
                className="py-3 bg-bakery-50 hover:bg-bakery-100 text-bakery-700 border border-bakery-100 rounded-xl text-sm font-bold transition-colors"
              >
                Cancel and Modify Recipe Selection
              </button>
            </div>

            <p className="text-[10px] text-bakery-600 dark:text-bakery-400 mt-4">
              All overrides are flagged in audit log visualizer. Proceeding triggers notification alert.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: ORDERS LIST
// -------------------------------------------------------------------
function OrderListView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { showToast } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders', { params: { status: statusFilter } });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      showToast('Error fetching orders list', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (oid, newStatus) => {
    try {
      await axios.put(`/api/orders/${oid}`, { status: newStatus });
      showToast(`Order #${oid} status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      showToast('Status update failed', 'danger');
    }
  };

  const statusOptions = ['Pending', 'Preparing', 'Completed', 'Delivered', 'Cancelled'];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${
              statusFilter === ''
                ? 'bg-bakery-500 border-bakery-500 text-white shadow-md shadow-bakery-500/10'
                : 'border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-200 bg-white dark:bg-bakery-900 hover:border-bakery-500'
            }`}
          >
            All Orders
          </button>
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${
                statusFilter === st
                  ? 'bg-bakery-500 border-bakery-500 text-white shadow-md shadow-bakery-500/10'
                  : 'border-bakery-100 dark:border-bakery-800 text-bakery-700 dark:text-bakery-200 bg-white dark:bg-bakery-900 hover:border-bakery-500'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <Link
          to="/orders/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl font-bold text-xs shadow-md shadow-bakery-500/10"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>New Order</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bakery-card text-center p-12 text-bakery-700 dark:text-bakery-300 font-medium">
          No orders found matching filters.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o.id} className="bakery-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-sm text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">Order #{o.id}</span>
                  <span className="text-xs text-bakery-600 dark:text-bakery-400 font-medium">
                    Delivery/Pickup Date: <strong className="text-bakery-700 dark:text-bakery-300">{o.delivery_date}</strong>
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-bakery-700 dark:text-bakery-200 font-semibold">
                    Customer: <strong className="text-bakery-700 dark:text-bakery-200">{o.customer_name}</strong> ({o.customer_phone})
                  </span>
                  {o.special_instructions && (
                    <span className="text-[11px] text-red-500/80 bg-red-500/5 p-1 px-2.5 rounded-lg w-fit mt-1 border border-red-500/10">
                      <strong>Prep Notes:</strong> {o.special_instructions}
                    </span>
                  )}
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {o.items.map((it) => (
                    <span key={it.id} className="text-xs bg-bakery-50 dark:bg-bakery-800 text-bakery-700 dark:text-bakery-200 px-2 py-1 rounded-lg border border-bakery-100/50">
                      {it.product_name} &times; {it.quantity} (${(it.price * it.quantity).toFixed(2)})
                    </span>
                  ))}
                </div>
              </div>

              {/* Status control and amount */}
              <div className="flex flex-row md:flex-col justify-between items-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-bakery-50 dark:border-bakery-800/40">
                <div className="text-right">
                  <span className="text-xs text-bakery-700 dark:text-bakery-300 block font-medium">Total Amount</span>
                  <strong className="text-lg font-black text-bakery-700 dark:text-bakery-700 dark:text-bakery-200">${o.total_amount.toFixed(2)}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={o.status}
                    onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-xl border border-bakery-100 bg-white font-semibold focus:outline-none"
                  >
                    {statusOptions.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: REPORTS CENTER
// -------------------------------------------------------------------
function ReportsView() {
  const [repStats, setRepStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const salesChartRef = useRef(null);
  const dietChartRef = useRef(null);
  
  const { showToast } = useContext(AuthContext);

  const fetchReportsData = async () => {
    try {
      const res = await axios.get('/api/reports/statistics');
      setRepStats(res.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading reports', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  useEffect(() => {
    if (!repStats) return;

    let salesChart = null;
    let dietChart = null;

    // 1. Line Chart: Sales over time
    if (salesChartRef.current) {
      const months = repStats.monthly_sales.map(x => x.month);
      const amounts = repStats.monthly_sales.map(x => x.amount);

      salesChart = new Chart(salesChartRef.current, {
        type: 'line',
        data: {
          labels: months.length > 0 ? months : ['2026-06'],
          datasets: [{
            label: 'Sales Revenue ($)',
            data: amounts.length > 0 ? amounts : [120],
            backgroundColor: 'rgba(214, 123, 80, 0.15)',
            borderColor: 'rgb(214, 123, 80)',
            borderWidth: 2,
            tension: 0.35,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Bar Chart: Diet statistics
    if (dietChartRef.current) {
      const diets = repStats.diet_stats.map(x => x.diet);
      const counts = repStats.diet_stats.map(x => x.count);

      dietChart = new Chart(dietChartRef.current, {
        type: 'bar',
        data: {
          labels: diets.length > 0 ? diets : ['Gluten Free', 'Vegan', 'Keto'],
          datasets: [{
            label: 'Customer Count',
            data: counts.length > 0 ? counts : [2, 1, 1],
            backgroundColor: 'rgba(22, 163, 74, 0.75)',
            borderColor: 'rgb(22, 163, 74)',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    return () => {
      if (salesChart) salesChart.destroy();
      if (dietChart) dietChart.destroy();
    };
  }, [repStats]);

  const handleDownload = (type) => {
    // Standard link download endpoint triggers browser download save dialog
    window.location.href = `/api/reports/download?type=${type}&format=csv`;
    showToast(`Downloading ${type} CSV report...`, 'success');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Downloader shortcuts panel */}
      <div className="bakery-card shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase">Download Data Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => handleDownload('customers')}
            className="flex items-center justify-between p-3.5 border border-bakery-100 hover:border-bakery-500 rounded-xl bg-white dark:bg-bakery-900 text-left font-semibold text-xs transition-all"
          >
            <div>
              <span className="block text-bakery-700 dark:text-bakery-200">Customers Database</span>
              <span className="text-[10px] text-bakery-700 dark:text-bakery-300 font-medium">Contains allergy profile history</span>
            </div>
            <Icon name="download" className="w-5 h-5 text-bakery-500" />
          </button>

          <button
            onClick={() => handleDownload('orders')}
            className="flex items-center justify-between p-3.5 border border-bakery-100 hover:border-bakery-500 rounded-xl bg-white dark:bg-bakery-900 text-left font-semibold text-xs transition-all"
          >
            <div>
              <span className="block text-bakery-700 dark:text-bakery-200">Orders Summary</span>
              <span className="text-[10px] text-bakery-700 dark:text-bakery-300 font-medium">Includes total receipts & dates</span>
            </div>
            <Icon name="download" className="w-5 h-5 text-bakery-500" />
          </button>

          <button
            onClick={() => handleDownload('allergies')}
            className="flex items-center justify-between p-3.5 border border-bakery-100 hover:border-bakery-500 rounded-xl bg-white dark:bg-bakery-900 text-left font-semibold text-xs transition-all"
          >
            <div>
              <span className="block text-bakery-700 dark:text-bakery-200">Allergen Registry</span>
              <span className="text-[10px] text-bakery-700 dark:text-bakery-300 font-medium">All registered allergy flags</span>
            </div>
            <Icon name="download" className="w-5 h-5 text-bakery-500" />
          </button>
        </div>
      </div>

      {/* Visual Analytics graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales */}
        <div className="bakery-card shadow-sm flex flex-col">
          <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4">Monthly Bakery Revenues</h3>
          <div className="relative h-56 flex-1">
            <canvas ref={salesChartRef}></canvas>
          </div>
        </div>

        {/* Diet preferences distribution */}
        <div className="bakery-card shadow-sm flex flex-col">
          <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4">Dietary Preference Distribution</h3>
          <div className="relative h-56 flex-1">
            <canvas ref={dietChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bakery-card shadow-sm">
        <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4">Popular Products (Units Sold)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-bakery-50 dark:border-bakery-800 text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 pb-2">
                <th className="py-2.5">Product Name</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bakery-50/50 dark:divide-bakery-800/20 text-sm">
              {repStats.popular_products.map((p, idx) => (
                <tr key={idx} className="hover:bg-bakery-50/20">
                  <td className="py-3 font-semibold text-bakery-700 dark:text-bakery-200">{p.product}</td>
                  <td className="font-bold text-green-600">{p.quantity} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: ADMIN & SETTINGS (System users management)
// -------------------------------------------------------------------
function AdminView() {
  const { user, showToast } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User Modal form states
  const [showModal, setShowModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '', password: '', role: 'staff', full_name: '', email: ''
  });

  const fetchAdminData = async () => {
    if (user?.role !== 'admin') return;
    try {
      const userRes = await axios.get('/api/admin/users');
      setUsers(userRes.data);
      
      const logRes = await axios.get('/api/admin/logs');
      setLogs(logRes.data);
    } catch (err) {
      console.error(err);
      showToast('Admin query failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleOpenAdd = () => {
    setEditUserId(null);
    setFormData({ username: '', password: '', role: 'staff', full_name: '', email: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (u) => {
    setEditUserId(u.id);
    setFormData({ username: u.username, password: '', role: u.role, full_name: u.full_name || '', email: u.email || '' });
    setShowModal(true);
  };

  const handleDeleteUser = async (uid) => {
    if (uid === user.id) {
      showToast('Downgrade check: you cannot delete yourself!', 'warning');
      return;
    }
    if (!window.confirm("Are you sure you want to delete this staff account?")) return;
    try {
      await axios.delete(`/api/admin/users/${uid}`);
      showToast('User deleted successfully', 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Delete failed', 'danger');
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) return;

    try {
      if (editUserId) {
        // Drop empty password if not modifying
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await axios.put(`/api/admin/users/${editUserId}`, payload);
        showToast('User account updated', 'success');
      } else {
        await axios.post('/api/admin/users', formData);
        showToast('User account created', 'success');
      }
      setShowModal(false);
      fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'danger');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bakery-card text-center p-8 bg-red-500/10 border border-red-500/20 text-red-700">
        🛡️ Access Forbidden. Administrator credentials required to open Settings.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Users Manager List */}
      <div className="lg:col-span-1 bakery-card shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase">System Accounts</h3>
          <button
            onClick={handleOpenAdd}
            className="p-1 px-2.5 rounded-lg border border-bakery-500 text-bakery-500 text-xs font-bold hover:bg-bakery-500/5 flex items-center gap-1"
          >
            <Icon name="plus" className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <div key={u.id} className="p-3 border border-bakery-50 dark:border-bakery-800/40 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-xs font-bold text-bakery-700 dark:text-bakery-200">
                  {u.full_name || u.username}
                </strong>
                <p className="text-[10px] text-bakery-600 dark:text-bakery-400 mt-0.5 font-semibold">
                  @{u.username} &bull; {u.role.toUpperCase()}
                </p>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenEdit(u)}
                  className="p-1 bg-bakery-50 dark:bg-bakery-800/40 hover:bg-bakery-500/10 hover:text-bakery-500 rounded-lg text-bakery-700 dark:text-bakery-700 dark:text-bakery-200"
                >
                  <Icon name="edit" className="w-3.5 h-3.5" />
                </button>
                {u.id !== user.id && (
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-1 bg-bakery-50 dark:bg-bakery-800/40 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-bakery-700 dark:text-bakery-700 dark:text-bakery-200"
                  >
                    <Icon name="delete" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Activity visualizer logs */}
      <div className="lg:col-span-2 bakery-card shadow-sm flex flex-col">
        <h3 className="font-bold text-sm tracking-wide text-bakery-800 dark:text-bakery-200 uppercase mb-4 border-b pb-2">Full Audit Trail</h3>
        <div className="overflow-x-auto max-h-[70vh] flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b text-bakery-700 dark:text-bakery-300 pb-2 uppercase tracking-wider font-bold">
                <th className="py-2">Timestamp</th>
                <th>Staff User</th>
                <th>Operation</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody className="divide-y text-[11px] font-medium text-bakery-700 dark:text-bakery-200">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-bakery-50/20">
                  <td className="py-2.5 pr-2 whitespace-nowrap text-[10px] text-bakery-600 dark:text-bakery-400">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="font-bold pr-2">
                    {l.username} ({l.user_role.toUpperCase()})
                  </td>
                  <td className="pr-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                      l.action === 'Allergy Override' ? 'badge-severe' : 'bg-bakery-500/5 text-bakery-700'
                    }`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="max-w-xs truncate" title={l.details}>
                    {l.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bakery-900 w-full max-w-sm rounded-2xl border border-bakery-100 shadow-2xl flex flex-col animate-slide-up">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase text-bakery-700">
                {editUserId ? 'Modify Staff Credentials' : 'Create Staff Member'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-bakery-50 rounded-lg">
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-bakery-700 dark:text-bakery-200 block mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bakery-100 bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-bakery-700 dark:text-bakery-200 block mb-1">
                  Password {editUserId ? '(Leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bakery-100 bg-white"
                  required={!editUserId}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-bakery-700 dark:text-bakery-200 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bakery-100 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-bakery-700 dark:text-bakery-200 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bakery-100 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-bakery-700 dark:text-bakery-200 block mb-1">
                  Access Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bakery-100 bg-white"
                >
                  <option value="staff">Counter Staff</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 border rounded-xl text-xs font-semibold bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bakery-500 hover:bg-bakery-600 text-white rounded-xl text-xs font-bold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// VIEW: SET PASSWORD (ADMIN SETUP)
// -------------------------------------------------------------------
function SetPasswordView() {
  const { showToast } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const query = new URLSearchParams(location.search);
  const [email, setEmail] = useState(query.get('email') || '');
  const [token, setToken] = useState(query.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/set-password', { email, token, password });
      showToast('Admin password set successfully! You can now log in.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bakery-50 dark:bg-bakery-900 px-4 relative overflow-hidden">
      <div className="gradient-blob -top-20 -left-20"></div>
      <div className="gradient-blob -bottom-20 -right-20"></div>
      
      <div className="w-full max-w-md p-8 rounded-2xl border border-bakery-100 dark:border-bakery-800 bg-white/80 dark:bg-bakery-900/80 backdrop-blur-md shadow-2xl animate-slide-up">
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-full bg-bakery-500 items-center justify-center text-white font-bold text-3xl font-serif shadow-lg shadow-bakery-500/20 mb-3">
            🛡️
          </div>
          <h2 className="text-2xl font-bold font-serif text-bakery-700 dark:text-bakery-100">Setup Admin Password</h2>
          <p className="text-sm text-bakery-700 dark:text-bakery-300 mt-1">Activate and secure your administrator account</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-600 dark:text-red-400">
            <Icon name="warning" className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/30 focus:border-bakery-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 block mb-1.5">
              Setup Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/30 focus:border-bakery-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 block mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/30 focus:border-bakery-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-bakery-700 dark:text-bakery-300 block mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-bakery-100 dark:border-bakery-800 bg-white dark:bg-bakery-900 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500/30 focus:border-bakery-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-bakery-500 text-white font-semibold text-sm hover:bg-bakery-600 shadow-md shadow-bakery-500/20 active:translate-y-px transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Save & Activate Account</span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs text-bakery-500 hover:underline font-bold"
          >
            Cancel and Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// MAIN APP COMPONENT & ROUTER SHELL
// -------------------------------------------------------------------
function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/set-password" element={<SetPasswordView />} />
          
          {/* Main App Views wrapped inside secure frame */}
          <Route path="/dashboard" element={<PageWrapper title="Operations Dashboard"><DashboardView /></PageWrapper>} />
          <Route path="/customers" element={<PageWrapper title="Customer Profile Catalog"><CustomerListView /></PageWrapper>} />
          <Route path="/customers/:cid" element={<PageWrapper title="Customer Profile File"><CustomerDetailView /></PageWrapper>} />
          <Route path="/ingredients" element={<PageWrapper title="Raw Ingredients Inventory"><IngredientListView /></PageWrapper>} />
          <Route path="/products" element={<PageWrapper title="Bakery Product Offerings"><ProductListView /></PageWrapper>} />
          <Route path="/orders" element={<PageWrapper title="Bakery Orders Hub"><OrderListView /></PageWrapper>} />
          <Route path="/orders/new" element={<PageWrapper title="Allergen-Verified Order Wizard"><OrderWizardView /></PageWrapper>} />
          <Route path="/reports" element={<PageWrapper title="Bakery Data Analytics Reports"><ReportsView /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper title="System Administrator Panel"><AdminView /></PageWrapper>} />
          
          {/* Fallback catches */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

// Render root element
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
