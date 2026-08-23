"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Role } from "./api/types";

interface RBACContextType {
  role: Role;
  setRole: (role: Role) => void;
  userName: string;
  facilityName: string;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("PHC_ADMIN");
  const [userName, setUserName] = useState<string>("Dr. Administrator");
  const [facilityName, setFacilityName] = useState<string>("PHC Shahpur");

  useEffect(() => {
    const saved = localStorage.getItem("ai_chikitsalya_role") as Role;
    if (saved) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("ai_chikitsalya_role", newRole);
    
    // Set realistic user labels
    switch (newRole) {
      case "PATIENT":
        setUserName("Ram Charan Devi");
        setFacilityName("Sub-Centre Khedi");
        break;
      case "HEALTH_WORKER":
        setUserName("ASHA Sunita Devi");
        setFacilityName("Sub-Centre Khedi");
        break;
      case "DOCTOR":
        setUserName("Dr. Ramesh Sharma");
        setFacilityName("PHC Shahpur");
        break;
      case "PHC_ADMIN":
        setUserName("Medical Officer In-Charge");
        setFacilityName("PHC Shahpur");
        break;
      case "HOSPITAL_ADMIN":
        setUserName("Hospital Superintendent");
        setFacilityName("District Hospital Rampur");
        break;
      case "DISTRICT_ADMIN":
        setUserName("District Chief Medical Officer (CMO)");
        setFacilityName("Rampur Health District HQ");
        break;
    }
  };

  return (
    <RBACContext.Provider value={{ role, setRole, userName, facilityName }}>
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error("useRBAC must be used within an RBACProvider");
  }
  return context;
}
