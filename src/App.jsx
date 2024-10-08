import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AddRecipe from './pages/AddRecipe';
import Navbar from './app_components/Navbar';
import RecipePage from './pages/RecipePage';
import RecipeDetail from './app_components/RecipeDetail';
import { RecipesProvider } from './context/Recipes';
import MainPage from './pages/MainPage';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallBack from './app_components/ErrorFallBack';
import PageNotFound from './app_components/PageNotFound';
import './index.css'




function App() {

  const auth = getAuth();
  const [user, setUser] = useState();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      }
    }
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(Boolean(data));
    })

    return () => unsubscribe();
    /* eslint-disable */
  }, [])
  /* eslint-ensable */

  const router = createBrowserRouter([
    {

      element: <ErrorBoundary FallbackComponent={ErrorFallBack} onReset={() => window.location.replace('/')}>
        <Outlet />
      </ErrorBoundary>,
      children: [

        {
          path: '/',
          element:
            <ErrorBoundary fallback={<ErrorFallBack />}>
              <Navigate to="/main" />,
            </ErrorBoundary>
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: "main",
          element:
            <ProtectedRoute user={user}>
              <Navbar />
              <RecipesProvider>
                <Outlet />
              </RecipesProvider>
            </ProtectedRoute>,
          children: [
            {
              index: true,
              element: <MainPage />
            },
            {
              path: "add-recipe",
              element: <AddRecipe />
            },
            {
              path: "my-recipes",
              element: <RecipePage />
            },
            {
              path: "recipe/:id",
              element: <RecipeDetail />
            },
            {
              path: "recipe-edit/:id",
              element: <AddRecipe />
            },

          ]
        }
      ]
    },
    {
      path: "*",
      element: <PageNotFound />
    },
  ])

  return (
    <>

      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
        <Toaster gutter={12} toastOptions={{
          className: "toast",
          style: {
            borderRadius: "1em",
            backgroundColor: "#f3cfcf",
            color: "#993b3b",
            border: "1px solid rgb(226, 226, 226)",
          }
        }} containerStyle={{ margin: "16px" }} />
      </QueryClientProvider>

    </>
  )
}
export default App
