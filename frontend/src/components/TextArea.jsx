import React from 'react'

const TextArea = ({ name, value, onChange, className, placeHolder, required = false }) =>{
    return (
        <textarea 
            className={`rounded p-1 shadow-lg ${className}`}
            value={value || ""}
            onChange={onChange}  
            placeholder={placeHolder}
            name={name}
            required={required}
        />
    );
};

export default TextArea;