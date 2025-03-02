import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useAuthSession } from "@/hooks/useAuthSession";
import ProtectedRoutes from "@/components/routing/ProtectedRoutes";
import { useEnhancedRoleAccess } from "@/hooks/useEnhancedRoleAccess";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { session, loading: sessionLoading } = useAuthSession();
  const { isLoading: rolesLoading, error: rolesError } = useEnhancedRoleAccess();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('App render state:', { 
    sessionLoading, 
    rolesLoading, 
    hasSession: !!session,
    currentPath: location.pathname 
  });

  useEffect(() => {
    // Only redirect to login if we're not already on the login page
    // and we're sure there's no session (not loading)
    if (!sessionLoading && !session && location.pathname !== '/login') {
      console.log('No session detected, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [session, sessionLoading, navigate, location.pathname]);

  if (rolesError) {
    console.error('Role loading error:', rolesError);
    toast({
      title: "Error loading roles",
      description: "There was a problem loading user roles. Please try again.",
      variant: "destructive",
    });
  }

  // Show loading state only if we're loading session
  // Don't show loading for roles if we're on the login page
  if (sessionLoading || (session && rolesLoading && location.pathname !== '/login')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard-dark">
        <Loader2 className="w-8 h-8 animate-spin text-dashboard-accent1" />
      </div>
    );
  }

  return (
    <>
      <ProtectedRoutes session={session} />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;