'use client';
import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null); setResult(null); setSaved(false);
    setPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1];
      setScanning(true);
      try {
        const data = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, medications: [] }),
        }).then(r => r.json());
        setResult(data);
      } catch { setError('Scan failed. Try again.'); }
      finally { setScanning(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !result) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'medications'), {
        name: result.name, activeIngredient: result.activeIngredient,
        dosage: result.dosage, sideEffects: result.sideEffects,
        interactions: result.interactions, safeToTake: result.safeToTake,
        warning: result.warning, addedAt: serverTimestamp(),
      });
      setSaved(true);
    } catch { setError('Failed to save. Try again.'); }
    finally { setSaving(false); }
  };

  const s = {
    page: { minHeight: '100vh', background: '#0f1117', padding: '24px 20px 100px' } as any,
    card: { background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 16, padding: 16, marginBottom: 12 } as any,
  };

  return (
    <main style={s.page}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>📷 Scan Medication</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Take a photo of your pill bottle or blister pack</p>

        <label style={{
          display: 'block', border: `2px dashed ${preview ? '#6366f1' : '#2d3148'}`,
          borderRadius: 16, padding: preview ? 12 : 40, textAlign: 'center',
          cursor: 'pointer', marginBottom: 16, background: '#1a1d2e', transition: 'all 0.2s',
        }}>
          {preview ? (
            <img src={preview} style={{ maxHeight: 200, borderRadius: 10, maxWidth: '100%' }} />
          ) : (
            <div>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>Tap to upload photo</div>
              <div style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>JPG, PNG supported</div>
            </div>
          )}
          <input type="file" accept="image/*" capture="environment" onChange={handleImage} style={{ display: 'none' }} />
        </label>

        {scanning && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ color: '#6366f1', fontSize: 15, fontWeight: 500 }}>🔍 Analyzing medication...</div>
            <div style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>This may take a few seconds</div>
          </div>
        )}

        {error && (
          <div style={{ background: '#2d1a1a', border: '1px solid #7f1d1d', borderRadius: 10, padding: 12, marginBottom: 12, color: '#fca5a5', fontSize: 14 }}>
            {error}
          </div>
        )}

        {result && !result.error && (
          <div>
            {/* Safety badge */}
            <div style={{
              ...s.card,
              background: result.safeToTake ? '#0d2818' : '#2d1a1a',
              border: `1px solid ${result.safeToTake ? '#166534' : '#7f1d1d'}`,
            }}>
              <p style={{ fontWeight: 700, fontSize: 16, color: result.safeToTake ? '#4ade80' : '#fca5a5' }}>
                {result.safeToTake ? '✅ Safe to take' : '⚠️ Use with caution'}
              </p>
              {result.warning && <p style={{ color: '#fca5a5', fontSize: 13, marginTop: 6 }}>{result.warning}</p>}
            </div>

            {/* Med info */}
            <div style={s.card}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{result.name}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>Active: </span>{result.activeIngredient}
                </p>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>Dosage: </span>{result.dosage}
                </p>
              </div>
            </div>

            {/* Side effects */}
            {result.sideEffects?.length > 0 && (
              <div style={s.card}>
                <h3 style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 10, fontSize: 15 }}>⚡ Side Effects</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.sideEffects.map((s: string, i: number) => (
                    <span key={i} style={{
                      background: '#0f1117', border: '1px solid #2d3148',
                      borderRadius: 20, padding: '4px 12px', fontSize: 13, color: '#94a3b8',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactions */}
            {result.interactions?.length > 0 && (
              <div style={s.card}>
                <h3 style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 10, fontSize: 15 }}>🔗 Drug Interactions</h3>
                {result.interactions.map((i: any, idx: number) => (
                  <div key={idx} style={{
                    borderTop: idx > 0 ? '1px solid #2d3148' : 'none',
                    paddingTop: idx > 0 ? 10 : 0, marginTop: idx > 0 ? 10 : 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: i.severity === 'severe' ? '#f87171' : i.severity === 'moderate' ? '#fb923c' : '#fbbf24', fontSize: 14 }}>
                        {i.drug}
                      </span>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500,
                        background: i.severity === 'severe' ? '#2d1a1a' : i.severity === 'moderate' ? '#2d1a0a' : '#1a1a0a',
                        color: i.severity === 'severe' ? '#f87171' : i.severity === 'moderate' ? '#fb923c' : '#fbbf24',
                      }}>{i.severity}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#64748b' }}>{i.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Save button */}
            <button onClick={handleSave} disabled={saving || saved} style={{
              width: '100%', padding: 16, borderRadius: 12, border: 'none',
              background: saved ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontSize: 16, fontWeight: 600,
              cursor: saved ? 'default' : 'pointer', marginTop: 4,
            }}>
              {saved ? '✅ Saved to My Medications' : saving ? 'Saving...' : '💊 Save to My Medications'}
            </button>
          </div>
        )}

        {result?.error && (
          <div style={{ background: '#2d1a1a', border: '1px solid #7f1d1d', borderRadius: 10, padding: 12, color: '#fca5a5', fontSize: 14, textAlign: 'center' }}>
            {result.error}
          </div>
        )}
      </div>
    </main>
  );
}