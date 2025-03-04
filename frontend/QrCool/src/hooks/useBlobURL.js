import { useState, useEffect } from "react";

/* Hook: useBlobUrl
*  Brief: Creates a url for a blob
*/
function useBlobUrl(data, type){
    const [blobURL, setBlobURL] = useState(null);
        
    useEffect(() =>{
        const blob = new Blob([data], {type: type});
        const url = URL.createObjectURL(blob);
        setBlobURL(url);
        console.log(url);

        return () =>{
            URL.revokeObjectURL(url);
        }
    }, [data]);

    return blobURL;
}

export default useBlobUrl;