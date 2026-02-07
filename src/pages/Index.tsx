import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="bg-medical-blue p-2 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Patient Khata</span>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate("/login")} className="hover:bg-blue-50 text-gray-700">
            Login
          </Button>
          <Button onClick={() => navigate("/signup")} className="bg-medical-blue hover:bg-blue-600 text-white rounded-full px-6">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto mt-[-4rem]">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-blue-700 font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Secure & Modern Patient Management</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
          Simplify Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-blue to-teal-400">Medical Practice</span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-900">
          Manage patient records, track history, and organize your clinic with an intuitive, secure, and modern digital solution.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <Button onClick={() => navigate("/signup")} className="h-12 px-8 text-lg bg-gray-900 hover:bg-black text-white rounded-full shadow-xl shadow-gray-900/20 transition-all hover:scale-105">
            Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button onClick={() => navigate("/login")} variant="outline" className="h-12 px-8 text-lg border-gray-300 text-gray-700 hover:bg-white rounded-full hover:border-gray-400 transition-all">
            Doctor Login
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <UserCheck className="h-6 w-6 text-medical-blue" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Patient Records</h3>
            <p className="text-gray-500">Easily add, update, and manage detailed patient profiles and medical history.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Track Vitals</h3>
            <p className="text-gray-500">Keep track of blood pressure, prescriptions, and diagnosis in one place.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Data</h3>
            <p className="text-gray-500">Your patient data is securely stored and accessible only to you.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-400 text-sm mt-12">
        <p>&copy; {new Date().getFullYear()} Patient Khata. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
