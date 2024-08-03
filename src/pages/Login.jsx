import { useState } from "react";
import { useUserAuth } from "@/context/UserAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUser, loginUser } from "@/utils/firebase";
import { getFirebaseAuthErrorMessage } from "@/utils/uitls";

function Login() {
  const { error, setError } = useUserAuth();
  const [type, setType] = useState('SignUp');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  function toggleType(e) {
    e.preventDefault();
    setError('');
    if (type === "SignUp") setType("SignIn")
    else setType("SignUp")
  }

  function handelData(data) {
    const { name, email, password } = data;

    if (type === 'SignUp') createUser(email, password, name).then(() => {
      setError('');
      navigate('/main');
    }).catch((err) => {
      setError(getFirebaseAuthErrorMessage(err.code));
    });

    if (type === "SignIn") loginUser(email, password).then(() => {
      setError('');
      navigate('/main');
    }).catch((err) => setError(getFirebaseAuthErrorMessage(err.code)))

  }
  const onSubmit = (data) => {
    // Handle form submission
    handelData(data);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-white border rounded-lg shadow-lg border-slate-300"
      >
        <h1 className="mb-6 text-2xl font-bold text-red-500">
          {type === "SignUp" ? "Sign Up" : "Sign In"}
        </h1>
        {type === "SignUp" && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded-lg focus:border-red-400 focus:outline-none"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
        )}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg focus:border-red-400 focus:outline-none"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            autoComplete="password"
            className="w-full p-2 border rounded-lg focus:border-red-400 focus:outline-none"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        {error !== '' && <p className="mb-2 text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 text-white bg-red-400 rounded-lg"
        >
          {type === "SignUp" ? "Sign Up" : "Sign In"}
        </button>
        <p className="mt-4">
          {type === "SignIn" ? "Don't Have An Account?" : "Already Have An Account?"}
          <button
            type="button"
            className="ml-2 text-red-400 underline"
            onClick={toggleType}
          >
            {type === "SignUp" ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login

