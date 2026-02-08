import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Mail, Lock } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Brand/Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-900/20 z-0"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-teal-600 rounded-sm flex items-center justify-center shadow-lg shadow-teal-500/20">
              <span className="font-bold text-xl text-white">+</span>
            </div>
            <span className="text-xl font-bold tracking-tight">PatientKhata</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-bold mb-6 leading-tight">Advanced Clinical EMR for Modern Hospitals.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Secure patient records, OPD management, and real-time vitals tracking.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © 2024 PatientKhata.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <Button
          variant="ghost"
          className="absolute top-8 left-8 lg:hidden"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Staff Login</h1>
            <p className="mt-2 text-slate-500">Access your clinical dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide" htmlFor="email">Email ID</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide" htmlFor="password">Password</label>
                  <Link to="#" className="text-xs font-medium text-teal-600 hover:text-teal-700">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white h-11 text-base shadow-sm rounded-sm"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</>
              ) : (
                "Access System"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">New personnel? </span>
            <Link to="/signup" className="font-semibold text-teal-700 hover:text-teal-800 transition-colors">
              Register ID
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
