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
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'




function App() {

  const auth = getAuth();
  const [user, setUser] = useState();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      }
    }
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(Boolean(data));
      console.log('user status', data)
    })

    return () => unsubscribe();
    /* eslint-disable */
  }, [])
  /* eslint-ensable */

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/main" />,

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
        }
      ]
    }
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
