
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import InputField from "../../components/InputField";
import LabeledInputField from "../../components/LabeledInputField";
import FormButton from "../../components/FormButton";

// Content
// import { AccountContext } from "../../App";
import { AccountContext } from "../../context/AccountProvider";

const CreateAccount = ({onSubmit, isLogin}) => {
    const navigate = useNavigate();
    const { accountController, account } = useContext(AccountContext);

    useEffect(() =>{
        if (account.LoggedIn)
            navigate('/');
    }, [account]);

  return (
    <div className="size-full col-flex-center justify-center">
        <form className="w-3/4 lg:w-1/3 gap-5 col-flex-center justify-between bg-medium rounded-xl p-10" onSubmit={onSubmit}>
            <div className="fields col-flex-center size-full flex-grow gap-5">
                <LabeledInputField
                    inputField={<InputField className="w-full" name="Email" onChange={accountController.changeField} value={account?.Email} placeHolder="personxyz@email.com" type="email" />}
                >Email</LabeledInputField>

                <LabeledInputField
                    inputField={<InputField className="w-full" name="Username" onChange={accountController.changeField} value={account?.Username} placeHolder="bubbleman47" />}
                >Username</LabeledInputField>

                <LabeledInputField
                    inputField={<InputField className="w-full" required name="Password" onChange={accountController.changeField} value={account?.Password} placeHolder="buycanadian123" type="password" />}
                >Password</LabeledInputField>
            </div>
            
            <div className="w-full flex justify-between items-center gap-3">
                <FormButton type="submit">{isLogin ? "Login" : "Create Account"}</FormButton>
                <Link to={isLogin ? "/createAccount" : "/login"}>{isLogin ? "Create Account" : "Login"}</Link>
            </div>
        </form>
    </div>
  );
}

export default CreateAccount