import { useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";

// Components
import Select from "react-select";
import GenericModal from "./GenericModal";

// Content Type Forms
import { RedirectForm, TextForm, FileForm } from '../components/ContentTypeForms';

// Context
import { ContentContext } from "../context/ContentProvider";
import { AppContext } from "../context/AppProvider";

const EntryContentModal = () => {
    const {showEntryContentModal, setShowEntryContentModal, setShowModal, entryContentModalType} = useContext(AppContext);
    const {entryContentController, contentType, entryContentRed, activeEntry, entryContentRef} = useContext(ContentContext);

    // Memo
    const contentTypeOptions = useMemo(() => (
        contentType?.map(ct => ({
            value: ct.Id,
            label: ct.Name
        }))
    ), [contentType]);

    const onClose = () =>{
        setShowModal(true);
        setShowEntryContentModal(false);
        entryContentController.reset();
    }

    const defaultFormSubmit = e =>{
        e.preventDefault();
        onClose();
    }

    // State
    const [formType, setFormType] = useState(null);
    const [formSubmit, setFormSubmit] = useState(() => defaultFormSubmit);
    const [submitted, setSubmitted] = useState(false);

    const [selectValue, setSelectValue] = useState(null);

    useEffect(() =>{
        if (submitted && entryContentRed){
            formSubmit();
            setSubmitted(false);
        }
    }, [submitted, entryContentRed, entryContentController, formSubmit]);

    const onSubmit = e =>{
        e.preventDefault();
        setSubmitted(true);
        setSelectValue(null);
        setFormType(null);
    }

    const regularFormSubmit = useCallback(async () =>{
        await entryContentController.post(activeEntry.Id);
        onClose();
    }, [entryContentController, activeEntry, onClose]);

    const onFileSubmit = useCallback(async () =>{
        await entryContentController.postFile(activeEntry?.Id)
    }, [activeEntry]);
    
    const onSelect = useCallback((option) =>{
        setSelectValue(option);
        entryContentController.contentFieldSet("ContentTypeId", option.value);
        // Set specific forms on the different cases
        switch(option?.label){
            case "Redirect":{
                setFormType(<RedirectForm />);
                setFormSubmit(() => regularFormSubmit);
                break;
            }
            case "Text":{
                setFormType(<TextForm />);
                setFormSubmit(() => regularFormSubmit);
                break;
            }

            // These cases need to upload a file, so they all just 
            case "Image":
            case "Video":
            case "Audio":
            case "HTML":
            case "File": {
                setFormType(<FileForm />);
                setFormSubmit(() => onFileSubmit);
                break;
            }

            default: {
                setFormType(null);
                setFormSubmit(() => defaultFormSubmit);
            }
        }
    }, [entryContentController]);

    return(
        <GenericModal
            show={showEntryContentModal}
            setShow={setShowEntryContentModal}
            title={`${entryContentModalType} Entry Content`}
            btnText={entryContentModalType}
            onSubmit={onSubmit}
            onClose={onClose}
        >
            <Select 
                styles={{ 
                    control: (styles) => ({ ...styles, zIndex: 1001}),
                    menu: (styles) => ({ ...styles, zIndex: 1001}),
                    menuPortal: (styles) => ({ ...styles, zIndex: 1001})
                }}
                className="w-full z-50" 
                options={contentTypeOptions}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                onChange={onSelect}
                value={selectValue}
            />
            <>{formType}</>
        </GenericModal>
    );
}

export default EntryContentModal;