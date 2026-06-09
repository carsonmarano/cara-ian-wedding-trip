import { useState, useEffect, useRef } from "react";

// ─── COLOUR TOKENS ───────────────────────────────────────────────────────────
const C = {
  gold: "#C9A84C", goldLight: "#F0DFA0",
  ink: "#1A1A1A", inkMuted: "#5A5A5A", inkFaint: "#9A9A9A",
  cream: "#FAFAF7", creamBorder: "#E8E5DC",
  milan: "#B04A2A", como: "#2A6B8A", wengen: "#2A5C3A", nice: "#7B3FA0",
  badge: "#F5F2EC",
  custom: "#1A6B8A",
};

const DEST_COLOR = { milan: C.milan, como: C.como, wengen: C.wengen, nice: C.nice, transit: C.wengen, departure: "#444" };

// ─── STATIC ITINERARY DATA ────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "milan", label: "Milan", color: C.milan, emoji: "🇮🇹",
    dates: "Jun 11–12 · 10 people · Hotel Sanpi",
    coords: { lat: 45.46, lon: 9.19 }, range: { start: "2026-06-11", end: "2026-06-12" },
    days: [
      {
        id: "milan-jun11", date: "2026-06-11", badge: "Jun 11", title: "Thursday — One Full Day in Milan",
        subtitle: "10 people · Duomo is a must · Choose your scenario below",
        scenarios: [
          {
            key: "a", label: "Option A — Rooms Ready on Arrival (~1 PM)",
            note: "Rooms are ready when you arrive — rest first, then a focused afternoon and evening.",
            items: [
              { id: "ma1", time: "~11:00 AM", title: "Arrive MXP → Car Service to Hotel Sanpi (~45–55 min)", desc: "Route via A8/A4 highway. Arrive hotel ~12:00–1:00 PM.", primary: false },
              { id: "ma2", time: "~1:00 PM", title: "Check In + Rest (1.5–2 hours)", desc: "Rooms ready. Drop bags, shower, rest. After a transatlantic flight this window is essential. Some may nap; others grab a coffee nearby.", primary: true },
              { id: "ma3", time: "2:30 PM", title: "☕ Late Lunch Near Hotel", desc: "Light Italian lunch within walking distance of Hotel Sanpi in Porta Venezia — pasta, pizza al taglio, tramezzini.", primary: false },
              { id: "ma4", time: "3:30 PM", title: "Metro M1: Porta Venezia → Duomo (3 stops, ~8 min)", desc: "Walk 5 min to Porta Venezia M1. Book Duomo terrace tickets online before the trip to skip queues for 10 people.", primary: false },
              { id: "ma5", time: "3:45 PM", title: "⚠️ Duomo di Milano — Cathedral & Rooftop Terraces", desc: "THE MUST. Terraces close 7pm Thursday — arrive by 5:30pm latest. Cathedral last entry 6:10pm. Cathedral ~€5 · Terrace by lift ~€15. Allow 1.5–2 hrs.", primary: true },
              { id: "ma6", time: "5:30 PM", title: "🎨 Pinacoteca Ambrosiana — Small Subgroup (1–3 people)", desc: "5-min walk from Duomo. Closes 6pm (last entry 5:30pm) — tight in this scenario. 1–3 people who most want it go directly from the Duomo while the rest explore the Galleria. ~€15 pp + ~€8 pp Crypt. ⚠️ Check ambrosiana.midaticket.com.", primary: false },
              { id: "ma7", time: "5:30 PM", title: "Galleria Vittorio Emanuele II + Piazza della Scala (Rest of Group)", desc: "Walk through the magnificent 19th-century iron-and-glass arcade (free). Continue to Piazza della Scala and La Scala opera house. Regroup with the Ambrosiana subgroup at 6:15pm.", primary: false },
              { id: "ma8", time: "7:00 PM", title: "🍷 Aperitivo: Navigli Canal District", desc: "Taxi or Tram 2 south (~25 min). 7–9pm aperitivo hour — outdoor canal seating in June is exceptional. Negroni, Aperol Spritz, bar snacks included.", primary: true },
              { id: "ma9", time: "8:30 PM", title: "🕯️ Dinner: Trattoria Madonnina or L'Antico Ristorante Boeucc", desc: "Trattoria Madonnina — Local, lively, generous. Where Milanese actually eat. Reservation Suggested for 10. €–€€\nBoeucc (1696, Piazza Belgioioso 2) — Milan's oldest restaurant. Reservation Required. €€€€", primary: true },
              { id: "ma10", time: "After Dinner", title: "Navigli Bars or Blue Note Jazz Club (Isola district)", desc: "Remain in Navigli for canal-side bars, or taxi to Blue Note Milano — one of Europe's top jazz venues. Book Blue Note in advance.", primary: false },
            ]
          },
          {
            key: "b", label: "Option B — Rooms Ready at ~4 PM",
            note: "Rooms aren't ready until 4 PM — store bags at the hotel and use the full afternoon out. This is the better window for the Ambrosiana.",
            items: [
              { id: "mb1", time: "~11:00 AM", title: "Arrive MXP → Car Service to Hotel Sanpi (~45–55 min)", desc: "Route via A8/A4. Arrive hotel ~1:00 PM.", primary: false },
              { id: "mb2", time: "~1:00 PM", title: "Store Bags with Concierge → Head Out", desc: "Standard practice — hotel stores luggage securely. Freshen up in lobby if possible, then head out immediately.", primary: true },
              { id: "mb3", time: "1:30 PM", title: "☕ Lunch: Pasticceria Marchesi or Local Café", desc: "Pasticceria Marchesi (Via Santa Maria alla Porta 11a, since 1824) near the Duomo — exceptional cornetti and pasticcini. Or a quick café near Hotel Sanpi in Porta Venezia.", primary: false },
              { id: "mb4", time: "2:30 PM", title: "🎨 Pinacoteca Ambrosiana + Crypt — Full Group (~1.5 hrs)", desc: "IDEAL WINDOW. Metro M1 → Duomo (8 min), 5-min walk to Piazza Pio XI 2. 3 full hours before the 6pm close — no rush. Leonardo's Codex Atlanticus, Caravaggio's Basket of Fruit, Raphael's School of Athens cartoon. The Crypt descends into the ancient Roman forum of Mediolanum. ~€15 pp + ~€8 pp Crypt. ⚠️ Check ambrosiana.midaticket.com.", primary: true },
              { id: "mb5", time: "4:00 PM", title: "⚠️ Duomo di Milano — Cathedral & Rooftop Terraces", desc: "THE MUST. 5-min walk from the Ambrosiana. Terraces close 7pm Thursday — arrive by 5:30pm. Cathedral last entry 6:10pm. Pre-book tickets. Allow 1.5 hrs.", primary: true },
              { id: "mb6", time: "5:45 PM", title: "Galleria Vittorio Emanuele II + Quick Brera Walk", desc: "Walk through the iconic arcade (free). Head north to Brera for 30 min — cobbled streets, independent boutiques, a coffee stop.", primary: false },
              { id: "mb7", time: "6:30 PM", title: "Return to Hotel Sanpi — Check In + Freshen Up (1 hour)", desc: "Metro M1 back to Porta Venezia (8 min). Rooms now ready. Check in, drop bags, shower before dinner.", primary: false },
              { id: "mb8", time: "7:30 PM", title: "🍷 Aperitivo: Brera or Porta Venezia Area", desc: "Given the later timeline, do aperitivo locally — Brera wine bars (~10-min walk from hotel) or the lively Porta Venezia bar strip. Save Navigli for post-dinner if energy allows.", primary: true },
              { id: "mb9", time: "8:30 PM", title: "🕯️ Dinner: Nerino Dieci Trattoria or Trattoria Madonnina", desc: "Nerino Dieci (Via Nerino 10): Authentic Milanese, risotto alla Milanese, mussels. Trip.com 2025 Global 100 #3 locally. Reservation Suggested for 10. €€\nTrattoria Madonnina: Lively, generous, local. Reservation Suggested. €–€€", primary: true },
              { id: "mb10", time: "After Dinner", title: "Navigli Evening Walk or Local Bars (Optional)", desc: "If the group has post-transatlantic energy, taxi to Navigli for canal-side drinks. Otherwise the Porta Venezia bar strip near the hotel works perfectly.", primary: false },
            ]
          }
        ]
      },
      {
        id: "milan-jun12", date: "2026-06-12", badge: "Jun 12", title: "Friday — Morning in Milan → Taxi to Malgrate",
        subtitle: "Check out · Optional quick shop · Taxi departs ~10–11am",
        items: [
          { id: "m11", time: "8:00 AM", title: "Breakfast at Hotel Sanpi + Checkout", desc: "Highly praised hotel breakfast. Check out, store bags with concierge if doing a morning activity. Book taxi/minivan the evening before.", primary: false },
          { id: "m12", time: "9:00 AM (Optional)", title: "Corso Buenos Aires — Quick Morning Shop (10-min walk)", desc: "Milan's longest retail strip is around the corner — last chance for mid-range Italian shopping.", primary: false },
          { id: "m13", time: "~10:00–11:00 AM", title: "🚕 Taxi Departs for Malgrate (~55 km, ~1 hour)", desc: "2–3 taxis or one minivan for 10 people. SS36 lakeside approach offers your first dramatic view of Lake Como. Estimated arrival Hotel Promessi Sposi: ~12:00–1:00 PM.", primary: true },
        ]
      }
    ]
  },
  {
    id: "como", label: "Lake Como", color: C.como, emoji: "🏔",
    dates: "Jun 12–16 · 10 people · Hotel Promessi Sposi",
    coords: { lat: 45.85, lon: 9.38 }, range: { start: "2026-06-12", end: "2026-06-16" },
    days: [
      {
        id: "como-jun12", date: "2026-06-12", badge: "Jun 12", title: "Friday — Arrival (~1 PM)",
        subtitle: "Afternoon at leisure · Easy dinner locally",
        items: [
          { id: "c1", time: "~1:00 PM", title: "Check in — Hotel Promessi Sposi", desc: "Drop bags. Step outside and feel the contrast with Milan — mountains, still water, total quiet.", primary: true },
          { id: "c2", time: "1:30 PM", title: "🍝 Lunch: Soqquadro Malgrate or Ristorante Da Giovannino", desc: "Soqquadro (lakefront): Outstanding creative pizza, lake views, casual — walk-in fine.\nDa Giovannino (central village): Seasonal Italian with local lake fish, more refined. Reservation Suggested.", primary: true },
          { id: "c3", time: "3:00 PM", title: "Il Lungolago — Malgrate Waterfront Promenade", desc: "Flat, beautiful, effortless. Modern sculptures, shaded trees, mountain panorama. More intimate than Lecco's waterfront. 45–60 min.", primary: false },
          { id: "c4", time: "4:30 PM", title: "Lido di Malgrate / SUP Boards — or — Walk to Lecco", desc: "Waterfront bike shop rents SUP boards and bikes. Or stroll across the 10-min bridge to Lecco for a gelato and lakeside wander.", primary: false },
          { id: "c5", time: "7:30 PM", title: "🕯️ Dinner: Griso Panorama (Malgrate)", desc: "Hotel-based restaurant in Malgrate. Sweeping lake terrace views. Reservation Required. €€€", primary: true },
        ]
      },
      {
        id: "como-jun13", date: "2026-06-13", badge: "Jun 13", title: "Saturday — Bellagio via D110 Bus + Rehearsal Dinner 💒",
        subtitle: "Must return to Malgrate by 6 PM · Ferry not needed · D110 bus is the plan",
        items: [
          { id: "c6", time: "7:30 AM", title: "Early Hotel Breakfast", desc: "Buy bus tickets at a tabaccheria before heading to the stop. Ask hotel staff for the exact Malgrate D110 stop location on Via Italia.", primary: false },
          { id: "c7", time: "~8:45–9:00 AM", title: "Walk to D110 Stop — Malgrate, Italia/fr. Agudio", desc: "Short walk along Via Italia from hotel. Confirm stop location with hotel staff on Friday. Source: lineelecco.it D110 summer timetable.", primary: true },
          { id: "c8", time: "~9:15 AM → ~10:05 AM", title: "D110 Bus: Malgrate → Bellagio Lido (~50 min, ~€2–4 pp)", desc: "Scenic SS583 lakeside road through small villages. Alight at Bellagio Lido (final stop). Sources: lineelecco.it, rome2rio.com", primary: true },
          { id: "c9", time: "10:05 AM – 12:30 PM", title: "Explore Bellagio — Pearl of Lake Como (~2.5 hours)", desc: "Lakeside promenades, steep flower-draped streets, Villa Melzi gardens (~€8 pp), panoramic views from the promontory where the two lake arms meet.", primary: true },
          { id: "c10", time: "12:30 PM", title: "🍝 Lunch in Bellagio", desc: "Ask Hotel Promessi Sposi staff Friday evening for a non-tourist-trap recommendation. Terrace with lake views, local lake fish or risotto. Allow 1.5 hours. Finish by 2:00 PM.", primary: true },
          { id: "c11", time: "2:00 PM", title: "Gelato + Regroup at Bellagio Lido Bus Stop by 2:20 PM", desc: "Final gelato, last boutique browsing. All 10 people at the Bellagio Lido stop by 2:20 PM.", primary: false },
          { id: "c12", time: "~2:30 PM → ~3:20 PM", title: "D110 Return: Bellagio Lido → Malgrate (~50 min)", desc: "Alight at Malgrate, Italia/fr. Agudio. Walk back to hotel. Arrive ~3:20–3:30 PM.", primary: true },
          { id: "c13", time: "3:30–6:00 PM", title: "Rest, Shower & Get Ready for Rehearsal Dinner", desc: "2.5 hours of comfortable buffer. No rushing.", primary: false },
          { id: "c14", time: "Evening", title: "💒 Rehearsal Dinner — Ferry on Lake Como", desc: "Pre-planned. June sunset: ~9:15 PM. Golden hour on the lake with the mountains lit behind you. 🥂", primary: true },
        ]
      },
      {
        id: "como-jun14", date: "2026-06-14", badge: "Jun 14", title: "Sunday — The Wedding Day 💍",
        subtitle: "Fully planned — no recommendations needed",
        items: [
          { id: "c15", time: "All Day", title: "💍 Wedding Day — Fully Planned", desc: "This day belongs entirely to your sister and her partner. No travel planning needed. Congratulations! 🥂", primary: true },
        ]
      },
      {
        id: "como-jun15", date: "2026-06-15", badge: "Jun 15", title: "Monday — Recovery Day (Stay Local)",
        subtitle: "No ferries · No long drives · Everything in/near Malgrate",
        items: [
          { id: "c16", time: "Whenever Ready", title: "Slow Hotel Breakfast", desc: "No alarm. This is the recovery morning after the wedding.", primary: false },
          { id: "c17", time: "Mid-Morning", title: "Il Lungolago Walk + Espresso Stop", desc: "Flat, effortless, beautiful. Stop at the waterfront café for espresso and cornetto.", primary: false },
          { id: "c18", time: "11:00 AM (Optional)", title: "Walk to Lecco — Short Wander (10-min bridge)", desc: "Flat, no planning needed. Lecco piazza, Manzoni monument, lakeside coffee.", primary: false },
          { id: "c19", time: "1:00 PM", title: "🍝 Lunch: Corte Fiorina (Lecco, 10-min walk)", desc: "Small, intimate, beloved by locals. Homemade lake fish ravioli, risotto with asparagus and Taleggio. Reservation Suggested. €€", primary: true },
          { id: "c20", time: "3:00 PM", title: "Spa / Lido / Afternoon by the Lake", desc: "San Martino Spa (Malgrate): massage or treatment.\nLido di Malgrate: sunbeds, lake water, mountain views.\nRifugio Martina: easy 30-min gentle walk or short drive.", primary: false },
          { id: "c21", time: "7:00 PM", title: "🕯️ Dinner: Crotto del Capraio (Civate — 10-min drive)", desc: "Family-owned cottage, traditional local dishes, rustic setting. Completely off the tourist circuit. Reservation Suggested. €–€€", primary: true },
        ]
      },
      {
        id: "como-jun16", date: "2026-06-16", badge: "Jun 16", title: "Tuesday — Checkout & Depart for Wengen",
        subtitle: "~3–3.5 hr drive · Park at Lauterbrunnen · Train to Wengen",
        items: [
          { id: "c22", time: "9:00–10:00 AM", title: "🚗 Depart Malgrate → Lauterbrunnen (~3–3.5 hrs via A9)", desc: "⚠️ WENGEN IS CAR-FREE. Park at Lauterbrunnen multi-storey (~CHF 15–20/day). WAB cogwheel train up: 11 min, every 30 min, ~CHF 8–10 pp.", primary: true },
        ]
      },
    ]
  },
  {
    id: "wengen", label: "Wengen", color: C.wengen, emoji: "🇨🇭",
    dates: "Jun 16–19 · 8 people · Spendagerten 1298 C",
    coords: { lat: 46.61, lon: 7.92 }, range: { start: "2026-06-16", end: "2026-06-19" },
    days: [
      {
        id: "wengen-jun16", date: "2026-06-16", badge: "Jun 16", title: "Tuesday — Arrival + Settling In",
        subtitle: "Afternoon arrival · Village walk · Dinner at Bären",
        items: [
          { id: "w1", time: "~3:00–4:00 PM", title: "Arrive Lauterbrunnen → WAB Train to Wengen → Settle In", desc: "Village electric golf-cart taxis available for luggage to Spendagerten.", primary: true, cost: "~CHF 10–15 luggage cart (group)" },
          { id: "w2", time: "5:00 PM", title: "Village Walk + Collect Hiking Maps", desc: "Walk from Spendagerten down to the station. Free hiking maps at tourist info board near the Männlichen cable car. Eiger, Mönch, and Jungfrau visible from the village.", primary: false },
          { id: "w3", time: "7:00 PM", title: "🕯️ Dinner: Restaurant Bären", desc: "Best overall restaurant in Wengen. Locally sourced, seasonal, exceptional wine list. Reservation Required for 8.", primary: true, cost: "€€€ (~CHF 55–80 pp)" },
        ]
      },
      {
        id: "wengen-jun17", date: "2026-06-17", badge: "Jun 17", title: "Wednesday — Main Mountain Day",
        subtitle: "Shared bookends · Choose the main activity below (3 options)",
        // Items shown before and after the toggleable middle activity slot.
        leadItems: [
          { id: "w-wed-am", time: "7:00 AM", title: "Breakfast & Morning Start", desc: "Breakfast at the accommodation. Pack layers and sunglasses for the mountains — conditions change fast at altitude.", primary: false },
        ],
        trailItems: [
          { id: "w7", time: "4:00 PM", title: "Tanne Bar — Post-Mountain Beers", desc: "Wengen institution. Owner Ronald is 'a brilliant host' per long-term regulars.", primary: false, cost: "~CHF 8–12 / drink" },
          { id: "w8", time: "7:00 PM", title: "🕯️ Dinner: Restaurant Eiger or Allmend", desc: "Eiger: Swiss fondue/raclette, sunny terrace. Walk-in.\nAllmend: Valley panorama, large terrace, casual. Walk-in.", primary: false, cost: "€€ (~CHF 30–45 pp)" },
        ],
        // The toggleable main activity. `key` ties Wed → Thu auto-matching.
        activityLabel: "Main Activity — choose one",
        activityOptions: [
          {
            key: "jungfraujoch", label: "🏔 Jungfraujoch (Splurge)",
            note: "Europe's highest railway station at 3,454m — a once-in-a-lifetime experience. Book NOW at jungfrau.ch.",
            items: [
              { id: "w4a", time: "7:30 AM", title: "🏔 Train: Wengen → Kleine Scheidegg → Jungfraujoch", desc: "⚠️ Book NOW at jungfrau.ch (+ mandatory seat reservation, required May–Oct). Train Wengen → Kleine Scheidegg (45 min) → Jungfraujoch (45 min). Eiger North Face views the whole way up.", primary: true, cost: "CHF 239 pp + CHF 10 seat reservation" },
              { id: "w4b", time: "9:00 AM", title: "🏔 At Jungfraujoch Summit (4 hours)", desc: "Sphinx Observatory (360° Alps + Aletsch Glacier), Ice Palace (glacier tunnels), Plateau glacier walk, Snow Fun Park, Alpine Sensation. Eat at the summit restaurant. Dress for winter — always below freezing.", primary: true, cost: "Included above" },
              { id: "w4c", time: "1:00 PM", title: "🏔 Descend via Grindelwald → Return to Wengen", desc: "Descend via Kleine Scheidegg → Grindelwald for completely different scenery → train back via Lauterbrunnen. Arrive Wengen ~3:30 PM.", primary: false, cost: "Included above" },
            ]
          },
          {
            key: "mannlichen", label: "🥾 Männlichen → Grindelwald (Best Value)",
            note: "Cable car up, iconic ridge hike, gondola down to Grindelwald. Arguably the best hiking scenery in the region at a fraction of the cost.",
            items: [
              { id: "w5a", time: "9:00 AM", title: "🥾 Cable Car: Wengen → Männlichen", desc: "Ascend to 2,342m for a 360° panorama. Ask about the Royal Ride open-air rooftop balcony upgrade (CHF 5 extra) — stunning on a clear morning.", primary: true, cost: "~CHF 31 pp one-way (CHF 62 return); 50% off with Swiss Travel Pass" },
              { id: "w5b", time: "9:30 AM", title: "🥾 Männlichen → Kleine Scheidegg Ridge Hike (2.5 hrs)", desc: "One of Switzerland's most iconic and accessible hikes — mostly flat ridge with uninterrupted Eiger North Face views. Wildflowers in June. Lunch at Kleine Scheidegg.", primary: true, cost: "Free (hiking)" },
              { id: "w5c", time: "1:30 PM", title: "🥾 Gondola → Grindelwald + Explore Village", desc: "Gondola down to Grindelwald Terminal (one of the longest cableways in the Alps). Explore the village — coffee, cake, mountain views from the valley floor. Train back to Wengen ~5:00 PM.", primary: false, cost: "~CHF 32 pp gondola + ~CHF 10–15 train (free w/ Swiss Travel Pass)" },
            ]
          },
          {
            key: "travelpass", label: "🎟 Jungfrau Travel Pass (Middle Ground)",
            note: "Best value if using multiple cable cars across Wed + Thu. Covers unlimited regional transport; Jungfraujoch needs only a supplement. Follows the Jungfraujoch itinerary at lower marginal cost.",
            items: [
              { id: "w6a", time: "7:30 AM", title: "🎟 Jungfraujoch via Travel Pass — Train Up", desc: "Same itinerary as the Jungfraujoch option, but the pass covers all connecting trains and you pay only a supplement for the final summit leg. Buy the pass in advance at jungfrau.ch.", primary: true, cost: "CHF 89 Jungfraujoch supplement (vs CHF 239 full) + pass cost" },
              { id: "w6b", time: "9:00 AM", title: "🎟 At Jungfraujoch Summit (4 hours)", desc: "Sphinx Observatory, Ice Palace, glacier walk, Snow Fun Park. Same summit experience as the splurge option. Pass also covers Thursday's Männlichen hike at no extra cable-car cost.", primary: true, cost: "Included in pass" },
              { id: "w6c", time: "1:00 PM", title: "🎟 Descend via Grindelwald → Return to Wengen", desc: "Descend via Kleine Scheidegg → Grindelwald → train to Wengen, all covered by the pass. Arrive ~3:30 PM.", primary: false, cost: "Included in pass" },
            ]
          }
        ]
      },
      {
        id: "wengen-jun18", date: "2026-06-18", badge: "Jun 18", title: "Thursday — Secondary Mountain Day + Final Evening",
        subtitle: "Main activity auto-matches your Wednesday choice",
        leadItems: [
          { id: "w-thu-am", time: "8:00 AM", title: "Breakfast & Morning Start", desc: "Breakfast at the accommodation before the day's activity.", primary: false },
        ],
        trailItems: [
          { id: "w13", time: "7:30 PM", title: "🕯️ Final Wengen Dinner: Restaurant 1903 (Hotel Schönegg)", desc: "'Refined without being snooty, quality food, maybe the best service in Wengen.' Opens earlier than most. Reservation Required for 8.", primary: true, cost: "€€€ (~CHF 55–80 pp)" },
          { id: "w14", time: "9:30 PM", title: "🌙 Eiger Alpenglow + Tanne Bar Last Night", desc: "June 18 sunset ~9:30 PM. The Eiger turns pink — watch from anywhere in the village. Then Tanne Bar for a final nightcap.", primary: false, cost: "~CHF 8–12 / drink" },
        ],
        activityLabel: "Main Activity — matches Wednesday's choice",
        // Auto-matched to Wednesday: jungfraujoch & travelpass → mannlichen hike; mannlichen → valley.
        activityMatch: { jungfraujoch: "mh", travelpass: "mh", mannlichen: "valley" },
        activityOptions: [
          {
            key: "mh", label: "🥾 Männlichen Hike Day",
            note: "Since Wednesday was Jungfraujoch (or the Travel Pass), spend Thursday on the iconic Männlichen ridge hike.",
            items: [
              { id: "w9a", time: "9:00 AM", title: "🥾 Cable Car: Wengen → Männlichen", desc: "Ascend to 2,342m. Ask about the Royal Ride open-air rooftop balcony upgrade.", primary: true, cost: "~CHF 31 pp one-way; 50% off with Swiss Travel Pass (free if bought the pass Wed)" },
              { id: "w9b", time: "9:30 AM", title: "🥾 Männlichen → Kleine Scheidegg Ridge Hike (2.5 hrs)", desc: "Mostly flat ridge, uninterrupted Eiger North Face views. Lunch at Kleine Scheidegg. WAB train back to Wengen ~2:00 PM.", primary: true, cost: "Free (hiking)" },
              { id: "w11", time: "2:30 PM", title: "Trümmelbach Falls (Optional)", desc: "Train to Lauterbrunnen + bus. 10 glacier-fed waterfalls inside the mountain. Allow 1.5 hours. Return by 5:30 PM.", primary: false, cost: "~€15 pp" },
            ]
          },
          {
            key: "valley", label: "🌊 Lauterbrunnen Valley + Trümmelbach",
            note: "Since Wednesday was the Männlichen → Grindelwald route, spend Thursday on a more relaxed valley day.",
            items: [
              { id: "w10a", time: "9:30 AM", title: "🌊 Train Down to Lauterbrunnen", desc: "A relaxed day after the big hike. The dramatic Lauterbrunnen Valley — 72 waterfalls, vertical cliff walls — said to have inspired Tolkien's Rivendell.", primary: false, cost: "~CHF 8–10 pp" },
              { id: "w10b", time: "10:00 AM", title: "🌊 Trümmelbach Falls", desc: "10 glacier-fed waterfalls inside the mountain via a lift carved into the rock. One of the Alps' most unique natural wonders. Allow 1.5 hours.", primary: true, cost: "~€15 pp" },
              { id: "w10c", time: "12:00 PM", title: "🌊 Staubbach Falls + Valley Floor Walk + Lunch", desc: "Staubbach Falls (300m) plunges directly off the cliff into the village. Walk the valley floor, lunch in Lauterbrunnen, then train back to Wengen.", primary: false, cost: "Free (falls); lunch €€" },
              { id: "w12", time: "4:00 PM", title: "Stubbachbankli Village Stroll (Easy 45-min round trip)", desc: "Gentle walk from Wengen to a small waterfall, meadow benches, and an Alpine panorama at the end.", primary: false, cost: "Free" },
            ]
          }
        ]
      },
      {
        id: "wengen-jun19am", date: "2026-06-19", badge: "Jun 19", title: "Friday — Checkout & Depart for Basel",
        subtitle: "Morning free · Depart ~8:30 AM · Flight BSL → NCE at 19:40",
        items: [
          { id: "w15", time: "8:30 AM", title: "Depart Spendagerten → Walk to Wengen Station (~10 min)", desc: "Village electric taxi for luggage ~CHF 10–15. WAB train down to Lauterbrunnen (11 min).", primary: true },
          { id: "w16", time: "~8:56 AM", title: "🚂 WAB Train: Wengen → Lauterbrunnen (11 min)", desc: "Collect car from Lauterbrunnen multi-storey OR continue by train all the way to Basel SBB.", primary: false },
          { id: "w17", time: "~9:00 AM → ~11:00–12:00 PM", title: "Drive or Train to Basel SBB", desc: "Drive (~1h 45m–2h via A8/A2, ~170 km) OR Train (~2h 45m avg, 2 changes via Interlaken Ost + Bern). Check sbb.ch for morning times.", primary: true },
          { id: "w18", time: "12:00–2:30 PM", title: "☕ Basel Lunch Break (~2 hours)", desc: "Basel Altstadt is 10-min walk from Basel SBB. Rhine riverfront, Marktplatz, excellent cafés. Worth a brief explore.", primary: false },
          { id: "w19", time: "~2:30–2:50 PM", title: "🚌 Bus 50 (BVB): Basel SBB → EuroAirport (~20 min)", desc: "Departs outside Basel SBB main hall (left exit). Every 7–10 min. Board 'Basel, Bahnhof SBB' → alight 'EuroAirport Abflug' (Departures).", primary: true, cost: "CHF 6.10 pp" },
          { id: "w20", time: "~3:00 PM", title: "✈ EuroAirport Basel (BSL) — Check In & Security", desc: "Arrive ~3:00 PM. Flight at 19:40 — a comfortable 3h 40m buffer. Non-EU passports: separate immigration lane. Check in online the day before.", primary: true },
          { id: "w21", time: "19:40", title: "🛫 Flight: Basel EuroAirport (BSL) → Nice NCE", desc: "~1h 10–15 min. Arrive Nice ~20:50–21:00. Onward to hotel: Tram Line 2 from NCE ~30 min to Jean Médecin, or taxi ~20 min.", primary: true, cost: "Tram €1.70 pp · Taxi ~€35" },
        ]
      },
    ]
  },
  {
    id: "nice", label: "Nice", color: C.nice, emoji: "🇫🇷",
    dates: "Jun 19–23 · 4 people · Nice Centre Hotel",
    coords: { lat: 43.70, lon: 7.27 }, range: { start: "2026-06-19", end: "2026-06-23" },
    days: [
      {
        id: "nice-jun19", date: "2026-06-19", badge: "Jun 19", title: "Friday — Late Arrival, Rest Night",
        subtitle: "~21:30 hotel arrival after full travel day · Keep it simple",
        items: [
          { id: "n1", time: "~21:30–22:00", title: "Check in to Nice Centre Hotel", desc: "After Wengen → Basel → flight → tram. Check in, freshen up.", primary: true },
          { id: "n2", time: "~22:00", title: "🌙 Rooftop Bar (Bella Ciela) — Arrival Drink", desc: "Hotel rooftop bar, open late. First glass of Côtes de Provence rosé above Nice with city lights.", primary: false },
          { id: "n3", time: "Late Evening", title: "Light Supper Near Hotel", desc: "Avenue Jean Médecin (2-min walk) has late-night options. Keep it simple — big days ahead.", primary: false },
        ]
      },
      {
        id: "nice-jun20", date: "2026-06-20", badge: "Jun 20", title: "Saturday — Beach Day OR Monaco Day",
        subtitle: "✅ Fully interchangeable with Sunday — decide on the morning",
        items: [
          { id: "n4", time: "Flexible", title: "🏖️ Beach Day or 🎰 Monaco Day — Either Order Works", desc: "Monaco on Sunday is completely fine: Palace open daily, Guard Change every day at 11:55 AM, Casino open daily, trains run 7 days/week.\n\nDecision rule: Feel rested & energetic → Monaco. Want a mellow start → Beach Day. Both work perfectly either day.", primary: true },
          { id: "n5", time: "If Beach Day", title: "🏖️ Castel Plage or Beau Rivage — Private Beach (15-min walk)", desc: "Castel Plage (Top pick): Art Deco, foot of Castle Hill, panoramic Bay of Angels. Sunbed + umbrella from ~€22. Open until midnight.\nBeau Rivage: Central Promenade, ~€25–35 pp private section.\n⚠️ Buy water shoes on Promenade ~€5 — all beaches are pebbles.", primary: false },
          { id: "n6", time: "If Monaco Day", title: "🎰 Train: Nice-Ville → Monaco-Monte Carlo (20 min, ~€4 pp round trip)", desc: "Nice-Ville station: 5-min walk from hotel (300m). Buy round-trip. Trains every 30 min. ⚠️ Uber cannot pick up passengers inside Monaco — return by train.", primary: false },
          { id: "n7", time: "4:00 PM (Beach Day)", title: "Castle Hill Free Elevator → Panoramic Views", desc: "Free elevator at eastern end of Promenade next to Castel Plage. Best free view in Nice — Bay of Angels and Old Town rooftops.", primary: false },
          { id: "n8", time: "11:55 AM (Monaco Day)", title: "⚠️ Changing of the Guard — Be in Position by 11:40 AM", desc: "Palace Square, Monaco-Ville (The Rock). Daily at exactly 11:55 AM. State Apartments: ~€13 pp. Oceanographic Museum adjacent.", primary: true },
          { id: "n9", time: "2:30 PM (Monaco Day)", title: "Monte Carlo Casino & Casino Square", desc: "Entrance Hall: free. Gambling rooms: €17 pp with passport, smart casual dress required. Casino Square with Ferraris and Hotel de Paris is the spectacle regardless.", primary: false },
          { id: "n10", time: "8:00 PM", title: "🕯️ Dinner: La Merenda (Beach Day) or Le Restaurant du Couvent (Monaco Day)", desc: "La Merenda: Former 2-Michelin-star, under 10 tables, pure Niçoise cuisine. Reservation Required — Book immediately. €€\nLe Restaurant du Couvent: 17th-century convent, farm-to-table, stunning garden courtyard. Reservation Required. €€€€", primary: true },
        ]
      },
      {
        id: "nice-jun21", date: "2026-06-21", badge: "Jun 21", title: "Sunday — Monaco Day OR Beach Day",
        subtitle: "Whichever wasn't done Saturday",
        items: [
          { id: "n11", time: "Flexible", title: "🎰 Monaco Day or 🏖️ Beach Day — The Other One", desc: "See Saturday entries above — all logistics and timings are identical. Both options work equally well on Sunday.", primary: true },
        ]
      },
      {
        id: "nice-jun22", date: "2026-06-22", badge: "Jun 22", title: "Monday — Vieux Nice + Culture Day",
        subtitle: "Last full day · Early-ish night (early flight Tuesday)",
        items: [
          { id: "n12", time: "8:30 AM", title: "☕ Chez Pipo — Socca Morning (Port quarter)", desc: "Since 1923. Chickpea pancake from the wood-fired oven — eat hot with hands, heavy black pepper, café au lait. Walk-in. €", primary: true },
          { id: "n13", time: "9:30 AM", title: "Cours Saleya — Monday Antique Market + Vieux Nice Wander", desc: "Monday is antique market day — the most local, unhurried Cours Saleya experience. Wander Old Town: Cathedrale Saint-Réparate, Chapelle de la Miséricorde, Place Rossetti. 2–3 hours.", primary: false },
          { id: "n14", time: "12:00 PM", title: "🍝 Lunch: Bar des Oiseaux (Vieux Nice)", desc: "Bistronomic, open kitchen, Corsican-Provençal cuisine. Family-run. Reservation: +33 4 93 80 27 33. €€–€€€ (~€25–40 pp). Open Tue–Sat.", primary: false },
          { id: "n15", time: "2:00 PM", title: "Marc Chagall National Museum (Cimiez, 20-min walk or bus)", desc: "17 monumental Biblical Message canvases. One of the most personal art museums in France. Verify Monday hours before visiting.", primary: false },
          { id: "n16", time: "4:00 PM", title: "🍦 Fenocchio Gelato (Place Rossetti) + Final Promenade Walk", desc: "Since 1966, 90+ flavors. Walk toward the Promenade for a final Riviera sunset stroll. Walk-in. €", primary: false },
          { id: "n17", time: "6:00 PM", title: "⚠️ Pack + Organize for Early Departure", desc: "Bags packed, documents organized, devices charged. Do this before dinner — saves morning stress.\n⚠️ Flight 10:10 AM. Leave hotel by 6:15 AM. Tram Line 2 from Jean Médecin (300m, 5-min walk) to airport: ~30 min.", primary: true },
          { id: "n18", time: "7:30 PM", title: "🕯️ Final Nice Dinner: La Merenda or Chez Pipo (dinner)", desc: "La Merenda (if available): Former 2-Michelin-star, tiny, perfect Niçoise. Reservation Required. €€\nChez Pipo (dinner): Full sit-down socca, pissaladière, daube. Excellent value. Walk-in. €", primary: true },
          { id: "n19", time: "9:00–9:30 PM", title: "One Final Drink: Castel Plage or Cours Saleya Bar", desc: "Last glass of rosé by the Mediterranean. End the European adventure properly — then back to hotel and sleep.", primary: false },
          { id: "n20", time: "10:00 PM", title: "Back to Hotel — Set Alarms & Sleep", desc: "Multiple alarms set. Bags already packed. Early morning tomorrow.", primary: true },
        ]
      },
    ]
  },
  {
    id: "departure", label: "Departure", color: "#555", emoji: "✈️",
    dates: "Jun 23 · AA Flight NCE → PHL · 10:10 AM",
    days: [
      {
        id: "dep-jun23", date: "2026-06-23", badge: "Jun 23", title: "Tuesday — Nice → Philadelphia",
        subtitle: "AA Flight 10:10 AM · Terminal 8 · Leave hotel by 6:15 AM",
        items: [
          { id: "d1", time: "5:30 AM", title: "⏰ Wake Up — Multiple Alarms", desc: "Bags already packed from last night. Check out of hotel.", primary: true },
          { id: "d2", time: "6:10 AM", title: "Walk to Jean Médecin Tram Stop (5 min, ~300m)", desc: "Or pre-book a taxi the night before (~€35, ~20 min to airport).", primary: false },
          { id: "d3", time: "6:15 → 6:45 AM", title: "🚋 Tram Line 2: Jean Médecin → Nice Côte d'Azur Airport (~30 min, €1.70 pp)", desc: "Direct to airport terminals. AA uses Terminal 8 (connected). Buy tickets at tram stop machine. First tram ~5:00 AM.", primary: true },
          { id: "d4", time: "6:45 AM", title: "✈ Arrive NCE Terminal 8 — Check In, Security, Passport Control", desc: "3h 25min before flight. Non-EU passports: separate immigration lane. Be at gate by 9:40 AM (30 min before departure). Check in online the night before.", primary: true },
          { id: "d5", time: "10:10 AM", title: "🛫 American Airlines NCE → PHL — Nonstop", desc: "~7h 50min. Arrive Philadelphia ~1:00–2:00 PM Eastern. Welcome home. 🎉", primary: true },
        ]
      }
    ]
  }
];

