import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './pages/Home.tsx';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Register.tsx';
import 'react-toastify/dist/ReactToastify.css';
import VerifyEmailPage from './pages/VerifyEmail.tsx';
import { store } from "./store/store.ts";
import { Provider } from 'react-redux';
import ViewEventPage from './pages/ViewEvent.tsx';
import MyEventPage from './pages/user/MyEvents.tsx';
import MyTicketPage from './pages/user/MyTickets.tsx';
import ProfilePage from './pages/user/Profile.tsx';
import SearchResultPage from './pages/SearchResultPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/verify-email/:uid",
    element: <VerifyEmailPage />
  },
  {
    path: "/event/:uid",
    element: <ViewEventPage />
  },
  {
    path: "/profile/my-events",
    element: <MyEventPage />
  },
  {
    path: "/profile/my-event/:uid",
    element: <ViewEventPage />
  },
  {
    path: "/profile/my-tickets",
    element: <MyTicketPage />
  },
  {
    path: "/profile/my-ticket/:uid",
    element: <ViewEventPage />
  },
  {
    path: "/profile/my-profile",
    element: <ProfilePage />
  },
  {
    path: "/search",
    element: <SearchResultPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>
      <RouterProvider router={router} />
     </Provider>
  </StrictMode>,
)
