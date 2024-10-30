import React, { createContext, useContext, useState } from 'react';

const LogoContext = createContext();

export const useLogo = () => {
  return useContext(LogoContext);
};

export const LogoProvider = ({ children }) => {
  const [logoAnimation, setLogoAnimation] = useState(false);

  const triggerLogoAnimation = () => {
    setLogoAnimation(true);
    setTimeout(() => setLogoAnimation(false), 250); 
  };

  return (
    <LogoContext.Provider value={{ logoAnimation, triggerLogoAnimation }}>
      {children}
    </LogoContext.Provider>
  );
};
