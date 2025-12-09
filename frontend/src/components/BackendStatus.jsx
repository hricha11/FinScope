import { useEffect, useState } from 'react'

export default function BackendStatus() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then(res => {
        if (!res.ok) {
          throw new Error('HTTP status ' + res.status)
        }
        return res.text()
      })
      .then(text => setMessage(text))
      .catch(err => setError(err.message))
  }, [])

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '1rem' }}>
      <h2>Backend Connection Status</h2>
      <p><strong>Response:</strong> {message || 'No response yet...'}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
    </div>
  )
}
