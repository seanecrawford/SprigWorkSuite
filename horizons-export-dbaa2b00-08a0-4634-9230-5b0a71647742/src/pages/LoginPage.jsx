
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, Users, Package, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (!error) {
      toast({
        title: "Welcome back! 🎉",
        description: "You've successfully logged in.",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password);
    if (!error) {
      toast({
        title: "Account created! 🚀",
        description: "Please check your email to verify your account.",
      });
    }
    setLoading(false);
  };

  const AuthForm = ({ isSignUp = false }) => (
    <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={isSignUp ? 'signup-email' : 'signin-email'} className="text-slate-200">Email</Label>
        <Input
          id={isSignUp ? 'signup-email' : 'signin-email'}
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isSignUp ? 'signup-password' : 'signin-password'} className="text-slate-200">Password</Label>
        <Input
          id={isSignUp ? 'signup-password' : 'signin-password'}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Sprig Work Suite Pro</h1>
            <p className="text-slate-400">Unified platform for modern teams</p>
          </motion.div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="signin">
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </TabsTrigger>
              <TabsTrigger value="signup">
                <UserPlus className="w-4 h-4 mr-2" /> Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <AuthForm />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <AuthForm isSignUp />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
