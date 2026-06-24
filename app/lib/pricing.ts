// Real-world travel times in minutes based on actual Kenyan bus journeys
const travelData: Record<string, { mins: number; dist: number }> = {
  "Nairobi-Kisii": { mins: 420, dist: 306 },
  "Nairobi-Kisumu": { mins: 450, dist: 340 },
  "Nairobi-Mombasa": { mins: 480, dist: 480 },
  "Nairobi-Nakuru": { mins: 150, dist: 156 },
  "Nairobi-Eldoret": { mins: 270, dist: 313 },
  "Nairobi-Thika": { mins: 45, dist: 42 },
  "Nairobi-Migori": { mins: 450, dist: 380 },
  "Nairobi-Homa Bay": { mins: 450, dist: 370 },
  "Nairobi-Kericho": { mins: 270, dist: 260 },
  "Nairobi-Bomet": { mins: 300, dist: 280 },
  "Nairobi-Narok": { mins: 150, dist: 140 },
  "Nairobi-Bungoma": { mins: 390, dist: 380 },
  "Nairobi-Kakamega": { mins: 360, dist: 360 },
  "Nairobi-Kitale": { mins: 390, dist: 370 },
  "Nairobi-Malindi": { mins: 480, dist: 580 },
  "Nairobi-Meru": { mins: 210, dist: 230 },
  "Nairobi-Nyeri": { mins: 150, dist: 150 },
  "Nairobi-Embu": { mins: 120, dist: 120 },
  "Nairobi-Machakos": { mins: 75, dist: 65 },
  "Nairobi-Nanyuki": { mins: 180, dist: 200 },
  "Nairobi-Isiolo": { mins: 240, dist: 275 },
  "Nairobi-Voi": { mins: 300, dist: 330 },
  "Nairobi-Kilifi": { mins: 420, dist: 440 },
  "Nairobi-Siaya": { mins: 420, dist: 370 },
  "Nairobi-Naivasha": { mins: 90, dist: 90 },
  "Nairobi-Nyahururu": { mins: 180, dist: 190 },
  "Mombasa-Kisumu": { mins: 720, dist: 820 },
  "Mombasa-Kisii": { mins: 660, dist: 760 },
  "Mombasa-Malindi": { mins: 120, dist: 110 },
  "Mombasa-Voi": { mins: 150, dist: 160 },
  "Mombasa-Kilifi": { mins: 60, dist: 60 },
  "Mombasa-Nakuru": { mins: 540, dist: 580 },
  "Kisumu-Eldoret": { mins: 120, dist: 110 },
  "Kisumu-Kisii": { mins: 120, dist: 115 },
  "Kisumu-Kakamega": { mins: 60, dist: 55 },
  "Kisumu-Siaya": { mins: 45, dist: 40 },
  "Kisumu-Homa Bay": { mins: 120, dist: 120 },
  "Kisumu-Bungoma": { mins: 150, dist: 120 },
  "Kisumu-Migori": { mins: 150, dist: 130 },
  "Kisii-Migori": { mins: 75, dist: 60 },
  "Kisii-Bomet": { mins: 90, dist: 80 },
  "Kisii-Rongo": { mins: 60, dist: 45 },
  "Kisii-Homa Bay": { mins: 90, dist: 90 },
  "Kisii-Keroka": { mins: 40, dist: 30 },
  "Kisii-Awendo": { mins: 60, dist: 50 },
  "Nakuru-Eldoret": { mins: 150, dist: 157 },
  "Nakuru-Kisumu": { mins: 180, dist: 186 },
  "Nakuru-Narok": { mins: 120, dist: 120 },
  "Nakuru-Nyahururu": { mins: 90, dist: 80 },
  "Nakuru-Naivasha": { mins: 60, dist: 60 },
  "Eldoret-Kitale": { mins: 75, dist: 65 },
  "Eldoret-Bungoma": { mins: 90, dist: 80 },
  "Eldoret-Kakamega": { mins: 75, dist: 60 },
  "Eldoret-Webuye": { mins: 60, dist: 50 },
};

// Fare rates — defaults match the seeded DB values, overwritten by loadFares()
let BASE_RATE = 4.5;
let AIRPORT_BASE = 1500;
let AIRPORT_RATE = 5.5;

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";

// Fetch live rates from the backend. Call once on app load.
// Falls back silently to defaults if the request fails.
export async function loadFares(): Promise<void> {
  try {
    const res = await fetch(`${API}/fares`);
    const data = await res.json();
    if (data.success && data.rates) {
      BASE_RATE = Number(data.rates.base_rate) || BASE_RATE;
      AIRPORT_BASE = Number(data.rates.airport_base) || AIRPORT_BASE;
      AIRPORT_RATE = Number(data.rates.airport_rate) || AIRPORT_RATE;
    }
  } catch {
    // keep defaults
  }
}

function getKey(from: string, to: string) {
  const clean = (s: string) => s.split("(")[0].trim();
  const f = clean(from);
  const t = clean(to);
  return travelData[`${f}-${t}`] || travelData[`${t}-${f}`] || null;
}

export function getDistance(from: string, to: string): number {
  return getKey(from, to)?.dist || 200;
}

export function getTravelTime(from: string, to: string, isAirport = false): { hours: number; minutes: number; label: string } {
  const data = getKey(from, to);
  const totalMins = isAirport ? Math.round((getDistance(from, to) / 50) * 60) : (data?.mins || 240);
  const hours = Math.floor(totalMins / 60);
  const minutes = totalMins % 60;
  const label = minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  return { hours, minutes, label };
}

export function calculateFare(from: string, to: string, isAirport = false): number {
  const dist = getDistance(from, to);
  const fare = isAirport ? AIRPORT_BASE + dist * AIRPORT_RATE : dist * BASE_RATE;
  return Math.round(fare / 50) * 50;
}

export function getArrivalTime(depTime: string, from: string, to: string, isAirport = false): string {
  const [h, m] = depTime.split(":").map(Number);
  const { hours, minutes } = getTravelTime(from, to, isAirport);
  const totalMins = h * 60 + m + hours * 60 + minutes;
  const arrH = Math.floor(totalMins / 60) % 24;
  const arrM = totalMins % 60;
  return `${String(arrH).padStart(2,"0")}:${String(arrM).padStart(2,"0")}`;
}