// ─── TIME PARSE HELPER ────────────────────────────────────────────────────────
// Returns a minutes-from-midnight sort value. Handles clock times, time ranges
// (sorted by START time), and descriptive labels with sensible defaults.
function parseTime(t) {
  if (!t) return 9999;
  const raw = t.trim();
  const lower = raw.toLowerCase();

  // Descriptive (non-clock) labels → sensible sort values.
  // Checked before clock parsing so "All Day"/"Flexible" land first, etc.
  const labelMap = [
    [/all day/, -100],
    [/flexible/, -100],
    [/whenever ready/, 9 * 60],          // ~9:00 AM
    [/early (morning|breakfast)/, 7 * 60], // ~7:00 AM
    [/^morning/, 9 * 60],                  // ~9:00 AM
    [/mid-?morning/, 10 * 60],             // ~10:00 AM
    [/late morning/, 11 * 60],             // ~11:00 AM
    [/midday|noon/, 12 * 60],              // 12:00 PM
    [/early afternoon/, 13 * 60],          // ~1:00 PM
    [/^afternoon/, 14 * 60],               // ~2:00 PM
    [/late afternoon/, 16 * 60],           // ~4:00 PM
    [/early evening/, 18 * 60],            // ~6:00 PM
    [/^evening/, 19 * 60],                 // ~7:00 PM
    [/after dinner/, 22 * 60],             // ~10:00 PM
    [/late evening|late night/, 22.5 * 60],// ~10:30 PM
    [/^night/, 23 * 60],                   // ~11:00 PM
  ];

  // Try to find a real clock time first (this is the START of any range,
  // since match() returns the first occurrence left-to-right).
  const clean = raw.replace(/[~→–-]/g, " ");
  const m = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (m) {
    let h = parseInt(m[1]), mn = parseInt(m[2]);
    let ap = (m[3] || "").toUpperCase();
    // If no AM/PM on the start token, try to infer from a later token in the string.
    if (!ap) {
      const later = clean.slice(m.index + m[0].length).match(/(AM|PM)/i);
      if (later) ap = later[1].toUpperCase();
    }
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return h * 60 + mn;
  }

  // No clock time — fall back to descriptive label mapping.
  for (const [re, val] of labelMap) {
    if (re.test(lower)) return val;
  }

  // Unknown / option-style labels (e.g. "Option 1") keep a stable mid value
  // so they don't jump to the very top or bottom unexpectedly.
  if (/option/.test(lower)) return 9000;
  return 9999;
}

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const STORAGE_KEY = "eu-trip-2026";
async function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { edits: {}, customs: {}, originals: {} };
  } catch { return { edits: {}, customs: {}, originals: {} }; }
}
async function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ─── WEATHER (Open-Meteo, no API key) ─────────────────────────────────────────
// WMO weather codes → emoji + short label.
function weatherCodeInfo(code) {
  if (code == null) return { icon: "🌡️", label: "—" };
  if (code === 0) return { icon: "☀️", label: "Clear" };
  if (code <= 2) return { icon: "🌤️", label: "Mostly clear" };
  if (code === 3) return { icon: "☁️", label: "Overcast" };
  if (code <= 48) return { icon: "🌫️", label: "Fog" };
  if (code <= 57) return { icon: "🌦️", label: "Drizzle" };
  if (code <= 67) return { icon: "🌧️", label: "Rain" };
  if (code <= 77) return { icon: "🌨️", label: "Snow" };
  if (code <= 82) return { icon: "🌧️", label: "Showers" };
  if (code <= 86) return { icon: "🌨️", label: "Snow showers" };
  if (code <= 99) return { icon: "⛈️", label: "Thunderstorm" };
  return { icon: "🌡️", label: "—" };
}

