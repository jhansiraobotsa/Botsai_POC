import { ReactNode } from "react";
import DashboardHeader from "@/components/dashboard-header";
import Sidebar from "@/components/sidebar";
import ChatWidget from "@/components/chat-widget";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">{children}</div>
      </div>
      <ChatWidget />
    </div>
  );
}
