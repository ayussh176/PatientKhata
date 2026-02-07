import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Search,
  LogOut,
  Menu,
  X,
  FileText,
  Settings,
  Activity,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Sidebar = ({ doctorData, onLogout }: { doctorData: any; onLogout: () => void }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { label: "New Admission", icon: UserPlus, path: "/new-patient" },
    { label: "Patient Records", icon: Search, path: "/search-patient" },
    { label: "OPD Queue", icon: Users, path: "/opd-queue" }, // Feature hint
    { label: "Vitals Monitor", icon: Activity, path: "/vitals" }, // Feature hint
    { label: "Reports", icon: FileText, path: "/reports" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed top-3 left-4 z-50 bg-white shadow-sm border-slate-300 rounded-sm"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 z-50 h-full w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-teal-600 rounded-sm flex items-center justify-center">
              <span className="font-bold text-white text-lg">+</span>
            </div>
            <span className="font-bold text-lg text-slate-100 tracking-tight">CURE<span className="text-teal-500">SYS</span></span>
          </div>
        </div>

        {/* User Info - Compact */}
        <div className="p-4 bg-slate-800/50 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-sm bg-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs border border-slate-600">
              DR
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate">{doctorData?.name || "Doctor"}</p>
              <p className="text-xs text-slate-500 truncate uppercase tracking-wider">{doctorData?.specialization || "General"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Clinical</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-teal-900/30 text-teal-400 border-l-2 border-teal-500"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-l-2 hover:border-slate-600 border-l-2 border-transparent"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300")} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="mt-8">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System</p>
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-sm text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors border-l-2 border-transparent"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full space-x-2 px-4 py-2 bg-slate-800 hover:bg-red-900/20 hover:text-red-400 text-slate-400 rounded-sm transition-colors text-xs font-medium uppercase tracking-wide border border-transparent hover:border-red-900/30"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
          <p className="text-[10px] text-center text-slate-600 mt-3">
            v2.4.0 • Hospital EMR
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
