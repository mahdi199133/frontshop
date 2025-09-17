import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { SiteConfiguration } from '../types';
import { fetchSiteConfig } from '../services/configService';

interface SiteConfigContextType {
  config: SiteConfiguration | null;
  loading: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfiguration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const fetchedConfig = await fetchSiteConfig();
        setConfig(fetchedConfig);
      } catch (error) {
        console.error("Failed to load site configuration", error);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const value = { config, loading };

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
