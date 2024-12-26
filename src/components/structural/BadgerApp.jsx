import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const BadgerLayout = lazy(() => import('./BadgerLayout'));
const BadgerLogin = lazy(() => import('../auth/BadgerLogin'));
const BadgerRegister = lazy(() => import('../auth/BadgerRegister'));
const BadgerLogout = lazy(() => import('../auth/BadgerLogout'));
const BadgerChatroom = lazy(() => import('../content/BadgerChatroom'));
const BadgerChatHome = lazy(() => import('../content/BadgerChatHome'));
const BadgerNoMatch = lazy(() => import('../content/BadgerNoMatch'));

function BadgerApp() {
  const [chatrooms, setChatrooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://cs571.org/api/s24/hw6/chatrooms', {
      headers: { 
        "X-CS571-ID": 'bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e' 
      }
    })
      .then((res) => res.json())
      .then((json) => setChatrooms(json))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<BadgerLayout chatrooms={chatrooms} />}>
            <Route index element={<BadgerChatHome />} />
            <Route path="login" element={<BadgerLogin />} />
            <Route path="register" element={<BadgerRegister />} />
            <Route path="logout" element={<BadgerLogout />} />
            {
              chatrooms.map(chatroom => {
                return <Route key={chatroom} path={`chatrooms/${chatroom}`} element={<BadgerChatroom name={chatroom} />} />
              })
            }
            <Route path="*" element={<BadgerNoMatch />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default React.memo(BadgerApp);
/* 优化前的代码
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import BadgerLayout from './BadgerLayout';
import BadgerLogin from '../auth/BadgerLogin';
import BadgerRegister from '../auth/BadgerRegister';
import BadgerLogout from '../auth/BadgerLogout';
import BadgerChatroom from '../content/BadgerChatroom';
import BadgerChatHome from '../content/BadgerChatHome';
import BadgerNoMatch from '../content/BadgerNoMatch';

function BadgerApp() {

  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    fetch('https://cs571.org/api/s24/hw6/chatrooms', {
      headers: {
        "X-CS571-ID": 'bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e',
      }
    }).then(res => res.json()).then(json => {
      setChatrooms(json)
    })
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BadgerLayout chatrooms={chatrooms} />}>
          <Route index element={<BadgerChatHome />} />
          <Route path="/login" element={<BadgerLogin />}></Route>
          <Route path="/register" element={<BadgerRegister />}></Route>
          <Route path="/logout" element={<BadgerLogout />}></Route>
          {
            chatrooms.map(chatroom => {
              return <Route key={chatroom} path={`chatrooms/${chatroom}`} element={<BadgerChatroom name={chatroom} />} />
            })
          }
          <Route path="*" element={<BadgerNoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default BadgerApp;

/* 
写代码的时候，要先写Route再写Nav，就是让其呈现在页面上，在添加导航功能
 */
