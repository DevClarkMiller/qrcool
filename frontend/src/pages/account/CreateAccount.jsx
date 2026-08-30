import { useContext } from "react";

//Pages
import AccountPage from './AccountPage';

// Context
import { AccountContext } from "../../context/AccountProvider";

const CreateAccount = () => {
    const { accountController } = useContext(AccountContext);
    return ( <AccountPage onSubmit={accountController.onCreateAccount} /> )
}

export default CreateAccount;