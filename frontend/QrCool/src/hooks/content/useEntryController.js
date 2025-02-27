import { useMemo } from "react";

import Controller from "../../tools/controller";

function useEntryController(appContext, entries, setEntries){
    const entryController = useMemo(() =>{
        class EntryController extends Controller{
            constructor(context){
              super(context);
            }

            async getViewCount(entryId){
              return new Promise((resolve) =>{
                super.get(`/entryView/${entryId}`, response =>{
                  resolve(response.data);
                });
              });
            }
        
            async get(){
              super.get('/entry', response =>{
                setEntries(response.data);
              });
            }
        
            getById(entryId){
              // Finds the entry in state by its id
              const entry = entries.find((ent) => ent.Id === entryId);
              return entry;
            }
        
            async post(entryName){
              super.post(`/entry/${entryName}`, null, response =>{
                appContext.setHeaderStatus("text-green-500", response.data, 2500);
                this.get();
              });
            }
        
            async delete(entryId){
              super.delete(`/entry/${entryId}`, response =>{
                appContext.setHeaderStatus("text-green-500", response.data, 2500);
                let newEntries = entries.filter((entry) => entry.Id !== entryId)
                setEntries(newEntries);
                // this.get();
              }, err => this.appContext.handleErr(err, true));
            }
        }

        return new EntryController(appContext)
    }, [appContext, entries, setEntries]);

    return entryController;
}

export default useEntryController;