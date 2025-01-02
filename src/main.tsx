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
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from './components/protectedPage/protectedRoute';
import LayoutAdmin from './components/layout/layout.admin';
import DashBoardPage from './pages/admin/dashBoardPage';
import ManageBookPage from './pages/admin/manageBookPage';
import ManageOrderPage from './pages/admin/manageOrderPage';
import ManageUserPage from './pages/admin/manageUserPage';
import enUS from 'antd/locale/en_US';
import BookPage from './pages/client/bookPage';
import OrderPage from './pages/client/orderPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/order",
        element: <OrderPage />
      },
      {
        path: "/checkout",
        element:
          <ProtectedRoute>
            (<div>checkout page</div>),
          </ProtectedRoute>
      },
      {
        path: "/admin",
        element:
          <ProtectedRoute>
            (<div>admin page</div>) ,
          </ProtectedRoute>
      },
    ]
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        )
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <div>admin page</div>
          </ProtectedRoute>
        ),
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
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>,
)
