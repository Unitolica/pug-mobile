import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { useToast } from "../hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  message?: string;
}

export function ProtectedRoute({
  children,
  message = "Faca login para acessar essa pagina"
}: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast({
        variant: "destructive",
        title: "Login necessario",
        description: message,
      });

      navigate("/login", {
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isLoggedIn, isLoading, navigate, location, message, toast]);

  if (isLoading) {
    return null;
  }

  return isLoggedIn ? <>{children}</> : null;
}