// Fetch daily forecast for a coordinate + date range, in Fahrenheit.
// Uses Open-Meteo's current snake_case daily variable names and an explicit
// temperature unit. Returns [] if no daily data (out of forecast window).
async function fetchForecast(coords, range) {
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lon),
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    temperature_unit: "fahrenheit",
    timezone: "auto",
    start_date: range.start,
    end_date: range.end,
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather request failed");
  const j = await res.json();
  const d = j.daily;
  if (!d || !d.time || d.time.length === 0) return [];
  // Tolerate both new (weather_code) and legacy (weathercode) key names.
  const codes = d.weather_code || d.weathercode || [];
  const maxes = d.temperature_2m_max || [];
  const mins = d.temperature_2m_min || [];
  const pops = d.precipitation_probability_max || [];
  return d.time.map((t, i) => ({
    date: t,
    code: codes[i],
    max: maxes[i],
    min: mins[i],
    pop: pops[i] != null ? pops[i] : null,
  })).filter(x => x.max != null);
}

// Seasonal June averages per location in °F (fallback when forecast is out of range).
const SEASONAL = {
  milan:  { hi: 81, lo: 63, note: "Warm, occasional afternoon thunderstorms" },
  como:   { hi: 79, lo: 61, note: "Warm and humid by the lake; afternoon showers possible" },
  wengen: { hi: 63, lo: 46, note: "Cool Alpine air; changeable mountain weather, cold at altitude" },
  nice:   { hi: 77, lo: 64, note: "Warm, sunny Mediterranean days" },
};

