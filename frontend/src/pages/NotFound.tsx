import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// Se você realmente for usar o Button e ele for "named export":
// import { Button } from '../components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">404</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! A página que você procura não existe.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
