import { useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from 'react-router-dom'
import { apiClient } from "../api/client";

const AuthCallBack = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token')
        const error = params.get('error')
        if (error || !token) {
            navigate('/login')
            return
        }
        localStorage.setItem('token', token)
        apiClient('/api/me')
        .then(user => {
            setUser(user)
            navigate('/')
        }).catch(() => navigate('/login'))
    }, [navigate, setUser]) 
    return <p className="text-4xl text-center">Signing you in...</p>;
};

export default AuthCallBack;
