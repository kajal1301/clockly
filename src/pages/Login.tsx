
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const handleLogin = (data: any) => {
    console.log('Login data:', data);
    
    // In a real app, this would make an API call to authenticate the user
    // For now, we'll just show a toast
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
    
    // Redirect to dashboard (would normally happen after successful auth)
    window.location.href = '/dashboard';
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass rounded-xl shadow-sm overflow-hidden w-full max-w-md">
        <div className="p-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
          
          <AuthForm type="login" onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