// Hook: fetch a section's forecast once, return a {date: dayData} lookup map.
function useSectionForecast(section) {
  const [state, setState] = useState({ loading: true, byDate: {}, error: false });
  useEffect(() => {
    let alive = true;
    setState({ loading: true, byDate: {}, error: false });
    if (!section.coords || !section.range) { setState({ loading:false, byDate:{}, error:false }); return; }
    fetchForecast(section.coords, section.range)
      .then(days => {
        if (!alive) return;
        const byDate = {};
        days.forEach(d => { byDate[d.date] = d; });
        setState({ loading: false, byDate, error: false });
      })
      .catch(() => { if (alive) setState({ loading: false, byDate: {}, error: true }); });
    return () => { alive = false; };
  }, [section.id]);
  return state;
}

// Compact live-weather chip shown in each day header.
function DayWeatherChip({ forecast, loading }) {
  if (loading) {
    return <span style={{ fontSize:11,color:C.inkFaint,whiteSpace:"nowrap" }}>… </span>;
  }
  if (!forecast) {
    return <span style={{ fontSize:10,color:C.inkFaint,whiteSpace:"nowrap" }} title="Live forecast not available for this date">—</span>;
  }
  const info = weatherCodeInfo(forecast.code);
  return (
    <div title={info.label} style={{ display:"flex",alignItems:"center",gap:5,background:C.cream,border:`1px solid ${C.creamBorder}`,borderRadius:8,padding:"5px 9px",whiteSpace:"nowrap" }}>
      <span style={{ fontSize:16,lineHeight:1 }}>{info.icon}</span>
      <span style={{ fontSize:12,fontWeight:600,color:C.ink }}>{Math.round(forecast.max)}°<span style={{ color:C.inkFaint,fontWeight:400 }}>/{Math.round(forecast.min)}°F</span></span>
      {forecast.pop != null && forecast.pop >= 20 && <span style={{ fontSize:10,color:C.como }}>💧{forecast.pop}%</span>}
    </div>
  );
}

