import { useState, useEffect } from "react";

function useEntryViewCount(entryId, entryController){
    const [viewCount, setViewCount] = useState(null);

    useEffect(() =>{
        async function fetchCount(){
            const cnt = entryController.getViewCount(entryId);
            setViewCount(cnt);
        }
        if (!viewCount) // Only need to grab the viewCount once, and keep trying until
            fetchCount();
    }, [entryController]);

    return viewCount;
}

export default useEntryViewCount;