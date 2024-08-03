import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function ProtectedRoute({user,children}) {

    const navigate = useNavigate();
    useEffect(() =>
    {
        if(user === false) navigate('/login')
    },[user,navigate])

    
    if(user === true )return children;

}

export default ProtectedRoute
