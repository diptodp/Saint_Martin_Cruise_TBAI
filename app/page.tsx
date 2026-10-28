'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { ArrowRight, Armchair, Award, CalendarDays, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Copy, CreditCard, Download, Headset, Heart, Info, MapPin, Minus, Play, Plus, Share2, Ship, ShieldCheck, Star, Ticket, Trash2, UserRound, X } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { ShipDetailsModal, type ShipDetailsData } from '@/components/ShipDetailsModal'

type TripType = 'cox-to-saint-martin' | 'saint-martin-to-cox' | 'round-trip'
type RoomType = { id: string; name: string; oneWayPrice: number; roundTripPrice: number; note: string }
type SeatCategory = { id: string; name: string; type: 'Seat' | 'Lounge' | 'Cabin' | 'Bunk'; roundTrip: number; oneWay: number }
type Passenger = { name: string; nid: string; dob: string; tripType: TripType; roomTypeId: string }
type ContactInformation = { phone: string; whatsapp: string; email: string }
type Schedule = { id: string; date: string; day: string; departure: string; arrival: string; duration: string }
type ShipReview = { title: string; text: string; author: string }
type Ship = { id: string; name: string; subtitle: string; description: string; accent: string; image: string; gallery: string[]; videoUrl?: string; class: string; rating?: number; reviewCount?: number; positivePercent?: number; topReview?: ShipReview; journeyDuration: string; schedules: Schedule[]; rooms: RoomType[]; operator: string; session: string; route: string; departurePoint: string; currency: string; basePrice: number; seatCategories: SeatCategory[] }

const ships: Ship[] = [
  { id: 'ocean-dream', name: 'MV KARNAFULY EXPRESS', subtitle: 'Premium coastal escape', description: 'Explore seating categories, fares and selected sailings aboard a comfortable cruise with verified journey details, passenger capacity and onboard facilities supplied by the operator.', accent: '#0d61ff', image: '/karnafuly-express.jpg', gallery: ['/karnafuly-express.jpg'], class: 'Premium', rating: 8.7, reviewCount: 234, positivePercent: 90, topReview: { title: 'A comfortable journey', text: 'The ship was clean, the crew were helpful, and the journey to Saint Martin was smooth and enjoyable.', author: 'Nusrat M.' }, journeyDuration: 'Approx. 12 hours journey', operator: 'Karnafuly Cruise Line', session: '2026-2027', route: 'Cox\'s Bazar - Saint Martin - Cox\'s Bazar', departurePoint: 'Nuniya Chora Jetty Ghat, Cox\'s Bazar', currency: '৳', basePrice: 1800, seatCategories: [
    { id: 'lavender', name: 'Lavender Seat', type: 'Seat', roundTrip: 4200, oneWay: 2200 },
    { id: 'marigold', name: 'Marigold Seat', type: 'Seat', roundTrip: 4200, oneWay: 2200 },
    { id: 'open-deck', name: 'Open Deck Seat', type: 'Seat', roundTrip: 4400, oneWay: 2300 },
    { id: 'gladiolus', name: 'Gladiolus Business Chair', type: 'Seat', roundTrip: 5000, oneWay: 2600 },
    { id: 'lilac', name: 'Lilac Lounge', type: 'Lounge', roundTrip: 5500, oneWay: 2800 },
    { id: 'chrysanthemum', name: 'Chrysanthemum Lounge', type: 'Lounge', roundTrip: 5800, oneWay: 3000 },
    { id: 'single-cabin', name: 'Single Cabin', type: 'Cabin', roundTrip: 7000, oneWay: 3600 },
    { id: 'twin-cabin', name: 'Twin Cabin', type: 'Cabin', roundTrip: 13000, oneWay: 7000 },
    { id: 'vip-cabin', name: 'VIP Cabin', type: 'Cabin', roundTrip: 16000, oneWay: 9000 },
    { id: 'vvip-cabin', name: 'VVIP Cabin', type: 'Cabin', roundTrip: 19000, oneWay: 10000 },
  ], schedules: [
    { id: 'od-1', date: '2026-11-14', day: 'Saturday', departure: '08:00 AM', arrival: '02:30 PM', duration: '6h 30m' },
    { id: 'od-2', date: '2026-11-21', day: 'Saturday', departure: '08:00 AM', arrival: '02:30 PM', duration: '6h 30m' },
    { id: 'od-3', date: '2026-12-01', day: 'Tuesday', departure: '07:00 AM', arrival: '03:00 PM', duration: '8h' },
    { id: 'od-4', date: '2027-01-09', day: 'Saturday', departure: '08:00 AM', arrival: '02:30 PM', duration: '6h 30m' },
  ], rooms: [{ id: 'lavender', name: 'Lavender Seat', oneWayPrice: 2200, roundTripPrice: 4200, note: 'Seat' }, { id: 'marigold', name: 'Marigold Seat', oneWayPrice: 2200, roundTripPrice: 4200, note: 'Seat' }, { id: 'open-deck', name: 'Open Deck Seat', oneWayPrice: 2300, roundTripPrice: 4400, note: 'Seat' }, { id: 'gladiolus', name: 'Gladiolus Business Chair', oneWayPrice: 2600, roundTripPrice: 5000, note: 'Seat' }, { id: 'lilac', name: 'Lilac Lounge', oneWayPrice: 2800, roundTripPrice: 5500, note: 'Lounge' }, { id: 'chrysanthemum', name: 'Chrysanthemum Lounge', oneWayPrice: 3000, roundTripPrice: 5800, note: 'Lounge' }, { id: 'single-cabin', name: 'Single Cabin', oneWayPrice: 3600, roundTripPrice: 7000, note: 'Cabin' }, { id: 'twin-cabin', name: 'Twin Cabin', oneWayPrice: 7000, roundTripPrice: 13000, note: 'Cabin' }, { id: 'vip-cabin', name: 'VIP Cabin', oneWayPrice: 9000, roundTripPrice: 16000, note: 'Cabin' }, { id: 'vvip-cabin', name: 'VVIP Cabin', oneWayPrice: 10000, roundTripPrice: 19000, note: 'Cabin' }] },
  { id: 'sea-breeze', name: 'MV BARO-AWLIA', subtitle: 'The relaxed way to travel', description: 'Explore seating categories, fares and selected sailings aboard a comfortable cruise with verified journey details and onboard facilities supplied by the operator.', accent: '#7c5cff', image: '/baro-awlia.jpg', gallery: ['/baro-awlia.jpg'], class: 'Premium', rating: 8.7, reviewCount: 234, positivePercent: 90, topReview: { title: 'A relaxed way to travel', text: 'A pleasant ship with friendly support and a memorable route across the water.', author: 'Rafi H.' }, journeyDuration: 'Approx. 10 hours journey', operator: 'Karnafuly Cruise Line', session: '2026-2027', route: 'Cox\'s Bazar - Saint Martin - Cox\'s Bazar', departurePoint: 'Nuniya Chora Jetty Ghat, Cox\'s Bazar', currency: '৳', basePrice: 1800, seatCategories: [
    { id: 'sun-deck', name: 'Sun Deck Seat', type: 'Seat', roundTrip: 4200, oneWay: 2200 },
    { id: 'main-deck', name: 'Main Deck Seat', type: 'Seat', roundTrip: 4200, oneWay: 2200 },
    { id: 'panorama', name: 'Panorama Business Chair', type: 'Seat', roundTrip: 4500, oneWay: 2300 },
    { id: 'riviera', name: 'Riviera Business Chair', type: 'Seat', roundTrip: 4500, oneWay: 2300 },
    { id: 'mozarat', name: 'Mozarat Chair', type: 'Seat', roundTrip: 4800, oneWay: 2500 },
    { id: 'bunker-bed', name: 'Bunker Bed', type: 'Bunk', roundTrip: 10000, oneWay: 6000 },
    { id: 'deluxe-cabin', name: 'Deluxe Cabin', type: 'Cabin', roundTrip: 13000, oneWay: 7000 },
    { id: 'vip-cabin', name: 'VIP Cabin', type: 'Cabin', roundTrip: 15000, oneWay: 8000 },
    { id: 'vvip-cabin', name: 'VVIP Cabin', type: 'Cabin', roundTrip: 18000, oneWay: 10000 },
    { id: 'family-bunker', name: 'Family Bunker Cabin', type: 'Cabin', roundTrip: 20000, oneWay: 11000 },
  ], schedules: [
    { id: 'sb-1', date: '2026-11-28', day: 'Saturday', departure: '07:30 AM', arrival: '02:00 PM', duration: '6h 30m' },
    { id: 'sb-2', date: '2026-12-12', day: 'Saturday', departure: '07:30 AM', arrival: '02:00 PM', duration: '6h 30m' },
    { id: 'sb-3', date: '2027-01-16', day: 'Saturday', departure: '07:30 AM', arrival: '02:00 PM', duration: '6h 30m' },
  ], rooms: [{ id: 'sun-deck', name: 'Sun Deck Seat', oneWayPrice: 2200, roundTripPrice: 4200, note: 'Seat' }, { id: 'main-deck', name: 'Main Deck Seat', oneWayPrice: 2200, roundTripPrice: 4200, note: 'Seat' }, { id: 'panorama', name: 'Panorama Business Chair', oneWayPrice: 2300, roundTripPrice: 4500, note: 'Seat' }, { id: 'riviera', name: 'Riviera Business Chair', oneWayPrice: 2300, roundTripPrice: 4500, note: 'Seat' }, { id: 'mozarat', name: 'Mozarat Chair', oneWayPrice: 2500, roundTripPrice: 4800, note: 'Seat' }, { id: 'bunker-bed', name: 'Bunker Bed', oneWayPrice: 6000, roundTripPrice: 10000, note: 'Bunk' }, { id: 'deluxe-cabin', name: 'Deluxe Cabin', oneWayPrice: 7000, roundTripPrice: 13000, note: 'Cabin' }, { id: 'vip-cabin', name: 'VIP Cabin', oneWayPrice: 8000, roundTripPrice: 15000, note: 'Cabin' }, { id: 'vvip-cabin', name: 'VVIP Cabin', oneWayPrice: 10000, roundTripPrice: 18000, note: 'Cabin' }, { id: 'family-bunker', name: 'Family Bunker Cabin', oneWayPrice: 11000, roundTripPrice: 20000, note: 'Cabin' }] },
]

