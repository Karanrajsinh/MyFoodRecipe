import { useState } from "react";
import { useUserAuth } from "@/context/UserAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUser, loginUser } from "@/utils/firebase";
import { getFirebaseAuthErrorMessage } from "@/utils/uitls";
import { ImSpinner8 } from "react-icons/im";
import img from '../../public/recipe-book.png'
function Login() {
  const { error, setError } = useUserAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('SignIn');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  function toggleType(e) {
    e.preventDefault();
    setError('');
    if (type === "SignUp") setType("SignIn")
    else setType("SignUp")
  }

  function handelData(data) {
    setIsLoading(true);
    const { name, email, password } = data;

    if (type === 'SignUp') createUser(email, password, name).then(() => {
      setError('');
      navigate('/main');
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
      setError(getFirebaseAuthErrorMessage(err.code));
    });

    if (type === "SignIn") loginUser(email, password).then(() => {
      setError('');
      navigate('/main');
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
      setError(getFirebaseAuthErrorMessage(err.code))
    })

  }
  const onSubmit = (data) => {
    // Handle form submission
    handelData(data);
  };

  return (
    <div className="flex flex-col justify-center min-h-screen gap-28">
      <div className="flex items-center justify-center gap-2">
        <img className="w-10 md:w-12" src={img} />
        <span className="text-xl font-bold text-red-400 md:text-3xl">MyFoodRecipe</span>
      </div>
      <div className="flex items-center justify-center px-4 mx-6 md:mx-0 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md px-5 py-4 bg-white border rounded-lg shadow-lg border-slate-300 sm:p-6 lg:p-8"
        >
          <h1 className="mb-6 text-lg font-bold text-red-500 sm:text-xl lg:text-2xl">
            {type === "SignUp" ? "Sign Up" : "Sign In"}
          </h1>
          {type === "SignUp" && (
            <div className="mb-4">
              <input
                disabled={isLoading}
                type="text"
                placeholder="Name"
                className="w-full p-2 text-sm border rounded-lg focus:border-red-400 focus:outline-none lg:text-base"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500 md:text-base">{errors.name.message}</p>}
            </div>
          )}
          <div className="mb-4">
            <input
              disabled={isLoading}
              type="email"
              defaultValue={'test@gmail.com'}
              placeholder="Email"
              className="w-full p-2 text-sm border rounded-lg focus:border-red-400 focus:outline-none lg:text-base"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500 md:text-base">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <input
              disabled={isLoading}
              defaultValue={'123456'}
              type="password"
              placeholder="Password"
              autoComplete="password"
              className="w-full p-2 text-sm border rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none lg:text-base"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500 md:text-base">{errors.password.message}</p>}
          </div>
          {error !== '' && <p className="mb-2 text-sm text-red-500 md:text-base">{error}</p>}
          <button
            type="submit"
            className="flex items-center justify-center w-full gap-2 p-2 text-sm text-white bg-red-400 rounded-lg lg:text-base"
          >
            {!isLoading ? (
              type === "SignUp" ? "Sign Up" : "Sign In"
            ) : (
              <>
                <ImSpinner8 className="spinner-rotate" />
                {type === "SignUp" ? "Signing Up" : "Signing In"}
              </>
            )}
          </button>
          <p className="mt-4 text-sm lg:text-base">
            {type === "SignIn" ? "Don't Have An Account?" : "Already Have An Account?"}
            <button
              disabled={isLoading}
              type="button"
              className="ml-2 text-red-400 underline"
              onClick={toggleType}
            >
              {type === "SignUp" ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login

