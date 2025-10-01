import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const bookmakers = [
  { id: "bet365", name: "Bet365 (UK)", country: "🇬🇧" },
  { id: "pinnacle", name: "Pinnacle (Curacao)", country: "🇨🇼" },
  { id: "betfair", name: "Betfair (UK)", country: "🇬🇧" },
  { id: "unibet", name: "Unibet (Malta)", country: "🇲🇹" },
  { id: "betway", name: "Betway (Malta)", country: "🇲🇹" },
  { id: "williamhill", name: "William Hill (UK)", country: "🇬🇧" },
  { id: "bwin", name: "BWin (Austria)", country: "🇦🇹" },
  { id: "betsson", name: "Betsson (Sweden)", country: "🇸🇪" },
  { id: "draftkings", name: "DraftKings (US)", country: "🇺🇸" },
  { id: "fanduel", name: "FanDuel (US)", country: "🇺🇸" },
  { id: "betclic", name: "Betclic (France)", country: "🇫🇷" },
  { id: "stake", name: "Stake (Curacao)", country: "🇨🇼" }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !name || !selectedAccount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name,
          bookmaker: selectedAccount,
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6 animate-fade-in">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="relative w-full max-w-md p-8 bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl animate-scale-in hover-scale">
        <div className="text-center mb-8">
          <div className="mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">CA</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Welcome to Coop-Arbitrage
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Join the risk-free betting revolution
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleSignIn} 
              disabled={loading}
              className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
              variant="hero"
              size="lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">Your Name</Label>
              <Input
                id="register-name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-bookmaker">Your Bookmaker Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40">
                  <SelectValue placeholder="Select your bookmaker" />
                </SelectTrigger>
                <SelectContent>
                  {bookmakers.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <span className="flex items-center gap-2">
                        {account.country} {account.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSignUp} 
              disabled={loading}
              className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
              variant="hero"
              size="lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '1.4s' }}>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/info")}
            className="text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 story-link"
          >
            Learn How It Works
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;