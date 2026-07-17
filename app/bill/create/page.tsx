'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const STORAGE_KEY      = 'mm_bill_auth'
const SERVICES_MEM_KEY = 'mm_bill_services_mem'
const PARTS_MEM_KEY    = 'mm_bill_parts_mem'
const MISC_MEM_KEY     = 'mm_bill_misc_mem'
const MAX_MEM          = 40

type ServiceRow = { id: string; description: string; qty: string; rate: string }
type PartRow    = { id: string; name: string; qty: string; rate: string }
type MiscRow    = { id: string; description: string; amount: string }

const QUICK_SERVICES = [
  'Exterior Wash','Interior Clean','Full Wash Combo','Engine Oil Change',
  'AC Service','Battery Service','Brake Service','Wheel Alignment',
  'Tyre Balancing','Tyre Rotation','Dent & Scratch Repair','Paint Polish',
  'Ceramic Coating','Headlight Restoration','Engine Service',
  'ECM Diagnostics','Suspension Check','Bumper Repair',
]

const PAYMENT_OPTIONS = [
  'Cash','UPI / GPay','PhonePe','Paytm','Card','NEFT / Bank Transfer','Pending / Due',
]

function generateBillNo() {
  return `MM-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`
}
function todayStr() { return new Date().toISOString().split('T')[0] }
function fmtDate(v: string) {
  if (!v) return ''
  return new Date(v + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
}
function addMonths(dateStr: string, months: number): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-IN', { month:'long', year:'numeric' })
}
function inr(n: number) { return '₹' + Math.round(n).toLocaleString('en-IN') }
function newRow(): ServiceRow { return { id: Date.now().toString(), description:'', qty:'1', rate:'' } }
function newPart(): PartRow   { return { id: Date.now().toString(), name:'', qty:'1', rate:'' } }
function newMisc(): MiscRow   { return { id: Date.now().toString(), description:'', amount:'' } }

