import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateItinerary = async (city: string, hours: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Crea un itinerario di ${hours} ore estremamente dettagliato e ottimizzato per ${city}. 
    Rispondi in ITALIANO.
    Per ogni tappa, fornisci:
    - 'time': Fascia oraria specifica
    - 'activity': Nome accattivante dell'attività
    - 'location': Indirizzo specifico o punto di riferimento
    - 'description': Descrizione approfondita di cosa fare e perché è speciale
    - 'historicalContext': Breve storia o significato culturale del luogo
    - 'costEstimate': Prezzo realistico in valuta locale
    - 'proTip': Un trucco locale segreto per migliorare l'esperienza
    - 'bestPhotoSpot': Dove scattare la foto migliore
    Formatta come un array JSON di oggetti.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            activity: { type: Type.STRING },
            location: { type: Type.STRING },
            description: { type: Type.STRING },
            historicalContext: { type: Type.STRING },
            costEstimate: { type: Type.STRING },
            proTip: { type: Type.STRING },
            bestPhotoSpot: { type: Type.STRING }
          },
          required: ["time", "activity", "location", "description", "historicalContext", "costEstimate", "proTip", "bestPhotoSpot"]
        }
      }
    }
  });

  return {
    data: JSON.parse(response.text || "[]"),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || []
  };
};

export const getSafetyHeatmap = async (city: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Fornisci un'analisi estremamente approfondita della sicurezza e dei quartieri per ${city}. 
    Rispondi in ITALIANO.
    Per ogni quartiere principale, includi:
    - 'neighborhood': Nome dell'area
    - 'rating': Punteggio di sicurezza da 1 a 10
    - 'tip': Un breve riassunto dell'atmosfera ("vibe")
    - 'safeZones': Strade o punti specifici molto sicuri
    - 'cautionAreas': Punti specifici da evitare o dove fare attenzione
    - 'commonScams': Descrizioni dettagliate delle truffe locali
    - 'nightSafety': Consigli specifici per le ore notturne
    - 'emergencyInfo': Informazioni sull'ospedale o la stazione di polizia più vicina per quell'area
    Formatta come un array JSON di oggetti.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            neighborhood: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            tip: { type: Type.STRING },
            safeZones: { type: Type.STRING },
            cautionAreas: { type: Type.STRING },
            commonScams: { type: Type.STRING },
            nightSafety: { type: Type.STRING },
            emergencyInfo: { type: Type.STRING }
          },
          required: ["neighborhood", "rating", "tip", "safeZones", "cautionAreas", "commonScams", "nightSafety", "emergencyInfo"]
        }
      }
    }
  });

  return {
    data: JSON.parse(response.text || "[]"),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || []
  };
};

export const getLocalBites = async (city: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Trova i 'StreetEats' più autentici e non turistici a ${city} dove i locali mangiano con meno di 15€. 
    Rispondi in ITALIANO.
    Per ogni posto, fornisci:
    - 'name': Nome del locale
    - 'price': Prezzo tipico per un pasto
    - 'mustTry': Il piatto specifico da ordinare
    - 'dishHistory': La storia dietro quel piatto specifico
    - 'reason': Perché i locali amano questo posto
    - 'address': Indirizzo completo
    - 'mapsUrl': Link diretto a Google Maps
    - 'bestTime': Quando visitare per evitare la folla
    - 'type': Categoria (es. Panificio, Chiosco, Trattoria)
    Formatta come un array JSON di oggetti.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.STRING },
            mustTry: { type: Type.STRING },
            dishHistory: { type: Type.STRING },
            reason: { type: Type.STRING },
            address: { type: Type.STRING },
            mapsUrl: { type: Type.STRING },
            bestTime: { type: Type.STRING },
            type: { type: Type.STRING }
          },
          required: ["name", "price", "mustTry", "dishHistory", "reason", "address", "mapsUrl", "bestTime", "type"]
        }
      }
    }
  });

  return {
    data: JSON.parse(response.text || "[]"),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || []
  };
};

