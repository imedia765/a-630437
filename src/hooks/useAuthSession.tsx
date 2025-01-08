import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAuthError = async (error: any) => {
    console.error('Auth error:', error);
    setLoading(true); // Ensure loading state is set during error handling
    
    const errorMessage = typeof error === 'string' ? error : error.message || error.error_description;
    
    if (errorMessage?.includes('Failed to fetch') ||
        errorMessage?.includes('session_not_found') ||
        errorMessage?.includes('JWT expired') ||
        errorMessage?.includes('Invalid Refresh Token') ||
        errorMessage?.includes('refresh_token_not_found')) {
      console.log('Session error, signing out...');
      setSession(null);
      
      try {
        // Clear all auth-related data
        await queryClient.resetQueries();
        localStorage.clear();
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error('Error during sign out:', signOutError);
      } finally {
        toast({
          title: "Session expired",
          description: "Please sign in again",
          variant: "destructive",
        });
        setLoading(false); // Ensure loading is reset after all cleanup
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeSession = async () => {
      try {
        setLoading(true);
        console.log('Checking for existing session...');
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted && existingSession?.user) {
          console.log('Found existing session for user:', existingSession.user.id);
          
          // Verify session is still valid with a test request
          const { error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          
          setSession(existingSession);
          setLoading(false); // Set loading false after successful session check
        } else {
          setLoading(false); // Set loading false if no session found
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        if (mounted) {
          await handleAuthError(error);
        }
      } finally {
        if (mounted && !session) {
          setLoading(false); // Final fallback to ensure loading is reset
        }
      }
    };

    initializeSession();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) {
        console.log('Component unmounted, ignoring auth state change');
        return;
      }
      
      subscription = authSubscription;
      if (!mounted) return;
      
      console.log('Auth state changed:', _event, currentSession?.user?.id);
      setLoading(true); // Set loading true on auth state change
      
      if (_event === 'SIGNED_OUT') {
        console.log('User signed out, clearing session and queries');
        setLoading(true);
        setSession(null);
        
        // Perform all cleanup operations in parallel
        await Promise.allSettled([
          queryClient.resetQueries(),
          localStorage.clear(),
          supabase.auth.signOut()
        ]);
        
        setLoading(false);
        return;
      }

      if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
        console.log('Setting session after', _event);
        setSession(currentSession);
        if (_event === 'SIGNED_IN') {
          queryClient.resetQueries();
        }
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient, toast]);

  return { session, loading };
};