import { useEffect, useState } from "react";

function useAccountCount(accountController){
    const [accountCount, setAccountCount] = useState(0);

    useEffect(() =>{
        async function fetchAccountCount(){
            const count = await accountController.getCount(); // Gets the number of registered accounts
            setAccountCount(count);
        }
        fetchAccountCount();
    }, [accountController]);

    return accountCount;
}

export default useAccountCount;