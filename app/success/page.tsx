'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
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
            backgroundClip: 'text',
          }}>Booking Confirmed!</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '500px', margin: '0 auto 2rem' }}>
            Thank you for booking with KP Golf Training. Kyle will be in touch within 24 hours to confirm your session time.
          </p>
          <p style={{ fontSize: '0.9rem', opacity: 0.5, marginBottom: '2rem' }}>
            Session ID: {sessionId?.slice(0, 20)}...
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#070f0a',
            fontWeight: 700,
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1rem',
          }}>
            Back to Home
          </Link>
        </div>
      )}
      {status === 'error' && (
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ opacity: 0.7, marginBottom: '2rem' }}>We couldn&apos;t confirm your booking. Please contact Kyle directly.</p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#070f0a',
            fontWeight: 700,
            borderRadius: '0.5rem',
            textDecoration: 'none',
          }}>
            Back to Home
          </Link>
        </div>
      )}
    </div>
  )
}
