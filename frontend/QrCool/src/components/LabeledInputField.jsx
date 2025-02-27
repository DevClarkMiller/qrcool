import React from 'react'

const LabeledInputField = ({className, inputField, children}) =>{
    return (
        <div className={`labeledInputField flex items-center gap-3 w-full ${className}`}>
            <label className="font-bold w-1/3">{children}</label>
            <div className="w-2/3 text-regular">{inputField}</div>
        </div>
    );
};

export default LabeledInputField;