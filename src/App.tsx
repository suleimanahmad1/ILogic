import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminResetPassword from "./pages/AdminResetPassword.tsx";
import AboutDashboard from "./pages/AboutDashboard.tsx";
import BlogsDashboard from "./pages/BlogsDashboard.tsx";
import BlogPost from "./pages/BlogPost.tsx";

const AppRoutes = () => {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminArea ? <AuthModal /> : null}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about-dashboard" element={<AboutDashboard />} />
        <Route path="/blogs-dashboard" element={<BlogsDashboard />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-reset-password" element={<AdminResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
