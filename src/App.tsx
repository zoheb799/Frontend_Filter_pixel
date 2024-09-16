import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ImageProcess from './pages/ImageProcess';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile';
import TRYAI from './pages/TRYAI';
import Tables from './pages/Tables';
import DefaultLayout from './layout/DefaultLayout';
import { ImageProvider } from './context/ImageContext';
import { ToastContainer } from 'react-toastify';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const layoutRoutes = (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <>
            <PageTitle title="Filter" />
            <Dashboard />
          </>
        }
      />
      <Route
        path="/ImageProcess"
        element={
          <>
            <PageTitle title="ImageProcess" />
            <ImageProcess />
          </>
        }
      />
      <Route
        path="/profile"
        element={
          <>
            <PageTitle title="Profile " />
            <Profile />
          </>
        }
      />
      <Route
        path="/tables"
        element={
          <>
            <PageTitle title="Tables " />
            <Tables />
          </>
        }
      />
      <Route
        path="/settings"
        element={
          <>
            <PageTitle title=" Try AI " />
            <TRYAI />
          </>
        }
      />
    </Routes>
  );

  return (

    <>
     <ImageProvider>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <PageTitle title="Signup" />
                <SignUp />
              </>
            }
          />
          <Route
            path="/*"
            element={
              <DefaultLayout>
                {layoutRoutes}
              </DefaultLayout>
            }
          />
        </Routes>
      )}
    </ImageProvider>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    </>
   
  );
}

export default App;
