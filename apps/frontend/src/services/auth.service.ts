import { api, setAccessToken, refreshAccessToken } from "./api";

interface UserPublic {
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

interface AuthResponse {
  accessToken: string;
  user: UserPublic;
}

export async function login(identifier: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<{ success: boolean; data: AuthResponse }>("/auth/login", {
    identifier,
    password,
  });
  setAccessToken(data.data.accessToken);
  return data.data;
}

export async function register(
  username: string,
  email: string,
  password: string,
  displayName: string,
  focusTrack: string
): Promise<AuthResponse> {
  const { data } = await api.post<{ success: boolean; data: AuthResponse }>("/auth/register", {
    username,
    email,
    password,
    displayName,
    focusTrack,
  });
  setAccessToken(data.data.accessToken);
  return data.data;
}

export async function checkAlias(username: string): Promise<boolean> {
  const { data } = await api.post<{ success: boolean; data: { available: boolean } }>(
    "/auth/alias-check",
    { username }
  );
  return data.data.available;
}

export async function getMe(): Promise<UserPublic> {
  const { data } = await api.get<{ success: boolean; data: UserPublic }>("/auth/me");
  return data.data;
}

export async function syncScore(score: number): Promise<void> {
  await api.post("/auth/sync-score", { score });
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  setAccessToken(null);
}

export async function refreshToken(): Promise<string> {
  return refreshAccessToken();
}
