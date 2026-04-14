'use client';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const provider = new GoogleAuthProvider();

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getRedirectResult(auth).then((result) => {
            if (result?.user) router.push('/dashboard');
        }).catch(() => { });
    }, [router]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch {
            setError('Invalid email or password');
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signInWithRedirect(auth, provider);
        } catch {
            setError('Google sign-in failed. Try again.');
        }
    };

    return (
        <main style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#0f1117', padding: 24,
        }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img src="/icon.svg" style={{ width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px' }} />
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>MediGuard</h1>
                    <p style={{ color: '#64748b', fontSize: 15 }}>Your personal medication safety assistant</p>
                </div>

                <div style={{ background: '#1a1d2e', borderRadius: 20, padding: 32, border: '1px solid #2d3148' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: '#f1f5f9' }}>Sign in</h2>

                    <button onClick={handleGoogle} style={{
                        width: '100%', padding: '12px 16px', marginBottom: 16,
                        background: '#fff', color: '#1a1a1a', border: 'none',
                        borderRadius: 10, fontSize: 15, fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 10,
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1, height: 1, background: '#2d3148' }} />
                        <span style={{ color: '#475569', fontSize: 13 }}>or</span>
                        <div style={{ flex: 1, height: 1, background: '#2d3148' }} />
                    </div>

                    <input type="email" placeholder="Email address" value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={{
                            width: '100%', padding: '12px 16px', marginBottom: 12,
                            borderRadius: 10, border: '1px solid #2d3148',
                            background: '#0f1117', color: '#f1f5f9', fontSize: 15,
                            outline: 'none', boxSizing: 'border-box',
                        }} />
                    <input type="password" placeholder="Password" value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={{
                            width: '100%', padding: '12px 16px', marginBottom: 16,
                            borderRadius: 10, border: '1px solid #2d3148',
                            background: '#0f1117', color: '#f1f5f9', fontSize: 15,
                            outline: 'none', boxSizing: 'border-box',
                        }} />

                    {error && (
                        <div style={{
                            background: '#2d1a1a', border: '1px solid #7f1d1d',
                            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                            color: '#fca5a5', fontSize: 14,
                        }}>{error}</div>
                    )}

                    <button onClick={handleLogin} disabled={loading} style={{
                        width: '100%', padding: 14,
                        background: loading ? '#4338ca' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white', border: 'none', borderRadius: 10,
                        fontSize: 16, cursor: loading ? 'default' : 'pointer', fontWeight: 600,
                    }}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
                        No account?{' '}
                        <a href="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>
                            Create one
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}