export const getSocialTours = async (city: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Trova tour sociali o attività di gruppo reali e vivaci a ${city}. 
    Rispondi in ITALIANO.
    Per ognuno, fornisci:
    - 'activity': Nome del tour/attività
    - 'vibe': Atmosfera sociale (es. Festa, Culturale, Relax)
    - 'description': Descrizione approfondita dell'esperienza
    - 'totalCost': Prezzo per persona
    - 'groupSize': Numero tipico di persone
    - 'meetingPoint': Punto di incontro specifico
    - 'duration': Quanto dura
    - 'included': Cosa è incluso nel prezzo
    - 'whatToBring': Articoli essenziali per l'ospite
    Formatta come un array JSON di oggetti.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            activity: { type: Type.STRING },
            vibe: { type: Type.STRING },
            description: { type: Type.STRING },
            totalCost: { type: Type.STRING },
            groupSize: { type: Type.STRING },
            meetingPoint: { type: Type.STRING },
            duration: { type: Type.STRING },
            included: { type: Type.STRING },
            whatToBring: { type: Type.STRING }
          },
          required: ["activity", "vibe", "description", "totalCost", "groupSize", "meetingPoint", "duration", "included", "whatToBring"]
        }
      }
    }
  });

  return {
    data: JSON.parse(response.text || "[]"),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || []
  };
};

export const getCityOverview = async (city: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Fornisci una guida di viaggio estremamente completa e persuasiva per ${city}. 
    Rispondi in ITALIANO.
    Includi:
    1. 'description': Una descrizione persuasiva di più paragrafi che motivi il lettore a visitare la città. Descrivi l'anima unica della città, le tradizioni profonde e perché è una destinazione imperdibile.
    2. 'typicalFoods': Un elenco dettagliato di piatti tipici. Per ogni piatto includi:
       - 'name': Nome del piatto
       - 'description': Descrizione dettagliata del piatto
       - 'history': L'origine storica e la storia del piatto
       - 'priceRange': Prezzo indicativo
       - 'recommendedPlaces': Un elenco di 2-3 ristoranti o locali reali ed esistenti dove è possibile mangiare questo piatto. Per ogni posto includi:
         - 'placeName': Nome del ristorante
         - 'mapsUrl': Un URL di ricerca diretto su Google Maps per questo specifico ristorante a ${city}
    3. 'monuments': Un elenco dettagliato di monumenti e punti di riferimento imperdibili. Per ognuno includi:
       - 'name': Nome del monumento
       - 'description': Descrizione dettagliata e significato
       - 'whyVisit': Ragioni persuasive per cui un viaggiatore dovrebbe visitare questo posto
       - 'transport': I migliori mezzi pubblici o metodi per raggiungerlo
       - 'price': Prezzo indicativo del biglietto d'ingresso o costo
    4. 'transportTips': Informazioni approfondite sui trasporti pubblici, costi nascosti e i modi migliori per risparmiare.
    5. 'localEtiquette': Norme culturali complete, inclusi mance, norme sociali ed errori comuni.
    6. 'bestTime': Suddivisione dettagliata delle stagioni, festival specifici e i mesi migliori per diversi tipi di viaggiatori.
    7. 'hiddenGems': Un elenco di 3-5 posti che NON sono trappole per turisti ma sono essenziali per l'esperienza locale.
    Formatta come un oggetto JSON con queste chiavi.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          typicalFoods: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                history: { type: Type.STRING },
                priceRange: { type: Type.STRING },
                recommendedPlaces: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      placeName: { type: Type.STRING },
                      mapsUrl: { type: Type.STRING }
                    },
                    required: ["placeName", "mapsUrl"]
                  }
                }
              },
              required: ["name", "description", "history", "priceRange", "recommendedPlaces"]
            } 
          },
          monuments: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                whyVisit: { type: Type.STRING },
                transport: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["name", "description", "whyVisit", "transport", "price"]
            } 
          },
          transportTips: { type: Type.STRING },
          localEtiquette: { type: Type.STRING },
          bestTime: { type: Type.STRING },
          hiddenGems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "description"]
            }
          }
        },
        required: ["description", "typicalFoods", "monuments", "transportTips", "localEtiquette", "bestTime", "hiddenGems"]
      }
    }
  });

  return {
    data: JSON.parse(response.text || "{}"),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || []
  };
};
