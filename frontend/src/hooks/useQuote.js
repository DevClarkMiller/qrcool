import { useEffect, useState } from "react";
import api from "../api";

function useQuote(){
    const [quote, setQuote] = useState("");
    
    async function fetchQuote(){
        try{
            const response = await api.get('/quote');
            setQuote(response.data);
        }catch(err){
            console.error(`Couldn't fetch quote: ${err.message}`);
        }
    }

    useEffect(() =>{ fetchQuote(); }, []);

    return quote;
}

export default useQuote;