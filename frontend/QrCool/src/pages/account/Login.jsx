import { useContext } from "react";

//Pages
import AccountPage from './AccountPage';

// Context
import { AccountContext } from "../../context/AccountProvider";


const Login = () => {
    const { accountController } = useContext(AccountContext);
    return ( <AccountPage isLogin onSubmit={accountController.onLogin} /> )
}

export default Login;