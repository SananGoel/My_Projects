'use client';
import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency?: string;
    activeIngredient?: string;
    safeToTake?: boolean;
}

export default function MedicationsPage() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('daily');
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
            setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Medication)));
        });
        return () => unsub();
    }, [uid]);

    const addMedication = async () => {
        if (!name || !dosage || !uid) return;
        await addDoc(collection(db, 'users', uid, 'medications'), {
            name, dosage, frequency, addedAt: Date.now()
        });
        setName(''); setDosage(''); setShowForm(false);
    };

    const removeMedication = async (id: string) => {
        if (!uid) return;
        await deleteDoc(doc(db, 'users', uid, 'medications', id));
    };

    const inputStyle: any = {
        width: '100%', padding: '12px 14px', marginBottom: 10,
        borderRadius: 10, border: '1px solid #2d3148',
        background: '#0f1117', color: '#f1f5f9', fontSize: 14,
        outline: 'none', boxSizing: 'border-box',
    };

    return (
        <main style={{ minHeight: '100vh', background: '#0f1117', padding: '24px 20px 100px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>💊 My Medications</h1>
                        <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{medications.length} medication{medications.length !== 1 ? 's' : ''} tracked</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} style={{
                        padding: '10px 18px', background: showForm ? '#2d3148' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white', border: 'none', borderRadius: 10,
                        cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    }}>
                        {showForm ? 'Cancel' : '+ Add'}
                    </button>
                </div>

                {/* Add form */}
                {showForm && (
                    <div style={{ background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                        <h3 style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 14, fontSize: 15 }}>Add Medication</h3>
                        <input placeholder="Medication name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                        <input placeholder="Dosage (e.g. 500mg)" value={dosage} onChange={e => setDosage(e.target.value)} style={inputStyle} />
                        <select value={frequency} onChange={e => setFrequency(e.target.value)} style={{ ...inputStyle, marginBottom: 14 }}>
                            <option value="daily">Once daily</option>
                            <option value="twice-daily">Twice daily</option>
                            <option value="as-needed">As needed</option>
                        </select>
                        <button onClick={addMedication} style={{
                            width: '100%', padding: 13,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white', border: 'none', borderRadius: 10,
                            cursor: 'pointer', fontWeight: 600, fontSize: 15,
                        }}>Save Medication</button>
                    </div>
                )}

                {/* Empty state */}
                {medications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>💊</div>
                        <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No medications yet</p>
                        <p style={{ color: '#64748b', fontSize: 14 }}>Scan a medication or add one manually</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {medications.map(med => (
                            <div key={med.id} style={{
                                background: '#1a1d2e', border: '1px solid #2d3148',
                                borderRadius: 14, padding: 16,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <p style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 15 }}>{med.name}</p>
                                        {med.safeToTake !== undefined && (
                                            <span style={{ fontSize: 14 }}>{med.safeToTake ? '✅' : '⚠️'}</span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: 13, color: '#64748b' }}>
                                        {med.dosage}{med.frequency ? ` · ${med.frequency}` : ''}
                                    </p>
                                    {med.activeIngredient && (
                                        <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{med.activeIngredient}</p>
                                    )}
                                </div>
                                <button onClick={() => removeMedication(med.id)} style={{
                                    background: '#2d1a1a', border: '1px solid #7f1d1d',
                                    color: '#f87171', cursor: 'pointer', fontSize: 18,
                                    width: 32, height: 32, borderRadius: 8,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}