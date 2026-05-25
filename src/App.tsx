import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AboutDashboard from "./pages/AboutDashboard.tsx";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <AuthModal />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about-dashboard" element={<AboutDashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
