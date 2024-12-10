import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from 'pages/client/auth/loginPage.tsx';
import RegisterPage from 'pages/client/auth/registerPage';
import 'styles/global.scss'
import HomePage from 'pages/client/auth/homePage';
import { App } from 'antd';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/book",
        element: <div>book page</div>,
      },
      {
        path: "/order",
        element: <div>order page</div>,
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Layout /> */}
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>,
)
