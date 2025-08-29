import React, { useEffect, useMemo, useState } from 'react'
import search from '../assets/search.svg'
import { find } from '../assets/assets'
import { medicine } from '../assets/assets'

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

  const API_BASE = '/api/medications'
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

  useEffect(() => {
    loadMeds()
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

  const onDelete = async (id) => {
    if (!confirm('Delete this medication?')) return
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: authHeaders() })
      await loadMeds()
    } catch (e) {
      setError('Delete failed')
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
                  <div className='flex gap-2'>
                    <button className='px-2 py-1 bg-green-100 text-green-700 rounded text-sm' onClick={()=>logAdherence(m._id, 'taken')}>Taken</button>
                    <button className='px-2 py-1 bg-red-100 text-red-700 rounded text-sm' onClick={()=>logAdherence(m._id, 'missed')}>Missed</button>
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
    </>
  )
}

export default DrugAndMed