import { ReactNode } from "react";
import DashboardHeader from "@/components/dashboard-header";
import Sidebar from "@/components/sidebar";
import ChatWidget from "@/components/chat-widget";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 pt-[4rem] overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-[4rem] bottom-0 z-40">
          <Sidebar />
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 ml-64 overflow-y-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
      
      <ChatWidget />
    </div>
  );
}
