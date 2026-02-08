import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import { Activity, Users, Clock, AlertCircle, FileText, Filter, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock Data for Hospital UI
  const opdQueue = [
    { token: "A-102", name: "Rajesh Kumar", age: 45, gender: "M", status: "Vitals Pending", priority: "urgent", time: "10:00 AM" },
    { token: "A-103", name: "Sunita Devi", age: 32, gender: "F", status: "Waiting", priority: "normal", time: "10:15 AM" },
    { token: "A-104", name: "Vikram Singh", age: 28, gender: "M", status: "In Consultation", priority: "normal", time: "10:30 AM" },
    { token: "A-105", name: "Anita Roy", age: 65, gender: "F", status: "Waiting", priority: "high", time: "10:45 AM" },
  ];

  const [doctorData, setDoctorData] = useState({
    name: "Loading...",
    specialization: "Loading...",
    department: "Loading...",
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

  return (
    <div className="flex h-screen bg-background font-sans text-sm">
      <Sidebar doctorData={doctorData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hospital Header - Minimal & Functional */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-slate-800 uppercase tracking-tight">OPD Control Center</h1>
            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 rounded-sm">
              DEPT: {doctorData.department || "GENERAL"}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>SYSTEM ONLINE</span>
            </div>
            <div className="pl-4 border-l border-slate-200">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Main Content - Dense Layout */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">

          {/* Status Ticker / Top Bar */}
          <div className="grid grid-cols-4 gap-4">
            <div className="card-clinical p-3 flex flex-col justify-between border-l-4 border-l-emerald-500">
              <span className="label-clinical text-slate-500">OPD Active</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-slate-800 leading-none">42</span>
                <Users className="h-4 w-4 text-emerald-600 mb-1" />
              </div>
            </div>
            <div className="card-clinical p-3 flex flex-col justify-between border-l-4 border-l-amber-500">
              <span className="label-clinical text-slate-500">Waiting</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-slate-800 leading-none">12</span>
                <Clock className="h-4 w-4 text-amber-600 mb-1" />
              </div>
            </div>
            <div className="card-clinical p-3 flex flex-col justify-between border-l-4 border-l-red-500">
              <span className="label-clinical text-slate-500">Critical / ER</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-slate-800 leading-none">03</span>
                <AlertCircle className="h-4 w-4 text-red-600 mb-1" />
              </div>
            </div>
            <div className="card-clinical p-3 flex flex-col justify-between border-l-4 border-l-blue-500">
              <span className="label-clinical text-slate-500">Avg. Wait</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-slate-800 leading-none">18m</span>
                <Activity className="h-4 w-4 text-blue-600 mb-1" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">

            {/* LEFT: Patient Queue (Main Focus) */}
            <div className="lg:col-span-2 card-clinical flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 uppercase tracking-tight text-xs flex items-center">
                  <Users className="h-3 w-3 mr-2" /> Current Queue
                </h3>
                <div className="flex space-x-2">
                  {/* <Button variant="outline" size="sm" className="h-7 text-xs bg-white border-slate-300">
                    <Filter className="h-3 w-3 mr-1" /> Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-white border-slate-300">
                    <Printer className="h-3 w-3 mr-1" /> Print List
                  </Button> */}
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Token</th>
                      <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Time</th>
                      <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Patient Name</th>
                      <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Priority</th>
                      <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Status</th>
                      <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {opdQueue.map((patient, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50 transition-colors group cursor-pointer">
                        <td className="px-4 py-3 font-mono text-slate-700 font-medium">{patient.token}</td>
                        <td className="px-4 py-3 text-slate-500">{patient.time}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {patient.name} <span className="text-slate-400 text-xs font-normal">({patient.gender}/{patient.age})</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                            patient.priority === "urgent" ? "bg-red-100 text-red-700" :
                              patient.priority === "high" ? "bg-amber-100 text-amber-700" :
                                "bg-slate-100 text-slate-600"
                          )}>
                            {patient.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-600">{patient.status}</td>
                        <td className="px-4 py-3 text-right">
                          {/* <Button size="sm" variant="ghost" className="h-6 text-xs text-blue-600 hover:bg-blue-50 uppercase font-bold tracking-tight">
                            Chart
                          </Button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT: Notifications / Tasks */}
            <div className="space-y-4">
              {/* Shift Info */}
              <div className="card-clinical p-4 bg-slate-800 text-white border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Shift Details</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-slate-300">Duty Doctor</span>
                    <span className="font-mono font-medium">{doctorData.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-slate-300">Shift Time</span>
                    <span className="font-mono text-emerald-400">08:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Nurse on Duty</span>
                    <span className="font-mono">Sister Nancy</span>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="card-clinical flex-1 flex flex-col">
                <div className="px-4 py-3 border-b border-border bg-slate-50">
                  <h3 className="font-bold text-slate-700 uppercase tracking-tight text-xs flex items-center">
                    <FileText className="h-3 w-3 mr-2" /> Pending Reports
                  </h3>
                </div>
                <ul className="divide-y divide-slate-100">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Lipid Profile</p>
                          <p className="text-[10px] text-slate-500">Patient: Rajesh Kumar (A-102)</p>
                        </div>
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200 font-medium">PENDING</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-2 border-t border-slate-100 mt-auto">
                  <Button variant="ghost" className="w-full h-8 text-xs font-bold text-slate-500 uppercase tracking-wide">View All Reports</Button>
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
