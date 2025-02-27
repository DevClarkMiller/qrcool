import { useState, useEffect } from "react";

function useEntryViewCount(entryId, entryController){
    const [viewCount, setViewCount] = useState(0);

    useEffect(() =>{
        async function fetchCount(){
            const cnt = entryController.getViewCount(entryId);
            setViewCount(cnt);
        }
        fetchCount();
    }, [entryController]);

    return viewCount;
}

export default useEntryViewCount;