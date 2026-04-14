'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function PharmacyPage() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [locationName, setLocationName] = useState('');
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) router.push('/login');
        });
        return () => unsub();
    }, [router]);

    const findPharmacies = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                setLoading(false);
            },
            () => {
                setLoading(false);
                window.open('https://www.google.com/maps/search/pharmacy', '_blank');
            }
        );
    };

    return (
        <main style={{ minHeight: '100vh', background: '#0f1117', padding: '24px 20px 100px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
                {/* Header */}
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>🏥 Nearby Pharmacies</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Find the closest pharmacy to you</p>

                {/* Find button */}
                <button onClick={findPharmacies} disabled={loading} style={{
                    width: '100%', padding: 16,
                    background: loading ? '#2d3148' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white', border: 'none', borderRadius: 12,
                    fontSize: 16, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                    marginBottom: 16, transition: 'all 0.2s',
                }}>
                    {loading ? '📍 Getting your location...' : '📍 Find Nearby Pharmacies'}
                </button>

                {/* Open in Maps button */}
                {location && (
                    <button onClick={() => window.open(`https://www.google.com/maps/search/pharmacy/@${location.lat},${location.lng},15z`, '_blank')}
                        style={{
                            width: '100%', padding: 14,
                            background: '#1a1d2e', border: '1px solid #2d3148',
                            color: '#6366f1', borderRadius: 12, fontSize: 15,
                            fontWeight: 600, cursor: 'pointer', marginBottom: 16,
                        }}>
                        🗺️ Open in Google Maps
                    </button>
                )}

                {/* Location info */}
                {location && (
                    <div style={{
                        background: '#1a1d2e', border: '1px solid #2d3148',
                        borderRadius: 12, padding: '10px 14px', marginBottom: 16,
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        <span style={{ fontSize: 16 }}>📍</span>
                        <p style={{ color: '#64748b', fontSize: 13 }}>Location: {locationName}</p>
                    </div>
                )}

                {/* Map */}
                {location && (
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #2d3148' }}>
                        <iframe
                            width="100%"
                            height="420"
                            style={{ border: 0, display: 'block' }}
                            loading="lazy"
                            src={`https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=pharmacy&center=${location.lat},${location.lng}&zoom=14`}
                        />
                    </div>
                )}

                {/* Info cards when no location */}
                {!location && !loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                        {[
                            { icon: '🔍', title: 'Smart Search', desc: 'Uses your GPS to find the nearest pharmacies' },
                            { icon: '🗺️', title: 'Interactive Map', desc: 'View pharmacies on a live map' },
                            { icon: '⚡', title: 'Instant Results', desc: 'Get directions in one tap' },
                        ].map(item => (
                            <div key={item.title} style={{
                                background: '#1a1d2e', border: '1px solid #2d3148',
                                borderRadius: 12, padding: 16, display: 'flex', gap: 14, alignItems: 'center',
                            }}>
                                <span style={{ fontSize: 28 }}>{item.icon}</span>
                                <div>
                                    <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>{item.title}</p>
                                    <p style={{ color: '#64748b', fontSize: 13 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}