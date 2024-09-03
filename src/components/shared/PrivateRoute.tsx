import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../helpers/useAuth";
import { useEffect, useState } from "react";
import { checkAuthStatus } from "../../helpers/api-communicator";


export default function PrivateRoute() {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (!auth.isSignedIn) {
          const data = await checkAuthStatus();
          if (data) {
            auth.setUser({ email: data.email, name: data.name });
            auth.setIsSignedIn(true);
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return auth.isSignedIn && auth.user ? <Outlet /> : <Navigate to="/sign-in" />;
}
