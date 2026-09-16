"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_SECTIONS } from "@/lib/nav";

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <Link href="/dashboard" className="px-2 text-lg font-semibold text-slate-900">
        StudyOn
      </Link>

      <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              {section.title}
            </p>
            <ul className="mt-2 space-y-1">
              {section.items.map((item) => {
                const active = item.href && pathname === item.href;
                if (item.status === "soon" || !item.href) {
                  return (
                    <li key={item.label}>
                      <span className="flex cursor-not-allowed items-center justify-between rounded-md px-2 py-1.5 text-sm text-slate-400">
                        {item.label}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                          скоро
                        </span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-brand-light font-medium text-brand"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 pt-4">
        <p className="truncate px-2 text-xs text-slate-500">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
