import { createContext, useContext, useEffect } from "react";

// Custom hooks
import useAccountState from "../hooks/account/useAccountState";
import useAccountController from "../hooks/account/useAccountController";

// Context
import { AppContext, VALIDATED_ROUTES } from "./AppProvider";

export const AccountContext = createContext();

const AccountProvider = ({children}) => {

    // Context
    const appContext = useContext(AppContext);

    // Reducers
    const {} = useAccountState();
    const { account, dispatchAccount, accountLoading, accountController } = useAccountController(appContext);

    /*! Gets account if user isn't on the anonymous route */
    useEffect(() =>{ 
        const splPathName = location.pathname.split('/');
        if (location.pathname === '/' || splPathName.some((nm) => VALIDATED_ROUTES.includes(nm)))
            accountController.get(); 
    }, []); 

    return(
        <AccountContext.Provider value={{accountController, account, dispatchAccount, accountLoading}}>
            {children}
        </AccountContext.Provider>
    );
}

export default AccountProvider;