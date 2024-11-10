import React from 'react';
import Sidebar from './Components/Sidebar';
import { useRecoilValue } from 'recoil';
import { activePageState } from './Atoms/Atoms';
import Home from './Pages/Home';
import Keyword_log from './Pages/Keyword_log';
import Image_rec from './Pages/Image_rec';

const App = () => {
  const activePage = useRecoilValue(activePageState);

  return (
    <main className='bg-primary w-full h-screen flex'>
      <Sidebar />

      <div className='text-white w-full'>
        {activePage === 'dashboard' && <Home/>}
        {activePage === 'keyword' && <Keyword_log/>}
        {activePage === 'image' && <Image_rec/>}
      </div>
    </main>
  );
};

export default App;
