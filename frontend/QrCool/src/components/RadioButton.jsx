import React from 'react'

const RadioButton = ({id, value, onChange, name, className}) => {
    return(
        <div class="flex items-center mb-4">
            <input id="default-radio-1" type="radio" value="" name="default-radio" className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${className}`}/>
        </div>
    )
}

export default RadioButton;
