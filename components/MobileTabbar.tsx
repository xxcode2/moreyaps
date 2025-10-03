"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Home", icon: (a:boolean)=>(<svg width="22" height="22" viewBox="0 0 24 24"><path fill={a?"#0b1220":"currentColor"} d="M12 5.3 3 12h2v7h6v-5h2v5h6v-7h2z"/></svg>) },
  { href: "/", label: "Tasks", icon: (a:boolean)=>(<svg width="22" height="22" viewBox="0 0 24 24"><path fill={a?"#0b1220":"currentColor"} d="M3 5h18v2H3zm0 6h18v2H3zm0 6h12v2H3z"/></svg>) },
  { href: "/create", label: "Create", icon: (a:boolean)=>(<svg width="22" height="22" viewBox="0 0 24 24"><path fill={a?"#0b1220":"currentColor"} d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>) },
  { href: "/my", label: "My", icon: (a:boolean)=>(<svg width="22" height="22" viewBox="0 0 24 24"><path fill={a?"#0b1220":"currentColor"} d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m-7 8v-1a7 7 0 0 1 14 0v1Z"/></svg>) },
];

export default function MobileTabbar(){
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="mx-auto max-w-3xl">
        <div className="mx-3 mb-3 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur shadow-lg">
          <ul className="grid grid-cols-4">
            {items.map(it=>{
              const active = pathname === it.href;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={`h-14 flex flex-col items-center justify-center gap-0.5 text-[11px]
                      ${active ? "bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-slate-900 font-semibold rounded-2xl" : "text-slate-300"}`}
                  >
                    {it.icon(active)}
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
