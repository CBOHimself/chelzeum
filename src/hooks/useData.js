import { useState, useEffect } from 'react';
import artworksData from '../data/artworks.json';
import showsData from '../data/shows.json';
import campaignsData from '../data/campaigns.json';
import siteConfigData from '../data/siteConfig.json';

/**
 * Wraps local JSON imports in an async-style interface so swapping
 * to a remote CMS later requires changing only this hook.
 */
export default function useData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    artworks: [],
    shows: [],
    campaigns: [],
    siteConfig: {},
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Swap these static imports for fetch() / CMS SDK calls when ready
        setData({
          artworks: artworksData,
          shows: showsData,
          campaigns: campaignsData,
          siteConfig: siteConfigData,
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { ...data, loading };
}
