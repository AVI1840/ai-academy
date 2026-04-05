import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import FlashcardSession from "./pages/FlashcardSession";
import QuizSession from "./pages/QuizSession";
import PhraseMode from "./pages/PhraseMode";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark min-h-screen bg-zinc-950 md:flex md:items-start md:justify-center">
          <div className="w-full max-w-lg min-h-screen bg-background md:shadow-2xl">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/session" element={<FlashcardSession />} />
            <Route path="/quiz" element={<QuizSession />} />
            <Route path="/phrases" element={<PhraseMode />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
