import { useContext, useRef } from "react";

// Components
import LabeledInputField from "./LabeledInputField";
import InputField from "./InputField";
import TextArea from "./TextArea";
import FormButton from './FormButton';

// Content
import { ContentContext } from "../context/ContentProvider";

const FormNameField = ({entryContentRed, entryContentController}) =>{
    return(
        <LabeledInputField
            className="text-regular font-bold text-left"
            inputField={<InputField 
                name="Name"
                value={entryContentRed?.Content?.Name || ""}
                onChange={entryContentController.contentFieldChange}
                required
                placeHolder="Cool entry content name"
            />}
        >Name</LabeledInputField>
    );
}

export const RedirectForm = () =>{
    const { entryContentController, entryContentRed } = useContext(ContentContext);

    return(
        <ul className="col-flex-center gap-3">
            <FormNameField entryContentRed={entryContentRed} entryContentController={entryContentController} />
            <LabeledInputField
                className="text-regular font-bold text-left"
                inputField={<InputField 
                    name="Text"
                    value={entryContentRed?.Content?.Text}
                    onChange={entryContentController.contentFieldChange}
                    required
                    placeHolder="https://coolwebsite.com"
                />}
            >URL</LabeledInputField>
        </ul>
    );
}

export const TextForm = () =>{
    const { entryContentController, entryContentRed } = useContext(ContentContext);

    return(
        <ul className="col-flex-center gap-3">
            <FormNameField entryContentRed={entryContentRed} entryContentController={entryContentController} />
            <LabeledInputField
                className="text-regular font-bold text-left"
                inputField={<TextArea 
                    name="Text"
                    value={entryContentRed?.Content?.Text}
                    onChange={entryContentController.contentFieldChange}
                    required
                    placeHolder="Enter your text here"
                />}
            >Text</LabeledInputField>
        </ul>
    );
}

function FileDropButton({onUploadClick}){
    return(
        <button type="button" onClick={onUploadClick} className="flex items-center justify-center w-3/4">
            <label htmlFor="dropzone-file" className="col-flex-center nice-trans justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="col-flex-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                </div>
            </label>
        </button> 
    );
}

export const FileForm = () =>{
    const { entryContentController, entryContentRed,  } = useContext(ContentContext);
    const { file, setFile } = useContext(ContentContext);

    const fileInputRef = useRef(null);

    const handleFileChange = e =>{
        if (e.target.files){
            setFile(e.target.files[0]);
        }
    }

    function onUploadClick(){
        fileInputRef.current.click();
    }

    return(
        <ul className="size-full col-flex-center gap-3">
            <FormNameField entryContentRed={entryContentRed} entryContentController={entryContentController} />
            <LabeledInputField
    
                className="text-regular font-bold text-left hidden"
                inputField={<InputField 
                    ref={fileInputRef}
                    className="w-full overflow-clip"
                    name="File"
                    onChange={handleFileChange}
                    required = {!file}
                    type="file"
                />}
            >Upload File</LabeledInputField>
            <FileDropButton onUploadClick={onUploadClick}/>
        </ul>
    );
}