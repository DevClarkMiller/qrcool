import { useState, useContext } from "react";

// Components
import GenericModal from "./GenericModal";
import LabeledInputField from '../components/LabeledInputField';
import InputField from '../components/InputField';

import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

// Context

const EntryReportModal = ({show, setShow}) => {
    const [currRadio, setCurrRadio] = useState(null);

    function radChange(val){
        console.log(val);
    }

    return (
        <GenericModal
            btnText="Create Report"
            title="Reports"
            show={true}
            setShow={setShow}
        >
            <RadioGroup
                defaultValue="reportViewsToExcel"
            >
                <FormControlLabel 
                    className="text-regular !font-bold" 
                    value="reportViewsToExcel" 
                    control={<Radio onChange={e => radChange(e.target.value)} />} 
                    label="Standard Excel"/>
            </RadioGroup>
           {/* <ReportRad radChange={radChange} value="reportViewsToExcel">Standard Excel</ReportRad> */}
        </GenericModal>
    );
}

export default EntryReportModal;