const periods = [{ label: 'November 2026', value: '2026-11' }, { label: 'December 2026', value: '2026-12' }, { label: 'January 2027', value: '2027-01' }, { label: 'February 2027', value: '2027-02' }, { label: 'March 2027', value: '2027-03' }]
const tripLabels: Record<TripType, string> = { 'cox-to-saint-martin': "Cox's Bazar → Saint Martin", 'saint-martin-to-cox': 'Saint Martin → Cox\'s Bazar', 'round-trip': 'Round trip' }
const money = (value: number) => `৳${value.toLocaleString('en-IN')}`
const startingPrice = (ship: Ship) => ship.seatCategories.length ? Math.min(...ship.seatCategories.map((category) => category.oneWay)) : ship.basePrice
const lowestStartingPrice = Math.min(...ships.map(startingPrice))
const shipSlug = (ship: Ship) => ship.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const shipFromSlug = (slug: string) => ships.find((ship) => shipSlug(ship) === slug)
const initialPassenger = (room = 'lavender'): Passenger => ({ name: '', nid: '', dob: '', tripType: 'round-trip', roomTypeId: room })

type InfoChipProps = { icon: ReactNode; children: ReactNode; className?: string }
function InfoChip({ icon, children, className = '' }: InfoChipProps) {
  return <div className={`hero-info-chip ${className}`}><span className="hero-info-chip-icon">{icon}</span>{children}</div>
}

type TrustItemData = {
  keyword: string
  title: string
  description: string
  icon: ReactNode
}

const trustItems: TrustItemData[] = [
  { keyword: 'Official', title: 'Official Booking Partner', description: 'Book with an official partner of leading cruise operators.', icon: <ShieldCheck size={36} aria-hidden="true" /> },
  { keyword: 'Pay Later', title: 'Pay After Confirmation', description: 'No payment required to submit your booking request.', icon: <CreditCard size={36} aria-hidden="true" /> },
  { keyword: '24/7', title: 'Dedicated Support', description: 'Get assistance from our travel team at every step.', icon: <Headset size={36} aria-hidden="true" /> },
]

function TrustItem({ item }: { item: TrustItemData }) {
  return <li className="trust-card"><div className="trust-card-dots" aria-hidden="true" /><div className="trust-card-top"><div className="trust-icon-tile">{item.icon}</div><div className="trust-keyword-wrap"><strong>{item.keyword}</strong><span aria-hidden="true">{item.keyword}</span></div></div><h3>{item.title}</h3><p>{item.description}</p></li>
}

function TrustSection() {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [activeTrustItem, setActiveTrustItem] = useState(0)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const cards = Array.from(scroller.children)
    const observer = new IntersectionObserver((entries) => {
      const visibleCard = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visibleCard) setActiveTrustItem(cards.indexOf(visibleCard.target))
    }, { root: scroller, threshold: [0.6, 0.8] })

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  function scrollToTrustItem(index: number) {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    scrollerRef.current?.children[index]?.scrollIntoView({ behavior, block: 'nearest', inline: 'start' })
  }

  function handleScrollerKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const nextIndex = Math.max(0, Math.min(trustItems.length - 1, activeTrustItem + (event.key === 'ArrowRight' ? 1 : -1)))
    scrollToTrustItem(nextIndex)
  }

  return <section className="trust-section" aria-label="Booking benefits">
    <ul ref={scrollerRef} className="trust-scroller" role="region" aria-label="Booking benefits" tabIndex={0} onKeyDown={handleScrollerKeyDown}>
      {trustItems.map((item) => <TrustItem key={item.title} item={item} />)}
    </ul>
    <div className="trust-indicators" aria-label="Booking benefit navigation">
      {trustItems.map((item, index) => <button key={item.title} type="button" className={index === activeTrustItem ? 'active' : ''} aria-label={`Go to benefit ${index + 1}`} aria-current={index === activeTrustItem ? 'true' : undefined} onClick={() => scrollToTrustItem(index)} />)}
    </div>
  </section>
}

type Voucher = {
  id: string
  title: string
  discount: number
  code: string
  validTill?: string
  image: string
  leftBg: string
  ctaLabel: string
  ctaHref: string
}

const vouchers: Voucher[] = [{
  id: 'saint-martin-resort',
  title: 'Resort Voucher',
  discount: 15,
  code: 'TBSHIP15',
  validTill: '2026-12-31',
  image: '/placeholder.jpg',
  leftBg: '#F1F0FD',
  ctaLabel: 'Book now',
  ctaHref: '/resorts/saint-martin',
}]

function VoucherCard({ voucher }: { voucher: Voucher }) {
  const [copyMessage, setCopyMessage] = useState('Copy code')
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(voucher.code)
      setCopyMessage('Copied')
      window.setTimeout(() => setCopyMessage('Copy code'), 1500)
    } catch {
      setCopyMessage('Copy unavailable')
      window.setTimeout(() => setCopyMessage('Copy code'), 1500)
    }
  }

  const href = `${voucher.ctaHref}?voucher=${encodeURIComponent(voucher.code)}`
  return <article className="voucher-card" style={{ '--voucher-left-bg': voucher.leftBg, '--voucher-image': `url(${voucher.image})` } as CSSProperties & Record<'--voucher-left-bg' | '--voucher-image', string>}>
    <div className="voucher-left">
      <span className="voucher-decoration voucher-decoration-one" aria-hidden="true" />
      <span className="voucher-decoration voucher-decoration-two" aria-hidden="true" />
      <span className="voucher-decoration voucher-decoration-sparkle" aria-hidden="true">✦</span>
      <h3>{voucher.title}</h3>
      <p className="voucher-supporting-text">Special discount on Saint Martin resort booking</p>
      <div className="voucher-code-row"><span>Code : {voucher.code}</span><button type="button" className="voucher-copy" onClick={copyCode} aria-label={`Copy voucher code ${voucher.code}`}><Copy size={14} aria-hidden="true" /><span className={`voucher-tooltip${copyMessage !== 'Copy code' ? ' is-visible' : ''}`} role="status">{copyMessage}</span></button></div>
      <a className="primary-button voucher-book-button" href={href}>{voucher.ctaLabel} <ArrowRight size={15} aria-hidden="true" /></a>
    </div>
    <div className="voucher-sand" aria-hidden="true" />
    <div className="voucher-right"><span>Discount</span><strong>{voucher.discount}%</strong></div>
    <div className="voucher-tear-line" aria-hidden="true" />
  </article>
}

