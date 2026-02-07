import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Save, User, Activity, ChevronLeft, Stethoscope, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

const NewPatient = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    bloodPressure: "",
    temperature: "",
    pulse: "",
    complaint: "",
    history: "",
    diagnosis: "",
    prescription: ""
  });

  const [doctorData, setDoctorData] = useState({
    name: "Loading...",
    specialization: "Loading...",
    department: "Loading...",
    doctorId: "Loading...",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, "users", currentUser.uid, "patients"), {
        ...formData,
        date: new Date().toISOString(),
        doctorId: currentUser.uid,
        status: "Admitted"
      });

      toast({
        title: "Patient Admitted",
        description: `Record created for ${formData.name}. Token generated.`,
        className: "bg-emerald-50 border-emerald-200 text-emerald-900"
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create patient record.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans text-sm">
      <Sidebar doctorData={doctorData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 text-slate-500">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-bold text-slate-800 uppercase tracking-tight">New Patient Admission</h1>
          </div>
        </header>

        {/* Main Form Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">

            {/* Section 1: Demographics */}
            <div className="card-clinical p-0 overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-border">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center">
                  <User className="h-3 w-3 mr-2" /> Demographics & Identity
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="label-clinical">Full Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    name="name"
                    placeholder="Enter patient name"
                    className="input-clinical uppercase"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="label-clinical">Age <span className="text-red-500">*</span></label>
                  <input
                    required
                    name="age"
                    type="number"
                    placeholder="Years"
                    className="input-clinical"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="label-clinical">Gender</label>
                  <select
                    name="gender"
                    className="input-clinical h-9" // match height
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label-clinical">Contact Number</label>
                  <input
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    className="input-clinical font-mono"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Vitals & Triage */}
            <div className="card-clinical p-0 overflow-hidden">
              <div className="bg-blue-50/50 px-4 py-2 border-b border-border">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center">
                  <Activity className="h-3 w-3 mr-2" /> Vitals & Triage Data
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label-clinical">Blood Pressure</label>
                  <div className="relative">
                    <Activity className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
                    <input
                      name="bloodPressure"
                      placeholder="120/80"
                      className="input-clinical pl-8"
                      value={formData.bloodPressure}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-clinical">Body Temp (°F)</label>
                  <div className="relative">
                    <Thermometer className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
                    <input
                      name="temperature"
                      placeholder="98.6"
                      className="input-clinical pl-8"
                      value={formData.temperature}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-clinical">Pulse (BPM)</label>
                  <div className="relative">
                    <Activity className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
                    <input
                      name="pulse"
                      placeholder="72"
                      className="input-clinical pl-8"
                      value={formData.pulse}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Clinical Notes */}
            <div className="card-clinical p-0 overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-border">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center">
                  <Stethoscope className="h-3 w-3 mr-2" /> Clinical Assessment
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="label-clinical">Chief Complaint</label>
                  <textarea
                    name="complaint"
                    rows={2}
                    className="input-clinical"
                    placeholder="Primary reason for visit..."
                    value={formData.complaint}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-clinical">History of Present Illness</label>
                    <textarea
                      name="history"
                      rows={4}
                      className="input-clinical"
                      placeholder="Detailed history..."
                      value={formData.history}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="label-clinical">Prescription / Plan</label>
                    <textarea
                      name="prescription"
                      rows={4}
                      className="input-clinical font-mono bg-yellow-50/30"
                      placeholder="Rx..."
                      value={formData.prescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} className="border-slate-300 text-slate-700">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-teal-700 hover:bg-teal-800 text-white min-w-[150px] shadow-sm">
                {isLoading ? "Processing..." : "Admit Patient"} <Save className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default NewPatient;
