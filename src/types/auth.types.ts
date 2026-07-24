export interface User {
  id: number;
  email: string;
  created_at: string;
  last_login: string | null;
}

export interface MagicToken {
  id: number;
  email: string;
  token: string;
  expires_at: string;
  used: number;
  created_at: string;
}

export interface SessionUser {
  email: string;
  id: number;
}
