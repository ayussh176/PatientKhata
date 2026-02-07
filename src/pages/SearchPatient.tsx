import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Search, ChevronRight, Edit2, FileText, Calendar, Activity, Filter, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SearchPatient = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patients, setPatients] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editForm, setEditForm] = useState<any>({});

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

  // Check for ID in URL
  useEffect(() => {
    const patientId = searchParams.get("patientId");
    if (patientId && currentUser) {
      const fetchPatient = async () => {
        try {
          const docRef = doc(db, "users", currentUser.uid, "patients", patientId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            setSelectedPatient(data);
            setEditForm(data);
            setPatients([data]); // Show in list
          }
        } catch (e) { console.error(e); }
      };
      fetchPatient();
    }
  }, [searchParams, currentUser]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim() || !currentUser) return;

    setLoading(true);
    setPatients([]);
    setSelectedPatient(null);

    try {
      // Simple name search - in production, use Algolia/Typesense for better search
      const q = query(
        collection(db, "users", currentUser.uid, "patients"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const patientsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsList);

      if (patientsList.length === 0) {
        toast({ description: "No patients found matching that name." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Search failed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setEditForm(patient);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!selectedPatient || !currentUser) return;
    try {
      await updateDoc(doc(db, "users", currentUser.uid, "patients", selectedPatient.id), editForm);

      // Update local state without refetching
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...editForm, id: p.id } as any : p));
      setSelectedPatient({ ...editForm, id: selectedPatient.id });
      setIsEditing(false);

      toast({ title: "Updated", description: "Patient record updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    }
  };

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
        {/* Header */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm z-10">
          <h1 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Patient Records Retrieval</h1>
        </header>

        <main className="flex-1 overflow-hidden flex">
          {/* LEFT: Search & List */}
          <div className="w-1/3 bg-slate-50 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border bg-white">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    className="input-clinical pl-9"
                    placeholder="Search by Name, ID, or Phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading} className="bg-slate-900 text-white shadow-sm">
                  {loading ? "..." : "Find"}
                </Button>
              </form>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs font-bold text-slate-500 uppercase">{patients.length} Records Found</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-500">
                  <Filter className="h-3 w-3 mr-1" /> Filters
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={cn(
                    "p-4 border-b border-slate-200 cursor-pointer transition-colors hover:bg-white",
                    selectedPatient?.id === patient.id ? "bg-white border-l-4 border-l-teal-600 shadow-sm" : "bg-transparent border-l-4 border-l-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 text-sm">{patient.name}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                      {patient.gender?.charAt(0) || "-"}/{patient.age}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 space-x-3">
                    <span className="flex items-center"><Activity className="h-3 w-3 mr-1" /> {patient.bloodPressure || "N/A"}</span>
                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {new Date(patient.date || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {patients.length === 0 && !loading && (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-xs uppercase tracking-wide">Enter search term to retrieve data</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Detail View / Editor */}
          <div className="flex-1 bg-white overflow-y-auto p-6">
            {selectedPatient ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Tools */}
                <div className="flex justify-end space-x-2 mb-4 print:hidden">
                  {!isEditing ? (
                    <Button size="sm" onClick={() => setIsEditing(true)} className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-sm">
                      <Edit2 className="h-3 w-3 mr-2" /> Edit Record
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button size="sm" className="bg-teal-700 text-white hover:bg-teal-800" onClick={handleUpdate}>Save Changes</Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" className="text-slate-600 border-slate-200"><FileText className="h-3 w-3 mr-1" /> Print Chart</Button>
                </div>

                {/* Patient Header - "Chart" Style */}
                <div className="border border-slate-300 rounded-sm overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-300 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-slate-900 uppercase tracking-tight flex items-center">
                      <User className="h-5 w-5 mr-2 text-slate-500" />
                      {selectedPatient.name}
                    </h2>
                    <div className="space-x-4 text-sm font-mono text-slate-600">
                      <span>AGE: {selectedPatient.age}</span>
                      <span>SEX: {selectedPatient.gender}</span>
                      <span>ID: {selectedPatient.id.substring(0, 6).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-3 gap-6 bg-white">
                    <div>
                      <label className="label-clinical">Diagnosis</label>
                      {isEditing ? (
                        <input className="input-clinical" value={editForm.disease || ""} onChange={e => setEditForm({ ...editForm, disease: e.target.value })} />
                      ) : (
                        <p className="text-base font-semibold text-slate-900">{selectedPatient.disease || "No Diagnosis"}</p>
                      )}
                    </div>
                    <div>
                      <label className="label-clinical">Blood Pressure</label>
                      {isEditing ? (
                        <input className="input-clinical" value={editForm.bloodPressure || ""} onChange={e => setEditForm({ ...editForm, bloodPressure: e.target.value })} />
                      ) : (
                        <p className="text-base font-medium text-slate-900">{selectedPatient.bloodPressure || "--/--"}</p>
                      )}
                    </div>
                    <div>
                      <label className="label-clinical">Contact</label>
                      <p className="text-base font-mono text-slate-900">{selectedPatient.phone || "--"}</p>
                    </div>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-slate-300 rounded-sm p-4 bg-white relative">
                    <h3 className="label-clinical mb-2 border-b border-slate-100 pb-1">History & Complaints</h3>
                    <div className="min-h-[150px] text-sm text-slate-800 whitespace-pre-wrap">
                      {selectedPatient.history || selectedPatient.complaint || "No clinical notes recorded."}
                    </div>
                  </div>

                  <div className="border border-slate-300 rounded-sm p-4 bg-yellow-50/20 relative">
                    <h3 className="label-clinical mb-2 border-b border-yellow-100 pb-1 text-slate-600">Prescription</h3>
                    {isEditing ? (
                      <textarea
                        className="input-clinical h-32 font-mono text-sm bg-yellow-50/50"
                        value={editForm.prescription || ""}
                        onChange={e => setEditForm({ ...editForm, prescription: e.target.value })}
                      />
                    ) : (
                      <div className="min-h-[150px] font-mono text-sm text-slate-800 whitespace-pre-wrap">
                        {selectedPatient.prescription || "No prescription issued."}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm font-medium uppercase tracking-widest">Select a patient record to view details</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPatient;