function ExclusiveOffers() {
  return <section className="exclusive-offers" aria-labelledby="offer-heading"><h2 id="offer-heading">Exclusive offer</h2><p className="exclusive-offers-description">Get special discount on resort booking at Saint Martin as you are booking the cruise ticket from TripBooking AI.</p><div className="exclusive-offers-grid">{vouchers.map((voucher) => <VoucherCard key={voucher.id} voucher={voucher} />)}</div></section>
}

function HeroBanner() {
  return <header className="cruise-hero"><div className="cruise-hero-inner"><div className="cruise-hero-header"><a className="hero-logo" href="/" aria-label="Bluewater home"><img src="/Logo.png" alt="Bluewater" /></a></div><div className="cruise-hero-content"><p className="cruise-hero-eyebrow">SAINT MARTIN&apos;S ISLAND CRUISES</p><h1>Make room for<br /><span>the sea!</span></h1><p className="cruise-hero-description">Sail from Cox&apos;s Bazar to Saint Martin&apos;s Island with comfortable cruise ships, easy booking and a memorable island escape.</p><div className="hero-info-chips"><InfoChip icon={<Ship size={28} aria-hidden="true" />}>2 Cruise Ships</InfoChip><InfoChip icon={<CalendarDays size={28} aria-hidden="true" />}>Scheduled Sailings</InfoChip><InfoChip icon={<Ticket size={28} aria-hidden="true" />} className="hero-fare-chip"><span><small>Tickets from</small><strong>{money(lowestStartingPrice)}</strong></span></InfoChip></div></div></div><div className="hero-location"><MapPin size={22} aria-hidden="true" />Saint Martin&apos;s Island</div><div className="cruise-hero-bottom-fade" aria-hidden="true" /></header>
}

function BookingStepper({ currentStep, shipRoute }: { currentStep: 1 | 2 | 3; shipRoute?: boolean }) {
  const steps = ['Choose your ship', 'Book your journey', 'Review and confirm']
  return <nav className="booking-stepper" aria-label="Booking progress"><ol>{steps.map((label, index) => { const step = index + 1; const complete = step < currentStep; const active = step === currentStep; return <li key={label} className={`${active ? 'active' : ''} ${complete ? 'complete' : ''}`} aria-current={active ? 'step' : undefined}><span className="booking-step-item"><span className="booking-step-circle">{complete ? <Check size={24} aria-label="Completed" /> : `0${step}`}</span><span className="booking-step-label">{label}</span></span>{step < steps.length && <span className={`booking-step-connector ${complete ? 'complete' : ''}`} aria-hidden="true" />}</li> })}</ol></nav>
}

function SelectedShipBanner({ ship }: { ship: Ship }) {
  return <section className="selected-ship-banner" aria-label={`Selected ship: ${ship.name}`}><div className={`selected-ship-banner-image ${ship.id === 'ocean-dream' ? 'ship-art-ocean' : 'ship-art-breeze'}`} role="img" aria-label={`${ship.name} sailing on the sea`} /><div><p className="eyebrow">Selected ship</p><h1>{ship.name}</h1><p>{ship.subtitle}</p></div></section>
}

function ShipHeader({ ship, onBack, onViewFares }: { ship: Ship; onBack: () => void; onViewFares: () => void }) {
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  async function shareShip() {
    const shareData = { title: ship.name, text: `Book ${ship.name}`, url: window.location.href }
    if (navigator.share) await navigator.share(shareData).catch(() => undefined)
    else {
      await navigator.clipboard.writeText(window.location.href)
      setToast('Link copied')
      window.setTimeout(() => setToast(''), 2200)
    }
  }

  return <header className="ship-header">
    <div className="ship-mobile-app-bar">
      <button type="button" className="ship-mobile-back" onClick={onBack}><ChevronLeft size={24} />Back</button>
      <div className="ship-mobile-app-actions">
        <button type="button" className={`ship-heart ${saved ? 'saved' : ''}`} onClick={() => setSaved((current) => !current)} aria-label={saved ? 'Remove from favourites' : 'Save to favourites'} aria-pressed={saved}><Heart size={22} fill={saved ? 'currentColor' : 'none'} /></button>
        <button type="button" className="ship-mobile-icon-button" onClick={shareShip} aria-label="Share ship"><Share2 size={21} /></button>
      </div>
    </div>
    <div className="ship-title-row">
      <div className="ship-title-copy">
        <h1>{ship.name}</h1>
        <span className="ship-verified" title="Verified operator" aria-label="Verified operator"><Check size={17} strokeWidth={3} /></span>
        <span className="ship-badge ship-badge-premium"><Star size={14} fill="currentColor" />{ship.class}</span>
        <span className="ship-badge ship-badge-choice"><Award size={14} />Traveller&apos;s Choice 2026</span>
      </div>
      <div className="ship-header-actions">
        <button type="button" className={`ship-heart ${saved ? 'saved' : ''}`} onClick={() => setSaved((current) => !current)} aria-label={saved ? 'Remove from favourites' : 'Save to favourites'} aria-pressed={saved}><Heart size={20} fill={saved ? 'currentColor' : 'none'} /></button>
        <button type="button" className="ship-share-button" onClick={shareShip}><Share2 size={17} />Share</button>
        <button type="button" className="primary-button ship-fares-button" onClick={onViewFares}>View Fares</button>
      </div>
    </div>
    <p className="ship-location"><MapPin size={16} /><span>{ship.departurePoint}</span><b>•</b><span>Cox&apos;s Bazar to Saint Martin&apos;s Island · {ship.journeyDuration}</span></p>
    <div className="ship-mobile-title-block">
      <div className="ship-mobile-name"><h1>{ship.name}</h1>{' '}<span className="ship-verified" title="Verified operator" aria-label="Verified operator"><Check size={17} strokeWidth={3} /></span></div>
      <div className="ship-mobile-badges"><span className="ship-badge ship-badge-premium"><Star size={16} fill="currentColor" />{ship.class}</span><span className="ship-badge ship-badge-choice"><Award size={16} />Traveller&apos;s Choice 2026</span></div>
      <p className="ship-mobile-location"><MapPin size={18} /><span>{ship.departurePoint}</span><b>•</b><span>{ship.journeyDuration}</span></p>
      <div className="ship-mobile-actions"><button type="button" className={`ship-heart ${saved ? 'saved' : ''}`} onClick={() => setSaved((current) => !current)} aria-label={saved ? 'Remove from favourites' : 'Save to favourites'} aria-pressed={saved}><Heart size={23} fill={saved ? 'currentColor' : 'none'} /></button><button type="button" className="ship-share-button" onClick={shareShip}><Share2 size={20} />Share</button><button type="button" className="primary-button ship-fares-button" onClick={onViewFares}>View Fares</button></div>
    </div>
    {toast && <span className="ship-share-toast" role="status">{toast}</span>}
  </header>
}

