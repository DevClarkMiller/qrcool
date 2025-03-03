import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import FormButton from '../components/FormButton';
import NotFound from './NotFound';

function ActivateAccount() {
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch token from params
    const token = useMemo(() =>{
        const query = new URLSearchParams(location.search);
        return query.get('token');
    }, []);

    function onSubmit(e){
        e.preventDefault();
    }

    return (
        <>
            {token ?
            <form onSubmit={onSubmit} className="authenticateAccount size-full text-white col-flex-center justify-center gap-5">
                <h2 className="font-semibold text-xl text-center">To authenticate your account, please click the button below</h2>
                <FormButton 
                    type="submit"
                    className={`text-white `}>
                    Authenticate Account
                </FormButton>
            </form> :
                 <NotFound />
            }
         </>
    );
}

export default ActivateAccount;


// const AuthenticateAccount = () =>{
//     const location = useLocation();
//     const navigate = useNavigate();

//     const token = useMemo(() =>{
//         const query = new URLSearchParams(location.search);
//         return query.get('token');
//     }, []);
    
//     //Context
//     const {grabAccount} = useContext(LoginContext);

//     const onSubmit = async e =>{
//         e.preventDefault();
//         const response = await fetchAll.get('/account/create',{
//             token: token
//         },
//         {
//             headers: { 'Content-Type': 'application/json' },
//             withCredentials: true,
//             credentials: "include"
//         });

//         if(!response || response.status !== 200) return alert('Error with authenticating account, please try again or send a new authentication email');

//         grabAccount();
//         alert('Account setup and authenticated!');
//         navigate('/');  //Moves you to the homepage if your acount was authenticated
//     }

//     return(
//         <>
//             {token ?
//             <form onSubmit={onSubmit} className="authenticateAccount size-full text-white col-flex-center justify-center gap-5">
//                 <h2 className="font-semibold text-xl text-center">To authenticate your account, please click the button below</h2>
//                 <button 
//                     type="submit"
//                     className={`text-white round-button blue-button`}>
//                 Authenticate Account</button>
//             </form> :
//                 <NotFound />
//             }
//         </>
//     );
// }

// export default AuthenticateAccount;