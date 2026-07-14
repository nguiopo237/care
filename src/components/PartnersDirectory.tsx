import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  Tag, 
  ExternalLink, 
  Star, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Search,
  CheckCircle
} from "lucide-react";

export default function PartnersDirectory() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Tous les partenaires" },
    { id: "nutrition", label: "Nutritionnistes" },
    { id: "phytotherapy", label: "Herboristeries & Pharmacies" },
    { id: "organic", label: "Alimentation Bio" },
    { id: "wellness", label: "Médecine Douce" },
  ];

  const partners = [
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
      verified: true
    }
  ];

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
      <div className="relative overflow-hidden bg-[#064E3B] rounded-3xl p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-opacity-80">
            Réseau de Partenaires CEan'sCare
          </span>
          <h2 className="font-sans text-3xl font-bold mt-4 leading-tight">
            Prenez soin de vous avec nos professionnels certifiés
          </h2>
          <p className="text-emerald-100/90 text-sm mt-2 leading-relaxed">
            Profitez de réductions et d'avantages exclusifs chez nos nutritionnistes, herboristeries de confiance et fournisseurs d'alimentation biologique partenaires.
          </p>
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
                  ? "bg-[#064E3B] text-white shadow-sm"
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
            placeholder="Rechercher un partenaire, spécialité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#064E3B] shadow-sm"
          />
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((p) => (
          <div key={p.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              {/* Card Upper line */}
              <div className="flex justify-between items-start">
                <span className="bg-[#064E3B]/10 text-[#064E3B] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded">
                  {p.category === "nutrition" && "Nutrition"}
                  {p.category === "phytotherapy" && "Phytothérapie"}
                  {p.category === "organic" && "Alimentation Bio"}
                  {p.category === "wellness" && "Médecine Douce"}
                </span>
                <div className="flex items-center space-x-1 text-xs text-slate-500 font-bold">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span>{p.rating}</span>
                  <span className="text-[10px] text-slate-300 font-medium">({p.reviews})</span>
                </div>
              </div>

              {/* Verified badge + Name */}
              <div className="mt-4 flex items-center space-x-1.5">
                <h4 className="font-sans font-bold text-slate-800 text-base">{p.name}</h4>
                {p.verified && (
                  <div className="p-0.5 bg-blue-100 text-blue-600 rounded-full" title="Partenaire de confiance CEan'sCare">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <span className="text-xs text-slate-400 font-semibold block mt-0.5">{p.specialty}</span>
              
              <p className="text-slate-500 text-xs mt-3 leading-relaxed">{p.description}</p>
              
              <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-3 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>{p.location}</span>
              </div>

              {/* Exclusive promo widget */}
              <div className="mt-4 p-3 bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-100 rounded-2xl">
                <div className="flex items-center space-x-1 text-[10px] font-extrabold uppercase text-amber-700">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Avantage Membre</span>
                </div>
                <p className="text-slate-700 text-xs font-semibold mt-1">{p.benefit}</p>
                <div className="mt-2 text-[10px] font-mono bg-white border border-amber-200/50 text-slate-600 px-2 py-1 rounded w-fit uppercase font-bold tracking-wider">
                  Code : {p.promoCode}
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-50">
              <a 
                href={`tel:${p.phone}`}
                className="flex items-center justify-center space-x-1 px-3 py-2 border border-slate-100 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Téléphone</span>
              </a>
              <a 
                href={p.website}
                target="_blank"
                rel="noreferrer"
                id={`btn-visit-partner-${p.id}`}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-[#064E3B] hover:bg-[#043427] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>Visiter</span>
                <ExternalLink className="w-3 h-3 text-white" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
