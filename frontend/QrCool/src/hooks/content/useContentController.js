import { useMemo, useEffect, useState } from "react";
import Controller from "../../tools/controller";

function useContentController(appContext, entryContentRef){
    const [anonymousData, setAnonymousData] = useState(null);

    const contentController = useMemo(() =>{
        class ContentController extends Controller{
            constructor(context){
                super(context);
            }
    
            async post(activeEntry, ){
                super.post('/content/add', { EntryId: activeEntry?.Id, Content: entryContentRef.current?.Content }, response =>{
                this.appContext.setHeaderStatus("text-green-500", response.data, 2500);
                })
            }
    
            async getAnonymous(contentId, contentType){
                switch(contentType){
                case "Text":
                    super.get(`/content/anonymous/${contentId}`, response =>{
                    this.appContext.setHeaderStatus("text-green-500", "Found content", 2500);
                    setAnonymousData(response.data);
                    });
                    break;
                default:
                    super.getBlob(`/content/anonymous/${contentId}`, response =>{
                    this.appContext.setHeaderStatus("text-green-500", "Found content", 2500);
                    setAnonymousData(response.data);
                    });
                }
            }
        }

        return new ContentController(appContext);
    }, [appContext]);

    return { anonymousData, setAnonymousData, contentController };
}

export default useContentController;