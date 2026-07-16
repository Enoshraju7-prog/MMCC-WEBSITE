'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type ServiceRow = {
  id: string
  description: string
  qty: string
  rate: string
}

const STORAGE_KEY = 'mm_bill_auth'

const QUICK_SERVICES = [
  'Exterior Wash', 'Interior Clean', 'Full Wash Combo',
  'Engine Oil Change', 'AC Service', 'Battery Service',
  'Brake Service', 'Wheel Alignment', 'Tyre Balancing',
  'Tyre Rotation', 'Dent & Scratch Repair', 'Paint Polish',
  'Ceramic Coating', 'Headlight Restoration', 'Engine Service',
  'ECM Diagnostics', 'Suspension Check', 'Bumper Repair',
]

function generateBillNo() {
  const year = new Date().getFullYear()
  const num = String(Math.floor(Math.random() * 9000) + 1000)
  return `MM-${year}-${num}`
}

function todayValue() {
  return new Date().toISOString().split('T')[0]
}

function formatDisplayDate(val: string) {
  if (!val) return ''
  const d = new Date(val + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function inr(n: number, decimals = 0) {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function BillCreatePage() {
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) { router.replace('/bill'); return }
      const { expiry } = JSON.parse(raw)
      if (Date.now() >= expiry) { router.replace('/bill') }
    } catch { router.replace('/bill') }
  }, [router])

  const [billNo, setBillNo]           = useState(generateBillNo)
  const [date, setDate]               = useState(todayValue)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [vehicleMake, setVehicleMake] = useState('')
  const [regNo, setRegNo]             = useState('')
  const [kmReading, setKmReading]     = useState('')
  const [services, setServices]       = useState<ServiceRow[]>([
    { id: '1', description: '', qty: '1', rate: '' },
  ])
  const [discount, setDiscount]       = useState('')
  const [includeGst, setIncludeGst]   = useState(false)
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [notes, setNotes]             = useState('')

  function addRow() {
    setServices(p => [...p, { id: Date.now().toString(), description: '', qty: '1', rate: '' }])
  }

  function removeRow(id: string) {
    setServices(p => p.length > 1 ? p.filter(r => r.id !== id) : p)
  }

  function updateRow(id: string, field: keyof ServiceRow, val: string) {
    setServices(p => p.map(r => r.id === id ? { ...r, [field]: val } : r))
  }

  function quickAdd(name: string) {
    const empty = services.find(r => !r.description)
    if (empty) { updateRow(empty.id, 'description', name) }
    else { setServices(p => [...p, { id: Date.now().toString(), description: name, qty: '1', rate: '' }]) }
  }

  function resetBill() {
    setBillNo(generateBillNo())
    setDate(todayValue())
    setCustomerName(''); setCustomerPhone(''); setVehicleMake('')
    setRegNo(''); setKmReading('')
    setServices([{ id: Date.now().toString(), description: '', qty: '1', rate: '' }])
    setDiscount(''); setIncludeGst(false); setPaymentMode('Cash'); setNotes('')
  }

  const subtotal    = services.reduce((s, r) => s + (parseFloat(r.qty) || 0) * (parseFloat(r.rate) || 0), 0)
  const discountAmt = subtotal * (parseFloat(discount) || 0) / 100
  const afterDisc   = subtotal - discountAmt
  const gstAmt      = includeGst ? Math.round(afterDisc * 0.18) : 0
  const total       = afterDisc + gstAmt
  const displayDate = formatDisplayDate(date)
  const filledRows  = services.filter(r => r.description || r.rate)

  function handlePrint() { window.print() }

  function handleWhatsApp() {
    const lines = [
      `*MM Car Care — Bill ${billNo}*`,
      '',
      `Customer: ${customerName}`,
      customerPhone ? `Phone: ${customerPhone}` : '',
      vehicleMake ? `Vehicle: ${vehicleMake}` : '',
      regNo ? `Reg No: ${regNo}` : '',
      '',
      ...filledRows.map(r => `• ${r.description} — ${inr((parseFloat(r.qty)||1)*(parseFloat(r.rate)||0))}`),
      '',
      `*Total: ${inr(total)}*`,
      paymentMode !== 'Pending' ? `Payment: ${paymentMode}` : '⚠️ Payment Pending',
      notes ? `\nNote: ${notes}` : '',
      '',
      'Thank you for choosing MM Car Care.',
      'Opp. APSP Petrol Bunk, Kakinada | 9848377309',
    ].filter(l => l !== null)
    const text = lines.join('\n')
    const phone = customerPhone.replace(/\D/g, '')
    const url = phone
      ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  // ─── shared input style ───────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,169,110,0.18)',
    borderRadius: '2px', padding: '9px 11px',
    fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px',
    color: '#fff', outline: 'none',
  }
  const lbl: React.CSSProperties = {
    display: 'block', marginBottom: '5px',
    fontFamily: 'var(--font-space-mono, monospace)',
    fontSize: '9px', letterSpacing: '1.5px',
    textTransform: 'uppercase', color: 'rgba(201,169,110,0.65)',
  }
  const sec: React.CSSProperties = {
    borderBottom: '1px solid rgba(201,169,110,0.07)',
    paddingBottom: '18px', marginBottom: '18px',
  }
  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-big-shoulders, sans-serif)',
    fontSize: '11px', fontWeight: 700,
    letterSpacing: '2.5px', textTransform: 'uppercase',
    color: '#C9A96E', marginBottom: '12px',
  }

  return (
    <>
      <style>{`
        /* ── print: show only the white invoice ─────────────────────── */
        @media print {
          body > * { display: none !important; }
          #bill-root { display: block !important; }
          #bill-root > * { display: none !important; }
          .invoice-print { display: block !important; position: static !important; }
          @page { margin: 12mm 14mm; size: A4; }
        }

        /* ── responsive ─────────────────────────────────────────────── */
        @media (max-width: 860px) {
          .bill-cols { flex-direction: column !important; }
          .bill-form  { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(201,169,110,0.1) !important; max-height: none !important; }
          .bill-preview { width: 100% !important; }
        }

        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5) sepia(1) saturate(2) hue-rotate(5deg); cursor: pointer; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #1a1a1a; color: #fff; }
      `}</style>

      <div id="bill-root" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Top bar ───────────────────────────────────────────────────── */}
        <div style={{
          borderBottom: '1px solid rgba(201,169,110,0.12)',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 200,
          gap: '10px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: '17px', fontWeight: 700, color: '#C9A96E',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>MM Car Care</span>
            <span style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', paddingLeft: '14px',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}>Bill Generator</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={resetBill} style={{
              background: 'transparent',
              border: '1px solid rgba(201,169,110,0.2)', borderRadius: '2px',
              padding: '7px 14px',
              fontFamily: 'var(--font-space-mono, monospace)', fontSize: '8px',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            }}>New Bill</button>

            <button onClick={handleWhatsApp} style={{
              background: '#25D366', border: 'none', borderRadius: '2px',
              padding: '7px 16px',
              fontFamily: 'var(--font-big-shoulders, sans-serif)', fontSize: '12px',
              fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
              color: '#fff', cursor: 'pointer',
            }}>WhatsApp</button>

            <button onClick={handlePrint} style={{
              background: '#C9A96E', border: 'none', borderRadius: '2px',
              padding: '7px 18px',
              fontFamily: 'var(--font-big-shoulders, sans-serif)', fontSize: '12px',
              fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
              color: '#0a0a0a', cursor: 'pointer',
            }}>Download PDF</button>
          </div>
        </div>

        {/* ── Two-column layout ─────────────────────────────────────────── */}
        <div className="bill-cols" style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* ── LEFT: Form ────────────────────────────────────────────── */}
          <div className="bill-form" style={{
            width: '40%', flexShrink: 0,
            borderRight: '1px solid rgba(201,169,110,0.1)',
            padding: '22px 20px',
            overflowY: 'auto', maxHeight: 'calc(100vh - 56px)',
          }}>

            {/* Bill details */}
            <div style={sec}>
              <div style={secTitle}>Bill Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={lbl}>Bill No.</label>
                  <input style={inp} value={billNo} onChange={e => setBillNo(e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Date</label>
                  <input type="date" style={{ ...inp, colorScheme: 'dark' }} value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Customer */}
            <div style={sec}>
              <div style={secTitle}>Customer</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={lbl}>Full Name</label>
                  <input style={inp} placeholder="Customer name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Phone Number</label>
                  <input style={inp} placeholder="98xxxxxxxx" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div style={sec}>
              <div style={secTitle}>Vehicle</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={lbl}>Make & Model</label>
                  <input style={inp} placeholder="Maruti Swift VXI 2020" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={lbl}>Reg. Number</label>
                    <input style={inp} placeholder="AP 05 AB 1234" value={regNo} onChange={e => setRegNo(e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>KM Reading</label>
                    <input style={inp} placeholder="45000" value={kmReading} onChange={e => setKmReading(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div style={sec}>
              <div style={secTitle}>Services</div>

              {/* Quick-add chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                {QUICK_SERVICES.map(s => (
                  <button key={s} onClick={() => quickAdd(s)} style={{
                    background: 'rgba(201,169,110,0.05)',
                    border: '1px solid rgba(201,169,110,0.14)',
                    borderRadius: '2px', padding: '4px 9px',
                    fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '11px',
                    color: 'rgba(201,169,110,0.65)', cursor: 'pointer',
                  }}>{s}</button>
                ))}
              </div>

              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 46px 70px 20px', gap: '5px', marginBottom: '5px' }}>
                <span style={{ ...lbl, margin: 0 }}>Service</span>
                <span style={{ ...lbl, margin: 0, textAlign: 'center' }}>Qty</span>
                <span style={{ ...lbl, margin: 0, textAlign: 'right' }}>Rate ₹</span>
                <span />
              </div>

              {/* Service rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {services.map(row => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 46px 70px 20px', gap: '5px', alignItems: 'center' }}>
                    <input style={inp} placeholder="Service description" value={row.description} onChange={e => updateRow(row.id, 'description', e.target.value)} />
                    <input style={{ ...inp, textAlign: 'center', padding: '9px 2px' }} value={row.qty} onChange={e => updateRow(row.id, 'qty', e.target.value)} />
                    <input style={{ ...inp, padding: '9px 7px' }} placeholder="0" value={row.rate} onChange={e => updateRow(row.id, 'rate', e.target.value)} />
                    <button onClick={() => removeRow(row.id)} style={{
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.18)', cursor: 'pointer',
                      fontSize: '18px', lineHeight: 1, padding: 0,
                    }}>×</button>
                  </div>
                ))}
              </div>

              <button onClick={addRow} style={{
                marginTop: '8px', width: '100%',
                background: 'none', border: '1px dashed rgba(201,169,110,0.2)', borderRadius: '2px',
                padding: '7px',
                fontFamily: 'var(--font-space-mono, monospace)', fontSize: '8px',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: 'rgba(201,169,110,0.4)', cursor: 'pointer',
              }}>+ Add Row</button>
            </div>

            {/* Totals */}
            <div style={sec}>
              <div style={secTitle}>Charges</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={lbl}>Discount %</label>
                  <input style={inp} placeholder="0" value={discount} onChange={e => setDiscount(e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Payment Mode</label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                    <option>Cash</option>
                    <option>UPI / GPay</option>
                    <option>Card</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeGst} onChange={e => setIncludeGst(e.target.checked)}
                  style={{ accentColor: '#C9A96E', width: '13px', height: '13px' }} />
                <span style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Add 18% GST
                </span>
              </label>
            </div>

            {/* Notes */}
            <div>
              <div style={secTitle}>Notes</div>
              <textarea style={{ ...inp, minHeight: '72px', resize: 'vertical' }}
                placeholder="Next service due date, parts replaced, warranty notes..."
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          {/* ── RIGHT: Invoice Preview ────────────────────────────────── */}
          <div className="bill-preview" style={{
            flex: 1, padding: '22px 24px',
            overflowY: 'auto', maxHeight: 'calc(100vh - 56px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '8px', letterSpacing: '2.5px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)', marginBottom: '14px', alignSelf: 'flex-start',
            }}>Live Preview — prints as PDF</div>

            {/* ── THE PRINTABLE INVOICE ─────────────────────────────── */}
            <div className="invoice-print" style={{
              background: '#fff',
              width: '100%', maxWidth: '580px',
              padding: '40px 44px',
              color: '#1a1a1a',
              boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
            }}>

              {/* Invoice head */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                paddingBottom: '24px', marginBottom: '28px',
                borderBottom: '3px solid #C9A96E',
              }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '0.5px', color: '#111', lineHeight: 1 }}>
                    MM CAR CARE
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '5px', letterSpacing: '0.3px' }}>
                    M.M. Car Care Service Garage
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#555', marginTop: '10px', lineHeight: 1.75 }}>
                    Opp. APSP Petrol Bunk, Kakinada – 533 001<br />
                    Phone: 9848377309
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#C9A96E', letterSpacing: '1px' }}>
                    INVOICE
                  </div>
                  <div style={{ fontSize: '12px', color: '#777', marginTop: '10px', lineHeight: 1.9 }}>
                    <span style={{ color: '#aaa' }}>No: </span>{billNo}<br />
                    <span style={{ color: '#aaa' }}>Date: </span>{displayDate || '—'}
                  </div>
                </div>
              </div>

              {/* Bill to / Vehicle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                <div>
                  <div style={{ fontSize: '8px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '8px', fontWeight: 700 }}>
                    Bill To
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>{customerName || '—'}</div>
                  {customerPhone && <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>{customerPhone}</div>}
                </div>
                <div>
                  <div style={{ fontSize: '8px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '8px', fontWeight: 700 }}>
                    Vehicle Details
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{vehicleMake || '—'}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '3px', lineHeight: 1.75 }}>
                    {regNo && <span>Reg: <strong>{regNo}</strong><br /></span>}
                    {kmReading && <span>Odometer: {parseInt(kmReading).toLocaleString('en-IN')} km</span>}
                  </div>
                </div>
              </div>

              {/* Services table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #e8e8e8' }}>
                    {['Service / Description', 'Qty', 'Rate', 'Amount'].map((h, i) => (
                      <th key={h} style={{
                        fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
                        color: '#aaa', fontWeight: 700,
                        textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right',
                        padding: '0 0 10px', width: i === 0 ? '52%' : i === 1 ? '10%' : '19%',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filledRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ fontSize: '12px', color: '#ccc', padding: '18px 0', textAlign: 'center' }}>
                        No services added yet
                      </td>
                    </tr>
                  ) : filledRows.map(row => {
                    const qty  = parseFloat(row.qty)  || 0
                    const rate = parseFloat(row.rate) || 0
                    const amt  = qty * rate
                    return (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                        <td style={{ fontSize: '13px', color: '#222', padding: '10px 0' }}>{row.description || '—'}</td>
                        <td style={{ fontSize: '13px', color: '#666', textAlign: 'center', padding: '10px 0' }}>{row.qty}</td>
                        <td style={{ fontSize: '13px', color: '#666', textAlign: 'right', padding: '10px 0' }}>{inr(rate)}</td>
                        <td style={{ fontSize: '13px', fontWeight: 600, color: '#111', textAlign: 'right', padding: '10px 0' }}>{inr(amt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Totals block */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                <div style={{ width: '210px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '12px', color: '#777' }}>
                    <span>Subtotal</span><span>{inr(subtotal)}</span>
                  </div>
                  {discountAmt > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '12px', color: '#777' }}>
                      <span>Discount ({discount}%)</span><span style={{ color: '#c0392b' }}>−{inr(discountAmt)}</span>
                    </div>
                  )}
                  {includeGst && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '12px', color: '#777' }}>
                      <span>GST (18%)</span><span>{inr(gstAmt)}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '11px 0', borderTop: '2px solid #C9A96E', marginTop: '5px',
                  }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>Total</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>{inr(total)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>Payment Mode</span>
                    <span style={{ fontSize: '11px', color: '#555', fontWeight: 600 }}>{paymentMode}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '7px', fontWeight: 700 }}>
                    Notes
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.75 }}>{notes}</div>
                </div>
              )}

              {/* Footer */}
              <div style={{
                borderTop: '1px solid #eee', paddingTop: '18px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '3px' }}>
                    Thank you for trusting MM Car Care.
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>
                    Drive safe — see you at your next service.
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#C9A96E', fontWeight: 700 }}>
                    MM CAR CARE
                  </div>
                  <div style={{ fontSize: '9px', color: '#bbb', marginTop: '2px' }}>
                    Kakinada — 9848377309
                  </div>
                </div>
              </div>
            </div>
            {/* end invoice-print */}
          </div>
        </div>
      </div>
    </>
  )
}
