import { useState, useContext } from "react";

// Components
import GenericModal from "./GenericModal";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

// Context
import { ContentContext } from '../context/ContentProvider';

const EntryReportModal = ({show, setShow}) => {
    const [currRadio, setCurrRadio] = useState("reportViewsToExcel");

    const { entryController, activeEntry } = useContext(ContentContext);

    async function onSubmit(){
        await entryController.getReport(currRadio, activeEntry?.Id);
    }


    return (
        <GenericModal
            btnText="Create Report"
            title="Reports"
            show={show}
            setShow={setShow}
            onSubmit={onSubmit}
        >
            <RadioGroup
                defaultValue="reportViewsToExcel"
                aria-labelledby="report-radio-buttons-group-label"
                name="report-radio-buttons-group"
                value={currRadio}
                onChange={e => setCurrRadio(e.target.value)}
            >
                <FormControlLabel 
                    classes={{label: "!font-bold text-regular"}}
                    value="reportViewsToExcel" 
                    control={<Radio />} 
                    label="Standard Excel"/>
            </RadioGroup>
        </GenericModal>
    );
}

export default EntryReportModal;
