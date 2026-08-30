import { useContext } from "react";

// Context
import { AppContext } from "../context/AppProvider";
import { ContentContext } from "../context/ContentProvider";

// Components
import GenericModal from "./GenericModal";
import InputField from "../components/InputField";
import LabeledInputField from "../components/LabeledInputField";

const AddEntryModal = () => {
    const {showAddEntryModal, setShowAddEntryModal} = useContext(AppContext);
    const {entryController, entryName, setEntryName} = useContext(ContentContext);

    function onSubmit(e){
        e.preventDefault();
        entryController.post(entryName);
        setShowAddEntryModal(false);
        setEntryName("");
    }

    return (
        <GenericModal
            btnText="Add"
            show={showAddEntryModal}
            setShow={setShowAddEntryModal}
            onSubmit={onSubmit}
            title="Add Entry"
            hideScroll
        >
            <LabeledInputField
                className="text-regular font-bold text-left"
                inputField={<InputField 
                    name="Name"
                    value={entryName}
                    onChange={e =>setEntryName(e.target.value)}
                    required
                    placeHolder="Cool Entry Name"
                />}
            >Name</LabeledInputField>
        </GenericModal>
    );
}

export default AddEntryModal;