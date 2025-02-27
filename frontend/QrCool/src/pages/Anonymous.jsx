import React from "react";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";

// Custom hooks
import useBlobUrl from "../hooks/useBlobURL";

// Context
import { ContentContext } from "../context/ContentProvider";

function TextContent({data}){
    return(
        <p className="text-xl">{data}</p>
    );
}

function BlobContent({data, loadingMsg, children, type}){
    const blobURL = useBlobUrl(data, type);

    if (!blobURL) {
        return <p>{loadingMsg}</p>;
    }

    return React.cloneElement(children, { src: blobURL });
}

function VideoContent({data, blobURL}){
    return(
        <BlobContent type="video/mp4" data={data} loadingMsg="Loading video...">
            <video controls className="w-full " src={blobURL}/>
        </BlobContent>
        
    );
}

function ImageContent({data, blobURL}){
    return(
        <BlobContent type="image/png" data={data} loadingMsg="Loading image...">
            <img className="w-full md:w-1/3" src={blobURL} />
        </BlobContent>
    );
}

function AudioContent({data, blobURL}){
    return(
        <BlobContent data={data} type="audio/mp3"  loadingMsg="Loading audio...">
            <audio controls className="w-full md:w-1/3" src={blobURL}/>
        </BlobContent>
    );
}

function useContent(){
    const {contentController, anonymousData} = useContext(ContentContext);
    
    const params = useParams();
    const [content, setContent] = useState(<></>);

    useEffect(() =>{
        switch(params?.contentType){
            case "Text":
                setContent(<TextContent data={anonymousData}/>);
                break;
            case "Image":
                setContent(<ImageContent data={anonymousData}/>);
                break;
            case "Video":
                setContent(<VideoContent data={anonymousData} /> );
                break;
            case "Audio":
                setContent(<AudioContent data={anonymousData}/>);
                break;
        }
    }, [anonymousData]);

    useEffect(() => {
        contentController.getAnonymous(params?.contentId, params?.contentType);
    }, [params?.contentId]);

    return content;
}

const Anonymous = () => {
    const content = useContent();

    return (
        <div className="size-full col-flex-center justify-center p-1 overflow-auto">
            {content}
        </div>
    );
}

export default Anonymous;