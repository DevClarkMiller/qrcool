import { useEffect, useReducer, useRef, useState } from "react";
import { INITIAL_STATE, loginReducer } from "../../pages/reducers/loginReducer";

const useAccountState = () =>{
    const [account, dispatchAccount] = useReducer(loginReducer, INITIAL_STATE);
    const [accountLoading, setAccountLoading] = useState(true);
    const accountRef = useRef(account);

    useEffect(() =>{
        accountRef.current = account;
    }, [account]);

    return { account, dispatchAccount, accountLoading, setAccountLoading, accountRef }
}

export default useAccountState;