// Section-level seasonal-average panel (live per-day forecasts live in each day header).
function SeasonalPanel({ section }) {
  const seasonal = SEASONAL[section.id];
  if (!seasonal) return null;
  const accent = section.color;
  return (
    <div style={{ margin:"0 24px 16px",border:`1px solid ${C.creamBorder}`,borderRadius:10,background:"#fff",overflow:"hidden" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:`${accent}0A` }}>
        <span style={{ fontSize:14 }}>🌡️</span>
        <span style={{ fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,fontWeight:600 }}>Typical June Weather</span>
        <span style={{ fontSize:11,color:C.inkFaint,marginLeft:"auto" }}>live daily forecast in each day ↓</span>
      </div>
      <div style={{ padding:"12px 16px",fontSize:13,color:C.inkMuted,lineHeight:1.6 }}>
        <strong style={{ color:C.ink }}>{seasonal.hi}°F / {seasonal.lo}°F</strong> — {seasonal.note}.
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ background:"#fff",borderRadius:10,width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:`1px solid ${C.creamBorder}` }}>
          <span style={{ fontWeight:600,fontSize:15,color:C.ink }}>{title}</span>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.inkFaint,lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── FORM FIELD ───────────────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline }) {
  const style = { width:"100%",padding:"8px 10px",borderRadius:6,border:`1px solid ${C.creamBorder}`,fontFamily:"inherit",fontSize:13,color:C.ink,background:"#fafaf8",resize:multiline?"vertical":"none",minHeight:multiline?80:undefined };
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.inkFaint,marginBottom:4 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} style={style} />
        : <input value={value} onChange={e=>onChange(e.target.value)} style={style} />}
    </div>
  );
}

