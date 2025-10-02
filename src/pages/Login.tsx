import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
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
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const checkUsername = async () => {
      setCheckingUsername(true);
      const { data, error } = await supabase.rpc('check_username_available', {
        username_to_check: username
      });
      
      if (!error) {
        setUsernameAvailable(data);
      }
      setCheckingUsername(false);
    };

    const timeoutId = setTimeout(checkUsername, 300);
    return () => clearTimeout(timeoutId);
  }, [username]);

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
    if (!email || !password || !confirmPassword || !name || !selectedAccount || !username) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      toast({
        title: "Error",
        description: "Username must be 3-20 characters and contain only letters, numbers, and underscores",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number if provided
    if (phoneNumber && !/^[\d\s\-\(\)\+]{10,15}$/.test(phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    if (usernameAvailable === false) {
      toast({
        title: "Error",
        description: "Username is already taken",
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name,
          bookmaker: selectedAccount,
          username,
          phone_number: phoneNumber,
          country_code: countryCode,
        },
      },
    });

    if (error) {
      // Check for specific error messages that indicate email already exists
      if (error.message.includes("already registered") || 
          error.message.includes("already exists") || 
          error.message.includes("User already registered") ||
          error.message.includes("already been registered")) {
        toast({
          title: "Error",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else if (data.user) {
      // Multiple checks to determine if user already exists
      const hasNoIdentities = data.user.identities && data.user.identities.length === 0;
      const userCreatedAt = new Date(data.user.created_at);
      const now = new Date();
      const timeDifference = now.getTime() - userCreatedAt.getTime();
      const isOldUser = timeDifference > 30000; // 30 second buffer for safety
      
      // Check if this is an existing user (multiple indicators)
      if (hasNoIdentities || isOldUser) {
        toast({
          title: "Error",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else if (!data.session) {
        // New account created but needs email verification
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to verify your account.",
        });
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setSelectedAccount("");
        setUsername("");
        setPhoneNumber("");
        setCountryCode("+1");
      } else {
        // New account created and user is automatically signed in
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setSelectedAccount("");
        setUsername("");
        setPhoneNumber("");
        setCountryCode("+1");
      }
    } else {
      // Unexpected response
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
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
              <Label htmlFor="register-name">Full Name</Label>
              <Input
                id="register-name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-username">Username</Label>
              <div className="relative">
                <Input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="username"
                  required
                  className="pr-10 transition-all duration-300 focus:scale-[1.02] hover:border-primary/40"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checkingUsername ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : usernameAvailable === true ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : usernameAvailable === false ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : null}
                </div>
              </div>
              {username.length > 0 && username.length < 3 && (
                <p className="text-xs text-muted-foreground">At least 3 characters</p>
              )}
              {usernameAvailable === false && (
                <p className="text-xs text-destructive">Username is already taken</p>
              )}
              {usernameAvailable === true && (
                <p className="text-xs text-green-600">Username is available</p>
              )}
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
              <Label htmlFor="register-phone">Phone Number (Optional)</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33</SelectItem>
                    <SelectItem value="+49">🇩🇪 +49</SelectItem>
                    <SelectItem value="+34">🇪🇸 +34</SelectItem>
                    <SelectItem value="+39">🇮🇹 +39</SelectItem>
                    <SelectItem value="+86">🇨🇳 +86</SelectItem>
                    <SelectItem value="+81">🇯🇵 +81</SelectItem>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+55">🇧🇷 +55</SelectItem>
                    <SelectItem value="+52">🇲🇽 +52</SelectItem>
                    <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    <SelectItem value="+7">🇷🇺 +7</SelectItem>
                    <SelectItem value="+82">🇰🇷 +82</SelectItem>
                    <SelectItem value="+27">🇿🇦 +27</SelectItem>
                    <SelectItem value="+90">🇹🇷 +90</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="register-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="123 456 7890"
                  className="flex-1 transition-all duration-300 focus:scale-[1.02] hover:border-primary/40"
                />
              </div>
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