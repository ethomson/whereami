import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';

export type Location = {
  ip: string,
  city: string,
  region: string | null,
  country: string,
  latitude: string,
  longitude: string,
  timezone: string
};

const inter = Inter({ subsets: ['latin'], variable: '--inter-font' })

export default function Home() {
  const [ mapVisible, setMapVisible ] = useState(false);
  const [ location, setLocation ] = useState<Location | null>(null);
  const [ error, setError ] = useState<string | null>(null);

  const loadLocation = async () => {
    const response = await fetch('/api/location');
    const location = await response.json();

    if (!location.ip || !location.city || !location.country ||
        !location.latitude.match(/^\d+\.\d+$/) ||
        !location.longitude.match(/^\d+\.\d+$/)) {
      setError('Could not identify location: server returned invalid location results');
      setLocation(null);
      setMapVisible(false);
    } else {
      setError(null);
      setLocation(location);
      setMapVisible(true);
    }
  };

  useEffect(() => { loadLocation() }, []);

  return (
    <>
      <Head>
        <title>Where Am I?</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.error} style={{ visibility: error ? 'visible' : 'hidden' }}>
          {error}
        </div>
        <div className={styles.center} style={{ visibility: error ? 'hidden' : 'visible' }}>
          { location ?
              (
                <div className={inter.className}>
                  <span className={styles.preamble}>
                    Your IP address of
                    <span className={styles.ip}>{location.ip}</span>
                    places you in
                  </span>
                  <span className={styles.city}>
                    {location.city}
                  </span>
                  { location.region ? 
                      (
                        <span className={styles.region}>
                          {location.region || ''}
                          {location.region ? ', ' : ''}
                        </span>
                      ) : ''
                  }
                  <span className={styles.country}>
                    {location.country}
                  </span>
                </div>
              ) :
              (
                <span className={styles.loading}>Locating...</span>
              )
          }
        </div>

        <div className={styles.map}>
          <iframe
            style={{ border: 0, visibility: mapVisible ? 'visible' : 'hidden' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={ location ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBwFQx_s7cuSysZFTgxs1UX9_YlEoukSHM&q=${location.latitude},${location.longitude}&zoom=12` : '' }>
          </iframe>
        </div>
      </main>
    </>
  )
}