function Btn({ children, onClick, variant="primary", small }) {
  const bg = variant==="primary"?C.gold:variant==="danger"?"#c0392b":variant==="ghost"?"transparent":"#eee";
  const col = variant==="primary"?"#fff":variant==="danger"?"#fff":C.inkMuted;
  const border = variant==="ghost"?`1px solid ${C.creamBorder}`:"none";
  return (
    <button onClick={onClick} style={{ background:bg,color:col,border,borderRadius:6,padding:small?"5px 10px":"8px 16px",fontSize:small?11:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit" }}>
      {children}
    </button>
  );
}

// ─── TIMELINE ITEM ────────────────────────────────────────────────────────────
function TimelineItem({ item, destColor, onEdit }) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const tapTimer = useRef(null);

  const showEdit = hovered || tapped;
  const isCustom = item.custom;
  const isEdited = item.edited;

  function handleTap() {
    setTapped(true);
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setTapped(false), 3000);
  }

  const dotColor = item.primary ? C.gold : "#fff";
  const dotBorder = item.primary ? C.gold : C.creamBorder;
  const itemBg = isCustom ? "#EEF7FF" : isEdited ? "#FFFBF0" : "#fff";
  const itemBorder = isCustom ? `1px solid #B8D8F5` : isEdited ? `1px solid #EDD98A` : `1px solid ${C.creamBorder}`;

  return (
    <div
      style={{ position:"relative",marginBottom:16,paddingLeft:32 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTap}
    >
      {/* dot */}
      <div style={{ position:"absolute",left:0,top:6,width:14,height:14,borderRadius:"50%",background:dotColor,border:`2px solid ${dotBorder}`,zIndex:1 }} />
      {/* card */}
      <div style={{ background:itemBg,border:itemBorder,borderRadius:8,padding:"12px 14px",position:"relative",transition:"box-shadow 0.15s" }}>
        {/* badges */}
        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap" }}>
          <span style={{ fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.inkFaint }}>{item.time}</span>
          {isCustom && <span style={{ fontSize:10,background:"#EEF7FF",color:"#1A5FA0",border:"1px solid #B8D8F5",borderRadius:3,padding:"1px 6px",letterSpacing:"0.05em",textTransform:"uppercase" }}>Custom</span>}
          {isEdited && !isCustom && <span style={{ fontSize:10,background:"#FFFBF0",color:"#8A5A00",border:"1px solid #EDD98A",borderRadius:3,padding:"1px 6px",letterSpacing:"0.05em",textTransform:"uppercase" }}>Edited</span>}
        </div>
        <div style={{ fontWeight:500,fontSize:14,color:C.ink,marginBottom:4,lineHeight:1.4 }}>{item.title}</div>
        {item.desc && <div style={{ fontSize:12,color:C.inkMuted,lineHeight:1.65,whiteSpace:"pre-line" }}>{item.desc}</div>}
        {item.cost && <div style={{ marginTop:6,fontSize:11,background:C.badge,border:`1px solid ${C.creamBorder}`,borderRadius:4,padding:"2px 8px",display:"inline-block",color:C.inkMuted }}>💰 {item.cost}</div>}
        {/* edit button */}
        {showEdit && (
          <button onClick={() => onEdit(item)} style={{ position:"absolute",top:8,right:8,background:C.badge,border:`1px solid ${C.creamBorder}`,borderRadius:5,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }} title="Edit item">✏️</button>
        )}
      </div>
    </div>
  );
}

// ─── ADD ACTIVITY MODAL ───────────────────────────────────────────────────────
function AddActivityModal({ sections, onSave, onClose }) {
  const [sectionId, setSectionId] = useState(sections[0]?.id || "");
  const [targetId, setTargetId] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cost, setCost] = useState("");

  const section = sections.find(s => s.id === sectionId);

  // Build a flat list of timeline targets. Scenario days and activity-option
  // days expand into one target per timeline so a custom activity lands on the
  // exact timeline the user intends.
  const targets = [];
  (section?.days || []).forEach(d => {
    if (d.scenarios) {
      d.scenarios.forEach(sc => {
        targets.push({ id: `${d.id}::${sc.key}`, label: `${d.badge} — ${sc.label}` });
      });
    } else if (d.activityOptions) {
      targets.push({ id: `${d.id}::lead`, label: `${d.badge} — Morning (shared)` });
      d.activityOptions.forEach(o => {
        targets.push({ id: `${d.id}::${o.key}`, label: `${d.badge} — ${o.label}` });
      });
      targets.push({ id: `${d.id}::trail`, label: `${d.badge} — Evening (shared)` });
    } else {
      targets.push({ id: d.id, label: `${d.badge} — ${d.title}` });
    }
  });

  useEffect(() => { setTargetId(targets[0]?.id || ""); }, [sectionId]);

  function handleSave() {
    if (!title.trim() || !targetId) return;
    onSave({ dayId: targetId, time: time || "—", title: title.trim(), desc: desc.trim(), cost: cost.trim(), custom: true, primary: false, id: `custom-${Date.now()}` });
  }

  return (
    <Modal title="➕ Add Custom Activity" onClose={onClose}>
      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.inkFaint,marginBottom:4 }}>Trip Destination</label>
        <select value={sectionId} onChange={e=>setSectionId(e.target.value)} style={{ width:"100%",padding:"8px 10px",borderRadius:6,border:`1px solid ${C.creamBorder}`,fontSize:13,fontFamily:"inherit",background:"#fafaf8" }}>
          {sections.filter(s => s.id !== "departure").map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.inkFaint,marginBottom:4 }}>Day / Timeline</label>
        <select value={targetId} onChange={e=>setTargetId(e.target.value)} style={{ width:"100%",padding:"8px 10px",borderRadius:6,border:`1px solid ${C.creamBorder}`,fontSize:13,fontFamily:"inherit",background:"#fafaf8" }}>
          {targets.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>
      <Field label="Activity Name *" value={title} onChange={setTitle} />
      <Field label="Time (e.g. 3:00 PM)" value={time} onChange={setTime} />
      <Field label="Cost (free text, e.g. ~€15 pp)" value={cost} onChange={setCost} />
      <Field label="Notes / Description" value={desc} onChange={setDesc} multiline />
      <div style={{ display:"flex",gap:8,justifyContent:"flex-end",marginTop:4 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave} variant="primary">Save Activity</Btn>
      </div>
    </Modal>
  );
}

