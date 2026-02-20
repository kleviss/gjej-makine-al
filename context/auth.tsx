import { createContext, useContext, useEffect, useState } from 'react';

import { Session } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';

type AuthContextType = {
  session: Session | null;
  initialized: boolean;
  demoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  initialized: false,
  demoMode: false,
  enterDemoMode: () => {},
  exitDemoMode: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const enterDemoMode = () => setDemoMode(true);
  const exitDemoMode = () => setDemoMode(false);

  return (
    <AuthContext.Provider value={{ session, initialized, demoMode, enterDemoMode, exitDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 