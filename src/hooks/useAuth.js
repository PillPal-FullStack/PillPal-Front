import { useState, useEffect } from 'react';

export function useAuth() {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Intentar cargar token del localStorage o sessionStorage
    // Por ahora usamos el token hardcodeado para desarrollo
    const savedToken = localStorage.getItem('auth_token') || 
      "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwicm9sZSI6IltST0xFX1VTRVJdIiwic3ViIjoidGVzdHVzZXIiLCJpYXQiOjE3NTgxOTg1NDUsImV4cCI6MTc1ODIwMDM0NX0.sh7Q9jlZ3kxbiGq8qenoIg018ZfrQbyeM0qXHLizdUA";
    
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return {
    token,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}