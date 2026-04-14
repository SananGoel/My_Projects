'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface Schedule {
  id: string;
  medicationName: string;
  days: string[];
  times: string[];
  time?: string;
  customTimes: Record<string, string[]>;
  useCustomTimes: boolean;
  startDate?: string;
  endDate?: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates(offset: number) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return DAYS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label, date: d, dateNum: d.getDate(), month: d.toLocaleString('default', { month: 'short' }) };
  });
}

function isInRange(date: Date, startDate?: string, endDate?: string) {
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (date < start) return false;
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (date > end) return false;
  }
  return true;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/login');
      else { setLoading(false); setEmail(user.email || ''); setUid(user.uid); }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(collection(db, 'users', uid, 'schedules'), (snap) => {
      setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() } as Schedule)));
    });
    return () => unsub();
  }, [uid]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117' }}>
      <div style={{ color: '#6366f1', fontSize: 16 }}>Loading...</div>
    </div>
  );

  const weekDates = getWeekDates(weekOffset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const weekLabel = `${weekStart.month} ${weekStart.dateNum} – ${weekEnd.month} ${weekEnd.dateNum}`;

  const todayLabel = DAYS[(today.getDay() + 6) % 7];
  const todayMeds = schedules.filter(s =>
    s.days.includes(todayLabel) && isInRange(today, s.startDate, s.endDate)
  );

  const cards = [
    {
      href: '/scan', label: 'Scan Medication', desc: 'Identify pills and check interactions',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
    },
    {
      href: '/medications', label: 'My Medications', desc: 'View your saved medications',
      gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
    },
    {
      href: '/caregiver', label: 'Caregiver View', desc: 'Monitor medications at a glance',
      gradient: 'linear-gradient(135deg, #10b981, #0ea5e9)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      href: '/pharmacy', label: 'Find Pharmacy', desc: 'Locate nearby pharmacies',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#0f1117', padding: '24px 20px 80px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <img src="/icon.svg" style={{ width: 36, height: 36, borderRadius: 10 }} />
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>MediGuard</h1>
            </div>
            <p style={{ color: '#64748b', fontSize: 13 }}>Welcome back, {email.split('@')[0]}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push('/login'))} style={{
            padding: '8px 14px', background: '#1a1d2e', color: '#64748b',
            border: '1px solid #2d3148', borderRadius: 8, cursor: 'pointer', fontSize: 13,
          }}>Sign out</button>
        </div>

        {/* Weekly Calendar */}
        <div style={{ background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15 }}>
                {weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : weekOffset === -1 ? 'Last Week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
              </p>
              <p style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{weekLabel}</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setWeekOffset(w => w - 1)} style={{
                width: 30, height: 30, borderRadius: 8, background: '#0f1117',
                border: '1px solid #2d3148', color: '#94a3b8', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              {weekOffset !== 0 && (
                <button onClick={() => setWeekOffset(0)} style={{
                  padding: '0 10px', height: 30, borderRadius: 8, background: '#0f1117',
                  border: '1px solid #2d3148', color: '#94a3b8', cursor: 'pointer', fontSize: 11,
                }}>Today</button>
              )}
              <button onClick={() => setWeekOffset(w => w + 1)} style={{
                width: 30, height: 30, borderRadius: 8, background: '#0f1117',
                border: '1px solid #2d3148', color: '#94a3b8', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          {/* Day columns */}
          <div style={{ display: 'flex', gap: 6 }}>
            {weekDates.map(({ label, date, dateNum, month }) => {
              const isToday = date.toDateString() === today.toDateString();
              const dayDate = new Date(date);
              dayDate.setHours(0, 0, 0, 0);
              const dayMeds = schedules.filter(s =>
                s.days.includes(label) && isInRange(dayDate, s.startDate, s.endDate)
              );
              return (
                <div key={label} style={{
                  flex: 1, borderRadius: 12, padding: '10px 6px',
                  background: isToday ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#0f1117',
                  border: `1px solid ${isToday ? '#6366f1' : '#2d3148'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  minHeight: 100,
                }}>
                  <span style={{ fontSize: 10, fontWeight: 500, color: isToday ? 'rgba(255,255,255,0.8)' : '#64748b' }}>{label}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: isToday ? 'white' : '#f1f5f9' }}>{dateNum}</span>
                  <span style={{ fontSize: 9, color: isToday ? 'rgba(255,255,255,0.7)' : '#475569', marginBottom: 4 }}>{month}</span>
                  {dayMeds.slice(0, 2).map((s, i) => (
                    <div key={i} style={{
                      width: '100%', background: isToday ? 'rgba(255,255,255,0.2)' : '#1a1d2e',
                      borderRadius: 4, padding: '3px 4px', textAlign: 'center',
                    }}>
                      <p style={{
                        fontSize: 8, color: isToday ? 'white' : '#6366f1',
                        fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {s.medicationName.split(' ')[0]}
                      </p>
                      <p style={{ fontSize: 7, color: isToday ? 'rgba(255,255,255,0.7)' : '#475569' }}>
                        {(s.times || [s.time]).join(', ')}
                      </p>
                    </div>
                  ))}
                  {dayMeds.length > 2 && (
                    <span style={{ fontSize: 8, color: isToday ? 'rgba(255,255,255,0.8)' : '#6366f1', fontWeight: 600 }}>
                      +{dayMeds.length - 2} more
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Today's meds list */}
          {todayMeds.length > 0 && weekOffset === 0 && (
            <div style={{ marginTop: 14, borderTop: '1px solid #2d3148', paddingTop: 12 }}>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Today's medications</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {todayMeds.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 500 }}>{s.medicationName}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(s.times || [s.time]).map((t, i) => (
                        <span key={i} style={{ color: '#6366f1', fontSize: 12, background: '#1e1b4b', padding: '2px 8px', borderRadius: 6 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick action cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cards.map(card => (
            <a key={card.href} href={card.href} style={{
              background: '#1a1d2e', border: '1px solid #2d3148',
              borderRadius: 14, padding: '14px 16px', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: card.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{card.icon}</div>
              <div>
                <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{card.label}</p>
                <p style={{ color: '#64748b', fontSize: 12 }}>{card.desc}</p>
              </div>
              <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}