export default function BillCreatePage() {
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) { router.replace('/bill'); return }
      const { expiry } = JSON.parse(raw)
      if (Date.now() >= expiry) router.replace('/bill')
    } catch { router.replace('/bill') }
  }, [router])

  // ── bill meta ────────────────────────────────────────────────────────────
  const [billNo,    setBillNo]    = useState(generateBillNo)
  const [date,      setDate]      = useState(todayStr)
  // ── customer / vehicle ───────────────────────────────────────────────────
  const [custName,  setCustName]  = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [vehicle,   setVehicle]   = useState('')
  const [regNo,     setRegNo]     = useState('')
  const [km,        setKm]        = useState('')
  // ── three line-item sections ─────────────────────────────────────────────
  const [services,  setServices]  = useState<ServiceRow[]>([newRow()])
  const [parts,     setParts]     = useState<PartRow[]>([newPart()])
  const [misc,      setMisc]      = useState<MiscRow[]>([newMisc()])
  // ── charges ──────────────────────────────────────────────────────────────
  const [discount,  setDiscount]  = useState('')
  const [gst,       setGst]       = useState(false)
  const [payment,   setPayment]   = useState('Cash')
  // ── staff / reminder ─────────────────────────────────────────────────────
  const [techName,     setTechName]     = useState('')
  const [nextSvcMonths, setNextSvcMonths] = useState('1')
  const [notes,        setNotes]        = useState('')
  const [pdfLoading,  setPdfLoading]  = useState(false)
  // ── learned suggestions (shared across users via /api/bill-mem) ──────────
  const [servicesMem, setServicesMem] = useState<string[]>([])
  const [partsMem,    setPartsMem]    = useState<string[]>([])
  const [miscMem,     setMiscMem]     = useState<string[]>([])

  useEffect(() => {
    // Instant paint from localStorage cache
    try {
      const s = localStorage.getItem(SERVICES_MEM_KEY); if (s) setServicesMem(JSON.parse(s))
      const p = localStorage.getItem(PARTS_MEM_KEY);    if (p) setPartsMem(JSON.parse(p))
      const m = localStorage.getItem(MISC_MEM_KEY);     if (m) setMiscMem(JSON.parse(m))
    } catch {}

    // Fetch authoritative shared memory from server
    fetch('/api/bill-mem').then(r => r.json()).then(data => {
      if (Array.isArray(data.services)) {
        setServicesMem(data.services)
        localStorage.setItem(SERVICES_MEM_KEY, JSON.stringify(data.services))
      }
      if (Array.isArray(data.parts)) {
        setPartsMem(data.parts)
        localStorage.setItem(PARTS_MEM_KEY, JSON.stringify(data.parts))
      }
      if (Array.isArray(data.misc)) {
        setMiscMem(data.misc)
        localStorage.setItem(MISC_MEM_KEY, JSON.stringify(data.misc))
      }
    }).catch(() => {})
  }, [])

  async function syncMem(kind: 'services'|'parts'|'misc', action: 'add'|'remove'|'clear', value?: string) {
    try {
      const res = await fetch('/api/bill-mem', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ action, kind, value }),
      })
      const data = await res.json()
      if (Array.isArray(data.list)) {
        const cacheKey = kind === 'services' ? SERVICES_MEM_KEY : kind === 'parts' ? PARTS_MEM_KEY : MISC_MEM_KEY
        localStorage.setItem(cacheKey, JSON.stringify(data.list))
        if (kind === 'services') setServicesMem(data.list)
        if (kind === 'parts')    setPartsMem(data.list)
        if (kind === 'misc')     setMiscMem(data.list)
      }
    } catch {}
  }

  function rememberService(name: string) {
    const val = name.trim()
    if (!val) return
    if (QUICK_SERVICES.some(x => x.toLowerCase() === val.toLowerCase())) return
    if (servicesMem.some(x => x.toLowerCase() === val.toLowerCase())) return
    syncMem('services', 'add', val)
  }

  function rememberPart(name: string) {
    const val = name.trim()
    if (!val) return
    if (partsMem.some(x => x.toLowerCase() === val.toLowerCase())) return
    syncMem('parts', 'add', val)
  }

  function rememberMisc(desc: string) {
    const val = desc.trim()
    if (!val) return
    if (miscMem.some(x => x.toLowerCase() === val.toLowerCase())) return
    syncMem('misc', 'add', val)
  }

  function removeServiceMem(name: string) { syncMem('services', 'remove', name) }
  function removePartMem(name: string)    { syncMem('parts',    'remove', name) }
  function removeMiscMem(name: string)    { syncMem('misc',     'remove', name) }

  function clearServicesMem() { syncMem('services', 'clear') }
  function clearPartsMem()    { syncMem('parts',    'clear') }
  function clearMiscMem()     { syncMem('misc',     'clear') }

  // ── row helpers ──────────────────────────────────────────────────────────
  const updSvc = (id:string, f:keyof ServiceRow, v:string) =>
    setServices(p => p.map(r => r.id===id ? {...r,[f]:v} : r))
  const updPart = (id:string, f:keyof PartRow, v:string) =>
    setParts(p => p.map(r => r.id===id ? {...r,[f]:v} : r))
  const updMisc = (id:string, f:keyof MiscRow, v:string) =>
    setMisc(p => p.map(r => r.id===id ? {...r,[f]:v} : r))

  function quickAdd(name: string) {
    const empty = services.find(r => !r.description)
    if (empty) updSvc(empty.id,'description',name)
    else setServices(p => [...p, { ...newRow(), description:name }])
  }

  function quickAddPart(name: string) {
    const empty = parts.find(r => !r.name)
    if (empty) updPart(empty.id,'name',name)
    else setParts(p => [...p, { ...newPart(), name }])
  }

  function quickAddMisc(desc: string) {
    const empty = misc.find(r => !r.description)
    if (empty) updMisc(empty.id,'description',desc)
    else setMisc(p => [...p, { ...newMisc(), description:desc }])
  }

  function reset() {
    setBillNo(generateBillNo()); setDate(todayStr())
    setCustName(''); setCustPhone(''); setVehicle(''); setRegNo(''); setKm('')
    setServices([newRow()]); setParts([newPart()]); setMisc([newMisc()])
    setDiscount(''); setGst(false); setPayment('Cash')
    setTechName(''); setNextSvcMonths('1'); setNotes('')
  }

  // ── totals ───────────────────────────────────────────────────────────────
  const svcTotal  = services.reduce((s,r) => s + (parseFloat(r.qty)||0)*(parseFloat(r.rate)||0), 0)
  const partTotal = parts.reduce((s,r) => s + (parseFloat(r.qty)||0)*(parseFloat(r.rate)||0), 0)
  const miscTotal = misc.reduce((s,r) => s + (parseFloat(r.amount)||0), 0)
  const subtotal  = svcTotal + partTotal + miscTotal
  const discAmt   = parseFloat(discount)||0
  const afterDisc = subtotal - discAmt
  const gstAmt    = gst ? Math.round(afterDisc * 0.18) : 0
  const total     = afterDisc + gstAmt

  const filledSvc  = services.filter(r => r.description || r.rate)
  const filledPart = parts.filter(r => r.name || r.rate)
  const filledMisc = misc.filter(r => r.description || r.amount)

  const isPaid = !payment.startsWith('Pending')
  const nextSvcDisplay = addMonths(date, parseInt(nextSvcMonths))

  // ── Shared: capture invoice as PDF blob ──────────────────────────────────
  async function capturePDF() {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ])
    const el = document.getElementById('invoice-print-target')
    if (!el) throw new Error('Invoice element not found')

    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: el.scrollWidth,
      height: el.scrollHeight,
    })

    const A4_W = 210
    const imgH = (canvas.height * A4_W) / canvas.width
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:[A4_W, Math.max(imgH, 50)] })
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, A4_W, imgH)
    return { pdf, fileName: `MM-CarCare-${billNo}.pdf` }
  }

  // ── Download PDF ──────────────────────────────────────────────────────────
  async function generatePDF() {
    setPdfLoading(true)
    try {
      const { pdf, fileName } = await capturePDF()
      // Use blob + anchor for reliable download across all browsers
      const blob = pdf.output('blob')
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Could not generate PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  // ── WhatsApp: share PDF file (mobile) or download + text (desktop) ────────
  async function handleWhatsApp() {
    setPdfLoading(true)
    try {
      const { pdf, fileName } = await capturePDF()
      const blob = pdf.output('blob')
      const file = new File([blob], fileName, { type:'application/pdf' })

      // Mobile / macOS Safari: native share sheet → pick WhatsApp → sends PDF file
      if (navigator.canShare?.({ files:[file] })) {
        await navigator.share({ files:[file], title:`MM Car Care — Bill ${billNo}` })
        return
      }

      // Desktop fallback: download PDF then open WhatsApp with text summary
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl; a.download = fileName
      document.body.appendChild(a); a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)

      // Short delay so download starts, then open WhatsApp
      await new Promise(r => setTimeout(r, 800))
      const lines = [
        `*MM Car Care — Bill*`,
        `Date: ${fmtDate(date)}`,
        custName  ? `Customer: *${custName}*` : '',
        custPhone ? `Phone: ${custPhone}` : '',
        vehicle   ? `Vehicle: ${vehicle}` : '',
        regNo     ? `Reg No: ${regNo}` : '',
        '',
        filledSvc.length  ? `*Services:*\n${filledSvc.map(r=>`• ${r.description} — ${inr((parseFloat(r.qty)||1)*(parseFloat(r.rate)||0))}`).join('\n')}` : '',
        filledPart.length ? `*Parts:*\n${filledPart.map(r=>`• ${r.name} ×${r.qty} — ${inr((parseFloat(r.qty)||1)*(parseFloat(r.rate)||0))}`).join('\n')}` : '',
        filledMisc.length ? `*Other charges:*\n${filledMisc.map(r=>`• ${r.description} — ${inr(parseFloat(r.amount)||0)}`).join('\n')}` : '',
        '',
        discAmt > 0 ? `Discount: −${inr(discAmt)}` : '',
        gst ? `GST (18%): ${inr(gstAmt)}` : '',
        `*Total: ${inr(total)}*`,
        `Payment: ${payment}`,
        techName       ? `Technician: ${techName}` : '',
        nextSvcDisplay ? `Next Service Due: ${nextSvcDisplay}` : '',
        notes          ? `\nNote: ${notes}` : '',
        '',
        '_PDF has been saved to your device. Please attach it to this chat._',
        '',
        'Thank you for choosing MM Car Care — Kakinada | 9848377309',
      ].filter(Boolean)

      const phone = custPhone.replace(/\D/g,'')
      const waUrl = phone
        ? `https://wa.me/91${phone}?text=${encodeURIComponent(lines.join('\n'))}`
        : `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`
      window.open(waUrl,'_blank')
    } catch (e) {
      // user cancelled share — no action needed
    } finally {
      setPdfLoading(false)
    }
  }

  // ── shared styles ─────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width:'100%', boxSizing:'border-box',
    background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(201,169,110,0.18)',
    borderRadius:'2px', padding:'9px 11px',
    fontFamily:'var(--font-dm-sans,sans-serif)', fontSize:'13px',
    color:'#fff', outline:'none',
  }
  const lbl: React.CSSProperties = {
    display:'block', marginBottom:'5px',
    fontFamily:'var(--font-space-mono,monospace)',
    fontSize:'9px', letterSpacing:'1.5px',
    textTransform:'uppercase', color:'rgba(201,169,110,0.65)',
  }
  const secHdr: React.CSSProperties = {
    fontFamily:'var(--font-big-shoulders,sans-serif)',
    fontSize:'11px', fontWeight:700, letterSpacing:'2.5px',
    textTransform:'uppercase', color:'#C9A96E', marginBottom:'12px',
  }
  const secWrap: React.CSSProperties = {
    borderBottom:'1px solid rgba(201,169,110,0.07)',
    paddingBottom:'18px', marginBottom:'18px',
  }

  // ── invoice section header (for the white preview) ────────────────────────
  function InvSectionHead({ label }: { label: string }) {
    return (
      <div style={{ margin:'18px 0 8px', display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ flex:1, height:'1px', background:'#e8e8e8' }} />
        <div style={{ fontSize:'8px', letterSpacing:'2.5px', textTransform:'uppercase', color:'#C9A96E', fontWeight:700, whiteSpace:'nowrap' }}>{label}</div>
        <div style={{ flex:1, height:'1px', background:'#e8e8e8' }} />
      </div>
    )
  }

  // ── memory chip with individual remove button ─────────────────────────────
  function MemChip({ label, onAdd, onRemove }: { label: string; onAdd: () => void; onRemove: () => void }) {
    return (
      <span style={{
        display:'inline-flex', alignItems:'stretch',
        background:'rgba(201,169,110,0.07)',
        border:'1px solid rgba(201,169,110,0.18)',
        borderRadius:'2px', overflow:'hidden',
      }}>
        <button onClick={onAdd} style={{
          background:'none', border:'none',
          padding:'3px 4px 3px 9px',
          fontFamily:'var(--font-dm-sans,sans-serif)', fontSize:'11px',
          color:'rgba(201,169,110,0.7)', cursor:'pointer',
        }}>{label}</button>
        <button onClick={onRemove} title="Remove from memory" style={{
          background:'none', border:'none', borderLeft:'1px solid rgba(201,169,110,0.13)',
          padding:'0 7px', fontSize:'13px', lineHeight:1,
          color:'rgba(255,255,255,0.22)', cursor:'pointer',
        }}>×</button>
      </span>
    )
  }

  return (
    <>
      <style>{`
        @media print { body { display:none; } }
        .bill-form::-webkit-scrollbar { width:4px; }
        .bill-form::-webkit-scrollbar-track { background:transparent; }
        .bill-form::-webkit-scrollbar-thumb { background:rgba(201,169,110,0.2); border-radius:2px; }
        .bill-prev::-webkit-scrollbar { width:4px; }
        .bill-prev::-webkit-scrollbar-thumb { background:rgba(201,169,110,0.15); border-radius:2px; }
        input[type=date]::-webkit-calendar-picker-indicator { filter:invert(0.5) sepia(1) saturate(2); cursor:pointer; }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.18) !important; }
        select option { background:#1a1a1a; color:#fff; }
        @media (max-width:860px) {
          .bill-cols { flex-direction:column !important; }
          .bill-form  { width:100% !important; border-right:none !important; border-bottom:1px solid rgba(201,169,110,0.1) !important; max-height:none !important; position:static !important; overflow:visible !important; }
          .bill-prev  { width:100% !important; max-height:none !important; padding:16px !important; }
        }
        @media (max-width:560px) {
          .top-bar { padding:9px 12px !important; gap:8px !important; }
          .top-bar-brand { gap:8px !important; }
          .top-bar-brand .brand-name { font-size:14px !important; }
          .top-bar-brand .brand-sub { font-size:7px !important; padding-left:8px !important; }
          .top-bar-btns { width:100%; display:flex; gap:6px !important; }
          .top-bar-btns button { flex:1 1 auto !important; min-width:0 !important; padding:9px 6px !important; font-size:10px !important; letter-spacing:0.8px !important; }
          .top-bar-btns .btn-new-bill { flex:0 0 auto !important; padding:9px 10px !important; }
          .inv-header { padding:14px 16px 12px !important; }
          .inv-brand { font-size:16px !important; letter-spacing:0.5px !important; }
          .inv-brand-sub { font-size:8px !important; margin-top:3px !important; }
          .inv-brand-addr { font-size:8px !important; margin-top:6px !important; line-height:1.6 !important; }
          .inv-bill-label { font-size:13px !important; letter-spacing:1px !important; }
          .inv-bill-date { font-size:10px !important; margin-top:6px !important; }
        }
      `}</style>

      <div style={{ background:'#0a0a0a', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <div className="top-bar" style={{
          borderBottom:'1px solid rgba(201,169,110,0.12)',
          padding:'11px 16px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'#0a0a0a', position:'sticky', top:0, zIndex:200,
          gap:'8px', flexWrap:'wrap',
        }}>
          <div className="top-bar-brand" style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span className="brand-name" style={{ fontFamily:'var(--font-big-shoulders,sans-serif)', fontSize:'16px', fontWeight:700, color:'#C9A96E', textTransform:'uppercase', letterSpacing:'1px' }}>
              MM Car Care
            </span>
            <span className="brand-sub" style={{ fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', paddingLeft:'12px', borderLeft:'1px solid rgba(255,255,255,0.07)' }}>
              Bill Generator
            </span>
          </div>
          <div className="top-bar-btns" style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
            <button className="btn-new-bill" onClick={reset} style={{
              background:'transparent', border:'1px solid rgba(201,169,110,0.18)', borderRadius:'2px',
              padding:'7px 13px', fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px',
              letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', cursor:'pointer',
            }}>New Bill</button>
            <button onClick={handleWhatsApp} style={{
              background:'#25D366', border:'none', borderRadius:'2px', padding:'7px 15px',
              fontFamily:'var(--font-big-shoulders,sans-serif)', fontSize:'12px',
              fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:'#fff', cursor:'pointer',
            }}>WhatsApp</button>
            <button onClick={generatePDF} disabled={pdfLoading} style={{
              background: pdfLoading ? 'rgba(201,169,110,0.4)' : '#C9A96E',
              border:'none', borderRadius:'2px', padding:'7px 17px',
              fontFamily:'var(--font-big-shoulders,sans-serif)', fontSize:'12px',
              fontWeight:700, letterSpacing:'1px', textTransform:'uppercase',
              color:'#0a0a0a', cursor: pdfLoading ? 'wait' : 'pointer', minWidth:'110px',
            }}>
              {pdfLoading ? 'Generating…' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* ── Columns ──────────────────────────────────────────────────────── */}
        <div className="bill-cols" style={{ display:'flex', alignItems:'flex-start' }}>

          {/* ════════════════ LEFT FORM ════════════════ */}
          <div className="bill-form" style={{
            width:'40%', flexShrink:0,
            borderRight:'1px solid rgba(201,169,110,0.1)',
            padding:'20px 18px',
            position:'sticky', top:'52px',   /* stays on screen while right scrolls */
            maxHeight:'calc(100vh - 52px)', overflowY:'auto',
          }}>

            {/* Bill Details */}
            <div style={secWrap}>
              <div style={secHdr}>Bill Details</div>
              <div><label style={lbl}>Date</label><input type="date" style={{...inp,colorScheme:'dark'}} value={date} onChange={e=>setDate(e.target.value)} /></div>
            </div>

            {/* Customer */}
            <div style={secWrap}>
              <div style={secHdr}>Customer</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'9px' }}>
                <div><label style={lbl}>Full Name</label><input style={inp} placeholder="Customer name" value={custName} onChange={e=>setCustName(e.target.value)} /></div>
                <div><label style={lbl}>Phone Number</label><input style={inp} placeholder="98xxxxxxxx" value={custPhone} onChange={e=>setCustPhone(e.target.value)} /></div>
              </div>
            </div>

            {/* Vehicle */}
            <div style={secWrap}>
              <div style={secHdr}>Vehicle</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'9px' }}>
                <div><label style={lbl}>Make & Model</label><input style={inp} placeholder="Maruti Swift VXI 2020" value={vehicle} onChange={e=>setVehicle(e.target.value)} /></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px' }}>
                  <div><label style={lbl}>Reg. Number</label><input style={inp} placeholder="AP 05 AB 1234" value={regNo} onChange={e=>setRegNo(e.target.value)} /></div>
                  <div><label style={lbl}>KM Reading</label><input style={inp} placeholder="45000" value={km} onChange={e=>setKm(e.target.value)} /></div>
                </div>
              </div>
            </div>

            {/* ── SECTION 1: SERVICES ── */}
            <div style={secWrap}>
              <div style={secHdr}>1 — Services</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'11px' }}>
                {QUICK_SERVICES.map(s => (
                  <button key={s} onClick={()=>quickAdd(s)} style={{
                    background:'rgba(201,169,110,0.05)', border:'1px solid rgba(201,169,110,0.13)',
                    borderRadius:'2px', padding:'3px 8px',
                    fontFamily:'var(--font-dm-sans,sans-serif)', fontSize:'11px',
                    color:'rgba(201,169,110,0.6)', cursor:'pointer',
                  }}>{s}</button>
                ))}
              </div>

              {/* Saved services memory chips */}
              {servicesMem.length > 0 && (
                <div style={{ marginBottom:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
                    <span style={{ fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px', letterSpacing:'1px', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>
                      Previously used
                    </span>
                    <button onClick={clearServicesMem} style={{ background:'none', border:'none', fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px', color:'rgba(255,255,255,0.15)', cursor:'pointer', letterSpacing:'1px', textTransform:'uppercase', padding:0 }}>
                      Clear All
                    </button>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                    {servicesMem.map(name => (
                      <MemChip key={name} label={name} onAdd={()=>quickAdd(name)} onRemove={()=>removeServiceMem(name)} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 44px 66px 18px', gap:'5px', marginBottom:'4px' }}>
                <span style={{...lbl,margin:0}}>Service</span>
                <span style={{...lbl,margin:0,textAlign:'center'}}>Qty</span>
                <span style={{...lbl,margin:0,textAlign:'right'}}>Rate ₹</span>
                <span/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                {services.map(r => (
                  <div key={r.id} style={{ display:'grid', gridTemplateColumns:'1fr 44px 66px 18px', gap:'5px', alignItems:'center' }}>
                    <input
                      style={inp}
                      placeholder="Service description"
                      value={r.description}
                      onChange={e=>updSvc(r.id,'description',e.target.value)}
                      onBlur={e=>rememberService(e.target.value)}
                    />
                    <input style={{...inp,textAlign:'center',padding:'9px 2px'}} value={r.qty} onChange={e=>updSvc(r.id,'qty',e.target.value)} />
                    <input style={{...inp,padding:'9px 6px'}} placeholder="0" value={r.rate} onChange={e=>updSvc(r.id,'rate',e.target.value)} />
                    <button onClick={()=>setServices(p=>p.length>1?p.filter(x=>x.id!==r.id):p)} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.15)',cursor:'pointer',fontSize:'17px',padding:0,lineHeight:1 }}>×</button>
                  </div>
                ))}
              </div>
              <button onClick={()=>setServices(p=>[...p,newRow()])} style={{ marginTop:'7px',width:'100%',background:'none',border:'1px dashed rgba(201,169,110,0.18)',borderRadius:'2px',padding:'6px',fontFamily:'var(--font-space-mono,monospace)',fontSize:'8px',letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(201,169,110,0.35)',cursor:'pointer' }}>+ Add Service</button>
            </div>

            {/* ── SECTION 2: PARTS ── */}
            <div style={secWrap}>
              <div style={secHdr}>2 — Parts Used</div>

              {/* Saved parts memory chips */}
              {partsMem.length > 0 && (
                <div style={{ marginBottom:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
                    <span style={{ fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px', letterSpacing:'1px', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>
                      Previously used
                    </span>
                    <button onClick={clearPartsMem} style={{ background:'none', border:'none', fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px', color:'rgba(255,255,255,0.15)', cursor:'pointer', letterSpacing:'1px', textTransform:'uppercase', padding:0 }}>
                      Clear All
                    </button>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                    {partsMem.map(name => (
                      <MemChip key={name} label={name} onAdd={()=>quickAddPart(name)} onRemove={()=>removePartMem(name)} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 44px 66px 18px', gap:'5px', marginBottom:'4px' }}>
                <span style={{...lbl,margin:0}}>Part Name</span>
                <span style={{...lbl,margin:0,textAlign:'center'}}>Qty</span>
                <span style={{...lbl,margin:0,textAlign:'right'}}>Price ₹</span>
                <span/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                {parts.map(r => (
                  <div key={r.id} style={{ display:'grid', gridTemplateColumns:'1fr 44px 66px 18px', gap:'5px', alignItems:'center' }}>
                    <input
                      style={inp}
                      placeholder="e.g. Oil Filter, Brake Pad"
                      value={r.name}
                      onChange={e=>updPart(r.id,'name',e.target.value)}
                      onBlur={e=>rememberPart(e.target.value)}
                    />
                    <input style={{...inp,textAlign:'center',padding:'9px 2px'}} value={r.qty} onChange={e=>updPart(r.id,'qty',e.target.value)} />
                    <input style={{...inp,padding:'9px 6px'}} placeholder="0" value={r.rate} onChange={e=>updPart(r.id,'rate',e.target.value)} />
                    <button onClick={()=>setParts(p=>p.length>1?p.filter(x=>x.id!==r.id):p)} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.15)',cursor:'pointer',fontSize:'17px',padding:0,lineHeight:1 }}>×</button>
                  </div>
                ))}
              </div>
              <button onClick={()=>setParts(p=>[...p,newPart()])} style={{ marginTop:'7px',width:'100%',background:'none',border:'1px dashed rgba(201,169,110,0.18)',borderRadius:'2px',padding:'6px',fontFamily:'var(--font-space-mono,monospace)',fontSize:'8px',letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(201,169,110,0.35)',cursor:'pointer' }}>+ Add Part</button>
            </div>

            {/* ── SECTION 3: MISC ── */}
            <div style={secWrap}>
              <div style={secHdr}>3 — Miscellaneous</div>
              <div style={{ fontFamily:'var(--font-dm-sans,sans-serif)', fontSize:'11px', color:'rgba(255,255,255,0.3)', marginBottom:'10px' }}>
                Labour charges, external vendor fees, towing, other costs
              </div>

              {/* Saved misc memory chips */}
              {miscMem.length > 0 && (
                <div style={{ marginBottom:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
                    <span style={{ fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px', letterSpacing:'1px', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>
                      Previously used
                    </span>
                    <button onClick={clearMiscMem} style={{ background:'none', border:'none', fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px', color:'rgba(255,255,255,0.15)', cursor:'pointer', letterSpacing:'1px', textTransform:'uppercase', padding:0 }}>
                      Clear All
                    </button>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                    {miscMem.map(desc => (
                      <MemChip key={desc} label={desc} onAdd={()=>quickAddMisc(desc)} onRemove={()=>removeMiscMem(desc)} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 18px', gap:'5px', marginBottom:'4px' }}>
                <span style={{...lbl,margin:0}}>Description</span>
                <span style={{...lbl,margin:0,textAlign:'right'}}>Amount ₹</span>
                <span/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                {misc.map(r => (
                  <div key={r.id} style={{ display:'grid', gridTemplateColumns:'1fr 80px 18px', gap:'5px', alignItems:'center' }}>
                    <input
                      style={inp}
                      placeholder="e.g. AC Labour, Towing"
                      value={r.description}
                      onChange={e=>updMisc(r.id,'description',e.target.value)}
                      onBlur={e=>rememberMisc(e.target.value)}
                    />
                    <input style={{...inp,padding:'9px 6px'}} placeholder="0" value={r.amount} onChange={e=>updMisc(r.id,'amount',e.target.value)} />
                    <button onClick={()=>setMisc(p=>p.length>1?p.filter(x=>x.id!==r.id):p)} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.15)',cursor:'pointer',fontSize:'17px',padding:0,lineHeight:1 }}>×</button>
                  </div>
                ))}
              </div>
              <button onClick={()=>setMisc(p=>[...p,newMisc()])} style={{ marginTop:'7px',width:'100%',background:'none',border:'1px dashed rgba(201,169,110,0.18)',borderRadius:'2px',padding:'6px',fontFamily:'var(--font-space-mono,monospace)',fontSize:'8px',letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(201,169,110,0.35)',cursor:'pointer' }}>+ Add Item</button>
            </div>

            {/* Charges */}
            <div style={secWrap}>
              <div style={secHdr}>Charges & Payment</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px', marginBottom:'10px' }}>
                <div><label style={lbl}>Discount ₹</label><input style={inp} placeholder="Amount" value={discount} onChange={e=>setDiscount(e.target.value)} /></div>
                <div>
                  <label style={lbl}>Payment Status</label>
                  <select style={{...inp,cursor:'pointer'}} value={payment} onChange={e=>setPayment(e.target.value)}>
                    {PAYMENT_OPTIONS.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer' }}>
                <input type="checkbox" checked={gst} onChange={e=>setGst(e.target.checked)} style={{ accentColor:'#C9A96E', width:'13px', height:'13px' }} />
                <span style={{ fontFamily:'var(--font-dm-sans,sans-serif)', fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>Add 18% GST</span>
              </label>
            </div>

            {/* Staff & Reminder */}
            <div style={secWrap}>
              <div style={secHdr}>Staff & Reminder</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px' }}>
                <div><label style={lbl}>Technician Name</label><input style={inp} placeholder="e.g. Santosh" value={techName} onChange={e=>setTechName(e.target.value)} /></div>
                <div>
                  <label style={lbl}>Next Service Due</label>
                  <select style={{...inp,cursor:'pointer'}} value={nextSvcMonths} onChange={e=>setNextSvcMonths(e.target.value)}>
                    <option value="1">1 Month — {addMonths(date,1)}</option>
                    <option value="2">2 Months — {addMonths(date,2)}</option>
                    <option value="3">3 Months — {addMonths(date,3)}</option>
                    <option value="6">6 Months — {addMonths(date,6)}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <div style={secHdr}>Notes</div>
              <textarea style={{...inp,minHeight:'64px',resize:'vertical'}} placeholder="Warranty info, parts replaced, special instructions..." value={notes} onChange={e=>setNotes(e.target.value)} />
            </div>
          </div>

          {/* ════════════════ RIGHT PREVIEW ════════════════ */}
          <div className="bill-prev" style={{
            flex:1, padding:'20px 20px',
            display:'flex', flexDirection:'column', alignItems:'center',
          }}>
            <div style={{ fontFamily:'var(--font-space-mono,monospace)', fontSize:'8px', letterSpacing:'2.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.15)', marginBottom:'12px', alignSelf:'flex-start' }}>
              Live Preview — tap Download PDF to save &amp; share
            </div>

            {/* ──────── WHITE INVOICE (captured by html2canvas) ──────── */}
            <div id="invoice-print-target" style={{
              background:'#fff', width:'100%', maxWidth:'600px',
              color:'#1a1a1a', overflow:'hidden',
              fontFamily:'"Helvetica Neue", Arial, sans-serif',
            }}>

              {/* Header — black/gold band, full-bleed (no negative margins needed) */}
              <div className="inv-header" style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                background:'#0a0a0a',
                padding:'28px 40px 26px',
                borderBottom:'3px solid #C9A96E',
              }}>
                <div>
                  <div className="inv-brand" style={{ fontSize:'28px', fontWeight:900, color:'#C9A96E', letterSpacing:'1px', lineHeight:1 }}>
                    MM CAR CARE
                  </div>
                  <div className="inv-brand-sub" style={{ fontSize:'11px', color:'rgba(201,169,110,0.55)', marginTop:'5px', letterSpacing:'0.5px' }}>
                    M.M. Car Care Service Garage
                  </div>
                  <div className="inv-brand-addr" style={{ fontSize:'11px', color:'rgba(255,255,255,0.45)', marginTop:'10px', lineHeight:1.8 }}>
                    Opp. APSP Petrol Bunk, Kakinada – 533 001<br/>Phone: 9848377309
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="inv-bill-label" style={{ fontSize:'24px', fontWeight:800, color:'#C9A96E', letterSpacing:'2px' }}>CUSTOMER BILL</div>
                  <div className="inv-bill-date" style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'10px' }}>
                    {fmtDate(date)||'—'}
                  </div>
                </div>
              </div>

              {/* Body content with padding */}
              <div style={{ padding:'22px 40px 36px' }}>

              {/* Customer + Vehicle */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px', marginBottom:'4px' }}>
                <div>
                  <div style={{ fontSize:'8px', letterSpacing:'2.5px', textTransform:'uppercase', color:'#C9A96E', marginBottom:'7px', fontWeight:700 }}>Bill To</div>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'#111' }}>{custName||'—'}</div>
                  {custPhone && <div style={{ fontSize:'12px', color:'#666', marginTop:'3px' }}>{custPhone}</div>}
                </div>
                <div>
                  <div style={{ fontSize:'8px', letterSpacing:'2.5px', textTransform:'uppercase', color:'#C9A96E', marginBottom:'7px', fontWeight:700 }}>Vehicle</div>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'#111' }}>{vehicle||'—'}</div>
                  <div style={{ fontSize:'12px', color:'#666', marginTop:'3px', lineHeight:1.75 }}>
                    {regNo && <span>Reg: <b>{regNo}</b><br/></span>}
                    {km    && <span>Odometer: {parseInt(km).toLocaleString('en-IN')} km</span>}
                  </div>
                </div>
              </div>

              {/* ── SERVICES TABLE ── */}
              {filledSvc.length > 0 && <>
                <InvSectionHead label="Services" />
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1.5px solid #e8e8e8' }}>
                      {['Service','Qty','Rate','Amount'].map((h,i)=>(
                        <th key={h} style={{ fontSize:'8px', letterSpacing:'2px', textTransform:'uppercase', color:'#aaa', fontWeight:700, textAlign:i===0?'left':i===1?'center':'right', padding:'0 0 8px', width:i===0?'54%':i===1?'10%':'18%' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filledSvc.map(r=>{
                      const a = (parseFloat(r.qty)||0)*(parseFloat(r.rate)||0)
                      return (
                        <tr key={r.id} style={{ borderBottom:'1px solid #f4f4f4' }}>
                          <td style={{ fontSize:'12px', color:'#222', padding:'8px 0' }}>{r.description||'—'}</td>
                          <td style={{ fontSize:'12px', color:'#666', textAlign:'center', padding:'8px 0' }}>{r.qty}</td>
                          <td style={{ fontSize:'12px', color:'#666', textAlign:'right', padding:'8px 0' }}>{inr(parseFloat(r.rate)||0)}</td>
                          <td style={{ fontSize:'12px', fontWeight:600, color:'#111', textAlign:'right', padding:'8px 0' }}>{inr(a)}</td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td colSpan={3} style={{ fontSize:'10px', color:'#bbb', textAlign:'right', padding:'6px 0 0', letterSpacing:'1px', textTransform:'uppercase' }}>Services Subtotal</td>
                      <td style={{ fontSize:'12px', fontWeight:700, color:'#333', textAlign:'right', padding:'6px 0 0' }}>{inr(svcTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </>}

              {/* ── PARTS TABLE ── */}
              {filledPart.length > 0 && <>
                <InvSectionHead label="Parts Used" />
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1.5px solid #e8e8e8' }}>
                      {['Part Name','Qty','Unit Price','Amount'].map((h,i)=>(
                        <th key={h} style={{ fontSize:'8px', letterSpacing:'2px', textTransform:'uppercase', color:'#aaa', fontWeight:700, textAlign:i===0?'left':i===1?'center':'right', padding:'0 0 8px', width:i===0?'48%':i===1?'10%':'21%' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filledPart.map(r=>{
                      const a = (parseFloat(r.qty)||0)*(parseFloat(r.rate)||0)
                      return (
                        <tr key={r.id} style={{ borderBottom:'1px solid #f4f4f4' }}>
                          <td style={{ fontSize:'12px', color:'#222', padding:'8px 0' }}>{r.name||'—'}</td>
                          <td style={{ fontSize:'12px', color:'#666', textAlign:'center', padding:'8px 0' }}>{r.qty}</td>
                          <td style={{ fontSize:'12px', color:'#666', textAlign:'right', padding:'8px 0' }}>{inr(parseFloat(r.rate)||0)}</td>
                          <td style={{ fontSize:'12px', fontWeight:600, color:'#111', textAlign:'right', padding:'8px 0' }}>{inr(a)}</td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td colSpan={3} style={{ fontSize:'10px', color:'#bbb', textAlign:'right', padding:'6px 0 0', letterSpacing:'1px', textTransform:'uppercase' }}>Parts Subtotal</td>
                      <td style={{ fontSize:'12px', fontWeight:700, color:'#333', textAlign:'right', padding:'6px 0 0' }}>{inr(partTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </>}

              {/* ── MISC TABLE ── */}
              {filledMisc.length > 0 && <>
                <InvSectionHead label="Miscellaneous" />
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1.5px solid #e8e8e8' }}>
                      <th style={{ fontSize:'8px', letterSpacing:'2px', textTransform:'uppercase', color:'#aaa', fontWeight:700, textAlign:'left', padding:'0 0 8px' }}>Description</th>
                      <th style={{ fontSize:'8px', letterSpacing:'2px', textTransform:'uppercase', color:'#aaa', fontWeight:700, textAlign:'right', padding:'0 0 8px', width:'25%' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filledMisc.map(r=>(
                      <tr key={r.id} style={{ borderBottom:'1px solid #f4f4f4' }}>
                        <td style={{ fontSize:'12px', color:'#222', padding:'8px 0' }}>{r.description||'—'}</td>
                        <td style={{ fontSize:'12px', fontWeight:600, color:'#111', textAlign:'right', padding:'8px 0' }}>{inr(parseFloat(r.amount)||0)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ fontSize:'10px', color:'#bbb', textAlign:'right', padding:'6px 0 0', letterSpacing:'1px', textTransform:'uppercase' }}>Misc Subtotal</td>
                      <td style={{ fontSize:'12px', fontWeight:700, color:'#333', textAlign:'right', padding:'6px 0 0' }}>{inr(miscTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </>}

              {/* ── GRAND TOTAL ── */}
              <div style={{ display:'flex', justifyContent:'flex-end', margin:'20px 0 18px' }}>
                <div style={{ width:'220px' }}>
                  {svcTotal > 0 && (
                    <div style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', fontSize:'11px', color:'#aaa' }}>
                      <span>Services</span><span>{inr(svcTotal)}</span>
                    </div>
                  )}
                  {partTotal > 0 && (
                    <div style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', fontSize:'11px', color:'#aaa' }}>
                      <span>Parts</span><span>{inr(partTotal)}</span>
                    </div>
                  )}
                  {miscTotal > 0 && (
                    <div style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', fontSize:'11px', color:'#aaa' }}>
                      <span>Miscellaneous</span><span>{inr(miscTotal)}</span>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0 4px', fontSize:'11px', color:'#888', borderTop:'1px solid #eee', marginTop:'3px' }}>
                    <span>Subtotal</span><span>{inr(subtotal)}</span>
                  </div>
                  {discAmt > 0 && (
                    <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize:'11px', color:'#888' }}>
                      <span>Discount{subtotal > 0 ? ` (${((discAmt/subtotal)*100).toFixed(1)}%)` : ''}</span>
                      <span style={{ color:'#c0392b' }}>−{inr(discAmt)}</span>
                    </div>
                  )}
                  {gst && (
                    <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize:'11px', color:'#888' }}>
                      <span>GST (18%)</span><span>{inr(gstAmt)}</span>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'2px solid #C9A96E', marginTop:'5px' }}>
                    <span style={{ fontSize:'15px', fontWeight:800, color:'#111' }}>Total</span>
                    <span style={{ fontSize:'15px', fontWeight:800, color:'#111' }}>{inr(total)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0' }}>
                    <span style={{ fontSize:'10px', color:'#bbb' }}>Payment</span>
                    <span style={{ fontSize:'11px', fontWeight:700, color: isPaid ? '#27ae60' : '#e67e22' }}>{payment}{isPaid ? ' ✓' : ' ⚠'}</span>
                  </div>
                </div>
              </div>

              {/* Technician + Next Service */}
              {(techName || nextSvcDisplay) && (
                <div style={{ background:'#f9f9f9', border:'1px solid #eee', borderRadius:'3px', padding:'12px 14px', marginBottom:'16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  {techName && (
                    <div>
                      <div style={{ fontSize:'8px', letterSpacing:'2px', textTransform:'uppercase', color:'#C9A96E', fontWeight:700, marginBottom:'4px' }}>Technician</div>
                      <div style={{ fontSize:'12px', color:'#333', fontWeight:600 }}>{techName}</div>
                    </div>
                  )}
                  {nextSvcDisplay && (
                    <div>
                      <div style={{ fontSize:'8px', letterSpacing:'2px', textTransform:'uppercase', color:'#C9A96E', fontWeight:700, marginBottom:'4px' }}>Next Service Due</div>
                      <div style={{ fontSize:'12px', color:'#333', fontWeight:600 }}>{nextSvcDisplay}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {notes && (
                <div style={{ borderTop:'1px solid #eee', paddingTop:'12px', marginBottom:'16px' }}>
                  <div style={{ fontSize:'8px', letterSpacing:'2px', textTransform:'uppercase', color:'#C9A96E', fontWeight:700, marginBottom:'6px' }}>Notes</div>
                  <div style={{ fontSize:'11px', color:'#666', lineHeight:1.75 }}>{notes}</div>
                </div>
              )}

              {/* Footer */}
              <div style={{ borderTop:'1px solid #eee', paddingTop:'16px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'#111', marginBottom:'2px' }}>Thank you for trusting MM Car Care.</div>
                  <div style={{ fontSize:'10px', color:'#aaa' }}>Drive safe — see you at your next service.</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'9px', letterSpacing:'1.5px', color:'#C9A96E', fontWeight:700 }}>MM CAR CARE</div>
                  <div style={{ fontSize:'9px', color:'#ccc', marginTop:'2px' }}>Kakinada — 9848377309</div>
                </div>
              </div>

              </div>{/* end body padding div */}
            </div>{/* end invoice-print-target */}
          </div>
        </div>
      </div>
    </>
  )
}
