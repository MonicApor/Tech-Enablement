const employee = [
  // Employee Routes - Microsoft 365 authenticated users
  {
    path: '/employee',
    component: 'pages/authenticated/employee/Feed',
    auth: true,
  },
  {
    path: '/employee/create-post',
    component: 'pages/authenticated/employee/CreatePost',
    auth: true,
  },
  {
    path: '/employee/post/:id',
    component: 'pages/authenticated/employee/Post',
    auth: true,
  },
  {
    path: '/employee/my-posts',
    component: 'pages/authenticated/employee/Posts',
    auth: true,
  },
  {
    path: '/employee/chats',
    component: 'pages/authenticated/employee/Chats',
    auth: true,
  },
];

export default employee;
