import React from 'react'

const RoundedButton = ({type, children, onClick, className}) => {
    return (
        <button onClick={onClick} type={type} className={`${className} text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}>{children}</button>
    );
}

export default RoundedButton