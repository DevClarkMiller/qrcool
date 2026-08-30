import { useState, useRef, useEffect } from "react";

function useFileState(){
    const [file, setFile] = useState(null);
    const fileRef = useRef(file);
    
    useEffect(() => { fileRef.current = file; }, [file]);

    return {file, setFile, fileRef};
}

export default useFileState;