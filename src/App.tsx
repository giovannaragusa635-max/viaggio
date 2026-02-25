import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Map as MapIcon, 
  MapPin,
  Shield, 
  Users, 
  Utensils, 
  Navigation, 
  Camera, 
  AlertCircle, 
  Clock, 
  Euro,
  ChevronRight,
  Star,
  Zap,
  TrendingUp,
  Info,
  Bus,
  Heart,
  Calendar,
  Lightbulb,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Header, FeatureCard, BottomNav } from './components/UI';
import { 
  generateItinerary, 
  getSafetyHeatmap, 
  getLocalBites, 
  getSocialTours,
  getCityOverview
} from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [city, setCity] = useState('');
  const [hours, setHours] = useState(4);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  const suggestions = ['Roma', 'Parigi', 'Tokyo', 'New York', 'Londra', 'Barcellona', 'Berlino', 'Milano'];

  const handleAction = async (tab: string, targetCity?: string) => {
    const searchCity = targetCity || city;
    if (!searchCity) return;

    // If we are just going to the menu, no need to load data yet
    if (tab === 'menu') {
      setCity(searchCity);
      setActiveTab('menu');
      return;
    }

    setLoading(true);
    setActiveTab(tab);
    setSources([]);
    try {
      let response;
      switch (tab) {
        case 'overview-detail':
        case 'food-detail':
        case 'monuments-detail':
          // These all come from getCityOverview
          response = await getCityOverview(searchCity);
          break;
        case 'itinerary':
          response = await generateItinerary(searchCity, hours);
          break;
        case 'safety':
          response = await getSafetyHeatmap(searchCity);
          break;
        case 'bites':
          response = await getLocalBites(searchCity);
          break;
        case 'social':
          response = await getSocialTours(searchCity);
          break;
        default:
          response = null;
      }
      
      if (response) {
        setData(response.data);
        setSources(response.sources || []);
      }
    } catch (error) {
      console.error(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="w-16 h-16 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          <p className="text-xl font-display font-medium animate-pulse">Consultando i locali a {city}...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'explore':
        return (
          <motion.div 
            key="explore"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden h-[600px] flex items-center px-8 md:px-16">
              <img 
                src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1920`} 
                className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
                alt="Travel the world"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-10 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block px-4 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-sm font-bold mb-6 tracking-widest uppercase">
                    Il tuo compagno di viaggio globale
                  </span>
                  <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight">
                    Esplora <br />
                    <span className="gradient-text">qualsiasi città</span> <br />
                    nel mondo.
                  </h1>
                </motion.div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="glass flex items-center gap-3 px-6 py-5 rounded-2xl flex-1 border-white/10 focus-within:border-brand-primary/50 transition-all">
                    <Search className="text-brand-primary w-6 h-6" />
                    <input 
                      type="text" 
                      placeholder="Inserisci una città (es. Tokyo, Parigi, Roma...)" 
                      className="bg-transparent border-none outline-none w-full text-xl placeholder:text-white/30"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAction('menu')}
                    />
                  </div>
                  <button 
                    onClick={() => handleAction('menu')}
                    className="btn-primary flex items-center justify-center gap-3 min-w-[200px] text-lg py-5"
                  >
                    <Zap className="w-6 h-6" />
                    Inizia ora
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-white/40 text-sm font-medium mr-2">Suggerimenti:</span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleAction('menu', s)}
                      className="px-4 py-2 rounded-xl glass border-white/5 hover:border-brand-primary/30 hover:text-brand-primary transition-all text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-vibe p-8">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6">
                  <MapIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Copertura Globale</h3>
                <p className="text-white/60 leading-relaxed">Dalle metropoli ai piccoli borghi, la nostra AI conosce ogni angolo del pianeta.</p>
              </div>
              <div className="card-vibe p-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Sicurezza Real-time</h3>
                <p className="text-white/60 leading-relaxed">Analisi dei quartieri e consigli aggiornati per viaggiare senza pensieri.</p>
              </div>
              <div className="card-vibe p-8">
                <div className="w-12 h-12 rounded-xl bg-orange-400/10 text-orange-400 flex items-center justify-center mb-6">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Sapori Autentici</h3>
                <p className="text-white/60 leading-relaxed">Niente trappole per turisti. Solo i posti dove mangia la gente del posto.</p>
              </div>
            </section>
          </motion.div>
        );

      case 'menu':
        return (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <button onClick={() => setActiveTab('explore')} className="text-white/60 hover:text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 rotate-180" /> Indietro
              </button>
              <h2 className="text-4xl font-display font-bold">Esplora {city}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Heart} 
                title={`L'Anima di ${city}`} 
                description="Scopri le tradizioni, la storia e l'essenza profonda della città."
                color="brand-primary"
                onClick={() => handleAction('overview-detail')}
              />
              <FeatureCard 
                icon={Utensils} 
                title="Sapori e Piatti Tipici" 
                description="Tutti i piatti tradizionali, la loro storia e i posti migliori dove mangiarli."
                color="orange-400"
                onClick={() => handleAction('food-detail')}
              />
              <FeatureCard 
                icon={MapIcon} 
                title="Monumenti Imperdibili" 
                description="Punti di riferimento storici, come raggiungerli e costi d'ingresso."
                color="brand-secondary"
                onClick={() => handleAction('monuments-detail')}
              />
              <FeatureCard 
                icon={Clock} 
                title="Itinerario AI" 
                description="Il percorso perfetto ottimizzato per il tuo tempo a disposizione."
                color="indigo-400"
                onClick={() => handleAction('itinerary')}
              />
              <FeatureCard 
                icon={Shield} 
                title="Mappa Sicurezza" 
                description="Analisi dettagliata dei quartieri e consigli per un soggiorno sicuro."
                color="emerald-400"
                onClick={() => handleAction('safety')}
              />
              <FeatureCard 
                icon={TrendingUp} 
                title="StreetEats" 
                description="Posticini segreti per mangiare bene con meno di 15€."
                color="yellow-400"
                onClick={() => handleAction('bites')}
              />
            </div>
          </motion.div>
        );

      case 'overview-detail':
        return (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveTab('menu')} className="text-white/60 hover:text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 rotate-180" /> Torna al Menu
              </button>
              <h2 className="text-3xl font-display font-bold">L'Anima di {city}</h2>
            </div>
            
            <div className="space-y-8">
              <div className="card-vibe">
                <h3 className="text-2xl font-bold mb-6 text-brand-primary flex items-center gap-3">
                  <Heart className="w-6 h-6" /> Perché visitare {city}
                </h3>
                <div className="text-white/80 leading-relaxed text-lg space-y-4 whitespace-pre-line">
                  {data?.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-vibe">
                  <h3 className="text-lg font-bold mb-3 text-emerald-400 flex items-center gap-2">
                    <Bus className="w-5 h-5" /> Trasporti
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{data?.transportTips}</p>
                </div>
                <div className="card-vibe">
                  <h3 className="text-lg font-bold mb-3 text-purple-400 flex items-center gap-2">
                    <Heart className="w-5 h-5" /> Galateo Locale
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{data?.localEtiquette}</p>
                </div>
                <div className="card-vibe">
                  <h3 className="text-lg font-bold mb-3 text-brand-primary flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Periodo Migliore
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{data?.bestTime}</p>
                </div>
              </div>
            </div>

            {sources.length > 0 && (
              <div className="mt-12 p-6 rounded-2xl glass border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Fonti Verificate
                </h4>
                <div className="flex flex-wrap gap-3">
                  {sources.map((source, idx) => (
                    source?.uri && (
                      <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-brand-primary transition-colors">
                        {source.title || 'Fonte'}
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'food-detail':
        return (
          <motion.div key="food" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveTab('menu')} className="text-white/60 hover:text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 rotate-180" /> Torna al Menu
              </button>
              <h2 className="text-3xl font-display font-bold">Sapori e Piatti Tipici</h2>
            </div>

            <div className="space-y-8">
              {data?.typicalFoods?.map((food: any, idx: number) => (
                <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold text-orange-300">{food.name}</h4>
                    <span className="px-3 py-1 rounded-full bg-orange-400/10 text-orange-400 text-xs font-bold">Prezzo: {food.priceRange}</span>
                  </div>
                  <p className="text-white/80 text-lg mb-4 leading-relaxed">{food.description}</p>
                  
                  <div className="mb-6">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">La Storia</h5>
                    <p className="text-white/60 text-sm italic leading-relaxed">{food.history}</p>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Dove mangiarlo</h5>
                    <div className="flex flex-wrap gap-3">
                      {food.recommendedPlaces?.map((place: any, pIdx: number) => (
                        <a key={pIdx} href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-brand-primary/20 hover:border-brand-primary/50 border border-white/10 transition-all text-sm font-medium">
                          <MapPin className="w-4 h-4 text-brand-primary" />
                          {place.placeName}
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'monuments-detail':
        return (
          <motion.div key="monuments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveTab('menu')} className="text-white/60 hover:text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 rotate-180" /> Torna al Menu
              </button>
              <h2 className="text-3xl font-display font-bold">Monumenti Imperdibili</h2>
            </div>

            <div className="space-y-8">
              {data?.monuments?.map((monument: any, idx: number) => (
                <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold text-brand-secondary">{monument.name}</h4>
                    <span className="px-3 py-1 rounded-full bg-brand-secondary/10 text-brand-secondary text-xs font-bold">Ingresso: {monument.price}</span>
                  </div>
                  <p className="text-white/80 text-lg mb-4 leading-relaxed">{monument.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5">
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Perché visitarlo
                      </h5>
                      <p className="text-white/60 text-sm leading-relaxed">{monument.whyVisit}</p>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2 flex items-center gap-2">
                        <Bus className="w-4 h-4" /> Come arrivare
                      </h5>
                      <p className="text-white/60 text-sm leading-relaxed">{monument.transport}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'itinerary':
        return (
          <motion.div key="itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveTab('menu')} className="text-white/60 hover:text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 rotate-180" /> Torna al Menu
              </button>
              <h2 className="text-2xl font-display font-bold">Itinerario {hours}h a {city}</h2>
            </div>
            <div className="space-y-8">
              {data?.map((item: any, idx: number) => (
                <div key={idx} className="card-vibe flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center font-bold text-brand-primary shrink-0">{item.time}</div>
                    {idx !== data.length - 1 && <div className="w-px h-full bg-white/10 my-2" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{item.activity}</h3>
                    <p className="text-white/60 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> {item.location}</p>
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">{item.description}</p>
                    
                    <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                        <Info className="w-3 h-3" /> Storia & Cultura
                      </h4>
                      <p className="text-white/60 text-xs leading-relaxed italic">{item.historicalContext}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-brand-secondary">Est. {item.costEstimate}</span>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                        <Lightbulb className="w-3 h-3" /> {item.proTip}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
                        <Camera className="w-3 h-3" /> {item.bestPhotoSpot}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'safety':
        return (
          <motion.div key="safety" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveTab('menu')} className="text-white/60 hover:text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 rotate-180" /> Torna al Menu
              </button>
              <h2 className="text-2xl font-display font-bold">Mappa Sicurezza: {city}</h2>
            </div>
            <div className="grid gap-8">
              {data?.map((item: any, idx: number) => (
                <div key={idx} className="card-vibe">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{item.neighborhood}</h3>
                      <p className="text-white/60 text-sm italic">"{item.tip}"</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-400">{item.rating}/10</div>
                      <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Safety Score</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Safe Zones
                      </h4>
                      <p className="text-white/60 text-sm">{item.safeZones}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Caution Areas
                      </h4>
                      <p className="text-white/60 text-sm">{item.cautionAreas}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Common Scams
                      </h4>
                      <p className="text-white/60 text-sm">{item.commonScams}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Sicurezza Notturna
                      </h4>
                      <p className="text-white/60 text-sm">{item.nightSafety}</p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Emergenze
                      </h4>
                      <p className="text-white/60 text-sm">{item.emergencyInfo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'bites':
        return (
          <motion.div key="bites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveTab('menu')} className="text-white/60 hover:text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 rotate-180" /> Torna al Menu
              </button>
              <h2 className="text-2xl font-display font-bold">StreetEats a {city}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data?.map((item: any, idx: number) => (
                <div key={idx} className="card-vibe">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{item.name}</h3>
                    <span className="text-brand-primary font-bold">{item.price}</span>
                  </div>
                  <p className="text-brand-secondary font-bold text-sm mb-2">Da provare: {item.mustTry}</p>
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">{item.reason}</p>
                  
                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">La Storia del Piatto</h4>
                    <p className="text-white/60 text-xs leading-relaxed italic">{item.dishHistory}</p>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <a href={item.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-brand-primary hover:underline">
                      <MapPin className="w-4 h-4" /> {item.address}
                    </a>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <Clock className="w-4 h-4" /> {item.bestTime}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-brand-primary uppercase tracking-widest">
                      <Utensils className="w-4 h-4" /> {item.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'social':
        return (
          <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveTab('menu')} className="text-white/60 hover:text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 rotate-180" /> Torna al Menu
              </button>
              <h2 className="text-2xl font-display font-bold">Tour Sociali: {city}</h2>
            </div>
            <div className="space-y-8">
              {data?.map((item: any, idx: number) => (
                <div key={idx} className="card-vibe">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{item.activity}</h3>
                      <p className="text-brand-secondary text-sm font-medium uppercase tracking-widest">Vibe: {item.vibe}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-xl font-bold text-brand-primary">{item.totalCost}</div>
                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Costo Totale</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-brand-primary">{item.groupSize}</div>
                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Persone</div>
                      </div>
                      <button className="btn-primary py-3 px-8">Unisciti</button>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm mb-6 leading-relaxed">{item.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-brand-secondary" />
                      <div>
                        <div className="text-[10px] text-white/40 uppercase font-bold">Punto di Incontro</div>
                        <div className="text-sm text-white/70">{item.meetingPoint}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-brand-secondary" />
                      <div>
                        <div className="text-[10px] text-white/40 uppercase font-bold">Durata</div>
                        <div className="text-sm text-white/70">{item.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-brand-secondary" />
                      <div>
                        <div className="text-[10px] text-white/40 uppercase font-bold">Incluso</div>
                        <div className="text-sm text-white/70">{item.included}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-brand-secondary" />
                      <div>
                        <div className="text-[10px] text-white/40 uppercase font-bold">Cosa Portare</div>
                        <div className="text-sm text-white/70">{item.whatToBring}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 pt-20">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      <BottomNav />
      <button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20 z-40 md:bottom-8">
        <AlertCircle className="text-white w-7 h-7" />
      </button>
    </div>
  );
}
