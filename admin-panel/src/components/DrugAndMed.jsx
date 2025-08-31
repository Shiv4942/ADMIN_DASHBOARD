import React, { useEffect, useMemo, useState } from 'react'
import search from '../assets/search.svg'
import { find } from '../assets/assets'
import { medicine } from '../assets/assets'
import { API_ENDPOINTS } from '../config/api';

const DrugAndMed = () => {
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [meds, setMeds] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', notes: '' })
  
  // Therapy state
  const [therapyQuery, setTherapyQuery] = useState('')
  const [therapyType, setTherapyType] = useState('')
  const [therapyLoading, setTherapyLoading] = useState(false)
  const [therapyError, setTherapyError] = useState('')
  const [therapySessions, setTherapySessions] = useState([])
  const [showTherapyForm, setShowTherapyForm] = useState(false)
  const [editingTherapyId, setEditingTherapyId] = useState(null)
  const [therapyForm, setTherapyForm] = useState({ therapist: '', sessionDate: '', type: 'individual', notes: '', progress: 0 })

  const API_BASE = API_ENDPOINTS.MEDICATIONS;
  const THERAPY_API_BASE = API_ENDPOINTS.THERAPY;
  const authHeaders = () => ({ 'Content-Type': 'application/json' })

  const loadMeds = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (activeOnly) params.append('active', 'true')
      const res = await fetch(`${API_BASE}?${params.toString()}`, { headers: authHeaders() })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setMeds(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Could not load medications')
    } finally {
      setLoading(false)
    }
  }

  const loadTherapySessions = async () => {
    try {
      setTherapyLoading(true)
      setTherapyError('')
      const params = new URLSearchParams()
      if (therapyQuery) params.append('q', therapyQuery)
      if (therapyType) params.append('type', therapyType)
      const res = await fetch(`${THERAPY_API_BASE}?${params.toString()}`, { headers: authHeaders() })
      if (!res.ok) throw new Error('Failed to fetch therapy sessions')
      const data = await res.json()
      setTherapySessions(Array.isArray(data) ? data : [])
    } catch (e) {
      setTherapyError('Could not load therapy sessions')
    } finally {
      setTherapyLoading(false)
    }
  }

  useEffect(() => {
    loadMeds()
    loadTherapySessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredMeds = useMemo(() => {
    let list = meds
    if (letter) list = list.filter(m => (m.name || '').toUpperCase().startsWith(letter))
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(m => (m.name || '').toLowerCase().includes(q) || (m.dosage || '').toLowerCase().includes(q))
    }
    return list
  }, [meds, letter, query])

  const onSubmit = async () => {
    if (!form.name || !form.dosage || !form.frequency || !form.startDate) { alert('Fill required fields'); return }
    try {
      setLoading(true)
      const body = {
        name: form.name,
        dosage: form.dosage,
        frequency: form.frequency,
        startDate: form.startDate,
        endDate: form.endDate || null,
        notes: form.notes
      }
      let res
      if (editingId) {
        res = await fetch(`${API_BASE}/${editingId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) })
      } else {
        res = await fetch(`${API_BASE}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) })
      }
      if (!res.ok) throw new Error('Request failed')
      setForm({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', notes: '' })
      setEditingId(null)
      setShowForm(false)
      await loadMeds()
    } catch (e) {
      setError('Save failed')
    } finally {
      setLoading(false)
    }
  }

  const onSubmitTherapy = async () => {
    if (!therapyForm.therapist || !therapyForm.sessionDate || !therapyForm.type) { 
      alert('Fill required fields: therapist, session date, and type'); 
      return 
    }
    try {
      setTherapyLoading(true)
      const body = {
        therapist: therapyForm.therapist,
        sessionDate: therapyForm.sessionDate,
        type: therapyForm.type,
        notes: therapyForm.notes,
        progress: Number(therapyForm.progress)
      }
      let res
      if (editingTherapyId) {
        res = await fetch(`${THERAPY_API_BASE}/${editingTherapyId}`, { 
          method: 'PUT', 
          headers: authHeaders(), 
          body: JSON.stringify(body) 
        })
      } else {
        res = await fetch(`${THERAPY_API_BASE}`, { 
          method: 'POST', 
          headers: authHeaders(), 
          body: JSON.stringify(body) 
        })
      }
      if (!res.ok) throw new Error('Therapy session request failed')
      setTherapyForm({ therapist: '', sessionDate: '', type: 'individual', notes: '', progress: 0 })
      setEditingTherapyId(null)
      setShowTherapyForm(false)
      await loadTherapySessions()
    } catch (e) {
      setTherapyError('Save failed')
    } finally {
      setTherapyLoading(false)
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this medication?')) return
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: authHeaders() })
      await loadMeds()
    } catch (e) {
      setError('Delete failed')
    }
  }

  const onDeleteTherapy = async (id) => {
    if (!confirm('Delete this therapy session?')) return
    try {
      await fetch(`${THERAPY_API_BASE}/${id}`, { method: 'DELETE', headers: authHeaders() })
      await loadTherapySessions()
    } catch (e) {
      setTherapyError('Delete failed')
    }
  }

  const logAdherence = async (id, status) => {
    try {
      await fetch(`${API_BASE}/${id}/logs`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ status }) })
      await loadMeds()
    } catch (e) {
      setError('Could not log adherence')
    }
  }

  return (
    <>
    {/* search section */}
    <div className='flex flex-col items-center justify-center text-center w-full'>
        <h1 className='text-center text-4xl font-semibold text-blue-900'>Drugs & Medictions </h1>
        <p className='py-4 text-sm md:text-lg'>Your trusted source of information for prescription drugs and medications
        </p>
        <div className="w-full flex flex-col justify-center items-center bg-blue-100/50 px-10 py-10 rounded-lg">
            <div className="w-full bg-white flex justify-between gap-4 ">
                <input value={query} onChange={(e)=>setQuery(e.target.value)} type="text" placeholder='Enter medication name to search' className='outline-none w-full px-10 py-2 transition-all duration-200 hover:ring-1 ring-blue-700' />
                <button onClick={loadMeds} className='px-3'>
                    <img src={search} alt="" className='h-6 bg-transparent '  />
                </button>
            </div>
            <div className="flex justify-between items-center w-full mt-7 max-md:flex-col max-md:items-start max-sm:text-sm">
                <div className="flex gap-2 ">
                     <p className="">Search Medicatons by Letter</p>
                     <select value={letter} onChange={(e)=>setLetter(e.target.value)} className='outline-none'>
                        <option value="">All</option>
                        {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                     </select>
                </div>
               
                <label className='flex items-center gap-2'>
                  <input type="checkbox" checked={activeOnly} onChange={(e)=>setActiveOnly(e.target.checked)} />
                  <span>Active only</span>
                </label>
                <button onClick={loadMeds} className='px-3 py-1 bg-blue-600 text-white rounded'>Apply</button>
            </div>
            {error && <p className='text-red-600 mt-3'>{error}</p>}
            {loading && <p className='text-gray-500 mt-3'>Loading…</p>}
        </div>
    </div>
    {/* ImageList with name */}
    <div className="flex justify-between items-center w-full my-10 max-md:flex-col">
        {
            find.map((item,i)=>(
                <div key={`${item.name}-${i}`} className="flex flex-col items-center p-8 justify-center">
                    <div className="bg-blue-100/50 rounded-full h-24 w-24 flex items-center justify-center ">
                        <img src={item.image} alt="" className='w-14 ' />
                    </div>
                    <h1 className='py-4 font-semibold'>{item.name}</h1>
                </div>
            ))
        }
    </div>
    {/* Top medicine */}
    <div className="flex flex-col items-center justify-center w-full my-10">
        <h1 className="text-3xl font-semibold text-blue-900 my-6">Top Searched Medications</h1>
        <div className="grid grid-cols-6 gap-6 w-full max-md:grid-cols-3">
        {
            medicine.map((m, idx)=>(
            <div key={`${m}-${idx}`} className="font-medium">
                {m}
            </div>
            ))
       }
        </div>
      
    </div>
    {/* Medications CRUD */}
    <div className='w-full my-10'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold text-blue-900'>My Medications</h2>
        <button className='btn-primary' onClick={()=>{ setShowForm(true); setEditingId(null); setForm({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', notes: '' }) }}>Add Medication</button>
      </div>
      {showForm && (
        <div className='card p-4 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <input className='input-field' placeholder='Name' value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
            <input className='input-field' placeholder='Dosage' value={form.dosage} onChange={(e)=>setForm({ ...form, dosage: e.target.value })} />
            <input className='input-field' placeholder='Frequency' value={form.frequency} onChange={(e)=>setForm({ ...form, frequency: e.target.value })} />
            <input className='input-field' type='date' placeholder='Start Date' value={form.startDate} onChange={(e)=>setForm({ ...form, startDate: e.target.value })} />
            <input className='input-field' type='date' placeholder='End Date' value={form.endDate} onChange={(e)=>setForm({ ...form, endDate: e.target.value })} />
            <input className='input-field' placeholder='Notes' value={form.notes} onChange={(e)=>setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className='flex gap-2 mt-3'>
            <button className='btn-primary' onClick={onSubmit}>{editingId ? 'Update' : 'Save'}</button>
            <button className='btn-secondary' onClick={()=>{ setShowForm(false); setEditingId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      <div className='overflow-x-auto'>
        <table className='min-w-full text-left border border-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='p-2'>Name</th>
              <th className='p-2'>Dosage</th>
              <th className='p-2'>Frequency</th>
              <th className='p-2'>Start</th>
              <th className='p-2'>End</th>
              <th className='p-2'>Notes</th>
              <th className='p-2'>Adherence</th>
              <th className='p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeds.map((m, idx) => (
              <tr key={m._id || `${m.name}-${m.dosage || ''}-${m.frequency || ''}-${idx}`} className='border-t'>
                <td className='p-2'>{m.name}</td>
                <td className='p-2'>{m.dosage}</td>
                <td className='p-2'>{m.frequency}</td>
                <td className='p-2'>{m.startDate ? String(m.startDate).slice(0,10) : '-'}</td>
                <td className='p-2'>{m.endDate ? String(m.endDate).slice(0,10) : '-'}</td>
                <td className='p-2'>{m.notes || '-'}</td>
                <td className='p-2'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex gap-2'>
                      <button 
                        className={`px-2 py-1 rounded text-sm ${m.logs?.[0]?.status === 'taken' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`} 
                        onClick={()=>logAdherence(m._id, 'taken')}
                      >
                        Taken
                      </button>
                      <button 
                        className={`px-2 py-1 rounded text-sm ${m.logs?.[0]?.status === 'missed' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`} 
                        onClick={()=>logAdherence(m._id, 'missed')}
                      >
                        Missed
                      </button>
                    </div>
                    {m.logs?.[0]?.date && (
                      <span className='text-xs text-gray-500'>
                        Last: {new Date(m.logs[0].date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </td>
                <td className='p-2'>
                  <div className='flex gap-2'>
                    <button className='btn-secondary' onClick={()=>{ setEditingId(m._id); setShowForm(true); setForm({ name: m.name || '', dosage: m.dosage || '', frequency: m.frequency || '', startDate: (m.startDate || '').slice(0,10), endDate: (m.endDate || '').slice(0,10), notes: m.notes || '' }) }}>Edit</button>
                    <button className='px-3 py-1 bg-red-600 text-white rounded' onClick={()=>onDelete(m._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredMeds.length === 0 && (
              <tr>
                <td className='p-3 text-gray-500' colSpan={8}>No medications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Therapy Sessions CRUD */}
    <div className='w-full my-10'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold text-blue-900'>Therapy Sessions</h2>
        <button className='btn-primary' onClick={()=>{ 
          setShowTherapyForm(true); 
          setEditingTherapyId(null); 
          setTherapyForm({ therapist: '', sessionDate: '', type: 'individual', notes: '', progress: 0 }) 
        }}>Add Session</button>
      </div>

      {/* Therapy Search & Filter */}
      <div className='card p-4 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mb-3'>
          <input 
            className='input-field' 
            placeholder='Search by therapist name' 
            value={therapyQuery} 
            onChange={(e)=>setTherapyQuery(e.target.value)} 
          />
          <select 
            className='input-field' 
            value={therapyType} 
            onChange={(e)=>setTherapyType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="online">Online</option>
            <option value="couples">Couples</option>
          </select>
          <button 
            className='btn-primary' 
            onClick={loadTherapySessions}
          >
            Search
          </button>
          <button 
            className='btn-secondary' 
            onClick={()=>{ 
              setTherapyQuery(''); 
              setTherapyType(''); 
              loadTherapySessions(); 
            }}
          >
            Clear
          </button>
        </div>
        {therapyError && <p className='text-red-600 mt-2'>{therapyError}</p>}
        {therapyLoading && <p className='text-gray-500 mt-2'>Loading therapy sessions…</p>}
      </div>

      {showTherapyForm && (
        <div className='card p-4 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <input 
              className='input-field' 
              placeholder='Therapist Name' 
              value={therapyForm.therapist} 
              onChange={(e)=>setTherapyForm({ ...therapyForm, therapist: e.target.value })} 
            />
            <input 
              className='input-field' 
              type='date' 
              placeholder='Session Date' 
              value={therapyForm.sessionDate} 
              onChange={(e)=>setTherapyForm({ ...therapyForm, sessionDate: e.target.value })} 
            />
            <select 
              className='input-field' 
              value={therapyForm.type} 
              onChange={(e)=>setTherapyForm({ ...therapyForm, type: e.target.value })}
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="online">Online</option>
              <option value="couples">Couples</option>
            </select>
            <input 
              className='input-field' 
              type='number' 
              min='0' 
              max='100' 
              placeholder='Progress (0-100)' 
              value={therapyForm.progress} 
              onChange={(e)=>setTherapyForm({ ...therapyForm, progress: e.target.value })} 
            />
            <input 
              className='input-field md:col-span-2' 
              placeholder='Session Notes' 
              value={therapyForm.notes} 
              onChange={(e)=>setTherapyForm({ ...therapyForm, notes: e.target.value })} 
            />
          </div>
          <div className='flex gap-2 mt-3'>
            <button className='btn-primary' onClick={onSubmitTherapy}>
              {editingTherapyId ? 'Update' : 'Save'}
            </button>
            <button className='btn-secondary' onClick={()=>{ 
              setShowTherapyForm(false); 
              setEditingTherapyId(null) 
            }}>Cancel</button>
          </div>
        </div>
      )}

      <div className='overflow-x-auto'>
        <table className='min-w-full text-left border border-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='p-2'>Therapist</th>
              <th className='p-2'>Date</th>
              <th className='p-2'>Type</th>
              <th className='p-2'>Progress</th>
              <th className='p-2'>Notes</th>
              <th className='p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {therapySessions.map((session, idx) => (
              <tr key={session._id || `therapy-${session.therapist}-${session.sessionDate}-${idx}`} className='border-t'>
                <td className='p-2'>{session.therapist}</td>
                <td className='p-2'>{session.sessionDate ? String(session.sessionDate).slice(0,10) : '-'}</td>
                <td className='p-2'>
                  <span className={`px-2 py-1 rounded text-xs ${
                    session.type === 'individual' ? 'bg-blue-100 text-blue-700' :
                    session.type === 'group' ? 'bg-green-100 text-green-700' :
                    session.type === 'online' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {session.type}
                  </span>
                </td>
                <td className='p-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-16 bg-gray-200 rounded-full h-2'>
                      <div 
                        className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${Math.min(session.progress || 0, 100)}%` }}
                      ></div>
                    </div>
                    <span className='text-sm text-gray-600'>{session.progress || 0}%</span>
                  </div>
                </td>
                <td className='p-2 max-w-xs truncate' title={session.notes || ''}>
                  {session.notes || '-'}
                </td>
                <td className='p-2'>
                  <div className='flex gap-2'>
                    <button 
                      className='btn-secondary' 
                      onClick={()=>{ 
                        setEditingTherapyId(session._id); 
                        setShowTherapyForm(true); 
                        setTherapyForm({ 
                          therapist: session.therapist || '', 
                          sessionDate: (session.sessionDate || '').slice(0,10), 
                          type: session.type || 'individual', 
                          notes: session.notes || '', 
                          progress: session.progress || 0 
                        }) 
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className='px-3 py-1 bg-red-600 text-white rounded' 
                      onClick={()=>onDeleteTherapy(session._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {therapySessions.length === 0 && (
              <tr>
                <td className='p-3 text-gray-500' colSpan={6}>No therapy sessions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default DrugAndMed