import { createContext, useEffect, useState } from "react";
import api from "../api";

export const AppContext = createContext();

export const VALIDATED_ROUTES = ["login", "createAccount", "settings"];
const AppProvider = ({children}) => {
  // State
  const [headerColor, setHeaderColor] = useState('text-light');
  const [headerText, setHeaderText] = useState("Qr Cool");
  const [headerDuration, setHeaderDuration] = useState(0);

  // Modals stuff
  const [showModal, setShowModal] = useState(false);
  const [showEntryContentModal, setShowEntryContentModal] = useState(false);
  const [entryContentModalType, setEntryContentModalType] = useState(null);

  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const [showEntryReportModal, setShowEntryReportModal] = useState(false);  
  
  const setHeaderStatus = (color, text, duration) =>{
    let lastColor = headerColor;
    let lastText = headerText;
    let lastDuration = headerDuration;

    setHeaderColor(color);
    setHeaderText(text);
    setHeaderDuration(duration);

    setTimeout(() => {
      setHeaderColor(lastColor);
      setHeaderText(lastText);
      setHeaderDuration(lastDuration);
    }, duration);
  }

  const handleErr = (err, log = false) =>{
      if (log)
          console.error(err);
      if (err.response){
          console.log(err);
          setHeaderStatus("text-red-500", err.response.data, 2500);
      }
  }

  class Request{
      static checkErrHandle(onErr, err){
        if (onErr)
          onErr(err);
        else  
          handleErr(err);
      }
  
      static async get(route, callback, onErr, params = null){
        try{
            const response = await api.get(route, { 
              params: params,
              withCredentials: true });
            callback(response);
        }catch(err){
          this.checkErrHandle(onErr, err);
        }
      } 

      static async getBlob(route, callback, onErr, params = null){
        try{
            const response = await api.get(route, { params: params, 
              withCredentials: true, responseType: 'blob' });
            callback(response);
        }catch(err){
          this.checkErrHandle(onErr, err);
        }
      }
  
      static async post(route, data, callback, onErr = null) {
        try{
            const response = await api.post(route, data, { withCredentials: true });
            callback(response);
        }catch(err){
          this.checkErrHandle(onErr, err);
        }
      }

      static async postFile(route, file, callback, onErr = null) {
        try{
            const formData = new FormData()
            formData.append('file', file)
            const response = await api.post(route, formData, { 
              withCredentials: true, 
            });
            callback(response);
        }catch(err){
          console.error(err);
          this.checkErrHandle(onErr, err);
        }
      }
  
      static async put(route, data, callback, onErr){
        try{
            const response = await api.put(route, data, { withCredentials: true });
            callback(response);
        }catch(err){
          this.checkErrHandle(onErr, err);
        }
      }
  
      static async delete(route, callback, onErr){
        try{
            const response = await api.delete(route, { withCredentials: true });
            callback(response);
        }catch(err){ 
          this.checkErrHandle(onErr, err);
        }
      }
  }
            
  return(
      <AppContext.Provider value={{Request, handleErr, setHeaderStatus, headerColor, setHeaderColor, headerText, setHeaderText, showModal, setShowModal, showEntryContentModal, setShowEntryContentModal, entryContentModalType, setEntryContentModalType, showAddEntryModal, setShowAddEntryModal, showQrModal, setShowQrModal, showEntryReportModal, setShowEntryReportModal}}>
          {children}
      </AppContext.Provider>
  );
}

export default AppProvider;