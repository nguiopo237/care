import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Users, 
  MapPin, 
  Tag, 
  Star, 
  Phone, 
  ShieldCheck, 
  Search,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  Clock,
  Quote,
  CalendarDays,
  Sparkles,
  Award
} from "lucide-react";
import { Partner } from "../types";
import { formatDays, formatTime, getOpenStatus } from "../utils/hours";

interface PartnersDirectoryProps {
  onNavigate: (tab: string) => void;
}

// Photo with elegant gradient fallback when the image can't load
function PartnerPhoto({ src, alt, className, fallbackClass }: { src: string; alt: string; className: string; fallbackClass?: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`${className} ${fallbackClass || "bg-gradient-to-br from-[#14cec3] to-[#0fb3a9]"} flex items-center justify-center`}>
        <span className="text-white font-bold text-4xl">{alt.charAt(0).toUpperCase()}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setError(true)} className={className} />;
}

export default function PartnersDirectory({ onNavigate }: PartnersDirectoryProps) {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const locale = i18n.language.substring(0, 2);

  const categories = [
    { id: "all", label: t("partners.filterAll") },
    { id: "nutrition", label: t("partners.filterNutrition") },
    { id: "phytotherapy", label: t("partners.filterPhyto") },
    { id: "organic", label: t("partners.filterOrganic") },
    { id: "wellness", label: t("partners.filterWellness") },
  ];

  const partners: Partner[] = [
    {
      id: 1,
      name: "Dr. Eliane Kouamé",
      category: "nutrition",
      specialty: "Diététicienne Clinicienne & Micronutrition",
      rating: 4.9,
      reviews: 142,
      location: "Paris 11e & Téléconsultation",
      description: "Spécialisée dans la conception de régimes alimentaires pour pathologies chroniques et rééquilibrage métabolique global.",
      promoCode: "CEAN_NUTRITION10",
      benefit: "-10% sur votre première consultation vidéo",
      phone: "+33 1 45 67 89 12",
      website: "https://example.com/dr-kouame",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      hours: [
        { days: [1, 2, 3, 4, 5], open: "08:00", close: "18:00" },
        { days: [6], open: "09:00", close: "13:00" },
      ],
      verified: true
    },
    {
      id: 2,
      name: "L'Herboristerie du Grand Jardin",
      category: "phytotherapy",
      specialty: "Tisanes Thérapeutiques & Huiles Essentielles",
      rating: 4.8,
      reviews: 98,
      location: "Lyon 2e & Livraison France",
      description: "Sélection rigoureuse de plantes médicinales sauvages et bio pour soutenir l'organisme et lutter contre l'anxiété.",
      promoCode: "CEANS_PLANTES15",
      benefit: "-15% sur tout l'e-shop (Code à insérer au panier)",
      phone: "+33 4 72 34 56 78",
      website: "https://example.com/grand-jardin",
      photo: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=60",
      hours: [
        { days: [2, 3, 4, 5, 6], open: "09:30", close: "19:00" },
        { days: [0], open: "10:00", close: "13:00" },
      ],
      verified: true
    },
    {
      id: 3,
      name: "BioNaturel Express",
      category: "organic",
      specialty: "Paniers de Légumes de Saison & Superaliments",
      rating: 4.7,
      reviews: 320,
      location: "Livraison à domicile nationale",
      description: "Paniers maraîchers direct producteurs, superaliments bio (spiruline, baies de goji, graines de chia) de qualité premium.",
      promoCode: "CEAN_BIOFRUIT",
      benefit: "Livraison offerte + 1 sachet de graines de chia bio",
      phone: "+33 800 900 123",
      website: "https://example.com/bionaturel",
      photo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=60",
      hours: [
        { days: [1, 2, 3, 4, 5, 6], open: "07:00", close: "20:00" },
      ],
      verified: true
    },
    {
      id: 4,
      name: "Sophie Masson",
      category: "wellness",
      specialty: "Naturopathe & Réflexologue Plautaire",
      rating: 4.9,
      reviews: 76,
      location: "Marseille 6e & Téléconsultation",
      description: "Bilan vital complet, gestion naturelle de la tension artérielle, du stress, et de la fatigue chronique par la phytothérapie.",
      promoCode: "CEAN_NATURO15",
      benefit: "Bilan vital naturopathique à 65€ au lieu de 80€",
      phone: "+33 6 12 34 56 78",
      website: "https://example.com/sophie-naturopathe",
      photo: "https://randomuser.me/api/portraits/women/65.jpg",
      hours: [
        { days: [1, 2, 3, 4, 5], open: "09:00", close: "17:00" },
        { days: [6], open: "09:00", close: "12:00" },
      ],
      verified: true
    },
    {
      id: 5,
      name: "La Pharmacie Verte",
      category: "phytotherapy",
      specialty: "Homéopathie & Phytothérapie Clinique",
      rating: 4.6,
      reviews: 215,
      location: "Bordeaux Centre",
      description: "Une pharmacie conventionnelle avec un pôle d'excellence en médecine douce, oligo-éléments et préparations magistrales d'herbes.",
      promoCode: "CEAN_PHARMA",
      benefit: "-10% sur les rayons compléments alimentaires & herbes",
      phone: "+33 5 56 78 90 12",
      website: "https://example.com/pharma-verte",
      photo: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=60",
      hours: [
        { days: [1, 2, 3, 4, 5, 6], open: "08:30", close: "20:00" },
        { days: [0], open: "09:00", close: "12:30" },
      ],
      verified: false
    },
    {
      id: 6,
      name: "L'Atelier du Levain",
      category: "organic",
      specialty: "Boulangerie Bio & Sans Gluten Artisanale",
      rating: 4.9,
      reviews: 184,
      location: "Nantes Centre",
      description: "Pains bio au levain naturel à fermentation longue, pâtisseries sans gluten à index glycémique bas, idéal pour la digestion.",
      promoCode: "CEAN_LEVAIN5",
      benefit: "1 baguette sans gluten offerte dès 12€ d'achat",
      phone: "+33 2 40 12 34 56",
      website: "https://example.com/atelier-levain",
      photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=60",
      hours: [
        { days: [2, 3, 4, 5, 6], open: "07:00", close: "19:00" },
        { days: [0], open: "07:00", close: "13:00" },
      ],
      verified: true
    }
  ];

  // ------------------- PARTNER DETAIL VIEW -------------------
  if (selectedPartner) {
    const p = selectedPartner;
    const services = t(`partners.detail.services.${p.category}`, { returnObjects: true }) as string[];
    const testimonials = [
      t("partners.detail.testimonial1", { name: p.name }),
      t("partners.detail.testimonial2", { name: p.name }),
      t("partners.detail.testimonial3", { name: p.name }),
    ];
    const { openToday, openNow } = getOpenStatus(p.hours);
    // Practitioners get a circular portrait; businesses get a wide photo banner
    const isPractitioner = p.category === "nutrition" || p.category === "wellness";

    const headerInfo = (
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#14cec3]/20 text-[#14cec3] border border-[#14cec3]/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-opacity-80">
            {p.category === "nutrition" && t("partners.categoryNutrition")}
            {p.category === "phytotherapy" && t("partners.categoryPhyto")}
            {p.category === "organic" && t("partners.categoryOrganic")}
            {p.category === "wellness" && t("partners.categoryWellness")}
          </span>
          {p.verified && (
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-teal-200/20 border border-teal-200/30 text-[10px] font-bold text-teal-100">
              <ShieldCheck className="w-3 h-3" />
              <span>{t("partners.detail.verifiedBy")}</span>
            </span>
          )}
        </div>
        <h2 className="font-sans text-2xl sm:text-3xl font-bold mt-3 leading-tight truncate">{p.name}</h2>
        <p className="text-teal-100/90 text-sm mt-1">{p.specialty}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-teal-100/90">
          <span className="flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span className="font-bold text-white">{p.rating}</span>
            <span className="text-teal-200/80">({p.reviews})</span>
          </span>
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{p.location}</span>
          </span>
        </div>
      </div>
    );

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Back button */}
        <button
          onClick={() => setSelectedPartner(null)}
          className="flex items-center space-x-1.5 text-xs font-semibold text-[#0fb3a9] hover:text-[#0d9488] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("partners.detail.back")}</span>
        </button>

        {/* Partner header with real photo */}
        <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 text-white">
          {isPractitioner ? (
            <div className="bg-[#0fb3a9] p-6 sm:p-8">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                <PartnerPhoto
                  src={p.photo}
                  alt={p.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white/30 shadow-lg shrink-0"
                />
                {headerInfo}
              </div>
            </div>
          ) : (
            <>
              <PartnerPhoto
                src={p.photo}
                alt={p.name}
                className="w-full h-52 sm:h-72 object-cover"
                fallbackClass="bg-gradient-to-br from-[#14cec3] to-[#0fb3a9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                {headerInfo}
              </div>
            </>
          )}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 blur-2xl rounded-full pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-sans font-bold text-lg text-[#0fb3a9] mb-3 flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#14cec3]" />
                <span>{t("partners.detail.about")}</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{p.description}</p>
              {p.verified && (
                <div className="mt-4 flex items-start space-x-2 p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 text-xs">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{t("partners.detail.verifiedBy")}</span>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-sans font-bold text-lg text-[#0fb3a9] mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#14cec3]" />
                <span>{t("partners.detail.services")}</span>
              </h3>
              <div className="space-y-3">
                {services.map((service, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-1.5 rounded-full bg-[#14cec3] text-white shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{service}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-sans font-bold text-lg text-[#0fb3a9] mb-4 flex items-center space-x-2">
                <Quote className="w-5 h-5 text-[#14cec3]" />
                <span>{t("partners.detail.testimonials")}</span>
              </h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Quote className="w-4 h-4 text-[#14cec3]/40 mb-2" />
                    <p className="text-sm text-slate-600 italic leading-relaxed">{testimonial}</p>
                    <div className="flex items-center space-x-0.5 mt-3">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real opening hours */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-sans font-bold text-lg text-[#0fb3a9] flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#14cec3]" />
                  <span>{t("partners.detail.hours")}</span>
                </h3>
                {openNow ? (
                  <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse inline-block"></span>
                    <span>{t("partners.detail.openNow")}</span>
                  </span>
                ) : (
                  <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    openToday ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${openToday ? "bg-red-400" : "bg-slate-400"}`}></span>
                    <span>{openToday ? t("partners.detail.closedNow") : t("partners.detail.closedToday")}</span>
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {p.hours.map((h, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-semibold text-slate-700">{formatDays(locale, h.days)}</span>
                    <span className="text-sm text-slate-500 font-medium">
                      {formatTime(locale, h.open)} – {formatTime(locale, h.close)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exclusive promo */}
            <div className="bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-100 p-6 rounded-3xl">
              <div className="flex items-center space-x-1.5 text-[10px] font-extrabold uppercase text-amber-700 mb-3">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>{t("partners.memberBenefit")}</span>
              </div>
              <p className="text-slate-700 text-sm font-semibold leading-relaxed">{p.benefit}</p>
              <div className="mt-3 text-xs font-mono bg-white border border-amber-200/50 text-slate-600 px-3 py-2 rounded-xl w-fit uppercase font-bold tracking-wider">
                {t("partners.code", { code: p.promoCode })}
              </div>
            </div>

            {/* Book a consultation */}
            <div className="bg-[#0fb3a9] text-white p-6 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <CalendarDays className="w-8 h-8 text-teal-200 mb-4" />
                <h4 className="font-sans font-bold text-lg text-white">{t("partners.detail.bookNow")}</h4>
                <p className="text-teal-100/90 text-xs mt-2 leading-relaxed">{t("partners.detail.bookDesc")}</p>
                <button
                  onClick={() => onNavigate("teleconsultation")}
                  className="mt-5 w-full py-3 bg-white text-[#0fb3a9] hover:bg-slate-100 font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{t("partners.detail.bookNow")}</span>
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 blur-2xl rounded-full"></div>
            </div>

            {/* Direct contact */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h4 className="font-sans font-bold text-base text-slate-800 mb-4">{t("partners.detail.contact")}</h4>
              <a
                href={`tel:${p.phone}`}
                className="flex items-center justify-center space-x-2 w-full py-2.5 border border-slate-100 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#0fb3a9]" />
                <span>{t("partners.detail.call")} — {p.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- DIRECTORY LIST VIEW -------------------
  const filteredPartners = partners.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.category === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Network Header Banner */}
      <div className="relative overflow-hidden bg-[#0fb3a9] rounded-3xl p-6 sm:p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-[#14cec3]/20 text-[#14cec3] border border-[#14cec3]/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-opacity-80">
            {t("partners.badge")}
          </span>
          <h2 className="font-sans text-3xl font-bold mt-4 leading-tight">{t("partners.title")}</h2>
          <p className="text-teal-100/90 text-sm mt-2 leading-relaxed">{t("partners.desc")}</p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 blur-2xl rounded-full"></div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Categories Tab Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? "bg-[#0fb3a9] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("partners.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] shadow-sm"
          />
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((p) => {
          const { openToday, openNow } = getOpenStatus(p.hours);
          return (
          <div key={p.id} className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all overflow-hidden">
            {/* Photo header with category + open/closed badges */}
            <div>
              <div className="relative h-32 sm:h-36">
                <PartnerPhoto
                  src={p.photo}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  fallbackClass="bg-gradient-to-br from-[#14cec3] to-[#0fb3a9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#0fb3a9] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-sm">
                  {p.category === "nutrition" && t("partners.categoryNutrition")}
                  {p.category === "phytotherapy" && t("partners.categoryPhyto")}
                  {p.category === "organic" && t("partners.categoryOrganic")}
                  {p.category === "wellness" && t("partners.categoryWellness")}
                </span>
                <span
                  className={`absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide shadow-sm backdrop-blur ${
                    openNow
                      ? "bg-teal-500/95 text-white"
                      : openToday
                        ? "bg-white/90 text-red-600"
                        : "bg-white/90 text-slate-500"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${openNow ? "bg-white animate-pulse" : openToday ? "bg-red-400" : "bg-slate-400"}`}></span>
                  <span>
                    {openNow
                      ? t("partners.detail.openNow")
                      : openToday
                        ? t("partners.detail.closedNow")
                        : t("partners.detail.closedToday")}
                  </span>
                </span>
              </div>

              <div className="p-6">
                {/* Name + rating */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <h4 className="font-sans font-bold text-slate-800 text-base truncate">{p.name}</h4>
                    {p.verified && (
                      <div className="p-0.5 bg-blue-100 text-blue-600 rounded-full shrink-0" title={t("partners.verified")}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{p.rating}</span>
                    <span className="text-[10px] text-slate-300 font-medium">({p.reviews})</span>
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-semibold block mt-0.5">{p.specialty}</span>
                
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">{p.description}</p>
                
                <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-3 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#0fb3a9]" />
                  <span>{p.location}</span>
                </div>

                {/* Exclusive promo widget */}
                <div className="mt-4 p-3 bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-100 rounded-2xl">
                  <div className="flex items-center space-x-1 text-[10px] font-extrabold uppercase text-amber-700">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t("partners.memberBenefit")}</span>
                  </div>
                  <p className="text-slate-700 text-xs font-semibold mt-1">{p.benefit}</p>
                  <div className="mt-2 text-[10px] font-mono bg-white border border-amber-200/50 text-slate-600 px-2 py-1 rounded w-fit uppercase font-bold tracking-wider">
                    {t("partners.code", { code: p.promoCode })}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <a 
                href={`tel:${p.phone}`}
                className="flex items-center justify-center space-x-1 px-3 py-2 border border-slate-100 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{t("partners.phone")}</span>
              </a>
              <button
                onClick={() => setSelectedPartner(p)}
                id={`btn-visit-partner-${p.id}`}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>{t("partners.visit")}</span>
                <ChevronRight className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
          );
        })}
      </div>

    </div>
  );
}
