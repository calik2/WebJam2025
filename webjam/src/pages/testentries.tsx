import { useState } from 'react'

interface Entry {
  uid: string
  date?: string
  title?: string
  description?: string
}

interface ApiResponse {
  error?: string
  entry?: Entry
  deletedEntry?: Entry
  user?: Entry
  [key: string]: any
}

export default function testentries() {
  const [date, setDate] = useState('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [response, setResponse] = useState<ApiResponse | null>(null)

  const uid = "ff47c2bd-3de5-4daa-a782-655a8e1a09a8"

  async function handleRequest(
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE' | 'GET',
    body: Record<string, any>
  ): Promise<ApiResponse | null> {
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      }
      if (method !== 'GET') {
        options.body = JSON.stringify(body)
      } else if (Object.keys(body || {}).length) {
        // append query params for GET if body has data
        const params = new URLSearchParams(body as Record<string, string>).toString()
        endpoint = `${endpoint}?${params}`
      }

      const res = await fetch(`/api/${endpoint}`, options, )
      const data: ApiResponse = await res.json()
      setResponse(data)
      return data
    } catch (err) {
      console.error('Request error:', err)
      setResponse({ error: 'Network or server error' })
      return null
    }
  }

  async function handleAdd() {
    await handleRequest('add_entry', 'POST', { uid, date, title, description })
  }

  async function handleUpdate() {
    await handleRequest('update_entry', 'PUT', { uid, date, title, description })
  }

  async function handleDelete() {
    await handleRequest('delete_entry', 'DELETE', { uid, date })
  }

  async function handleGetToday() {
    const data = await handleRequest('get_entry', 'GET', { uid, date })
    if (data && data.entry) {
      setTitle(data.entry.title ?? '')
      setDescription(data.entry.description ?? '')
    } else {
      alert('No entry found for today!')
    }
  }

  async function handleGetAll() {
    await handleRequest('get_all_entries', 'GET', { uid })
  }

  return (
    
    <div>
      <h1>Entries Manager</h1>

      <div>
        <label>Date: </label>
        <input
          value = {date}
          onChange={(e) => setDate(e.target.value)}
          placeholder = {new Date().toISOString().split('T')[0]} 
        />
      </div>

      <div>
        <label>Title: </label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label>Description: </label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleAdd}>Add Entry</button>
        <button onClick={handleUpdate}>Update Entry</button>
        <button onClick={handleDelete}>Delete Entry</button>
        <button onClick={handleGetToday}>Get Todays Entry</button>
        <button onClick={handleGetAll}>Get All Entries</button>
      </div>

      <pre>{response && JSON.stringify(response, null, 2)}</pre>
    </div>
  )
}