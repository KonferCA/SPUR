import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Register, DashboardPage, AdminDashboardPage, SubmitProjectPage } from '@pages';
import { AuthProvider } from '@/contexts/AuthContext';

const Router = () => (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Landing /> } />
                <Route path="/register" element={ <Register /> } />
                
                {/* User routes */}
                <Route path="/dashboard" element={ <DashboardPage /> } />
                <Route path="/projects" element={ <DashboardPage /> } />
                <Route path="/resources" element={ <DashboardPage /> } />
                <Route path="/favorites" element={ <DashboardPage /> } />
                <Route path="/profile" element={ <DashboardPage /> } />
                <Route path="/drafts" element={ <DashboardPage /> } />
                <Route path="/submit-project" element={<SubmitProjectPage />} />
                
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={ <AdminDashboardPage /> } />
                <Route path="/admin/projects" element={ <AdminDashboardPage /> } />
                <Route path="/admin/projects/pending" element={ <AdminDashboardPage /> } />
                <Route path="/admin/projects/approved" element={ <AdminDashboardPage /> } />
                <Route path="/admin/resources" element={ <AdminDashboardPage /> } />
                <Route path="/admin/users" element={ <AdminDashboardPage /> } />
                <Route path="/admin/settings" element={ <AdminDashboardPage /> } />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);

export { Router };
