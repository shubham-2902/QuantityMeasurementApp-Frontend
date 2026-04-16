import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const { session, logout, deleteAccount } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  async function handleDeleteAccount() {
    if (window.confirm("Are you sure you want to delete your account? All your history will also be wiped out. This action cannot be undone.")) {
      const success = await deleteAccount();
      if (success) {
        navigate('/', { replace: true });
      }
    }
  }

  function handleLogin() {
    navigate('/login')  // ✅ Go to login page
  }

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md h-[60px] px-8 flex items-center justify-between shadow-sm dark:shadow-slate-900/20 border-b border-gray-200 dark:border-white/10 max-sm:px-4 max-sm:h-[54px] transition-colors duration-300">
      {/* Brand - Click to go to dashboard */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-3 font-raleway text-base font-extrabold text-[#1a1f6e] dark:text-white tracking-wide hover:opacity-80 transition-opacity"
      >
        <div className="bg-gradient-to-br from-[#3b5bdb] to-[#1a1f6e] dark:from-[#4f73fd] dark:to-[#3b5bdb] p-1.5 rounded-lg shadow-sm">
          <svg viewBox="0 0 40 50" width="22" xmlns="http://www.w3.org/2000/svg">
            <rect x="8"  y="2"  width="24" height="34" rx="4" fill="white" opacity="0.95"/>
            <rect x="11" y="27" width="18" height="9"  rx="2" fill="#bfd2ff"/>
            <rect x="11" y="17" width="18" height="8"  rx="2" fill="#dce9ff" opacity="0.8"/>
            <rect x="4"  y="36" width="32" height="8"  rx="3" fill="#e2a96a"/>
          </svg>
        </div>
        <span className="max-sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-[#1a1f6e] to-[#3b5bdb] dark:from-white dark:to-gray-300">Quantity Measurement</span>
      </button>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {session ? (
          <>
            <span className="text-gray-700 dark:text-white/80 text-[13px] font-semibold max-sm:hidden">
              Hi, {session.name} 👋
            </span>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-red-50 dark:bg-red-500/10 border-[1.5px] border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-lg text-[13px] font-bold
                hover:bg-red-100 dark:hover:bg-red-500/20 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 shadow-sm"
            >
              Delete Account
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-gray-50 dark:bg-white/5 border-[1.5px] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 px-4 py-1.5 rounded-lg text-[13px] font-bold
                hover:bg-gray-100 dark:hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleLogin}
            className="bg-gradient-to-r from-[#3b5bdb] to-[#1a1f6e] text-white px-5 py-2 rounded-lg text-[13px] font-bold
              hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}