function ShipGallery({ ship }: { ship: Ship }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeMobileImage, setActiveMobileImage] = useState(0)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const mobileGalleryRef = useRef<HTMLDivElement>(null)
  const images = Array.from({ length: 5 }, (_, index) => ship.gallery[index] ?? ship.gallery[0] ?? ship.image)
  const allImages = Array.from({ length: Math.max(5, ship.gallery.length) }, (_, index) => ship.gallery[index % ship.gallery.length] ?? ship.image)
  const mobileImages = ship.gallery.length ? ship.gallery : [ship.image]

  useEffect(() => {
    if (lightboxIndex === null) return
    closeButtonRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setLightboxIndex(null)
      if (event.key === 'ArrowRight') setLightboxIndex((current) => current === null ? 0 : (current + 1) % allImages.length)
      if (event.key === 'ArrowLeft') setLightboxIndex((current) => current === null ? 0 : (current - 1 + allImages.length) % allImages.length)
      if (event.key === 'Tab') {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [allImages.length, lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) triggerRef.current?.focus()
  }, [lightboxIndex])

  useEffect(() => {
    const gallery = mobileGalleryRef.current
    if (!gallery) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveMobileImage(Number((visible.target as HTMLElement).dataset.index ?? 0))
    }, { root: gallery, threshold: .6 })
    Array.from(gallery.children).forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [mobileImages.length])

  function openGallery(index: number, event: React.MouseEvent<HTMLElement>) {
    triggerRef.current = event.currentTarget
    setLightboxIndex(index)
  }

  return <>
    <div className="ship-gallery">
      {images.map((image, index) => <button key={`${image}-${index}`} type="button" className={`ship-gallery-tile ship-gallery-tile-${index + 1}`} onClick={(event) => openGallery(index, event)} aria-label={`Open photo ${index + 1} of ${allImages.length}`}>
        <img src={image} alt={`${ship.name} ${index === 0 ? 'deck' : 'photo'}`} loading={index === 0 ? 'eager' : 'lazy'} />
        {index === 0 && ship.videoUrl && <span className="ship-gallery-play" aria-label="Play ship video"><Play size={24} fill="white" /></span>}
        {index === 4 && <span className="ship-gallery-overlay"><Camera size={18} />See all photo</span>}
      </button>)}
      <button type="button" className="ship-gallery-mobile-button" onClick={(event) => openGallery(0, event)} aria-label={`Open all ${allImages.length} photos`}><Camera size={14} />See all photo ({allImages.length})</button>
    </div>
    <div className="ship-mobile-gallery-wrap">
      <div className="ship-mobile-gallery" ref={mobileGalleryRef}>
        {mobileImages.map((image, index) => <button key={`${image}-mobile-${index}`} type="button" className="ship-mobile-slide" data-index={index} onClick={(event) => openGallery(index, event)} aria-label={`Open photo ${index + 1} of ${mobileImages.length}`}><img src={image} alt={`${ship.name} ${index === 0 ? 'deck' : 'photo'}`} loading={index === 0 ? 'eager' : 'lazy'} />{index === 0 && ship.videoUrl && <span className="ship-gallery-play" aria-label="Play ship video"><Play size={24} fill="white" /></span>}</button>)}
        <button type="button" className="ship-gallery-mobile-button" onClick={(event) => openGallery(0, event)} aria-label={`Open all ${mobileImages.length} photos`}><Camera size={14} />See all photo ({mobileImages.length})</button>
      </div>
      <div className="ship-mobile-pagination" aria-label="Photo navigation">{Array.from({ length: Math.min(5, mobileImages.length) }, (_, index) => <span key={index} className={index === Math.min(activeMobileImage, 4) ? 'active' : ''} />)}</div>
    </div>
    {lightboxIndex !== null && <div className="ship-lightbox" role="dialog" aria-modal="true" aria-label="Ship photo gallery" onClick={() => setLightboxIndex(null)}>
      <div className="ship-lightbox-content" onClick={(event) => event.stopPropagation()}>
        <button type="button" ref={closeButtonRef} className="ship-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close photo gallery"><X size={24} /></button>
        <img src={allImages[lightboxIndex % allImages.length]} alt={`${ship.name} photo ${lightboxIndex + 1}`} />
        <span className="ship-lightbox-counter">{lightboxIndex + 1} / {allImages.length}</span>
      </div>
    </div>}
  </>
}

const shipTabs = [
  ['overview', 'Overview'], ['seat-categories', 'Seat categories'], ['schedule', 'Schedule'], ['facilities', 'Facilities'],
  ['reviews', 'Reviews'], ['policies', 'Policies'], ['boarding-point', 'Boarding point'], ['faq', 'FAQ'],
] as const

type ShipTabModalKind = 'seat-categories' | 'schedule'

function ShipTabs({ onOpenModal }: { onOpenModal: (tab: ShipTabModalKind) => void }) {
  const [activeTab, setActiveTab] = useState('overview')
  const tabRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const sections = shipTabs.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveTab(visible.target.id)
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .5] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function activateTab(id: string) {
    setActiveTab(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => { tabRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }) }, [activeTab])

  return <nav className="ship-tabs-wrap" aria-label="Ship sections"><div className="ship-tabs" role="tablist">
    {shipTabs.map(([id, label]) => <a key={id} href={`#${id}`} role="tab" ref={activeTab === id ? tabRef : undefined} aria-selected={activeTab === id} className={activeTab === id ? 'active' : ''} onClick={(event) => { event.preventDefault(); if (id === 'seat-categories' || id === 'schedule') onOpenModal(id); else activateTab(id) }}>{label}</a>)}
  </div></nav>
}

function ShipAbout({ ship }: { ship: Ship }) {
  const [expanded, setExpanded] = useState(false)
  const description = ship.description || `Sail from Cox's Bazar to Saint Martin's Island aboard ${ship.name}, operated by ${ship.operator}. Choose from comfortable seats, lounges and cabins, with scheduled sailings throughout the season.`
  return <section className="ship-about-layout" id="overview">
    <div className="ship-about-copy"><h2>About This Ship</h2><p className={expanded ? 'expanded' : ''}>{description}</p><button type="button" onClick={() => setExpanded((current) => !current)}>{expanded ? 'Show Less' : 'Read More'}</button></div>
    {ship.rating && ship.reviewCount && <aside className="ship-review-card" id="reviews"><div className="ship-review-score"><strong>{ship.rating}</strong><span><b>Excellent · {ship.reviewCount} reviews</b><small>{ship.positivePercent ?? 90}% positive reviews</small></span></div><h3>{ship.topReview?.title ?? 'Nice journey'}</h3><p>{ship.topReview?.text ?? 'A comfortable journey with helpful support and pleasant facilities.'}</p><small>{ship.topReview?.author ?? 'Guest traveller'}</small></aside>}
  </section>
}

function FareChartModal({ ship, onClose }: { ship: Ship; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return <div className="fare-chart-overlay" role="dialog" aria-modal="true" aria-labelledby="fare-chart-title" onClick={onClose}>
    <div className="fare-chart-modal" onClick={(event) => event.stopPropagation()}>
      <div className="fare-chart-header"><div><p className="eyebrow">Fare guide</p><h2 id="fare-chart-title">{ship.name}</h2><p>Seat category prices</p></div><button type="button" className="fare-chart-close" onClick={onClose} aria-label="Close fare chart">×</button></div>
      <div className="fare-chart-table" role="table" aria-label={`${ship.name} fare chart`}><div className="fare-chart-row fare-chart-heading" role="row"><span role="columnheader">Category</span><span role="columnheader">One way</span><span role="columnheader">Round trip</span></div>{ship.rooms.map((room) => <div className="fare-chart-row" role="row" key={room.id}><span role="cell"><b>{room.name}</b><small>{room.note}</small></span><strong role="cell">{money(room.oneWayPrice)}</strong><strong role="cell">{money(room.roundTripPrice)}</strong></div>)}</div>
    </div>
  </div>
}

function ShipTabModal({ ship, tab, onClose }: { ship: Ship; tab: ShipTabModalKind; onClose: () => void }) {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0].value)
  const scheduleShip = {
    name: ship.name,
    image: ship.image,
    description: ship.description,
    schedules: ship.schedules.filter((schedule) => schedule.date.startsWith(selectedPeriod)),
    rooms: ship.rooms.map((room) => ({ id: room.id, name: room.name, oneWayPrice: money(room.oneWayPrice), roundTripPrice: money(room.roundTripPrice), note: room.note })),
    periods,
    selectedPeriod,
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (tab === 'schedule') {
    return <ShipDetailsModal
      ship={scheduleShip}
      isOpen
      initialTab="Ship schedule"
      onClose={onClose}
      onChoose={() => undefined}
      onPeriodChange={setSelectedPeriod}
    />
  }

  return <div className="fare-chart-overlay" role="dialog" aria-modal="true" aria-labelledby="ship-tab-modal-title" onClick={onClose}>
    <div className="fare-chart-modal ship-tab-modal" onClick={(event) => event.stopPropagation()}>
      <div className="fare-chart-header"><div><p className="eyebrow">Seat categories</p><h2 id="ship-tab-modal-title">{ship.name}</h2><p>Available seating on this ship</p></div><button type="button" className="fare-chart-close" onClick={onClose} aria-label="Close ship information">×</button></div>
      <div className="ship-category-list">{ship.rooms.map((room) => <div className="ship-category-item" key={room.id}><span><b>{room.name}</b><small>{room.note}</small></span><strong>{money(room.oneWayPrice)} one way</strong></div>)}</div>
    </div>
  </div>
}

