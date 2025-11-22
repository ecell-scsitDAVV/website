
import React from "react"; // Add explicit React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TargetCursor from "./components/TargetCursor";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Announcements from "./pages/Announcements";
import ScrollToHash from "./components/ScrolltoHash";
import AboutSection from "./components/AboutSection";
import InitiativesSection from "./components/InitiativesSection";
import ContactSection from "./components/ContactSection";
import RedirectToHash from "./components/RedirectToHash";
import { Helmet } from "react-helmet";

// Create the query client outside of the component
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <title>E-Cell SCSIT - Innovation & Entrepreneurship | DAVV Indore</title>
        <meta name="description" content="The Entrepreneurship Cell - SCSIT here is the official Entrepreneurship Cell of SCSIT, DAVV Indore. We foster innovation, startups, and tech-driven student initiatives." />
        <link rel="canonical" href="https://ecell-davv.vercel.app/" />
      </Helmet>
      <p className="sr-only">
        E-Cell SCSIT | Entrepreneurship Cell DAVV | Startup Club DAVV | Innovation Cell SCSIT |
        Student Entrepreneurship SCSIT | DAVV Clubs | ECell SCSIT Indore | Entrepreneurship
        Community DAVV | Tech Startups SCSIT | Student Innovation DAVV | E-Cell Events SCSIT |
        Startup Support DAVV | Entrepreneurship Programs SCSIT | E-Cell Initiatives DAVV |
        Student-led Startups SCSIT | Innovation Hub DAVV | E-Cell Networking SCSIT |
        Entrepreneurship Resources DAVV | Startup Mentorship SCSIT | E-Cell Workshops DAVV | ecell scsit |
        ecell davv | ecell indore | entrepreneurship cell indore
      </p>
      <TooltipProvider>
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor={true}
        />
        <Router>
          <ScrollToHash />
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />

              <Route path="/about" element={<RedirectToHash to="/#about" />} />
              <Route path="/initiatives" element={<RedirectToHash to="/#initiatives" />} />
              <Route path="/contact" element={<RedirectToHash to="/#contact" />} />
              <Route path="/testimonials" element={<RedirectToHash to="/#testimonials" />} />

              <Route path="/team" element={<Team />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
