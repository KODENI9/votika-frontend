import { Outlet, NavLink, Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Vote, Users, Settings, Receipt, LayoutDashboard } from 'lucide-react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export const AdminLayout = () => {
  const { user } = useUser();

  const navItems = [
    { to: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/admin/candidates', label: 'Candidates', icon: Users },
    { to: '/dashboard/admin/transactions', label: 'Transactions', icon: Receipt },
    { to: '/dashboard/admin/users', label: 'Users', icon: Users },
    { to: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between shrink-0">
          <div>
            {/* Logo area */}
            <div className="h-20 flex items-center px-6 border-b border-gray-50 mb-6">
              <Link to="/" className="flex items-center gap-3 font-bold text-lg text-gray-900 hover:no-underline">
                <div className="bg-gray-900 rounded-lg p-2">
                  <Vote className="h-5 w-5 text-[var(--color-brand)]" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm">VoteAdmin</span>
                  <span className="text-xs text-gray-400 font-medium">Management Portal</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:no-underline ${
                        isActive
                          ? 'bg-[#FFF5ED] text-[#F37A20]'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Profile */}
          <div className="p-4 border-t border-gray-100 m-3 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-3">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10",
                  }
                }} 
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || 'Admin User'}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};
