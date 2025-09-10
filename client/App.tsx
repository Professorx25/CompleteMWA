import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/Layout";
import Chat from "@/pages/Chat";
import Screening from "@/pages/Screening";
import Booking from "@/pages/Booking";
import Resources from "@/pages/Resources";
import Forum from "@/pages/Forum";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Onboarding from "@/pages/Onboarding";
import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="onboarding" element={<Onboarding />} />
              <Route index element={<Index />} />
              <Route path="chat" element={<Chat />} />
              <Route path="screening" element={<Screening />} />
              <Route path="booking" element={<Booking />} />
              <Route path="resources" element={<Resources />} />
              <Route path="forum" element={<Forum />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="journal" element={<Journal />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
