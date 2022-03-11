import React, { createContext, useContext } from "react";

export const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({children}) {
    const user = {
        login: true,
    };
    return <authContext.Provider value={{user}}>{children}</authContext.Provider>;
}