function ModernDatePicker({ label, value, onChange, min, max, optional, helper, compact }: { label: string; value: string; onChange: (value: string) => void; min?: string; max?: string; optional?: boolean; helper: string; compact?: boolean }) {
  const today = new Date()
  const selected = value ? new Date(`${value}T12:00:00`) : today
  const minDate = min ? new Date(`${min}T12:00:00`) : undefined
  const maxDate = max ? new Date(`${max}T12:00:00`) : undefined
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(new Date((minDate ?? selected).getFullYear(), (minDate ?? selected).getMonth(), 1))
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + days }, (_, index) => index < firstDay ? null : index - firstDay + 1)
  const yearOptions = Array.from({ length: 107 }, (_, index) => (maxDate?.getFullYear() ?? today.getFullYear()) - index)
  function choose(day: number) { const next = new Date(month.getFullYear(), month.getMonth(), day); if ((minDate && next < minDate) || (maxDate && next > maxDate)) return; onChange(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`); setOpen(false) }
  return <div className={`field date-field relative ${compact ? 'compact-date-field' : ''}`}><span>{label} {optional && <em>optional</em>}</span><button type="button" className={`modern-date-trigger ${value ? 'has-value' : ''}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}><span><b>{value ? selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select a date'}</b>{!compact && <small>{value ? selected.toLocaleDateString('en-US', { weekday: 'long' }) : helper}</small>}</span><ChevronDown size={17} /></button>{open && <div className="calendar-popover"><div className="calendar-top"><button type="button" disabled={Boolean(minDate && new Date(month.getFullYear(), month.getMonth() - 1, 1) < new Date(minDate.getFullYear(), minDate.getMonth(), 1))} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft size={20} /></button>{compact ? <div className="calendar-month-year"><select aria-label="Birth month" value={month.getMonth()} onChange={(event) => setMonth(new Date(month.getFullYear(), Number(event.target.value), 1))}>{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((monthName, index) => <option value={index} key={monthName}>{monthName}</option>)}</select><select aria-label="Birth year" value={month.getFullYear()} onChange={(event) => setMonth(new Date(Number(event.target.value), month.getMonth(), 1))}>{yearOptions.map((year) => <option value={year} key={year}>{year}</option>)}</select></div> : <strong>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong>}<button type="button" disabled={Boolean(maxDate && new Date(month.getFullYear(), month.getMonth() + 1, 1) > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1))} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight size={20} /></button></div><div className="calendar-weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{cells.map((day, index) => day ? <button type="button" key={index} disabled={Boolean((minDate && new Date(month.getFullYear(), month.getMonth(), day) < minDate) || (maxDate && new Date(month.getFullYear(), month.getMonth(), day) > maxDate))} className={value === `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? 'active' : ''} onClick={() => choose(day)}>{day}</button> : <span key={index} />)}</div></div>}{!compact && <small>{value ? helper : 'Choose a date'}</small>}</div>
}

function MonthDropdown({ value, onChange, label, name = 'travel-period' }: { value: string; onChange: (value: string) => void; label?: string; name?: string }) {
  const [open, setOpen] = useState(false)
  const selected = periods.find((item) => item.value === value) ?? periods[0]

  return <div className={`month-dropdown field relative ${label ? '' : 'month-dropdown-compact'}`}>{label && <span>{label}</span>}<button type="button" className={`month-dropdown-trigger ${open ? 'open' : ''}`} onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="listbox"><span>{selected.label}</span><ChevronDown size={17} /></button>{open && <div className="month-dropdown-menu" role="listbox" aria-label={label ?? 'Sailing schedule month'}>{periods.map((item) => <label key={item.value} className="month-dropdown-option"><input type="radio" name={name} value={item.value} checked={value === item.value} onChange={() => { onChange(item.value); setOpen(false) }} /><span className="month-radio" aria-hidden="true" /><span>{item.label}</span></label>)}</div>}</div>
}

function ShipCard({ ship, selected, onSelect, onDetails, onSchedule }: { ship: Ship; selected: boolean; onSelect: () => void; onDetails: (ship: Ship, trigger: HTMLElement) => void; onSchedule: (ship: Ship, trigger: HTMLElement) => void }) {
  return <article className={`ship-card ${selected ? 'selected' : ''}`} role="radio" aria-checked={selected} tabIndex={0} onClick={onSelect} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect() } }}>
    <div className="ship-art-wrapper"><div className={`ship-art ${ship.id === 'ocean-dream' ? 'ship-art-ocean' : 'ship-art-breeze'}`} role="img" aria-label={`${ship.name} sailing on the sea`} /><div className="ship-partner-badge"><span aria-hidden="true"><Check size={13} strokeWidth={3} /></span><strong>Official Booking Partner</strong></div></div>
    <div className="ship-card-content">
      <div className="ship-card-heading">
        <input id={`ship-${ship.id}`} className="ship-radio-input" type="radio" name="ship" checked={selected} onChange={onSelect} aria-label={`Select ${ship.name}`} />
        <label htmlFor={`ship-${ship.id}`} className={`radio-indicator ${selected ? 'checked' : ''}`} onClick={(event) => event.stopPropagation()} />
        <div className="min-w-0"><h3>{ship.name}</h3><p>{ship.subtitle}</p></div>
      </div>
      <div className="ship-tags"><span><Armchair size={14} aria-hidden="true" />Multiple seat categories</span><span><Clock3 size={14} aria-hidden="true" />{ship.journeyDuration}</span></div>
      <div className="ship-price-area">
        <div><p>Tickets from</p><strong>{money(startingPrice(ship))}</strong><span>/ person · one way</span></div>
        <div className="ship-card-actions"><button type="button" onClick={(event) => { event.stopPropagation(); onSchedule(ship, event.currentTarget) }}><CalendarDays size={15} aria-hidden="true" />Schedule</button><span aria-hidden="true" /><button type="button" onClick={(event) => { event.stopPropagation(); onDetails(ship, event.currentTarget) }}><Info size={15} aria-hidden="true" />Details</button></div>
      </div>
    </div>
  </article>
}

function ShipSelection({ ships, selectedShipId, onSelect, onDetails, onSchedule, onContinue }: { ships: Ship[]; selectedShipId: string | null; onSelect: (id: string) => void; onDetails: (ship: Ship, trigger: HTMLElement) => void; onSchedule: (ship: Ship, trigger: HTMLElement) => void; onContinue: () => void }) {
  return <>
    <section className="ship-selection" aria-labelledby="ship-selection-title">
    <div className="ship-selection-heading"><div><p className="eyebrow">01 / Choose your vessel</p><h2 id="ship-selection-title">Choose your ship.</h2><p>Select the ship that suits your trip to Saint Martin&apos;s Island.</p></div></div>
    <div className="ship-grid">{ships.map((ship) => <ShipCard key={ship.id} ship={ship} selected={selectedShipId === ship.id} onSelect={() => onSelect(ship.id)} onDetails={onDetails} onSchedule={onSchedule} />)}</div>
    <div className="ship-selection-footer"><button type="button" disabled={!selectedShipId} onClick={onContinue} className="primary-button">Continue with selected ship <ArrowRight size={20} aria-hidden="true" /></button><p>Need more information? <button type="button" onClick={(event) => { const selected = ships.find((ship) => ship.id === selectedShipId) ?? ships[0]; onDetails(selected, event.currentTarget) }}>Explore ship details</button></p></div>
    </section>
    <TrustSection />
  </>
}

