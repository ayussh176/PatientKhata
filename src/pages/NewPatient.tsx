import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Save, User, Activity, FileText, ChevronLeft, AlertCircle } from "lucide-react";
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
    bloodPressure: "",
    disease: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast({ title: "Error", description: "Failed to log out", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age) {
      toast({ title: "Validation Error", description: "Patient name and age are required.", variant: "destructive" });
      return;
    }
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const patientsCollection = collection(db, "patients");
      const docRef = await addDoc(patientsCollection, {
        ...formData,
        doctorId: currentUser.uid,
        createdAt: new Date().toISOString(),
        lastVisitDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Patient record created successfully.",
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      });
      navigate(`/search-patient?patientId=${docRef.id}`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save record.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans">
      <Sidebar doctorData={doctorData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-neutral-400 hover:text-neutral-900">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-neutral-800">New Patient Registration</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => navigate(-1)} className="text-neutral-600 border-neutral-300">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-brand-600 hover:bg-brand-700 text-white min-w-[140px]">
              {isLoading ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Personal Information */}
              <section className="card-base p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-brand-50 rounded-lg text-brand-600 mt-1">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-1">Personal Details</h2>
                      <p className="text-sm text-neutral-400">Basic patient identification information.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="label-text">Full Name <span className="text-red-500">*</span></label>
                        <input
                          id="name"
                          name="name"
                          className="input-field"
                          placeholder="e.g. John Doe"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="age" className="label-text">Age <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            id="age"
                            name="age"
                            type="number"
                            className="input-field pr-12"
                            placeholder="0"
                            value={formData.age}
                            onChange={handleChange}
                          />
                          <span className="absolute right-3 top-2.5 text-sm text-neutral-400 pointer-events-none">Yrs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Medical Details */}
              <section className="card-base p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600 mt-1">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-1">Clinical Vitals</h2>
                      <p className="text-sm text-neutral-400">Current health metrics and diagnosis.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="bloodPressure" className="label-text">Blood Pressure</label>
                        <input
                          id="bloodPressure"
                          name="bloodPressure"
                          className="input-field"
                          placeholder="e.g. 120/80"
                          value={formData.bloodPressure}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="disease" className="label-text">Diagnosis / Conditions</label>
                        <input
                          id="disease"
                          name="disease"
                          className="input-field"
                          placeholder="e.g. Type 2 Diabetes"
                          value={formData.disease}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Prescription */}
              <section className="card-base p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-1">Prescription & Notes</h2>
                      <p className="text-sm text-neutral-400">Treatment plan and clinical observations.</p>
                    </div>
                    <div className="space-y-1.5">
                      <textarea
                        id="prescription"
                        name="prescription"
                        rows={6}
                        className="input-field text-base leading-relaxed"
                        placeholder="Type prescription details here..."
                        value={formData.prescription}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <AlertCircle className="h-4 w-4" />
                      <span>Remember to verify patient allergies before prescribing.</span>
                    </div>
                  </div>
                </div>
              </section>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewPatient;
