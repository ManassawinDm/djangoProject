import React, { createContext, useContext, useState } from 'react';

const LogoContext = createContext();

export const useLogo = () => {
  return useContext(LogoContext);
};

export const LogoProvider = ({ children }) => {
  const [logoAnimation, setLogoAnimation] = useState(false);
  const [isItemRemoved, setIsItemRemoved] = useState(false); 

  const triggerLogoAnimation = () => {
    setLogoAnimation(true);
    setTimeout(() => setLogoAnimation(false), 250); 
  };

  const triggerRemoved = () => {
    setIsItemRemoved(true);
    setTimeout(() => setIsItemRemoved(false), 1000);
  };

  return (
    <LogoContext.Provider value={{ logoAnimation, triggerLogoAnimation, isItemRemoved, setIsItemRemoved, triggerRemoved }}>
      {children}
    </LogoContext.Provider>
  );
};
