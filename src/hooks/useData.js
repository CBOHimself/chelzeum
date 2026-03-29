import { useState, useEffect } from 'react';
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
        const artworksRes = await fetch(
          `${import.meta.env.BASE_URL}data/artworks.json`
        );
        if (!artworksRes.ok) throw new Error('Failed to load artworks');
        const artworksData = await artworksRes.json();
        setData({
          artworks: Array.isArray(artworksData) ? artworksData : [],
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
