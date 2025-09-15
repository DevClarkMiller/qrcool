import { createContext, useContext, useState } from "react";

// Custom hooks
import useContentTypeController from "../hooks/content/useContentTypeController";
import useEntryController from "../hooks/content/useEntryController";
import useEntryContentController from "../hooks/content/useEntryContentController";
import useContentController from "../hooks/content/useContentController";

// Context
import { AccountContext } from "./AccountProvider";
import { AppContext } from "./AppProvider";


export const ContentContext = createContext();

const ContentProvider = ({children}) =>{
  const context = useContext(AppContext);

  const [entries, setEntries] = useState(null);
  const [activeEntry, setActiveEntry] = useState(null);

  const [entryName, setEntryName] = useState("");
  const [qrValue, setQrValue] = useState("");

  // Context
  const { account } = useContext(AccountContext);
  const { setShowModal } = useContext(AppContext);

  const { contentType, contentTypeController } = useContentTypeController(context, account);

  const { entriesLoading, entryController } = useEntryController(context, entries, setEntries);
  const { anonymousData, anonymousDataLoading, file, setFile, fileRef, entryContent, entryContentRed, entryContentRef, entryContentController } = useEntryContentController(context, entryController, setActiveEntry, setShowModal);
  const { contentController } = useContentController(context, entryContentRef)

  return(
      <ContentContext.Provider value={{ anonymousDataLoading, setActiveEntry, entries, entryContent, entryContentRed, contentType, activeEntry, entryController, entryContentController, contentTypeController, contentController, entryContentRef, entryName, setEntryName, anonymousData, file, setFile, fileRef, qrValue, setQrValue, entriesLoading}}>
          {children}
      </ContentContext.Provider>
  );
}

export default ContentProvider;