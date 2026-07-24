import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "~/services/auth.service";
import type { SessionUser } from "~/types";

export function useAuth(redirectTo?: string): {
  user: SessionUser | null;
  loading: boolean;
} {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSession()
      .then((data) => {
        setUser(data.user);
        if (!data.user && redirectTo) {
          navigate(redirectTo);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        if (redirectTo) navigate(redirectTo);
      });
  }, [navigate, redirectTo]);

  return { user, loading };
}
