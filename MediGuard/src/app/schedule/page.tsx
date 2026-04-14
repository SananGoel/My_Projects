'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface Medication { id: string; name: string; dosage?: string; }
interface Schedule {
  id: string;
  medicationName: string;
  days: string[];
  times: string[];
  time?: string;
  customTimes: Record<string, string[]>;
  useCustomTimes: boolean;
  dosagePerIntake: string;
  startDate: string;
  endDate: string;
}

export default function SchedulePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedMed, setSelectedMed] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [customTimes, setCustomTimes] = useState<Record<string, string[]>>({});
  const [useCustomTimes, setUseCustomTimes] = useState(false);
  const [dosagePerIntake, setDosagePerIntake] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [overdoseWarning, setOverdoseWarning] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) { router.push('/login'); return; }
      setUid(user.uid);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!uid) return;
    const medUnsub = onSnapshot(collection(db, 'users', uid, 'medications'), (snap) => {
      setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Medication)));
    });
    const schedUnsub = onSnapshot(collection(db, 'users', uid, 'schedules'), (snap) => {
      setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() } as Schedule)));
    });
    return () => { medUnsub(); schedUnsub(); };
  }, [uid]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addTime = () => setTimes(prev => [...prev, '08:00']);
  const removeTime = (i: number) => setTimes(prev => prev.filter((_, idx) => idx !== i));
  const updateTime = (i: number, val: string) => setTimes(prev => prev.map((t, idx) => idx === i ? val : t));

  const checkOverdose = () => {
    const med = medications.find(m => m.name === selectedMed);
    if (!med || !dosagePerIntake) return '';
    const dosageNum = parseFloat(dosagePerIntake);
    if (isNaN(dosageNum)) return '';
    const totalPerDay = dosageNum * times.length;
    if (selectedMed.toLowerCase().includes('paracetamol') || selectedMed.toLowerCase().includes('crocin')) {
      if (totalPerDay > 4000) return `⚠️ Warning: ${totalPerDay}mg/day exceeds the safe limit of 4000mg for paracetamol.`;
    }
    if (selectedMed.toLowerCase().includes('ibuprofen')) {
      if (totalPerDay > 1200) return `⚠️ Warning: ${totalPerDay}mg/day exceeds the safe OTC limit of 1200mg for ibuprofen.`;
    }
    return '';
  };

  useEffect(() => {
    setOverdoseWarning(checkOverdose());
  }, [dosagePerIntake, times, selectedMed]);

  const handleSave = async () => {
    if (!uid || !selectedMed || selectedDays.length === 0 || times.length === 0) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', uid, 'schedules'), {
        medicationName: selectedMed,
        days: selectedDays,
        times,
        customTimes,
        useCustomTimes,
        dosagePerIntake,
        startDate,
        endDate,
        createdAt: serverTimestamp(),
      });
      setSelectedMed(''); setSelectedDays([]); setTimes(['08:00']);
      setCustomTimes({}); setUseCustomTimes(false);
      setDosagePerIntake(''); setStartDate(''); setEndDate('');
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'schedules', id));
  };

  const syncToGoogleCalendar = (sched: Schedule) => {
    const today = new Date();
    const startD = sched.startDate ? new Date(sched.startDate) : today;
    const endD = sched.endDate ? new Date(sched.endDate) : new Date(new Date().setMonth(today.getMonth() + 1));
    const time = (sched.times || [sched.time])[0] || '08:00';
    const [hours, minutes] = time.split(':');
    const eventStart = new Date(startD);
    eventStart.setHours(parseInt(hours), parseInt(minutes), 0);
    const eventEnd = new Date(eventStart);
    eventEnd.setMinutes(eventEnd.getMinutes() + 30);
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, 15) + 'Z';
    const dayMap: Record<string, string> = { Mon: 'MO', Tue: 'TU', Wed: 'WE', Thu: 'TH', Fri: 'FR', Sat: 'SA', Sun: 'SU' };
    const byDay = sched.days.map(d => dayMap[d] || d).join(',');
    const until = endD.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, 8);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(`💊 ${sched.medicationName}`)}` +
      `&dates=${format(eventStart)}/${format(eventEnd)}` +
      `&details=${encodeURIComponent(`MediGuard Medication Reminder\nDosage: ${sched.dosagePerIntake || 'As prescribed'}mg\nTimes: ${(sched.times || [sched.time]).join(', ')}`)}` +
      `&recur=RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${until}`;
    window.open(url, '_blank');
  };

  const inputStyle: any = {
    width: '100%', padding: '12px 14px',
    borderRadius: 10, border: '1px solid #2d3148',
    background: '#0f1117', color: '#f1f5f9',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0f1117', padding: '24px 20px 80px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Schedule</h1>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Manage your medication reminders</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            padding: '10px 18px',
            background: showForm ? '#2d3148' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', border: 'none', borderRadius: 10,
            cursor: 'pointer', fontWeight: 600, fontSize: 14,
          }}>
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 16, padding: 20, marginBottom: 24 }}>

            <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Medication</label>
            {medications.length === 0 ? (
              <div style={{ ...inputStyle, marginBottom: 16, color: '#64748b' }}>No medications saved yet.</div>
            ) : (
              <select value={selectedMed} onChange={e => setSelectedMed(e.target.value)}
                style={{ ...inputStyle, marginBottom: 16, cursor: 'pointer' }}>
                <option value="">Select a medication...</option>
                {medications.map(med => (
                  <option key={med.id} value={med.name}>{med.name}</option>
                ))}
              </select>
            )}

            <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Dosage per intake (mg)</label>
            <input
              type="number" placeholder="e.g. 500"
              value={dosagePerIntake} onChange={e => setDosagePerIntake(e.target.value)}
              style={{ ...inputStyle, marginBottom: overdoseWarning ? 8 : 16 }}
            />
            {overdoseWarning && (
              <div style={{
                background: '#2d1a1a', border: '1px solid #7f1d1d',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                color: '#fca5a5', fontSize: 13,
              }}>{overdoseWarning}</div>
            )}

            <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 10 }}>Days</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {DAYS.map(day => (
                <div key={day} onClick={() => toggleDay(day)} style={{
                  width: 48, height: 48, borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
                  border: `1px solid ${selectedDays.includes(day) ? '#6366f1' : '#2d3148'}`,
                  background: selectedDays.includes(day) ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#0f1117',
                  color: selectedDays.includes(day) ? 'white' : '#64748b',
                }}>{day}</div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>Times per day</label>
              <button onClick={addTime} style={{
                padding: '4px 12px', background: '#2d3148', color: '#6366f1',
                border: '1px solid #6366f1', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
              }}>+ Add time</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {times.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    background: '#2d3148', color: '#94a3b8', borderRadius: 6,
                    padding: '4px 10px', fontSize: 12, fontWeight: 500, flexShrink: 0,
                  }}>Dose {i + 1}</span>
                  <input type="time" value={t} onChange={e => updateTime(i, e.target.value)}
                    style={{ ...inputStyle, flex: 1 }} />
                  {times.length > 1 && (
                    <button onClick={() => removeTime(i)} style={{
                      background: '#2d1a1a', border: '1px solid #7f1d1d',
                      color: '#f87171', cursor: 'pointer', fontSize: 16,
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>×</button>
                  )}
                </div>
              ))}
            </div>

            {selectedDays.length > 1 && (
              <div style={{ marginBottom: 16 }}>
                <div onClick={() => setUseCustomTimes(!useCustomTimes)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 8,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    border: `2px solid ${useCustomTimes ? '#6366f1' : '#2d3148'}`,
                    background: useCustomTimes ? '#6366f1' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {useCustomTimes && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>Different times for each day</span>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Start date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>End date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving || !selectedMed || selectedDays.length === 0} style={{
              width: '100%', padding: 14,
              background: (!selectedMed || selectedDays.length === 0) ? '#2d3148' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: (!selectedMed || selectedDays.length === 0) ? '#475569' : 'white',
              border: 'none', borderRadius: 10, fontSize: 15,
              fontWeight: 600, cursor: (!selectedMed || selectedDays.length === 0) ? 'default' : 'pointer',
            }}>
              {saving ? 'Saving...' : 'Add to Schedule'}
            </button>
          </div>
        )}

        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
              background: '#1a1d2e', border: '1px solid #2d3148',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No schedules yet</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Add a medication schedule to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {schedules.map(sched => (
              <div key={sched.id} style={{
                background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 14, padding: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15 }}>{sched.medicationName}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      {(sched.times || [sched.time]).map((t, i) => (
                        <span key={i} style={{
                          background: '#2d3148', color: '#6366f1', borderRadius: 6,
                          padding: '2px 8px', fontSize: 12, fontWeight: 500,
                        }}>{t}</span>
                      ))}
                    </div>
                    {sched.dosagePerIntake && (
                      <p style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{sched.dosagePerIntake}mg per dose</p>
                    )}
                    {(sched.startDate || sched.endDate) && (
                      <p style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>
                        {sched.startDate && `From ${sched.startDate}`}{sched.startDate && sched.endDate && ' → '}{sched.endDate && `Until ${sched.endDate}`}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => syncToGoogleCalendar(sched)} style={{
                      background: '#0d2818', border: '1px solid #166534',
                      color: '#4ade80', cursor: 'pointer', fontSize: 11,
                      padding: '0 10px', height: 32, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, whiteSpace: 'nowrap', gap: 4,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Sync
                    </button>
                    <button onClick={() => deleteSchedule(sched.id)} style={{
                      background: '#2d1a1a', border: '1px solid #7f1d1d',
                      color: '#f87171', cursor: 'pointer', fontSize: 16,
                      width: 32, height: 32, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>×</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {DAYS.map(day => (
                    <div key={day} style={{
                      width: 40, height: 36, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: sched.days.includes(day) ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#0f1117',
                      border: `1px solid ${sched.days.includes(day) ? '#6366f1' : '#2d3148'}`,
                      color: sched.days.includes(day) ? 'white' : '#475569',
                      fontSize: 11, fontWeight: 600,
                    }}>{day}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}