import React from 'react'

// Icons
import { FaGithubSquare, FaChevronRight } from "react-icons/fa";

export default function Footer() {
    return (
        <div className='w-full p-3 flex items-center justify-between bg-regular'>
            <div className='flex flex-col text-left'>
                <span className='font-bold'>Support</span>
                <a href='mailto:clarkmillermail@gmail.com'>clarkmillermail@gmail.com</a>
            </div>
            <a target='_blank' href='https://clarkmiller.ca' className='nice-trans hover:text-blue-500 flex gap-2 items-center flex-grow justify-center'>
                <span>About Me</span>
                <span><FaChevronRight  /></span>
            </a>
            <a className='text-5xl nice-trans hover:text-blue-700' href="https://clarkmiller.ca/github" target='_blank'>
                <FaGithubSquare />
            </a>
        </div>
    );
}
