import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenPanel from "./pages/CitizenPanel";
import ComplaintDashboard from "./pages/citizen/ComplaintDashboard";

// ✅ Updated paths after moving to /citizen folder
import ComplaintForm from "./pages/citizen/ComplaintForm";
import ComplainDone from "./pages/citizen/ComplainDone";
// import ComplaintDashboard from "./pages/citizen/ComplaintDashboard";
import ComplaintStatus from "./pages/citizen/ComplainStatus";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MapPage from "./pages/admin/MapPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import Dashboard from "./pages/admin/Dashboard";
import MonitoringPage from "./pages/admin/MonitoringPage";
import ServicesDemoPage from "./pages/admin/ServicesDemoPage";
import AlertsPage from "./pages/admin/AlertsPage";

// Optionally later you can uncomment below
// import AdminDashboard from "./pages/AdminDashboard";
// import EmployeeDashboard from "./pages/EmployeeDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/citizen" element={<CitizenPanel />} />
          <Route path="*" element={<NotFound />} />

          {/* ✅ Citizen Routes */}
          <Route path="/complaint-form" element={<ComplaintForm />} />
          <Route path="/complain_done" element={<ComplainDone />} />
          <Route path="/complaint-dashboard" element={<ComplaintDashboard />} />
          <Route path="/complaint-status" element={<ComplaintStatus />} />

          {/* ✅ Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/map" element={<MapPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/monitoring" element={<MonitoringPage />} />
          <Route path="/admin/alerts" element={<AlertsPage />} />
          <Route path="/admin/services" element={<ServicesDemoPage />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;