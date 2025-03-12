import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import LabeledInputField from '../../components/LabeledInputField';
import InputField from '../../components/InputField';
import FormButton from '../../components/FormButton';
import GenericModal from '../../modals/GenericModal';

// Context
import { AccountContext } from '../../context/AccountProvider';

function AccountSettings() {
    const {account} = useContext(AccountContext); 

    const [showConfirmation, setShowConfirmation] = useState(false);

    function onDeleteAccount(){
        console.log("Deleting account");
    }

    return (
        <ul className='h-full w-2/3 col-flex-center justify-center gap-3'>
            <GenericModal
                title="Are you sure you want to delete?"
                show={showConfirmation}
                setShow={setShowConfirmation}
                btnText="Delete Account"
                hideScroll
                titleColor='text-red-500'
                centerTitle
                hideFooter
                onSubmit={onDeleteAccount}
            >
                <div className='size-full flex justify-center gap-5'>
                    <button type='submit' className='nice-trans bg-green-600 hover:bg-green-700 p-2 rounded-xl font-bold'>Yes</button>
                    <button onClick={() => setShowConfirmation(false)} type='button' className='nice-trans bg-red-500 hover:bg-red-700 p-2 rounded-xl font-bold'>No</button>
                </div>
            </GenericModal>
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
            <button onClick={() => setShowConfirmation(true)} type='button' className='nice-trans bg-red-500 hover:bg-red-700 p-2 rounded-xl font-bold'>Delete Account</button>
        </ul>
    );
}

export default AccountSettings