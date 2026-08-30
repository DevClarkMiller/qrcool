import { useMemo, useEffect, useReducer, useRef, useState } from "react";
import Controller from "../../tools/controller";

import makeEntryStale from "../../../lib/makeEntryStale";

// Custom hook
import useFileState from '../../hooks/content/useFileState';

import {ENTRYCONTENT_ACTIONS, entryContentReducer, INITIAL_ENTRYCONTENT_STATE} from '../../reducers/entryContentReducer';

function useEntryContentController(
    appContext, 
    entryController, 
    setActiveEntry,
    setShowModal
){

  // State
  const [entryContent, setEntryContent] = useState(null);
  const [anonymousData, setAnonymousData] = useState(null);
  const [anonymousDataLoading, setAnonymousDataLoading] = useState(true);

  // Reducers
  const [entryContentRed, dispatchEntryContent] = useReducer(entryContentReducer, INITIAL_ENTRYCONTENT_STATE);

  // Ref
  const entryContentRef = useRef(entryContentRed);  
  
  // Ref assignment
  useEffect(() => { entryContentRef.current = entryContentRed; }, [entryContentRed]);

  const {file, setFile, fileRef} = useFileState();

  const entryContentController = useMemo(() =>{
      class EntryContentController extends Controller{
        constructor(context){
          super(context);
        }
    
        ecFieldChange(e){
          dispatchEntryContent({
            type: ENTRYCONTENT_ACTIONS.UPDATE_ENTRYCONTENT_FIELD,
            payload: { name: e.target.name, value:e.target.value }
          });
        }
        
        contentFieldChange(e){
          dispatchEntryContent({
            type: ENTRYCONTENT_ACTIONS.UPDATE_CONTENT_FIELD,
            payload: { name: e.target.name, value:e.target.value }
          });
        }
    
        ecFieldSet(name, val){
          dispatchEntryContent({
            type: ENTRYCONTENT_ACTIONS.UPDATE_ENTRYCONTENT_FIELD,
            payload: { name: name, value:val }
          });
        }
    
        contentFieldSet(name, val){
          dispatchEntryContent({
            type: ENTRYCONTENT_ACTIONS.UPDATE_CONTENT_FIELD,
            payload: { name: name, value:val }
          });
        }
    
        reset(){
          dispatchEntryContent({type: ENTRYCONTENT_ACTIONS.RESET_FIELDS})
        }
    
        async get(entry){
          // Check to see if the entrys content is in local storage
          const store = localStorage.getItem(`entry-${entry.Id}`);
          let ents = localStorage.getItem('entries');
          if (!ents) ents = {}; // Inits as a new dictionary
          else ents = JSON.parse(ents);

          if (ents[entry.Id]){
            setEntryContent(ents[entry.Id]);
            setActiveEntry(entry);
            setShowModal(true);
            return;
          }
          super.get(`/entryContent/${entry.Id}`, response =>{
            setEntryContent(response.data);

            // Updates the localstorage entries store to be up to date
            ents[entry.Id] = response.data;
            localStorage.setItem('entries', JSON.stringify(ents));

            setActiveEntry(entry);
            setShowModal(true);
          }, null);
        }
    
        async set(entryContent){
          super.set(`/entryContent/${entryContent.Id}`, null, response =>{
            this.appContext.setHeaderStatus("text-green-500", response.data, 2500);
            // Refetch the entry to show the change in active entryContent
            const entry = entryController.getById(entryContent.EntryId);
            makeEntryStale(entry.Id);
            this.get(entry);
          });
        }
    
        async delete(entCon){
          super.delete(`/entryContent/${entCon.Id}`, response =>{
            this.appContext.setHeaderStatus("text-green-500", response.data, 2500);
            // Only refetch the entry content if it's active
            if (entCon.IsActive){
              const entry = entryController.getById(entCon.EntryId);
              makeEntryStale(entry.Id);
              this.get(entry);
            }else{
              const newEntryContent = entryContent.filter(ec => ec.Id !== entCon.Id);
              setEntryContent(newEntryContent);
            }
          }, err => this.appContext.handleErr(err, true));
        }
      
        async post(entryId){
          super.post(`/entryContent/${entryId}`, entryContentRef.current?.Content, response =>{
            this.appContext.setHeaderStatus("text-green-500", response.data, 2500);
            // Refetch entry content after to be up to date
            const entry = entryController.getById(entryId);
            makeEntryStale(entry.Id);
            this.get(entry);
          });
        }
      
        async postFile(entryId){
          super.postFile(`/entryContent/file/${entryId}/${entryContentRef.current.Content.ContentTypeId}/${entryContentRef.current.Content.Name}`, fileRef.current, response =>{
            this.appContext.setHeaderStatus("text-green-500", response.data, 2500);
            const entry = entryController.getById(entryId);
            makeEntryStale(entry.Id);
            this.get(entry);
          }, err =>{
            if (err?.response){ 
              this.appContext.handleErr(err, true);
            }else
              console.error('FILE TOO BIG');
              this.appContext.setHeaderStatus('text-red-500', 'File too Big', 2500);
          });
        }

        async getAnonymous(entryContentId, contentType, location = null){
          switch(contentType){
          case "Text":
            super.get(`/entryContent/anonymous/${entryContentId}`, response =>{
              this.appContext.setHeaderStatus("text-green-500", "Found content", 2500);
              setAnonymousData(response.data);
              setAnonymousDataLoading(false);
            }, err => setAnonymousDataLoading(false), location);
            break;
          default:
            super.getBlob(`/entryContent/anonymous/${entryContentId}`, response =>{
              this.appContext.setHeaderStatus("text-green-500", "Found content", 2500);
              setAnonymousData(response.data);
              setAnonymousDataLoading(false);
            }, err => setAnonymousDataLoading(false), location);
          }
        }
      }

      return new EntryContentController(appContext);
  }, [appContext]);

  return {anonymousData, anonymousDataLoading, entryContent, setEntryContent, entryContentRed, dispatchEntryContent, entryContentRef, entryContentController, file, setFile, fileRef};
}

export default useEntryContentController;