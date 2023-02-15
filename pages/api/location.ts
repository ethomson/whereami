import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge'
};

export type Location = {
  ip: string,
  computeRegion: string,
  city: string,
  region: string | null,
  country: string,
  latitude: string,
  longitude: string,
  timezone: string
};

const devLocation: Location = {
  'ip': '127.0.0.1',
  'computeRegion': 'localhost',
  'city': 'Brescia',
  'region': 'Lombardy',
  'country': 'IT',
  'latitude': '45.5336',
  'longitude': '10.2194',
  'timezone': 'Europe/Rome'
};

export default function handler(req: NextRequest, res: NextResponse) {
  let data: Location;

  if (process.env.NODE_ENV === "development") {
    data = devLocation;
  } else {
    data = {
      ip: req.headers.get('x-real-ip') || '127.0.0.1',
      computeRegion: process.env.VERCEL_REGION || 'Unknown',
      city: req.headers.get('x-vercel-ip-city') || 'Unknown',
      region: req.headers.get('x-vercel-ip-country-region'),
      country: req.headers.get('x-vercel-ip-country') || '??',
      latitude: req.headers.get('x-vercel-ip-latitude') || '0.0000',
      longitude: req.headers.get('x-vercel-ip-longitude') || '0.0000',
      timezone: req.headers.get('x-vercel-ip-timezone') || 'Unknown'
    }
  };

  return NextResponse.json(data);
}
