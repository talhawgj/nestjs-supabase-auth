export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  role: UserRole;
  created_at: string;
}

