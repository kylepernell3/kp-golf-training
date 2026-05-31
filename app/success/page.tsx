'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')

  useEffect(() => {
    if (sessionId) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }, [sessionId])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070f0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      color: '#ede8dc',
      textAlign: 'center',
      padding: '2rem',
    }}>
      {status === 'loading' && (
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛳</div>
          <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Confirming your booking...</p>
        </div>
      )}
      {status === 'success' && (
        <div>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏌️</div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #f59e0b, #fcd34d, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>You're Booked!</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem', maxWidth: '480px' }}>
            Your lesson is confirmed. Check your email for details. See you on the range!
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#c5983e',
            color: '#070f0a',
            textDecoration: 'none',
            fontWeight: 600,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            fontSize: '12px',
          }}>Back to Home</Link>
        </div>
      )}
      {status === 'error' && (
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Please contact us to confirm your booking.</p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#c5983e',
            color: '#070f0a',
            textDecoration: 'none',
            fontWeight: 600,
          }}>Go Back</Link>
        </div>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#070f0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ede8dc' }}>
        <div style={{ fontSize: '3rem' }}>⛳</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
