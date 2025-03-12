import { useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import AccountSettings from './AccountSettings';
import ResetPassword from './ResetPassword';

// Context
import { AccountContext } from '../../context/AccountProvider';

function Settings() {
    return (
        <div className='size-full col-flex-center justify-center'>
            <Routes>
                <Route path='/account/*' element={<AccountSettings />} />
                <Route path='/account/resetPassword' element={<ResetPassword />} />
            </Routes>
        </div>
    );
}

export default Settings;