import { createContext, useContext, useEffect } from "react";

// Custom hooks
import useAccountController from "../hooks/account/useAccountController";

// Context
import { AppContext, VALIDATED_ROUTES } from "./AppProvider";

export const AccountContext = createContext();

const AccountProvider = ({children}) => {

    // Context
    const appContext = useContext(AppContext);

    // Reducers
    const { account, dispatchAccount, accountLoading, accountController, setAccountLoading } = useAccountController(appContext);

    /*! Gets account if user isn't on the anonymous route */
    useEffect(() =>{ 
        const splPathName = location.pathname.split('/');
        console.log(splPathName.some((nm) => VALIDATED_ROUTES.includes(nm)));
        // console.log(location.pathname === '/' || splPathName.some((nm) => VALIDATED_ROUTES.includes(nm)));
        if (location.pathname === '/' || splPathName.some((nm) => VALIDATED_ROUTES.includes(nm)))
            accountController.get(); 
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