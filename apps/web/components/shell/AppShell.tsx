import { Sidebar } from "./Sidebar";

export function AppShell({ userEmail, children }: { userEmail: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userEmail={userEmail} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
