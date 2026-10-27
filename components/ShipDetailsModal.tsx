'use client'

import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

export type ShipDetailsSchedule = {
  id: string
  date: string
  departure: string
  arrival: string
}

export type ShipDetailsRoom = {
  id: string
  name: string
  oneWayPrice: string
  roundTripPrice: string
  note: string
}

export type ShipDetailsPeriod = {
  label: string
  value: string
}

export type ShipDetailsData = {
  name: string
  image: string
  description: string
  schedules: ShipDetailsSchedule[]
  rooms: ShipDetailsRoom[]
  periods: ShipDetailsPeriod[]
  selectedPeriod: string
}

type ShipDetailsModalProps = {
  ship: ShipDetailsData
  isOpen: boolean
  initialTab?: Tab
  onClose: () => void
  onChoose: () => void
  onPeriodChange: (period: string) => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

const tabs = ['Overview', 'Ship schedule', 'Room & seat pricing'] as const
type Tab = (typeof tabs)[number]
const tabId = (tab: Tab) => `ship-${tab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

function Tabs({ visibleTabs, activeTab, onChange }: { visibleTabs: readonly Tab[]; activeTab: Tab; onChange: (tab: Tab) => void }) {
  const tablistRef = useRef<HTMLDivElement>(null)

  function moveTab(direction: 1 | -1) {
    const currentIndex = visibleTabs.indexOf(activeTab)
    const nextIndex = (currentIndex + direction + visibleTabs.length) % visibleTabs.length
    onChange(visibleTabs[nextIndex])
    tablistRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${visibleTabs[nextIndex]}"]`)?.focus()
  }

  return (
    <div ref={tablistRef} className="ship-details-tabs" role="tablist" aria-label="Ship information">
      {visibleTabs.map((tab) => (
        <button
          key={tab}
          type="button"
          id={`${tabId(tab)}-tab`}
          className={activeTab === tab ? 'active' : ''}
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls={`${tabId(tab)}-panel`}
          tabIndex={activeTab === tab ? 0 : -1}
          data-tab={tab}
          onClick={() => onChange(tab)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
              event.preventDefault()
              moveTab(1)
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
              event.preventDefault()
              moveTab(-1)
            } else if (event.key === 'Home') {
              event.preventDefault()
              onChange(visibleTabs[0])
              tablistRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${visibleTabs[0]}"]`)?.focus()
            } else if (event.key === 'End') {
              event.preventDefault()
              onChange(visibleTabs[visibleTabs.length - 1])
              tablistRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${visibleTabs[visibleTabs.length - 1]}"]`)?.focus()
            }
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function ModalMonthDropdown({ periods, value, onChange }: { periods: ShipDetailsPeriod[]; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const selected = periods.find((period) => period.value === value) ?? periods[0]

  return <div className={`month-dropdown field relative ${open ? 'month-dropdown-open' : ''}`}><span>Travel period</span><button type="button" className={`month-dropdown-trigger ${open ? 'open' : ''}`} onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="listbox"><span>{selected.label}</span><ChevronDown size={17} /></button>{open && <div className="month-dropdown-menu" role="listbox" aria-label="Travel period">{periods.map((period) => <label key={period.value} className="month-dropdown-option"><input type="radio" name="modal-travel-period" value={period.value} checked={value === period.value} onChange={() => { onChange(period.value); setOpen(false) }} /><span className="month-radio" aria-hidden="true" /><span>{period.label}</span></label>)}</div>}</div>
}

export function ShipDetailsModal({ ship, isOpen, initialTab = 'Overview', onClose, onChoose, onPeriodChange, returnFocusRef }: ShipDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [seatPreview, setSeatPreview] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    setActiveTab(initialTab)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeAndRestoreFocus()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, initialTab])

  if (!isOpen) return null

  const visibleTabs = initialTab === 'Ship schedule' ? (['Ship schedule'] as const) : (['Overview', 'Room & seat pricing'] as const)
  function closeAndRestoreFocus() {
    onClose()
    requestAnimationFrame(() => returnFocusRef?.current?.focus())
  }

  const panelId = `${tabId(activeTab)}-panel`
  return (
    <div className="ship-details-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAndRestoreFocus() }}>
      <div ref={dialogRef} className="ship-details-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="ship-details-header">
          <h2 id={titleId}>{ship.name}</h2>
          <button ref={closeButtonRef} type="button" className="ship-details-close" aria-label="Close ship details" onClick={closeAndRestoreFocus}>×</button>
        </div>
        <img className="ship-details-hero" src={ship.image} alt={`${ship.name} sailing on the sea`} />
        <Tabs visibleTabs={visibleTabs} activeTab={activeTab} onChange={setActiveTab} />
        <div id={panelId} role="tabpanel" aria-labelledby={`${tabId(activeTab)}-tab`} className="ship-details-panel" tabIndex={0}>
          {activeTab === 'Overview' && <>
            <h3>About this Ship</h3>
            <p>{ship.description}</p>
            <div className="ship-details-note">Ship information and imagery are illustrative in this prototype.</div>
          </>}
          {activeTab === 'Ship schedule' && <div className="ship-details-schedule-content"><ModalMonthDropdown periods={ship.periods} value={ship.selectedPeriod} onChange={onPeriodChange} /><div className="ship-details-data-table"><div className="ship-details-data-heading"><span>Date</span><span>Departure</span><span>Return</span></div>{ship.schedules.length ? ship.schedules.map((schedule) => <div key={schedule.id}><span>{new Date(`${schedule.date}T12:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span><strong>{schedule.departure}</strong><strong>{schedule.arrival}</strong></div>) : <p className="ship-details-empty">No sailings are available for this period.</p>}</div></div>}
          {activeTab === 'Room & seat pricing' && <div className="ship-details-data-table room-pricing-table"><div className="ship-details-data-heading"><span>Category</span><span>One way</span><span>Round trip</span><span>Images</span></div>{ship.rooms.map((room) => <div key={room.id}><span><strong>{room.name}</strong><small>{room.note}</small></span><strong>{room.oneWayPrice}</strong><strong>{room.roundTripPrice}</strong><button type="button" className="ship-details-view-image" onClick={() => setSeatPreview(room.name)} aria-label={`View ${room.name} seat image`}>View</button></div>)}</div>}
        </div>
        <button type="button" className="ship-details-choose" onClick={() => { onChoose(); closeAndRestoreFocus() }}>Choose this ship <ArrowRight size={25} aria-hidden="true" /></button>
        {seatPreview && <div className="ship-seat-preview-overlay" role="dialog" aria-modal="true" aria-labelledby="ship-seat-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSeatPreview(null) }}><div className="ship-seat-preview"><div className="ship-seat-preview-header"><div><p className="eyebrow">Seat preview</p><h3 id="ship-seat-preview-title">{seatPreview} seating</h3></div><button type="button" className="ship-seat-preview-close" aria-label="Close seat image" onClick={() => setSeatPreview(null)}>×</button></div><img src="/seat-category-preview.png" alt={`${seatPreview} seating preview`} /></div></div>}
      </div>
    </div>
  )
}
