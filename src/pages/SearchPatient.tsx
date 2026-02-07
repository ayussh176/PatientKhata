import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Bell, UserCircle, Search, Edit2, Save, X, Activity, FileText, Calendar, User, Clock, ChevronRight, AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { cn } from "@/lib/utils";

const SearchPatient = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get("patientId") || "";

  const [patientId, setPatientId] = useState(initialPatientId);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patient, setPatient] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [updateData, setUpdateData] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [unsubscribeSnapshot, setUnsubscribeSnapshot] = useState<any>(null);

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

  const handleSearch = async () => {
    if (!patientId.trim()) {
      toast({ title: "Input Required", description: "Please enter a patient ID", variant: "destructive" });
      return;
    }
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const patientsRef = collection(db, "patients");
      const q = query(
        patientsRef,
        where("doctorId", "==", currentUser.uid),
        where("__name__", "==", patientId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({ title: "Not Found", description: "No patient found with that ID", variant: "destructive" });
        setPatient(null);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        return;
      }

      const docSnap = querySnapshot.docs[0];
      const foundDocId = docSnap.id;

      if (unsubscribeSnapshot) unsubscribeSnapshot();

      const unsub = onSnapshot(doc(db, "patients", foundDocId), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setPatient({ id: foundDocId, ...data });
          if (!editMode) setUpdateData({ ...data });
        } else {
          setPatient(null);
        }
      });

      setUnsubscribeSnapshot(() => unsub);
    } catch (error) {
      toast({ title: "Error", description: "Failed to search for patient", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (!editMode && patient) setUpdateData({ ...patient });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    try {
      const patientRef = doc(db, "patients", patient.id);
      await updateDoc(patientRef, {
        ...updateData,
        lastVisitDate: new Date().toISOString(),
      });
      toast({ title: "Success", description: "Patient information updated.", className: "bg-emerald-50 border-emerald-200 text-emerald-800" });
      setEditMode(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update record", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (initialPatientId) handleSearch();
    return () => { if (unsubscribeSnapshot) unsubscribeSnapshot(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans">
      <Sidebar doctorData={doctorData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-neutral-800">Search Records</h1>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Bell className="h-5 w-5 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors" />
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm border border-brand-200">
              {doctorData.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
              <div className="flex-1 w-full relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter Patient ID (e.g. pt_12345)"
                  className="w-full pl-12 pr-4 py-3.5 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none bg-white shadow-sm text-base"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="h-auto py-3.5 px-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl shadow-lg shadow-neutral-900/10 transition-all font-medium text-base min-w-[140px]"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Results / Empty State */}
            {!patient && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-neutral-100 rounded-full mb-4">
                  <Search className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900">No Patient Selected</h3>
                <p className="text-neutral-500 max-w-sm mt-2">Enter a unique patient ID above to view their medical records and history.</p>
              </div>
            )}

            {patient && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                {editMode ? (
                  /* Edit Form */
                  <form onSubmit={handleUpdatePatient} className="card-base overflow-hidden">
                    <div className="p-6 border-b border-neutral-200 bg-brand-50/50 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg border border-brand-100 shadow-sm">
                          <Edit2 className="h-5 w-5 text-brand-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-neutral-900">Edit Patient Record</h2>
                          <p className="text-xs text-brand-600 font-medium uppercasetracking-wider">ID: {patient.id}</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={toggleEditMode}>
                        <X className="h-5 w-5 text-neutral-500" />
                      </Button>
                    </div>

                    <div className="p-8 grid gap-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="label-text">Full Name</label>
                          <input name="name" className="input-field" value={updateData.name || ""} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="label-text">Age</label>
                          <input name="age" type="number" className="input-field" value={updateData.age || ""} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="label-text">Blood Pressure</label>
                          <input name="bloodPressure" className="input-field" value={updateData.bloodPressure || ""} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="label-text">Diagnosis</label>
                          <input name="disease" className="input-field" value={updateData.disease || ""} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="label-text">Prescription / Clinical Notes</label>
                        <textarea name="prescription" rows={6} className="input-field text-base" value={updateData.prescription || ""} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="p-6 bg-neutral-50 border-t border-neutral-200 flex justify-end space-x-3">
                      <Button type="button" variant="outline" onClick={toggleEditMode} className="bg-white">Cancel</Button>
                      <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white">
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* View Mode Layout */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Sidebar: Profile Card */}
                    <div className="space-y-6">
                      <div className="card-base p-6 text-center">
                        <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-sm">
                          <User className="h-10 w-10 text-neutral-400" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900">{patient.name}</h2>
                        <p className="text-neutral-500 text-sm mt-1">{patient.age} Years Old • Male/Female</p>

                        <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Last Visit</p>
                            <p className="text-sm font-medium text-neutral-900 mt-1">
                              {patient.lastVisitDate ? new Date(patient.lastVisitDate).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div className="text-center border-l border-neutral-100">
                            <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Status</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                              Active
                            </span>
                          </div>
                        </div>

                        <Button onClick={toggleEditMode} variant="outline" className="w-full mt-6 border-brand-200 text-brand-700 hover:bg-brand-50 hover:text-brand-800">
                          <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                        </Button>
                      </div>

                      <div className="card-base p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Contact Info</h3>
                        <div className="space-y-4">
                          <div className="flex items-center text-sm text-neutral-600">
                            <Phone className="h-4 w-4 mr-3 text-neutral-400" />
                            <span>+91 98765 43210</span>
                          </div>
                          {/* Placeholder for more contact info if schema expanded */}
                        </div>
                      </div>
                    </div>

                    {/* Main Content: Clinical Data */}
                    <div className="lg:col-span-2 space-y-8">

                      {/* Vitals Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="card-base p-5 flex items-center space-x-4 border-l-4 border-l-rose-500">
                          <div className="p-3 bg-rose-50 rounded-full text-rose-600">
                            <Activity className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Blood Pressure</p>
                            <p className="text-xl font-bold text-neutral-900">{patient.bloodPressure || "N/A"}</p>
                          </div>
                        </div>
                        <div className="card-base p-5 flex items-center space-x-4 border-l-4 border-l-brand-500">
                          <div className="p-3 bg-brand-50 rounded-full text-brand-600">
                            <Activity className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Diagnosis</p>
                            <p className="text-lg font-bold text-neutral-900 truncate max-w-[150px]">{patient.disease || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tabs / Sections */}
                      <div className="card-base min-h-[400px]">
                        <div className="border-b border-neutral-200 px-6">
                          <nav className="-mb-px flex space-x-8">
                            <button className="border-b-2 border-brand-600 py-4 px-1 text-sm font-medium text-brand-600">
                              Clinical Notes
                            </button>
                            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:border-neutral-300">
                              Lab Reports
                            </button>
                            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:border-neutral-300">
                              Prescriptions History
                            </button>
                          </nav>
                        </div>
                        <div className="p-6">
                          <div className="prose prose-sm max-w-none text-neutral-600">
                            <h4 className="text-neutral-900 font-medium mb-2">Current Prescription</h4>
                            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 whitespace-pre-wrap">
                              {patient.prescription || "No prescription details available."}
                            </div>

                            {/* Placeholder timeline */}
                            <div className="mt-8">
                              <h4 className="text-neutral-900 font-medium mb-4">Visit Timeline</h4>
                              <div className="border-l-2 border-neutral-100 ml-2 space-y-6">
                                <div className="relative pl-6 pb-2">
                                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-white"></div>
                                  <p className="text-sm font-medium text-neutral-900">Today</p>
                                  <p className="text-xs text-neutral-500">Routine Check-up</p>
                                </div>
                                <div className="relative pl-6 pb-2">
                                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-neutral-300 ring-4 ring-white"></div>
                                  <p className="text-sm font-medium text-neutral-900">Registration</p>
                                  <p className="text-xs text-neutral-500">{new Date(patient.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPatient;
