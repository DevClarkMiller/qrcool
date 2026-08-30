import { createContext, useContext, useEffect } from "react";

// Custom hooks
import useAccountController from "../hooks/account/useAccountController";

// Context
import { AppContext, VALIDATED_ROUTES, MUST_LOGIN } from "./AppProvider";

export const AccountContext = createContext();

const AccountProvider = ({children}) => {

    // Context
    const appContext = useContext(AppContext);
 
    // Reducers
    const { account, dispatchAccount, accountLoading, accountController, setAccountLoading } = useAccountController(appContext);

    /*! Gets account if user isn't on the anonymous route */
    useEffect(() =>{ 
        const splPathName = location.pathname.split('/');
        const isHome = splPathName.some(nm => nm.trim() === "");
        const doRedirect = splPathName.some((nm) => MUST_LOGIN.has(nm)) || isHome; 
        if (location.pathname === '/' || splPathName.some((nm) => VALIDATED_ROUTES.has(nm)))
            accountController.get(doRedirect); 
        else
            setAccountLoading(false); // Account isn't loading on unvalidated routes
    }, []); 


    return(
        <AccountContext.Provider value={{accountController, account, dispatchAccount, accountLoading, setAccountLoading}}>
            {children}
        </AccountContext.Provider>
    );
}

export default AccountProvider;