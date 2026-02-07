import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Mail, Lock, User, Stethoscope, Building } from "lucide-react";

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    department: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, {
        name: formData.name,
        specialization: formData.specialization,
        department: formData.department
      });
      toast({
        title: "Account Created!",
        description: "Welcome to PatientKhata. Your account has been created.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Could not create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Brand/Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-900/40 via-neutral-900 to-neutral-900"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-10"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <span className="font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight">PatientKhata</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-6 leading-tight">Start your journey with modern healthcare.</h2>
          <p className="text-neutral-400 text-lg leading-relaxed mb-8">
            Create an account to access advanced patient tracking, secure records, and seamless scheduling tools.
          </p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3 text-neutral-300">
              <div className="h-2 w-2 rounded-full bg-brand-500"></div>
              <span>Secure Cloud Storage</span>
            </div>
            <div className="flex items-center space-x-3 text-neutral-300">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>HIPAA Compliant Standards</span>
            </div>
            <div className="flex items-center space-x-3 text-neutral-300">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <span>Intelligent Analytics</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-neutral-500">
          © 2024 PatientKhata Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white relative overflow-y-auto">
        <Button
          variant="ghost"
          className="absolute top-8 left-8 lg:hidden"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Create an account</h1>
            <p className="mt-2 text-neutral-500">Enter your details to register as a doctor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  placeholder="Dr. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="specialization">Specialization</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                    placeholder="Cardiology"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="department">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                  <input
                    id="department"
                    name="department"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                    placeholder="OPD"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  placeholder="doctor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11 text-base shadow-lg shadow-brand-500/20 mt-2"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-neutral-500">Already have an account? </span>
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
