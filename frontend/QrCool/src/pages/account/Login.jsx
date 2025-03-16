import { useContext } from "react";
import { Link } from "react-router-dom";

//Pages
import AccountPage from './AccountPage';

// Context
import { AccountContext } from "../../context/AccountProvider";


const Login = () => {
    const { accountController } = useContext(AccountContext);
    return ( <AccountPage 
            isLogin 
            onSubmit={accountController.onLogin} 
            link={<Link to="/settings/account/resetPassword" className="w-fit underline hover:text-blue-500">Reset Password</Link>}
        /> 
    )
}

export default Login;