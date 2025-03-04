// Components
import GenericModal from "./GenericModal";
import RadioButton from "../components/RadioButton";

const EntryReportModal = ({show, setShow}) => {
    return (
        <GenericModal
            btnText="Create Report"
            title="Reports"
            show={true}
            setShow={setShow}
        >
            <RadioButton />
        </GenericModal>
    );
}

export default EntryReportModal;
