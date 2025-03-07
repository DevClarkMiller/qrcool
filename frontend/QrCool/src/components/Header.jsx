import { useContext } from "react";
import { Link } from "react-router-dom";
import { IoLogOut  } from "react-icons/io5";

// Context
import {AccountContext} from "../context/AccountProvider";
import { AppContext } from "../context/AppProvider";

// Icons
import { FaHome } from "react-icons/fa";

const Header = () => {
    const {account, accountController} = useContext(AccountContext);
    const {headerColor, headerText} = useContext(AppContext);

    return (
        <div className="nice-trans gap-2 p-2 w-9/12 lg:w-1/2 flex items-center justify-between bg-medium rounded-b-xl shadow-lg">
            <Link to='/' className="text-2xl"><FaHome/></Link>
            <h1 className={`flex-grow nice-trans font-bold text-2xl text-center ${headerColor}`}>{headerText}</h1>
             
            {account?.LoggedIn && <div className="username font-semibold">{account?.Username}</div>}
            {account?.LoggedIn && <button onClick={accountController.logout} className="text-3xl nice-trans hover:text-blue-500"><IoLogOut /></button> }
        </div>
    );
}

export default Header;