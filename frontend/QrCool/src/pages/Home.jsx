import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Components
import RoundedButton from "../components/RoundedButton";
import FormButton from "../components/FormButton";
import { ClipLoader } from "react-spinners";

// Pages
import Entries from "./Entries";

// Custom hooks
import useAccountCount from '../hooks/account/useAccountCount';
import useQuote from "../hooks/useQuote";
import useEmoji from "../hooks/useEmoji";

// Context
import { AccountContext } from "../context/AccountProvider";

const FAQS = [
    {q: "Why create this webapp?", a: "To provide a free service to anyone who needs to manage a qr code"},
    {q: "Are there any limits to what I can do?", a: "Yes, you can only create 5 entries and file sizes are limited to 25 mbs since this is a free service"}
];

function FAQItem({q, a}){
    return <p className='text-left w-full'><span className='font-semibold mr-2'>{q}</span>{a}</p>
}

function FAQ(){
    return(
        <div className="card rounded-lg w-3/4 lg:w-2/3 card text-center col-flex-center">
            <h3 className="font-semibold text-xl">FAQ</h3>           
            {FAQS?.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
    );
}

function AccountCount({accountController}){
    const accountCount = useAccountCount(accountController);

    return(
        <div className="card hidden lg:flex size-full lg:w-1/3 col-flex-center justify-center font-bold">
            <div className="text-2xl">Number of Registered Accounts</div>
            <div className="bg-base rounded shadow-lg w-full">{accountCount}</div>
        </div>
    );
}

function LoginOrSignup(){
    const navigate = useNavigate();

    return(
        <div className="card col-flex-center gap-5 size-full">
            <h3 className="font-semibold text-xl">Start today</h3>
            <FormButton onClick={() => navigate('/createAccount')}>Create Account</FormButton>
            <div className="font-bold text-2xl">Or</div>
            <FormButton onClick={() => navigate('/login')}>Login</FormButton>
        </div>
    );
}


function StartToday(){
    const { accountController } = useContext(AccountContext);

    return(
        <div className="flex w-3/4 lg:w-2/3 gap-2">
            <LoginOrSignup />
            <AccountCount accountController={accountController} />
        </div>
    );
}

function AnonymousView(){
    return(
        <div className="size-full col-flex-center gap-5 justify-between p-5 pb-12">
            <h2 className="font-semibold text-lg mt-10">Simplify Your World, One Scan at a Time...</h2>
            <StartToday />
            <FAQ />            
        </div>
    );
}

function LoggedInView(){
    const navigate = useNavigate();
    const {account} = useContext(AccountContext);

    const quote = useQuote();
    const emoji = useEmoji();

    return(
        <div className="size-full col-flex-center justify-between gap-5">
            <div className="flex items-center gap-2 text-center">
                <span>{account?.Username && 
                    <h3 className="text-xl">Welcome, <span className="font-semibold">{account?.Username}{emoji}</span></h3>
                    }</span>
                <div className="text-xl">{quote}</div>
            </div>
            <Entries />
        </div>
    );
}

const Home = () => {
    const {account, accountLoading} = useContext(AccountContext);

    return (
        <div className="size-full col-flex-center justify-center gap-5">
            {accountLoading ? <ClipLoader 
                size={150}
            /> :
            account?.LoggedIn ? <LoggedInView /> : <AnonymousView />}            
        </div>
    );
}

export default Home;