import { createContext, useContext, useState } from 'react';

const LogoCtx = createContext({ logoUrl: null, setLogoUrl: () => {} });

export function LogoProvider({ children }) {
  const [logoUrl, setLogoUrl] = useState(null);
  return <LogoCtx.Provider value={{ logoUrl, setLogoUrl }}>{children}</LogoCtx.Provider>;
}

export function useLogo() {
  return useContext(LogoCtx);
}
