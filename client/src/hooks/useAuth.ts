import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | undefined>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
