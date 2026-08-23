import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { CreatorPage } from '@/pages/CreatorPage';
import { VoteConfirmationPage } from '@/pages/VoteConfirmationPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminTransactionsPage } from '@/pages/admin/AdminTransactionsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminCandidatesPage } from '@/pages/admin/AdminCandidatesPage';
import { CreatorDashboardPage } from '@/pages/creator/CreatorDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with standard Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="creator/:id" element={<CreatorPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="vote/confirm" element={<VoteConfirmationPage />} />

              {/* Protected: creator dashboard */}
              <Route
                path="/dashboard/creator"
                element={
                  <ProtectedRoute requiredRole="creator">
                    <CreatorDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              {/* Other admin routes as scaffold */}
              <Route path="candidates" element={<AdminCandidatesPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