// ─── EDIT ITEM MODAL ──────────────────────────────────────────────────────────
function EditItemModal({ item, onSave, onReset, onClose }) {
  const [time, setTime] = useState(item.time || "");
  const [title, setTitle] = useState(item.title || "");
  const [desc, setDesc] = useState(item.desc || "");
  const [cost, setCost] = useState(item.cost || "");

  function handleSave() {
    if (!title.trim()) return;
    onSave({ ...item, time: time.trim(), title: title.trim(), desc: desc.trim(), cost: cost.trim(), edited: true });
  }

  return (
    <Modal title="✏️ Edit Activity" onClose={onClose}>
      <Field label="Time" value={time} onChange={setTime} />
      <Field label="Activity Name *" value={title} onChange={setTitle} />
      <Field label="Cost (free text)" value={cost} onChange={setCost} />
      <Field label="Notes / Description" value={desc} onChange={setDesc} multiline />
      {(item.edited || item.custom) && (
        <div style={{ marginBottom:14,padding:"10px 12px",background:"#FFF5F0",border:"1px solid #FAAB78",borderRadius:6,fontSize:12,color:"#7A2800" }}>
          {item.custom ? "Custom activity — no original to restore." : "This item has been edited from its original."} {!item.custom && <button onClick={onReset} style={{ background:"none",border:"none",color:C.milan,cursor:"pointer",textDecoration:"underline",fontSize:12,padding:0,fontFamily:"inherit" }}>Restore original</button>}
        </div>
      )}
      <div style={{ display:"flex",gap:8,justifyContent:"flex-end",marginTop:4 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave} variant="primary">Save Changes</Btn>
      </div>
    </Modal>
  );
}

// ─── TIMELINE (shared) ────────────────────────────────────────────────────────
function Timeline({ items, destColor, onEdit, compact }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ padding: compact ? "12px 20px 12px 24px" : "20px 20px 20px 24px",position:"relative" }}>
      <div style={{ position:"absolute",left:31,top:compact?12:20,bottom:compact?12:20,width:1,background:C.creamBorder }} />
      {items.map(item => (
        <TimelineItem key={item.id} item={item} destColor={destColor} onEdit={onEdit} />
      ))}
    </div>
  );
}

