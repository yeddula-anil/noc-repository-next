import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const StaffContext = createContext(null);

export const StaffProvider = ({ children }) => {
  const { data: session } = useSession();
  const [staff, setStaff] = useState(null);
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/staff/get-profile?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setStaff(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [email]);

  return (
    <StaffContext.Provider value={{ staff }}>
      {children}
    </StaffContext.Provider>
  );
};

// Hook for convenience
export const useStaff = () => useContext(StaffContext);
