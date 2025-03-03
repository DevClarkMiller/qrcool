import { useMemo, useEffect, useState, useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Controller from "../../tools/controller";

import { LOGIN_ACTIONS, INITIAL_STATE, loginReducer } from "../../pages/reducers/loginReducer";

function useAccountController(appContext){
    const navigate = useNavigate();

    const [account, dispatchAccount] = useReducer(loginReducer, INITIAL_STATE);
    const [accountLoading, setAccountLoading] = useState(true);
    const accountRef = useRef(account);

    useEffect(() =>{
        accountRef.current = account;
    }, [account]);


    const accountController = useMemo(() =>{
        class AccountController extends Controller{
            constructor(context){
                super(context);
            }
    
            changeField(e){
                dispatchAccount({
                    type: LOGIN_ACTIONS.UPDATE_INPUT, 
                    payload:{ name: e.target.name, value:e.target.value }
                });
            }
            
            setField(name, val){
                dispatchAccount({
                    type: LOGIN_ACTIONS.UPDATE_INPUT, 
                    payload:{ name: name, value: val }
                });
            }
    
            login(){
                dispatchAccount({type: LOGIN_ACTIONS.LOGIN});
            }
    
            get = async() =>{
                setAccountLoading(true);
                super.get('/account/login', response =>{
                    this.setField("Email", response.data.Email);
                    this.setField("Username", response.data.Username);
                    this.setField("Password", response.data.Password);
                    this.login();
                    setAccountLoading(false);
                }, err =>{
                    setAccountLoading(false);
                    console.log(err);
                    if (!location.pathname.includes("login") && !location.pathname.includes("createAccount") && location?.pathname != '/')
                        navigate('/login');
                });
            }
    
            getCount = async() =>{
                return new Promise((resolve) =>{
                    super.get('/account/count', response =>{
                        resolve(response.data)
                    });
                });
            }
    
            logout = async() =>{
                super.get('/account/logout', response =>{
                    dispatchAccount({type: LOGIN_ACTIONS.LOGOUT});
                    navigate('/login');
                }, err =>{
                    console.log(err);
                    if (!location.pathname.includes("login") && !location.pathname.includes("createAccount"))
                        navigate('/login');
                });
            }
    
            onLogin = e => {
                e.preventDefault();
            
                let loginData = accountRef.current;
                delete loginData.Id;
                delete loginData.LoggedIn;
    
                super.post('/account/login', loginData, response =>{
                    this.appContext.setHeaderStatus("text-green-500", response.data, 2500);
                    this.login();
                    navigate('/');
                });
            }
            
            onCreateAccount = async e =>{
                e.preventDefault();
            
                let loginData = accountRef.current;
                delete loginData.Id;
                delete loginData.LoggedIn;
    
                super.post('/account/create', loginData, response =>{
                    this.appContext.setHeaderStatus("text-green-500", response.data, 2500);
                    this.login();
                    navigate('/');
                });
            }

            async activate(token){

            }
        }

        return new AccountController(appContext);
    }, [appContext]);
    
    return { account, dispatchAccount, accountLoading, setAccountLoading, accountRef, accountController };
}

export default useAccountController;