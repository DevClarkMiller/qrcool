import { useContext, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";

// Context
import {AccountContext} from "../context/AccountProvider";
import { AppContext } from "../context/AppProvider";

// Icons
import { FaHome } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoLogOut  } from "react-icons/io5";

const Header = () => {
    // Context
    const {account, accountController} = useContext(AccountContext);
    const {headerColor, headerText} = useContext(AppContext)

    // Memo

    // This dictates whether the title div should be betweem the username and control or under
    const titleTop = useMemo(() => headerText.length < 15,[headerText]);

    return (
        <header className="nice-trans gap-2 p-2 w-9/12 lg:w-1/2 flex items-center justify-between bg-medium rounded-b-xl shadow-lg flex-wrap">
            {account?.LoggedIn && <div className="username font-semibold text-2xl">{account?.Username}</div>}
            {titleTop&&<h1 className={`flex-grow nice-trans font-bold text-2xl text-center ${headerColor}`}>{headerText}</h1>}
            <div className="controls flex items-center justify-center">
                <Link to='/' className="icon icon-blue-hover" ><FaHome/></Link>
                {account?.LoggedIn && <Link to="/settings/account" className="icon icon-blue-hover"><IoIosSettings /></Link>}
                {account?.LoggedIn && <button onClick={accountController.logout} className="icon icon-blue-hover"><IoLogOut /></button> }
            </div>
            {!titleTop&&<h1 className={`flex-grow nice-trans font-bold text-2xl text-center ${headerColor}`}>{headerText}</h1>}
        </header>
    );
}

export default Header;