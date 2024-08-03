import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";


const UserAuthContext = createContext();

function UserAuthProvider({ children }) {

  const [name, setName] = useState();
  const auth = getAuth();
  const [error, setError] = useState('');
  const [uid, setUid] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid);
      setName(user?.displayName);
    })
    return () => unsubscribe();
    /* eslint-disable */
  }, [])
  /* eslint-ensable */

  return (
    <UserAuthContext.Provider value={
      {
        name, uid, setUid, error, setError
      }}>
      {children}
    </UserAuthContext.Provider>
  )
}

function useUserAuth() {
  const context = useContext(UserAuthContext);
  return context;
}

/*eslint-disable */
export { UserAuthProvider, useUserAuth };