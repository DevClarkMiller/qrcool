import { useState, useContext, useEffect } from "react"

// Components
import LabeledInputField from '../../components/LabeledInputField';
import InputField from '../../components/InputField';

// Context
import { AccountContext } from "../../context/AccountProvider"

function ResetPassword() {
    const { account, accountController } = useContext(AccountContext);

    const [email, setEmail] = useState(account?.Email);
    const [password, setPassword] = useState("");    
    const [newPassword, setNewPassword] = useState("");

    function onSubmit(e){
        e.preventDefault();
        accountController.resetPassword(email, password, newPassword);
    }

    return (
        <form onSubmit={onSubmit} className="h-full w-2/3 lg:w-1/2 col-flex-center gap-3 justify-center">
            {!account?.Email && <LabeledInputField
                className="justify-center w-2/3"
                inputFieldClassName="w-fit"
                inputField={<InputField 
                    name='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    type="email"
                />}
            >Email</LabeledInputField>}
            <LabeledInputField
                className="justify-center w-2/3"
                inputFieldClassName="w-fit"
                inputField={<InputField 
                    name='OldPassword'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required        
                    type="password"
                />}
            >Old Password</LabeledInputField>
            <LabeledInputField
                className="justify-center w-2/3"
                inputFieldClassName="w-fit"
                inputField={<InputField 
                    name='NewPassword'
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    type="password"
                />}
            >New Password</LabeledInputField>
            <button type='form' className='mt-5 nice-trans bg-red-500 hover:bg-red-700 p-2 rounded-xl font-bold'>Change Password</button>
        </form>
    );
}

export default ResetPassword