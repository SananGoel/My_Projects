'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const icons = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  scan: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  meds: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  caregiver: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  pharmacy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="12" width="6" height="10"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const links = [
  { href: '/dashboard', label: 'Home', icon: icons.home },
  { href: '/scan', label: 'Scan', icon: icons.scan },
  { href: '/medications', label: 'Medications', icon: icons.meds },
  { href: '/caregiver', label: 'Caregiver', icon: icons.caregiver },
  { href: '/pharmacy', label: 'Pharmacy', icon: icons.pharmacy },
  { href: '/schedule', label: 'Schedule', icon: icons.calendar },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isAuth = path === '/login' || path === '/register';
  if (isAuth) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 200,
          background: '#1a1d2e', border: '1px solid #2d3148',
          borderRadius: 10, width: 42, height: 42,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#f1f5f9',
        }}>
        {open ? icons.close : icons.menu}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 100, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <nav style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 240, background: '#1a1d2e',
        borderRight: '1px solid #2d3148',
        zIndex: 150, padding: '80px 16px 24px',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingLeft: 8 }}>
          <img src="/icon.svg" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16 }}>MediGuard</span>
        </div>

        {links.map(l => {
          const active = path === l.href;
          return (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 10,
              textDecoration: 'none',
              background: active ? '#2d3148' : 'transparent',
              color: active ? '#6366f1' : '#64748b',
              fontWeight: active ? 600 : 400,
              fontSize: 14, transition: 'all 0.15s',
            }}>
              {l.icon}
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}