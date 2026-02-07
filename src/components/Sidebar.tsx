import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCircle, UserPlus, Search, LogOut, LayoutDashboard, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  doctorData: {
    name: string;
    doctorId: string;
    department: string;
    specialization: string;
  } | null;
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ doctorData, onLogout }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const matchPath = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { path: "/new-patient", icon: UserPlus, label: "New Patient" },
    { path: "/search-patient", icon: Search, label: "Search Records" },
  ];

  return (
    <>
      {/* Mobile Menu Button - Floating */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-neutral-900 text-white rounded-full shadow-lg hover:bg-neutral-800 transition-colors"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-neutral-900/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-neutral-900 text-neutral-300 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none border-r border-neutral-800",
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <span className="font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">PatientKhata</span>
          </div>
        </div>

        {/* Profile Brief */}
        <div className="px-6 py-6">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-neutral-800/50 border border-neutral-800">
            <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center shrink-0">
              <UserCircle className="h-6 w-6 text-neutral-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{doctorData?.name || "Loading..."}</p>
              <p className="text-xs text-neutral-500 truncate">{doctorData?.specialization || "Doctor"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
          <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => {
            const isActive = matchPath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-900/20"
                    : "hover:bg-neutral-800 hover:text-white"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-neutral-500 group-hover:text-white"
                  )} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-white/50" />}
              </Link>
            );
          })}
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all duration-200 text-sm font-medium group"
          >
            <LogOut className="h-4 w-4 group-hover:text-red-400 transition-colors" />
            <span>Sign Out</span>
          </button>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-semibold">Version 2.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
