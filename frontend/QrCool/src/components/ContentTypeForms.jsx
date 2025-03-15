import { useContext, useRef, useMemo } from "react";

// Components
import LabeledInputField from "./LabeledInputField";
import InputField from "./InputField";
import TextArea from "./TextArea";
import FormButton from './FormButton';

// Content
import { ContentContext } from "../context/ContentProvider";

// Icons
import { IoCloudUploadSharp } from "react-icons/io5";

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

function FileDropButton({onUploadClick, hasFile}){
    return(
        <button type="button" onClick={onUploadClick} className={`justify-center ${hasFile ? "text-green-600" : "text-black"} text-4xl icon-blue-hover`}>
            <IoCloudUploadSharp />
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

    const hasFile = useMemo(() => file !== null, [file]);

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
            <div className="flex items-center justify-center gap-3">
                <FileDropButton onUploadClick={onUploadClick} hasFile={hasFile}/>
                {file && <div className="text-regular font-bold text-2xl">{file?.name}</div>}
            </div>
        </ul>
    );
}