export function BookingPage({ initialShipSlug }: { initialShipSlug?: string }) {
  const router = useRouter()
  const initialShip = initialShipSlug ? shipFromSlug(initialShipSlug) : ships[0]
  const shipRoute = Boolean(initialShipSlug && initialShip)
  const [shipId, setShipId] = useState<string | null>(initialShip?.id ?? 'ocean-dream')
  const [period, setPeriod] = useState('2026-11')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState<Passenger[]>([initialPassenger()])
  const [contactInformation, setContactInformation] = useState<ContactInformation>({ phone: '', whatsapp: '', email: '' })
  const [terms, setTerms] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showSeatMap, setShowSeatMap] = useState(false)
  const [showFareChart, setShowFareChart] = useState(false)
  const [shipTabModal, setShipTabModal] = useState<ShipTabModalKind | null>(null)
  const [selectedSeatCategory, setSelectedSeatCategory] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [showAllRooms, setShowAllRooms] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [detailsShip, setDetailsShip] = useState<Ship | null>(null)
  const [detailsInitialTab, setDetailsInitialTab] = useState<'Overview' | 'Ship schedule'>('Overview')
  const detailsTriggerRef = useRef<HTMLElement | null>(null)
  const [step, setStep] = useState<1 | 2>(shipRoute ? 2 : 1)
  const [openPassenger, setOpenPassenger] = useState(0)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)
  const bookingStepRef = useRef<HTMLElement>(null)
  const [errors, setErrors] = useState('')
  const [bookingId] = useState(() => `TBAI${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`)
  const ship = ships.find((item) => item.id === shipId) ?? ships[0]
  const schedules = ship.schedules.filter((item) => item.date.startsWith(period))
  const total = useMemo(() => passengers.reduce((sum, passenger) => { const room = ship.rooms.find((item) => item.id === passenger.roomTypeId); return sum + (room ? passenger.tripType === 'round-trip' ? room.roundTripPrice : room.oneWayPrice : 0) }, 0), [passengers, ship])

  useEffect(() => {
    if (step === 2) bookingStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  function chooseShip(id: string) { const nextShip = ships.find((item) => item.id === id) ?? ships[0]; setShipId(id); setStep(1); setShowDetails(false); setOpenPassenger(0); setDepartureDate(''); setReturnDate(''); setPassengers((current) => current.map((person) => ({ ...person, roomTypeId: nextShip.rooms[0].id }))) }
  function continueWithSelectedShip() {
    if (!shipId) return
    const selected = ships.find((item) => item.id === shipId)
    if (selected) router.push(`/${shipSlug(selected)}`)
  }
  function updatePassenger(index: number, field: keyof Passenger, value: string) { setPassengers((current) => current.map((person, i) => i === index ? { ...person, [field]: value } : person)) }
  async function downloadSummary() { const pdfMoney = (value: number) => `BDT ${value.toLocaleString('en-IN')}`; const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true }); const logo = new Image(); logo.src = '/tripbooking-logo.png'; await new Promise<void>((resolve) => { logo.onload = () => resolve(); logo.onerror = () => resolve() }); const logoData = logo.complete && logo.naturalWidth ? (() => { const canvas = document.createElement('canvas'); const maxWidth = 900; const scale = Math.min(1, maxWidth / logo.naturalWidth); canvas.width = Math.max(1, Math.round(logo.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(logo.naturalHeight * scale)); const context = canvas.getContext('2d'); if (context) { context.fillStyle = '#F6F8FF'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(logo, 0, 0, canvas.width, canvas.height) } return canvas.toDataURL('image/jpeg', 0.72) })() : null; const pageWidth = pdf.internal.pageSize.getWidth(); const navy = [24, 52, 93] as const; const blue = [21, 87, 214] as const; pdf.setFillColor(245, 248, 255); pdf.rect(0, 0, pageWidth, 842, 'F'); if (logoData) pdf.addImage(logoData, 'JPEG', 56, 8, 128, 36, undefined, 'FAST'); pdf.setFillColor(...blue); pdf.roundedRect(40, 58, pageWidth - 80, 92, 18, 18, 'F'); pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(25); pdf.text('Booking Summary', 64, 106); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.text(`Booking ID: ${bookingId}`, pageWidth - 56, 134, { align: 'right' }); pdf.text('Cruise booking request', 64, 118); let y = 194; pdf.setTextColor(...navy); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(14); pdf.text('Journey details', 48, y); y += 24; pdf.setFillColor(255, 255, 255); pdf.roundedRect(48, y, pageWidth - 96, 112, 12, 12, 'F'); pdf.setTextColor(92, 113, 144); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.text('SHIP', 66, y + 25); pdf.text('TRAVEL PERIOD', 66, y + 58); pdf.text('DEPARTURE', 66, y + 91); pdf.setTextColor(...navy); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(12); pdf.text(ship.name, 205, y + 25); pdf.text(periods.find((item) => item.value === period)?.label ?? '', 205, y + 58); pdf.text(departureDate || 'Not selected', 205, y + 91); if (returnDate) { pdf.setTextColor(92, 113, 144); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.text('RETURN', 340, y + 91); pdf.setTextColor(...navy); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(12); pdf.text(returnDate, 395, y + 91) } y += 148; pdf.setTextColor(...navy); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(14); pdf.text(`Passengers (${passengers.length})`, 48, y); y += 22; passengers.forEach((person, index) => { if (y > 730) { pdf.addPage(); y = 48 } pdf.setFillColor(255, 255, 255); pdf.roundedRect(48, y, pageWidth - 96, 58, 10, 10, 'F'); pdf.setTextColor(...navy); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); pdf.text(`${index + 1}. ${person.name || 'Passenger'}`, 64, y + 22); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(92, 113, 144); pdf.text(`DOB: ${person.dob || '—'}   NID: ${person.nid || '—'}   Seat: ${ship.rooms.find((room) => room.id === person.roomTypeId)?.name ?? '—'}`, 64, y + 41); y += 68 }); y += 8; pdf.setFillColor(...blue); pdf.roundedRect(48, y, pageWidth - 96, 64, 12, 12, 'F'); pdf.setTextColor(219, 232, 255); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11); pdf.text('ESTIMATED TOTAL', 68, y + 25); pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(21); pdf.text(pdfMoney(total), 68, y + 49); pdf.save('booking-summary.pdf') }
  function submit(event: React.FormEvent) { event.preventDefault(); const incomplete = passengers.some((person) => !person.name.trim() || !person.nid || !person.dob); const invalidContact = !contactInformation.email.includes('@') || !contactInformation.phone.trim() || !contactInformation.whatsapp.trim() || !/^(?:\+880|880|0)1[3-9][0-9]{8}$/.test(contactInformation.phone); if (!departureDate || !returnDate || incomplete || invalidContact || !terms || !schedules.length) { setErrors(!departureDate || !returnDate ? 'Please select your departure and return dates.' : !terms ? 'Please accept the Terms and Conditions to continue.' : 'Please complete the highlighted journey and contact information.'); return } setErrors(''); setSubmitted(true) }

  if (submitted) return <main className="min-h-screen bg-[#f5f8ff] px-5 py-10 text-[#101828]"><div className="mx-auto max-w-7xl px-5 pb-8 sm:px-10 lg:px-16"><div className="flex items-center justify-between gap-3 text-sm font-bold text-[#8b9ab2]"><div className="flex items-center gap-2 text-[#1464ff]"><span className="flex size-10 items-center justify-center rounded-full bg-[#1464ff] text-white">1</span><span className="hidden sm:inline">Choose cruise</span></div><div className="h-px flex-1 bg-[#1464ff]" /><div className="flex items-center gap-2 text-[#1464ff]"><span className="flex size-10 items-center justify-center rounded-full bg-[#1464ff] text-white">2</span><span className="hidden sm:inline">Booking your journey</span></div><div className="h-px flex-1 bg-[#1464ff]" /><div className="flex items-center gap-2 text-[#1464ff]"><span className="flex size-10 items-center justify-center rounded-full bg-[#1464ff] text-white">3</span><span className="hidden sm:inline">Confirm booking</span></div></div></div><div className="mx-auto max-w-7xl"><section className="flex min-h-[70vh] items-center justify-center"><div className="w-full rounded-[32px] bg-white p-8 text-center shadow-[0_24px_80px_rgba(13,97,255,.12)] sm:p-16"><div className="mx-auto mb-7 flex size-20 items-center justify-center rounded-full bg-[#e7f0ff] text-[#0d61ff]"><Check size={36} /></div><p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-[#0d61ff]">03 / Confirm booking</p><h1 className="mb-4 text-4xl font-semibold tracking-[-.04em]">Your journey is on its way.</h1><p className="mx-auto max-w-md leading-7 text-slate-500">Your booking request has been received successfully. Our team will contact you as soon as possible to confirm availability and complete your booking.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><button className="primary-button" onClick={() => setSubmitted(false)}>Back to booking</button><button type="button" className="summary-download confirmation-download" onClick={downloadSummary}><Download size={16} /> Download booking summary PDF</button></div><ExclusiveOffers /></div></section></div></main>

  {showSeatMap && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071b46]/45 p-5" role="dialog" aria-modal="true" aria-labelledby="seat-map-title" onClick={() => setShowSeatMap(false)}><div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-start justify-between"><div><p className="eyebrow">Seat preview</p><h2 id="seat-map-title" className="text-2xl font-semibold">{selectedSeatCategory ? `${selectedSeatCategory} seating` : `${ship.name} layout`}</h2></div><button type="button" onClick={() => setShowSeatMap(false)} className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500" aria-label="Close seat map">×</button></div><img src="/seat-category-preview.png" alt={`${selectedSeatCategory ?? ship.name} seating preview`} className="mb-4 h-40 w-full rounded-2xl object-cover" /><div className="rounded-2xl bg-[#f5f8ff] p-5"><div className="mx-auto mb-5 w-28 rounded-b-3xl rounded-t-xl bg-[#d8e7ff] px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#0d61ff]">Bow</div><div className="grid grid-cols-4 gap-2">{Array.from({ length: 20 }, (_, index) => <span key={index} className={`flex aspect-square items-center justify-center rounded-lg border text-[10px] font-bold ${index % 5 === 0 ? 'border-[#b9c9e8] bg-white text-slate-400' : 'border-[#9dbdff] bg-[#e6efff] text-[#0d61ff]'}`}>{index % 5 === 0 ? '—' : index + 1}</span>)}</div><div className="mx-auto mt-5 w-28 rounded-t-3xl rounded-b-xl bg-[#d8e7ff] px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#0d61ff]">Stern</div></div><div className="mt-5 flex items-center gap-4 text-xs text-slate-500"><span className="flex items-center gap-2"><i className="size-3 rounded bg-[#e6efff]" /> Available</span><span className="flex items-center gap-2"><i className="size-3 rounded bg-white ring-1 ring-[#b9c9e8]" /> Reserved</span></div></div></div>}
  return <main className="min-h-screen overflow-hidden bg-[#f6f9ff] text-[#101828]">
    {!shipRoute && step === 1 && <HeroBanner />}
    <BookingStepper currentStep={step} shipRoute={shipRoute} />
    <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-10 lg:px-16"><form onSubmit={submit} className="space-y-10">
      {shipId && (shipRoute || step === 2) && <div className="ship-heading-section"><ShipHeader ship={ship} onBack={() => router.back()} onViewFares={() => setShowFareChart(true)} /><ShipGallery ship={ship} /><ShipTabs onOpenModal={setShipTabModal} /><ShipAbout ship={ship} /></div>}
      {!shipRoute && step === 1 && <ShipSelection ships={ships} selectedShipId={shipId} onSelect={chooseShip} onDetails={(selected, trigger) => { detailsTriggerRef.current = trigger; setDetailsInitialTab('Overview'); setDetailsShip(selected) }} onSchedule={(selected, trigger) => { detailsTriggerRef.current = trigger; setDetailsInitialTab('Ship schedule'); setDetailsShip(selected) }} onContinue={continueWithSelectedShip} />}

      {shipId && (shipRoute || step === 2) && <>
      {showDetails &&       <section id="schedule" className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="panel"><div className="panel-heading"><div><p className="eyebrow">02 / The sailing</p><h2 className="flex items-center gap-2 text-2xl font-semibold"><CalendarDays className="h-6 w-6 text-[#0d61ff]" aria-hidden="true" />Ship schedule</h2><MonthDropdown value={period} name="schedule-period" onChange={(value) => { setPeriod(value); setDepartureDate(''); setReturnDate(''); setShowAll(false) }} /><p className="mt-3 text-sm text-slate-500">{periods.find((item) => item.value === period)?.label} sailings</p></div><span className="schedule-ship-name rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#0d61ff]">{ship.name}</span></div>{schedules.length ? <div className="overflow-hidden rounded-2xl border border-slate-100"><div className="grid grid-cols-3 bg-[#f7f9fd] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500"><span>Date</span><span>Departure (Cox&apos;s Bazar)</span><span>Return (Saint Martin)</span></div><div className="divide-y divide-slate-100">{(showAll ? schedules : schedules.slice(0, 3)).map((schedule) => <div key={schedule.id} className="grid grid-cols-3 items-center gap-3 px-4 py-4 text-sm"><span className="font-semibold text-slate-800">{new Date(`${schedule.date}T12:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span><span className="font-medium text-slate-700">{schedule.departure}</span><span className="font-medium text-slate-700">{schedule.arrival}</span></div>)}</div></div> : <p className="p-6 text-sm text-slate-500">No sailings are available for {periods.find((item) => item.value === period)?.label}.</p>}{schedules.length > 3 && <button type="button" onClick={() => setShowAll(!showAll)} className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#0d61ff]">{showAll ? 'Show less' : 'Show more'} <ChevronDown className={showAll ? 'rotate-180' : ''} size={16} /></button>}</div><div id="seat-categories" className="panel"><div className="panel-heading"><div><p className="eyebrow">03 / Find your comfort</p><div><h2 className="text-2xl font-semibold">Room & seat pricing</h2><button type="button" onClick={() => setShowSeatMap(true)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#cfe0ff] bg-[#f5f9ff] px-3.5 py-2 text-xs font-bold text-[#0d61ff] transition hover:border-[#0d61ff] hover:bg-[#eaf2ff]"><Ship size={14} /> View seat map</button></div><span className="text-xs font-medium text-slate-400">Per passenger</span></div></div><div className="overflow-hidden rounded-2xl border border-slate-100"><div className="grid grid-cols-3 bg-[#f7f9fd] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400"><span>Category</span><span>One way</span><span>Round trip</span><span>Images</span></div>{(showAllRooms ? ship.rooms : ship.rooms.slice(0, 5)).map((room) => <div key={room.id} className="grid grid-cols-3 items-center border-t border-slate-100 px-4 py-4 text-sm"><div><p className="font-semibold">{room.name}</p><p className="text-xs text-slate-400">{room.note}</p></div><span>{money(room.oneWayPrice)}</span><span className="font-semibold text-[#0d61ff]">{money(room.roundTripPrice)}<button type="button" aria-label={`View ${room.name} seat image`} onClick={() => { setSelectedSeatCategory(room.name); setShowSeatMap(true) }} className="view-seat-image">View</button></span></div>)}</div><button type="button" className="pricing-toggle mb-3" onClick={() => setShowAllRooms((current) => !current)}>{showAllRooms ? 'Show less' : 'Show more'}</button><div className="mt-5 flex gap-2 rounded-2xl bg-[#fff8e8] p-4 text-xs leading-5 text-[#88631a]"><CircleHelp className="mt-0.5 shrink-0" size={15} /><span><b>Child Policy:</b> Ages 1–5 do not require a ticket.</span></div></div></section>}


      <section ref={bookingStepRef} className="panel"><div className="mb-8 flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">{shipRoute ? '01 / Book your journey' : '02 / Book your journey'}</p>      <h2 className="text-3xl font-semibold tracking-tight">Book your journey.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Choose your travel period, select your sailing dates, and provide passenger details to submit your cruise booking request.</p></div><div className="flex items-center gap-3">{!shipRoute && <button type="button" onClick={() => setStep(1)} className="rounded-full border border-[#cfe0ff] bg-white px-4 py-2.5 text-sm font-bold text-[#0d61ff] transition hover:border-[#0d61ff] hover:bg-[#eaf2ff]">Back to ship</button>}</div></div><div className="grid gap-4 md:grid-cols-3"><MonthDropdown value={period} onChange={(value) => { setPeriod(value); setDepartureDate(''); setReturnDate('') }} /><ModernDatePicker label="Departure date" value={departureDate} onChange={setDepartureDate} min={`${period}-01`} helper={schedules.find((item) => item.date === departureDate)?.departure || 'No sailing listed for this date'} />      <ModernDatePicker label="Return date" value={returnDate} onChange={setReturnDate} min={departureDate || `${period}-01`} helper="Return sailing date" /></div></section>

      <div className="passenger-step-layout"><section className="panel"><div className="mb-7 flex items-end justify-between gap-4"><div><p className="eyebrow">03 / Who&apos;s sailing</p><h2 className="text-3xl font-semibold tracking-tight">Passenger information.</h2><p className="mt-2 text-sm text-slate-500">Add up to 5 passengers per booking request.</p></div><span className="shrink-0 rounded-full bg-[#edf4ff] px-3 py-2 text-xs font-bold text-[#0d61ff]">{passengers.length} of 5</span></div>      <div className="space-y-3">{passengers.map((passenger, index) => { const room = ship.rooms.find((item) => item.id === passenger.roomTypeId); const fare = room ? passenger.tripType === 'round-trip' ? room.roundTripPrice : room.oneWayPrice : 0; const isOpen = openPassenger === index; return <div className={`passenger ${isOpen ? 'passenger-open' : ''}`} key={index}><div className="flex items-center justify-between gap-3"><button type="button" className="passenger-toggle" onClick={() => setOpenPassenger(isOpen ? -1 : index)} aria-expanded={isOpen}>      <span className="passenger-avatar"><UserRound size={20} strokeWidth={2} aria-hidden="true" /></span><span className="min-w-0 text-left"><strong>Passenger {index + 1}</strong><small>{room?.name ?? 'Select a seat category'}</small></span><ChevronDown className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} /></button>{index > 0 && <button type="button" onClick={() => { setPassengers((current) => current.filter((_, i) => i !== index)); setOpenPassenger((current) => current >= passengers.length - 1 ? Math.max(0, current - 1) : current) }} className="flex items-center gap-1 text-xs font-semibold text-red-500"><Trash2 size={14} /> Remove</button>}</div>{isOpen && <div className="mt-5 grid gap-4 md:grid-cols-2"><label className="field"><span>Full Name as per NID <em className="not-italic text-[#0d61ff]">(required)</em></span><input required value={passenger.name ?? ''} onChange={(e) => updatePassenger(index, 'name', e.target.value)} placeholder="e.g. Samira Rahman" /></label><ModernDatePicker label="Date of birth" value={passenger.dob} onChange={(value) => updatePassenger(index, 'dob', value)} max={new Date().toISOString().split('T')[0]} helper="Date of birth" compact /><label className="field"><span>NID number <em className="not-italic text-[#0d61ff]">(required)</em></span><input required value={passenger.nid} onChange={(e) => updatePassenger(index, 'nid', e.target.value)} placeholder="Enter NID number" /></label><label className="field"><span>Trip type</span><select value={passenger.tripType} onChange={(e) => updatePassenger(index, 'tripType', e.target.value)}>{Object.entries(tripLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label className="field"><span>Room / seat type</span><select value={passenger.roomTypeId} onChange={(e) => updatePassenger(index, 'roomTypeId', e.target.value)}>{ship.rooms.map((item) => <option key={item.id} value={item.id}>{item.name} · {money(passenger.tripType === 'round-trip' ? item.roundTripPrice : item.oneWayPrice)}</option>)}</select>                  <small>Estimated fare: <b>{money(fare)}</b></small></label></div>}</div> })}</div><button type="button" disabled={passengers.length === 5}       onClick={() => { setOpenPassenger(passengers.length); setPassengers((current) => [...current, initialPassenger()]) }} className="mt-5 flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-[#0d61ff] hover:text-[#0d61ff] disabled:cursor-not-allowed disabled:opacity-40"><Plus size={16} /> Add passenger</button></section><section className="panel contact-information-panel"><div className="mb-7"><p className="eyebrow">04 / Stay in touch</p><h2 className="text-3xl font-semibold tracking-tight">Contact Information.</h2><p className="mt-2 text-sm text-slate-500">We&apos;ll use these details for booking updates.</p></div><div className="grid gap-4 md:grid-cols-2"><label className="field"><span>Phone number <em className="not-italic text-[#0d61ff]">(required)</em></span><input required type="tel" inputMode="tel" pattern="(?:\+880|880|0)1[3-9][0-9]{8}" title="Enter a valid Bangladesh mobile number, such as 01712345678 or +8801712345678" value={contactInformation.phone} onChange={(e) => setContactInformation((current) => ({ ...current, phone: e.target.value.replace(/[^0-9+]/g, '').slice(0, 14) }))} placeholder="017XXXXXXXX" /></label><label className="field"><span>WhatsApp number <em className="not-italic text-[#0d61ff]">(required)</em></span><input required type="tel" inputMode="tel" value={contactInformation.whatsapp} onChange={(e) => setContactInformation((current) => ({ ...current, whatsapp: e.target.value.replace(/[^0-9+]/g, '').slice(0, 15) }))} placeholder="+880 1712345678 or +1 2025550123" /></label><label className="field md:col-span-2"><span>Email address <em className="not-italic text-[#0d61ff]">(required)</em></span><input required type="email" value={contactInformation.email} onChange={(e) => setContactInformation((current) => ({ ...current, email: e.target.value }))} placeholder="you@example.com" /></label></div></section>

      <section className="review-section grid gap-5 lg:grid-cols-[1fr_350px]"><div className="panel"><p className="eyebrow">05 / Review</p><h2 className="text-3xl font-semibold tracking-tight">Almost there.</h2><label className="mt-8 flex items-start gap-3 text-sm leading-6 text-slate-600"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 size-4 accent-[#0d61ff]" /> <span>I confirm that the passenger information and selected travel details are correct, and I agree to the <a href="#terms" className="font-semibold text-[#0d61ff] underline">Terms and Conditions</a>.</span></label>{errors && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{errors}</p>}<button type="submit" className="primary-button mt-8 w-full">Confirm booking request <ArrowRight size={17} /></button><p className="mt-3 text-center text-xs text-slate-400">This is a request for review, not an instant confirmed booking.</p></div>      <aside className={`summary ${mobileSummaryOpen ? 'mobile-summary-open' : ''}`}><button type="button" className="summary-drawer-toggle" onClick={() => setMobileSummaryOpen((current) => !current)} aria-expanded={mobileSummaryOpen}><span><span className="eyebrow text-blue-100">Your trip</span><strong>Booking summary</strong></span><span className="summary-drawer-total">{money(total)}</span><ChevronDown className={mobileSummaryOpen ? 'rotate-180' : ''} size={20} /></button><div className="mb-6 flex items-center justify-between summary-desktop-heading"><div><p className="eyebrow text-blue-100">Your trip</p><h2 className="text-2xl font-semibold">Booking summary</h2></div><MapPin className="text-[#a9c7ff]" size={22} /></div><div className="space-y-4 text-sm"><div className="summary-row"><span>Ship</span><b>{ship.name}</b></div><div className="summary-row"><span>Travel period</span><b>{periods.find((item) => item.value === period)?.label}</b></div><div className="summary-row"><span>Departure</span><b>{departureDate || 'Not selected'}</b></div>{returnDate && <div className="summary-row"><span>Return</span><b>{returnDate}</b></div>}<div className="border-t border-white/15 pt-4">{passengers.map((person, index) => { const room = ship.rooms.find((item) => item.id === person.roomTypeId); const fare = room ? person.tripType === 'round-trip' ? room.roundTripPrice : room.oneWayPrice : 0; return <div className="mb-3 flex justify-between gap-3" key={index}><span className="text-blue-100">Passenger {index + 1}<br /><small>{room?.name} · {tripLabels[person.tripType]}</small></span><b>{money(fare)}</b></div> })}</div><div className="mt-6 flex items-end justify-between border-t border-white/15 pt-5"><span className="text-sm text-blue-100">Estimated total</span><strong className="text-2xl">{money(total)}</strong></div></div></aside>            </section></div>
      </>}
    </form></div>
    {detailsShip && <ShipDetailsModal ship={{ name: detailsShip.name, image: detailsShip.image, description: detailsShip.description, schedules: detailsShip.schedules.filter((schedule) => schedule.date.startsWith(period)), rooms: detailsShip.rooms.map((room) => ({ id: room.id, name: room.name, oneWayPrice: money(room.oneWayPrice), roundTripPrice: money(room.roundTripPrice), note: room.note })), periods, selectedPeriod: period }} isOpen={Boolean(detailsShip)} initialTab={detailsInitialTab} onClose={() => setDetailsShip(null)} onChoose={() => chooseShip(detailsShip.id)} onPeriodChange={(value) => { setPeriod(value); setDepartureDate(''); setReturnDate('') }} returnFocusRef={detailsTriggerRef} />}
    {showFareChart && <FareChartModal ship={ship} onClose={() => setShowFareChart(false)} />}
    {shipTabModal && <ShipTabModal ship={ship} tab={shipTabModal} onClose={() => setShipTabModal(null)} />}
  </main>
}

export default function Page() {
  return <BookingPage />
}
