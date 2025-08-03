// utils/calculateEta.ts

type DeliveryType = 'priority' | 'regular' | 'polling';

interface EtaResult {
  eta: Date;
  etaInMinutes: number;
}

const SPEEDS: Record<DeliveryType, number> = {
  priority: 60, // km/h
  regular: 40,
  polling: 30,
};

const DELAYS: Record<DeliveryType, number> = {
  priority: 0,  // mins
  regular: 0,
  polling: 5,
};

export function calculateEta(distanceKm: number, type: DeliveryType): EtaResult {
  if (!SPEEDS[type]) {
    throw new Error(`Invalid delivery type: ${type}`);
  }

  const speed = SPEEDS[type];
  const delay = DELAYS[type];

  const travelMinutes = (distanceKm / speed) * 60;
  const totalEtaMinutes = travelMinutes + delay;
  const eta = new Date(Date.now() + totalEtaMinutes * 60_000);

  return {
    eta,
    etaInMinutes: Math.round(totalEtaMinutes),
  };
}
