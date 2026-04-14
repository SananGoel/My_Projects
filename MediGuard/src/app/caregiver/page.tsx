'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function CaregiverPage() {
    const [medications, setMedications] = useState<any[]>([]);
    const [uid, setUid] = useState<string | null>(null);
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
        const ref = collection(db, 'users', uid, 'medications');
        const unsub = onSnapshot(ref, (snap) => {
            setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [uid]);

    const safe = medications.filter(m => m.safeToTake !== false);
    const unsafe = medications.filter(m => m.safeToTake === false);

    return (
        <main style={{ minHeight: '100vh', background: '#0f1117', padding: '24px 20px 100px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
                {/* Header */}
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>👨‍👩‍👧 Caregiver View</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Medication safety overview</p>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
                    {[
                        { label: 'Total', value: medications.length, color: '#6366f1', bg: '#1a1d2e' },
                        { label: 'Safe', value: safe.length, color: '#4ade80', bg: '#0d2818' },
                        { label: 'Caution', value: unsafe.length, color: '#f87171', bg: '#2d1a1a' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            background: stat.bg, border: `1px solid ${stat.color}33`,
                            borderRadius: 12, padding: '14px 10px', textAlign: 'center',
                        }}>
                            <p style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</p>
                            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {medications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>💊</div>
                        <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No medications on file</p>
                        <p style={{ color: '#64748b', fontSize: 14 }}>Scanned medications will appear here</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {medications.map(med => (
                            <div key={med.id} style={{
                                background: med.safeToTake === false ? '#2d1a1a' : '#1a1d2e',
                                border: `1px solid ${med.safeToTake === false ? '#7f1d1d' : '#2d3148'}`,
                                borderRadius: 14, padding: 16,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                    <p style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 15, flex: 1 }}>{med.name}</p>
                                    <span style={{
                                        fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                                        background: med.safeToTake === false ? '#7f1d1d' : '#166534',
                                        color: med.safeToTake === false ? '#fca5a5' : '#4ade80',
                                        marginLeft: 8, whiteSpace: 'nowrap',
                                    }}>
                                        {med.safeToTake === false ? '⚠️ Caution' : '✅ Safe'}
                                    </span>
                                </div>
                                {med.dosage && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>{med.dosage}</p>}
                                {med.activeIngredient && <p style={{ fontSize: 12, color: '#475569' }}>{med.activeIngredient}</p>}
                                {med.warning && (
                                    <div style={{
                                        marginTop: 10, background: '#1a0a0a', border: '1px solid #7f1d1d',
                                        borderRadius: 8, padding: '8px 12px',
                                    }}>
                                        <p style={{ fontSize: 12, color: '#fca5a5' }}>⚠️ {med.warning}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}