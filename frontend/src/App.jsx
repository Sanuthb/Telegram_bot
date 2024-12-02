import React from 'react';
import Sidebar from './Components/Sidebar';
import { useRecoilValue } from 'recoil';
import { activePageState } from './Atoms/Atoms';
import Home from './Pages/Home';
import Keyword_log from './Pages/Keyword_log';
import {Routes,Route} from 'react-router-dom'
import Sigin from './Pages/Sigin';
import AddUsers from './Pages/AddUsers'
import {jwtDecode} from 'jwt-decode'

const Main = () =>{
  const activePage = useRecoilValue(activePageState);

  const getRole = () =>{
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
    }
    return null;
  }

  const role = getRole();

  return(
    <main className='bg-primary w-full h-screen flex'>
    <Sidebar role={role}/>

    <div className='text-white w-full'>
      {activePage === 'dashboard' && <Home/>}
      {activePage === 'keyword' && <Keyword_log/>}
      {role ==='superuser'&& activePage==='adduser'&& <AddUsers/>}
    </div>
  </main>
  )
}

const App = () => {

  return (
      <Routes>
        <Route path='/' element={<Sigin/>}/>
        <Route path='/dashboard' element={<Main/>}/>
      </Routes>
  );
};

export default App;
