一个全栈单页面应用（SPA），使用 React 和 React Router 构建，旨在提供一个支持用户注册、登录、退出和实时聊天的现代聊天平台。项目支持多聊天室的动态管理，用户可以在不同的聊天室中发帖、阅读消息并删除帖子。
```bash
npm install
npm run dev
```

所有数据均可通过 API 调用检索 https://cs571.org/rest/f24/hw6/ 。下面提供了 API 的简要概述。详细信息请参考API_DOCUMENTATION.md 。
| Method | URL | Purpose | Return Codes |
| --- | --- | --- | --- |
| `GET`| `/chatrooms` | Get all chatrooms. | 200, 304 |
| `GET` | `/messages?chatroom=NAME&page=NUM`| Get latest messages for specified chatroom and page. | 200, 400, 404 |
| `POST` | `/messages?chatroom=NAME` | Posts a message to the specified chatroom. | 200, 400, 404, 413 |
| `DELETE` | `/messages?id=ID` | Deletes the given message. | 200, 400, 401, 404 |
| `POST` | `/register` | Registers a user account. | 200, 400, 409, 413  |
| `POST` | `/login` | Logs a user in. | 200, 400, 401 |
| `POST` | `/logout` | Logs the current user out. | 200 |
| `GET` | `/whoami` | Gets details about the currently logged in user. | 200 |
