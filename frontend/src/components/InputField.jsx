import React from 'react'

const InputField = ({ name, value, onChange, className, placeHolder, type = "text", required = false, ref = null, readOnly }) =>{
    return (
        <input 
            ref={ref}
            className={`rounded p-1 shadow-lg ${className}`}
            value={value || ""}
            onChange={onChange}  
            placeholder={placeHolder}
            type={type}
            name={name}
            required={required}
            readOnly={readOnly}
        />
    );
};

export default InputField;