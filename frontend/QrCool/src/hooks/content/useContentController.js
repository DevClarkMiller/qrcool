import { useMemo, useEffect, useState } from "react";
import Controller from "../../tools/controller";

function useContentController(appContext, entryContentRef){
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
        }

        return new ContentController(appContext);
    }, [appContext]);

    return { contentController };
}

export default useContentController;