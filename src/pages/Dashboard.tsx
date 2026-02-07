import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import { Bell, Calendar, Activity, Users, Plus, Search, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [doctorData, setDoctorData] = useState({
    name: "Loading...",
    specialization: "Loading...",
    department: "Loading...",
    doctorId: "Loading...",
    appointments: 0,
    surgeries: 0,
    meetings: 0
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "doctors", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setDoctorData({ ...docSnap.data() as any });
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast({ title: "Error", description: "Failed to log out", variant: "destructive" });
    }
  };

  const stats = [
    { label: "Daily Appointments", value: doctorData.appointments || 12, change: "+4.5%", icon: Calendar, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Total Patients", value: "1,248", change: "+12%", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Surgeries", value: doctorData.surgeries || 3, change: "0%", icon: Activity, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Pending Reports", value: "8", change: "-2%", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const upcomingSchedule = [
    { time: "09:00 AM", patient: "Sarah Johnson", type: "Check-up", status: "Checked In" },
    { time: "10:30 AM", patient: "Michael Chen", type: "Consultation", status: "Waiting" },
    { time: "11:45 AM", patient: "Emma Davis", type: "Follow-up", status: "Confirmed" },
    { time: "02:15 PM", patient: "James Wilson", type: "Report Review", status: "Pending" },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans">
      <Sidebar doctorData={doctorData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-neutral-800">Overview</h1>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <Bell className="h-5 w-5 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm border border-brand-200">
              {doctorData.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="card-base p-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</h3>
                    <span className={cn("text-xs font-medium mt-2 inline-block", stat.change.startsWith("+") ? "text-emerald-600" : "text-neutral-500")}>
                      {stat.change} <span className="text-neutral-400 font-normal">from last week</span>
                    </span>
                  </div>
                  <div className={cn("p-2.5 rounded-lg", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column: Schedule & Activity */}
              <div className="lg:col-span-2 space-y-8">
                <div className="card-base p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900">Today's Schedule</h3>
                    <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 text-xs font-medium h-8">
                      View Calendar
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {upcomingSchedule.map((app, i) => (
                      <div key={i} className="flex items-center p-3 hover:bg-neutral-50 rounded-lg transition-colors border border-transparent hover:border-neutral-100 group">
                        <div className="w-20 text-sm font-medium text-neutral-500">{app.time}</div>
                        <div className="flex-1 ml-4">
                          <div className="text-sm font-medium text-neutral-900">{app.patient}</div>
                          <div className="text-xs text-neutral-500">{app.type}</div>
                        </div>
                        <div>
                          <span className={cn(
                            "text-xs px-2.5 py-1 rounded-full font-medium border",
                            app.status === "Checked In" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              app.status === "Waiting" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                "bg-neutral-50 text-neutral-600 border-neutral-100"
                          )}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Actions */}
              <div className="space-y-6">
                <div className="card-base p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate("/new-patient")}
                      className="w-full justify-start h-12 bg-neutral-900 hover:bg-neutral-800 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" /> New Patient Registration
                    </Button>
                    <Button
                      onClick={() => navigate("/search-patient")}
                      variant="outline"
                      className="w-full justify-start h-12 border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    >
                      <Search className="mr-2 h-4 w-4" /> Search Patient Records
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/20">
                  <h4 className="font-semibold text-lg mb-2">Pro Tip</h4>
                  <p className="text-brand-100 text-sm mb-4">You can now search for patients using their phone number directly from the search bar.</p>
                  <Button size="sm" variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Learn More
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
