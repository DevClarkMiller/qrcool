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

function BlobContent({data, loadingMsg, children, type, loading}){
    const blobURL = useBlobUrl(data, type);

    return (<>{loading ? 
            <p className="text-3xl">{loadingMsg}</p> : 
            React.cloneElement(children, { src: blobURL })
        }</>);
}

function VideoContent({data, blobURL, loading}){
    return(
        <BlobContent type="video/mp4" data={data} loadingMsg="Loading video..." loading={loading}>
            <video controls className="w-full" src={blobURL}/>
        </BlobContent>
    );
}

function ImageContent({data, blobURL, loading}){
    return(
        <BlobContent type="image/png" data={data} loadingMsg="Loading image..." loading={loading}>
            <img className="w-full lg:w-1/3" src={blobURL} />
        </BlobContent>
    );
}

function AudioContent({data, blobURL, loading}){
    return(
        <BlobContent data={data} type="audio/mp3"  loadingMsg="Loading audio..." loading={loading}>
            <audio controls className="w-full md:w-1/3" src={blobURL}/>
        </BlobContent>
    );
}

function useContent(){
    const { entryContentController, anonymousData, anonymousDataLoading} = useContext(ContentContext);
    
    const params = useParams();

    const [content, setContent] = useState(<></>);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(true);
 
    useEffect(() =>{
        navigator.geolocation.getCurrentPosition((pos) =>{
            setLatitude(pos.coords.latitude);
            setLongitude(pos.coords.longitude);
            setLoading(false);
        }, err =>{
            console.error(err);
            setLoading(false);
        });
    }, []);

    useEffect(() =>{
        switch(params?.contentType){
            case "Text":
                setContent(<TextContent data={anonymousData} />);
                break;
            case "Image":
                setContent(<ImageContent data={anonymousData} loading={anonymousDataLoading}/>);
                break;
            case "Video":
                setContent(<VideoContent data={anonymousData} loading={anonymousDataLoading} /> );
                break;
            case "Audio":
                setContent(<AudioContent data={anonymousData} loading={anonymousDataLoading}/>);
                break;
        }
    }, [anonymousData]);

    useEffect(() => {
        if (!loading){
            entryContentController.getAnonymous(params?.entryContentId, params?.contentType, {
                Longitude: longitude,
                Latitude: latitude
            });
        }
    }, [params?.contentId, loading]);

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