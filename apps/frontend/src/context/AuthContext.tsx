import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getMe,
  refreshToken,
} from "../services/auth.service";
import { setAccessToken } from "../services/api";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  profile: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    focusTrack: string;
    score: number;
    rank: number;
  } | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    displayName: string,
    focusTrack: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): ReactNode {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const initialize = useCallback(async () => {
    try {
      await refreshToken();
      const user = await getMe();
      setState({ user, loading: false, error: null });
    } catch {
      setAccessToken(null);
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleLogout = (): void => {
      setAccessToken(null);
      setState({ user: null, loading: false, error: null });
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = useCallback(async (identifier: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await loginService(identifier, password);
      setState({ user: result.user, loading: false, error: null });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      const axiosMessage = (err as { response?: { data?: { error?: string } } })?.response?.data
        ?.error;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: axiosMessage ?? message,
      }));
      throw err;
    }
  }, []);

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string,
      displayName: string,
      focusTrack: string
    ): Promise<void> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await registerService(username, email, password, displayName, focusTrack);
        setState({ user: result.user, loading: false, error: null });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        const axiosMessage = (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: axiosMessage ?? message,
        }));
        throw err;
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    await logoutService();
    setState({ user: null, loading: false, error: null });
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const user = await getMe();
      setState((prev) => ({ ...prev, user }));
    } catch {
      // silently ignore – user data will refresh on next navigation
    }
  }, []);

  const clearError = useCallback((): void => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
