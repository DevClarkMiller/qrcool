import { useContext } from 'react';
import { Link } from 'react-router-dom';

// Components
import LabeledInputField from '../../components/LabeledInputField';
import InputField from '../../components/InputField';
import FormButton from '../../components/FormButton';

// Context
import { AccountContext } from '../../context/AccountProvider';

function AccountSettings() {
    const {account} = useContext(AccountContext); 

    return (
        <ul className='h-full w-2/3 col-flex-center justify-center gap-3'>
            <LabeledInputField
                inputField={<InputField 
                    name='Email'
                    value={account?.Email}
                    readOnly
                />}
            >Email</LabeledInputField>

            <LabeledInputField
                inputField={<InputField 
                    name='Username'
                    value={account?.Username}
                    readOnly
                />}
            >Username</LabeledInputField>
            <div className='w-full underline nice-trans hover:text-blue-500'>
                <Link to='resetPassword'>Reset Password</Link>
            </div>
        </ul>
    );
}

export default AccountSettings