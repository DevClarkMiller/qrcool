import { useState, useContext } from "react"

// Components
import LabeledInputField from '../../components/LabeledInputField';
import InputField from '../../components/InputField';
import FormButton from '../../components/FormButton';

// Context
import { AccountContext } from "../../context/AccountProvider"

function ResetPassword() {
    const {account} = useContext(AccountContext);

    const [password, setPassword] = useState("");    
    const [newPassword, setNewPassword] = useState("");

    function onSubmit(e){
        e.preventDefault();
    }

    return (
        <form onSubmit={onSubmit} className="h-full w-2/3 lg:w-1/2 col-flex-center gap-3 justify-center">
            <LabeledInputField
                inputField={<InputField 
                    name='OldPassword'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    type="password"
                />}
            >Old Password</LabeledInputField>
            <LabeledInputField
                inputField={<InputField 
                    name='NewPassword'
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    type="password"
                />}
            >New Password</LabeledInputField>
        </form>
    );
}

export default ResetPassword