// ─── DAY CARD ─────────────────────────────────────────────────────────────────
// Handles three day types:
//  • single timeline (day.items)
//  • scenario days (day.scenarios) — independent toggle, e.g. Milan Jun 11
//  • activity-option days (day.leadItems + day.activityOptions + day.trailItems)
//    where the middle slot toggles. If `activityKey`/`onActivityChange` are
//    passed, the toggle is *controlled* (used to sync Wed → Thu).
function DayCard({ day, color, onEdit, activityKey, onActivityChange, forecast, forecastLoading }) {
  const [activeScenario, setActiveScenario] = useState(day.scenarios ? day.scenarios[0].key : null);
  const [localActivity, setLocalActivity] = useState(day.activityOptions ? day.activityOptions[0].key : null);

  const header = (
    <div style={{ padding:"16px 20px",borderBottom:`1px solid ${C.creamBorder}`,display:"flex",alignItems:"center",gap:12 }}>
      <div style={{ width:46,height:46,borderRadius:"50%",border:`2px solid ${color}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color,background:`${color}12`,flexShrink:0,lineHeight:1.2,textAlign:"center" }}>{day.badge}</div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,color,lineHeight:1.2 }}>{day.title}</div>
        {day.subtitle && <div style={{ fontSize:11,color:C.inkFaint,marginTop:2 }}>{day.subtitle}</div>}
      </div>
      <DayWeatherChip forecast={forecast} loading={forecastLoading} />
    </div>
  );

  // ── Scenario day (independent toggle) ──
  if (day.scenarios) {
    const current = day.scenarios.find(s => s.key === activeScenario) || day.scenarios[0];
    return (
      <div style={{ margin:"0 24px 32px",borderRadius:10,border:`1px solid ${C.creamBorder}`,background:"#fff",overflow:"hidden" }}>
        {header}
        <div style={{ display:"flex",borderBottom:`1px solid ${C.creamBorder}` }}>
          {day.scenarios.map(sc => {
            const active = sc.key === current.key;
            return (
              <button key={sc.key} onClick={() => setActiveScenario(sc.key)} style={{ flex:1,padding:"12px 14px",fontSize:12,fontWeight:500,cursor:"pointer",background:active?color:"#fff",color:active?"#fff":C.inkMuted,border:"none",borderRight:`1px solid ${C.creamBorder}`,fontFamily:"inherit",lineHeight:1.3 }}>
                {sc.label}
              </button>
            );
          })}
        </div>
        {current.note && (
          <div style={{ padding:"10px 20px",fontSize:12,color:C.inkMuted,background:`${color}0A`,borderBottom:`1px solid ${C.creamBorder}`,fontStyle:"italic" }}>{current.note}</div>
        )}
        <Timeline items={current.items} destColor={color} onEdit={onEdit} />
      </div>
    );
  }

  // ── Activity-option day (shared bookends + toggleable middle) ──
  if (day.activityOptions) {
    // If activityKey is passed WITH a handler → controlled & editable (Wed).
    // If activityKey is passed WITHOUT a handler → locked/synced (Thu).
    // If neither → local state (standalone).
    const selKey = activityKey != null ? activityKey : localActivity;
    const setSel = onActivityChange || (activityKey != null ? null : setLocalActivity);
    const locked = activityKey != null && !onActivityChange;
    const current = day.activityOptions.find(o => o.key === selKey) || day.activityOptions[0];

    return (
      <div style={{ margin:"0 24px 32px",borderRadius:10,border:`1px solid ${C.creamBorder}`,background:"#fff",overflow:"hidden" }}>
        {header}
        {/* lead items */}
        {day.leadItems && day.leadItems.length > 0 && <Timeline items={day.leadItems} destColor={color} onEdit={onEdit} compact />}
        {/* activity toggle */}
        <div style={{ padding:"0 20px" }}>
          <div style={{ fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.inkFaint,margin:"4px 0 8px" }}>{day.activityLabel}</div>
          <div style={{ display:"flex",border:`1px solid ${C.creamBorder}`,borderRadius:8,overflow:"hidden",marginBottom:4 }}>
            {day.activityOptions.map(o => {
              const active = o.key === current.key;
              return (
                <button key={o.key} disabled={locked} onClick={() => !locked && setSel && setSel(o.key)} style={{ flex:1,padding:"10px 8px",fontSize:11.5,fontWeight:500,cursor:locked?"default":"pointer",background:active?color:"#fff",color:active?"#fff":(locked?C.inkFaint:C.inkMuted),border:"none",borderRight:`1px solid ${C.creamBorder}`,fontFamily:"inherit",lineHeight:1.3,opacity:locked&&!active?0.45:1 }}>
                  {o.label}
                </button>
              );
            })}
          </div>
          {locked && (
            <div style={{ fontSize:11,color:C.inkFaint,marginBottom:8,fontStyle:"italic" }}>↑ Auto-matched to your Wednesday choice — change it on Wednesday to update this day.</div>
          )}
        </div>
        {current.note && (
          <div style={{ padding:"6px 20px 0",fontSize:12,color:C.inkMuted,fontStyle:"italic" }}>{current.note}</div>
        )}
        <Timeline items={current.items} destColor={color} onEdit={onEdit} />
        {/* trail items */}
        {day.trailItems && day.trailItems.length > 0 && <Timeline items={day.trailItems} destColor={color} onEdit={onEdit} compact />}
      </div>
    );
  }

  // ── Single timeline day ──
  return (
    <div style={{ margin:"0 24px 32px",borderRadius:10,border:`1px solid ${C.creamBorder}`,background:"#fff",overflow:"hidden" }}>
      {header}
      <Timeline items={day.items} destColor={color} onEdit={onEdit} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TravelGuide() {
  const [activeSection, setActiveSection] = useState("milan");
  const [data, setData] = useState(null); // { edits, customs, originals }
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  // Wengen main-activity selection (Wed). Thursday auto-matches via activityMatch.
  const [wengenActivity, setWengenActivity] = useState("jungfraujoch");

  const currentSection = SECTIONS.find(s => s.id === activeSection);
  // Fetch the current section's forecast once; look up per-day below.
  const forecast = useSectionForecast(currentSection);

  // Load persisted data on mount
  useEffect(() => { loadData().then(setData); }, []);

  async function persist(newData) {
    setSaving(true);
    await saveData(newData);
    setSaving(false);
  }

  // Merge edits + custom items into a single sorted item list for a given
  // "timeline id" (either a day id, or a scenario id like "milan-jun11::a").
  function mergeItems(items, timelineId) {
    const merged = items.map(item => {
      const edit = data.edits[item.id];
      return edit ? { ...item, ...edit, edited: true } : item;
    });
    const customs = data.customs[timelineId] || [];
    return [...merged, ...customs].sort((a, b) => parseTime(a.time) - parseTime(b.time));
  }

  // Build merged section data. Days may have `items` (single timeline),
  // `scenarios` (toggleable timelines), or `leadItems`+`activityOptions`+`trailItems`.
  function getMergedDays(section) {
    if (!data) return section.days;
    return section.days.map(day => {
      if (day.scenarios) {
        return {
          ...day,
          scenarios: day.scenarios.map(sc => ({
            ...sc,
            items: mergeItems(sc.items, `${day.id}::${sc.key}`),
          })),
        };
      }
      if (day.activityOptions) {
        return {
          ...day,
          // Custom items added to a bookend go to "<dayId>::lead" / "::trail".
          leadItems: mergeItems(day.leadItems || [], `${day.id}::lead`),
          trailItems: mergeItems(day.trailItems || [], `${day.id}::trail`),
          activityOptions: day.activityOptions.map(o => ({
            ...o,
            items: mergeItems(o.items, `${day.id}::${o.key}`),
          })),
        };
      }
      return { ...day, items: mergeItems(day.items, day.id) };
    });
  }

  async function handleAddActivity(newItem) {
    const next = { ...data, customs: { ...data.customs, [newItem.dayId]: [...(data.customs[newItem.dayId] || []), newItem] } };
    setData(next);
    await persist(next);
    setShowAdd(false);
  }

  async function handleEditSave(updatedItem) {
    let next;
    if (updatedItem.custom) {
      // Find which day this custom item belongs to and update it there
      const newCustoms = { ...data.customs };
      for (const dayId in newCustoms) {
        newCustoms[dayId] = newCustoms[dayId].map(i => i.id === updatedItem.id ? updatedItem : i);
      }
      next = { ...data, customs: newCustoms };
    } else {
      // Save original if not already saved, then save edit
      const originals = { ...data.originals };
      if (!originals[updatedItem.id]) {
        originals[updatedItem.id] = editItem; // preserve pre-edit state
      }
      const edits = { ...data.edits, [updatedItem.id]: updatedItem };
      next = { ...data, edits, originals };
    }
    setData(next);
    await persist(next);
    setEditItem(null);
  }

  async function handleRestore(item) {
    const original = data.originals[item.id];
    if (!original) return;
    const edits = { ...data.edits };
    delete edits[item.id];
    const originals = { ...data.originals };
    delete originals[item.id];
    const next = { ...data, edits, originals };
    setData(next);
    await persist(next);
    setEditItem(null);
  }

  if (!data) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.cream,fontFamily:"sans-serif",color:C.inkMuted,fontSize:14 }}>
      Loading your travel guide…
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans', system-ui, sans-serif",background:C.cream,minHeight:"100vh",color:C.ink }}>

      {/* ── COVER ── */}
      <div style={{ background:C.ink,color:"#fff",padding:"48px 32px 36px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-60,width:300,height:300,borderRadius:"50%",border:"1px solid rgba(201,168,76,0.2)",pointerEvents:"none" }} />
        <div style={{ fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:C.gold,marginBottom:10 }}>◆ Day-by-Day Itinerary · Summer 2026 · Version 4</div>
        <div style={{ fontFamily:"Georgia,serif",fontSize:38,fontWeight:700,lineHeight:1.1,marginBottom:6 }}>European<br/>Adventure</div>
        <div style={{ fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:24 }}>Milan · Lake Como · Wengen · Nice — June 11–23, 2026</div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {[["✈","Milan","Jun 11–12"],["🏔","Malgrate","Jun 12–16"],["🇨🇭","Wengen","Jun 16–19"],["🇫🇷","Nice","Jun 19–23"],["✈","Departure","Jun 23"]].map(([e,l,d]) => (
            <div key={l} style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:4,padding:"5px 12px",fontSize:12,color:"rgba(255,255,255,0.8)" }}>{e} {l} · {d}</div>
          ))}
        </div>
      </div>

      {/* ── NAV ── */}
      <div style={{ background:"#fff",borderBottom:`1px solid ${C.creamBorder}`,position:"sticky",top:0,zIndex:50,display:"flex",overflowX:"auto" }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ flexShrink:0,padding:"14px 18px",fontSize:12,letterSpacing:"0.05em",textTransform:"uppercase",background:"none",border:"none",borderBottom:activeSection===s.id?`2px solid ${s.color}`:"2px solid transparent",color:activeSection===s.id?s.color:C.inkMuted,cursor:"pointer",fontFamily:"inherit",fontWeight:activeSection===s.id?500:400,transition:"color 0.2s" }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      {currentSection && (
        <div style={{ maxWidth:760,margin:"0 auto",padding:"0 0 80px" }}>
          {/* Section header */}
          <div style={{ padding:"36px 24px 24px" }}>
            <div style={{ fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:C.inkFaint,marginBottom:8 }}>
              {SECTIONS.findIndex(s=>s.id===activeSection)+1} / {SECTIONS.length}
            </div>
            <div style={{ fontFamily:"Georgia,serif",fontSize:32,fontWeight:700,color:currentSection.color,marginBottom:6 }}>{currentSection.emoji} {currentSection.label}</div>
            <div style={{ fontSize:12,color:C.inkMuted,background:C.badge,border:`1px solid ${C.creamBorder}`,borderRadius:4,display:"inline-block",padding:"4px 10px" }}>{currentSection.dates}</div>
          </div>

          {/* Seasonal averages (live per-day forecast sits in each day header) */}
          {currentSection.coords && <SeasonalPanel section={currentSection} />}

          {/* Days */}
          {getMergedDays(currentSection).map(day => {
            const dayForecast = forecast.byDate[day.date];
            const fp = { forecast: dayForecast, forecastLoading: forecast.loading };
            // Wengen Wed/Thu share a synced main-activity selection.
            if (day.activityOptions && activeSection === "wengen") {
              if (day.id === "wengen-jun17") {
                return <DayCard key={day.id} day={day} color={currentSection.color} onEdit={setEditItem}
                  activityKey={wengenActivity} onActivityChange={setWengenActivity} {...fp} />;
              }
              if (day.id === "wengen-jun18") {
                const matched = day.activityMatch?.[wengenActivity] || day.activityOptions[0].key;
                return <DayCard key={day.id} day={day} color={currentSection.color} onEdit={setEditItem}
                  activityKey={matched} {...fp} />;
              }
            }
            return <DayCard key={day.id} day={day} color={currentSection.color} onEdit={setEditItem} {...fp} />;
          })}
        </div>
      )}

      {/* ── FAB: ADD ACTIVITY ── */}
      <div style={{ position:"fixed",bottom:24,right:24,zIndex:100,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8 }}>
        {saving && <div style={{ background:"rgba(0,0,0,0.7)",color:"#fff",fontSize:11,borderRadius:20,padding:"4px 12px" }}>Saving…</div>}
        <button onClick={() => setShowAdd(true)} style={{ background:C.gold,color:"#fff",border:"none",borderRadius:28,padding:"13px 20px",fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 16px rgba(201,168,76,0.4)",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit" }}>
          <span style={{ fontSize:18,lineHeight:1 }}>＋</span> Add Activity
        </button>
      </div>

      {/* ── MODALS ── */}
      {showAdd && <AddActivityModal sections={SECTIONS} onSave={handleAddActivity} onClose={() => setShowAdd(false)} />}
      {editItem && (
        <EditItemModal
          item={editItem}
          onSave={handleEditSave}
          onReset={() => handleRestore(editItem)}
          onClose={() => setEditItem(null)}
        />
      )}
    </div>
  );
}
