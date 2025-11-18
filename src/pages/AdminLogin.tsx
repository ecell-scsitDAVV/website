
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, KeyRound } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasDefaultCredentials, setHasDefaultCredentials] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if default credentials exist
  useEffect(() => {
    const checkDefaultCredentials = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_credentials')
          .select('username, password');
          
        if (error) {
          console.error('Error checking credentials:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const hasDefault = data.some(cred => 
            cred.username === 'admin' && cred.password === 'admin123'
          );
          setHasDefaultCredentials(hasDefault);
        } else {
          // If no credentials exist, create default admin credentials
          console.log('No admin credentials found, creating default...');
          const { error: insertError } = await supabase
            .from('admin_credentials')
            .insert([{ username: 'admin', password: 'admin123' }]);
            
          if (insertError) {
            console.error('Error creating default admin credentials:', insertError);
          } else {
            setHasDefaultCredentials(true);
            console.log('Default admin credentials created successfully');
          }
        }
      } catch (error) {
        console.error('Error checking/creating credentials:', error);
      }
    };
    
    checkDefaultCredentials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Fetch admin credentials from the database
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('username, password');
      
      if (error) {
        console.error('Database query error:', error);
        throw new Error('Failed to connect to the database');
      }
      
      // Check if there are any credentials
      if (!data || data.length === 0) {
        throw new Error('No admin accounts found. Please contact the system administrator.');
      }
      
      // Check if password matches
      const matchedAdmin = data.find(admin => 
        admin.username === username && admin.password === password
      );
      
      if (matchedAdmin) {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_username', username);
        
        // If logging in with default credentials, show a warning
        if (username === 'admin' && password === 'admin123') {
          toast({
            variant: "destructive",
            title: "Default credentials detected",
            description: "Please change your credentials in the settings page for security."
          });
          navigate('/admin/settings');
        } else {
          toast({
            title: "Login successful",
            description: "Welcome to the admin panel",
          });
          navigate('/admin/members');
        }
      } else {
        setLoginError('Incorrect username or password. Please try again.');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Incorrect username or password. Please try again."
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Login error:', error);
      setLoginError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8 sm:px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <KeyRound size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel.
          </CardDescription>
          {hasDefaultCredentials && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
              <p className="font-medium">Default credentials detected!</p>
              <p>Default username: admin</p>
              <p>Default password: admin123</p>
              <p className="mt-1">Please change these after logging in.</p>
            </div>
          )}
          {loginError && (
            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{loginError}</p>
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
