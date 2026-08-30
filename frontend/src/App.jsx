import { Route, Routes } from 'react-router-dom';

// CSS
import 'react-tooltip/dist/react-tooltip.css' 

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Login from './pages/account/Login';
import CreateAccount from './pages/account/CreateAccount';
import Home from './pages/Home';
import Anonymous from './pages/Anonymous';
import NotFound from './pages/NotFound';
import ActivateAccount from './pages/ActivateAccount';
import Settings from './pages/settings/Settings';

// Context
import AppProvider from './context/AppProvider';
import AccountProvider from './context/AccountProvider';
import ContentProvider from './context/ContentProvider';
import { useEffect } from 'react';


function App() {
  useEffect(() =>{
    localStorage.removeItem('entries'); // Entries should be reset on initial load
  }, []);

  return (
    <AppProvider>
      <AccountProvider>
        <ContentProvider>
          <div className='App gap-5 h-screen p-0 text-light col-flex-center justify-between'>
            <Header/>
            <main className='size-full col-flex-center flex-grow justify-center'>
              <Routes>
                <Route path ='/' element = {<Home />} />
                <Route path='/login' element={ <Login /> } />
                <Route path='/createAccount' element={ <CreateAccount /> } />
                <Route path ='/anonymous/:contentType/:entryContentId' element={<Anonymous />} />
                <Route path='/activate' element= {<ActivateAccount />}/>
                <Route path='/settings/*' element ={<Settings />} />
                <Route path='*' element={<NotFound/>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ContentProvider>
      </AccountProvider>
    </AppProvider>
  )
}

export default App;