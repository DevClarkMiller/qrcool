import { useMemo, useEffect, useState } from "react";
import Controller from "../../tools/controller";

function useContentTypeController(appContext, account){
  const [contentType, setContentType] = useState(null);

  const contentTypeController = useMemo(() =>{
      class ContentTypeController extends Controller{
          constructor(context){
            super(context);
          }
      
          async get(){
            return new Promise((resolve) =>{
              super.get('/contentType/', response =>{
                resolve(response.data);
              });
            }); 
          }
      }

      return new ContentTypeController(appContext);
  }, [appContext]);

  useEffect(() =>{
    async function fetchContentType(){
      const conType = await contentTypeController.get();
      setContentType(conType);
    }

    if(account?.LoggedIn && !contentType){
        fetchContentType();
    }
    
  }, [account]);

  return {contentType, contentTypeController};
}

export default useContentTypeController;