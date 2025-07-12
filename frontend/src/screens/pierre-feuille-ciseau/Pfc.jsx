import "./pfc.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../../contexts/userContexts";
import Chatbox from "../../components/chatbox/Chatbox";
import Header from "../../components/header/Header";
import Shifumi from "../../components/shifumi/Shifumi";

const Pfc = () => { 
    const navigate = useNavigate();
    const { user, loading } = useUser();

    useEffect(() => {
        console.log("Pfc component - user state:", user, "loading:", loading);
        
        // Ne rediriger que si le chargement est terminé et qu'il n'y a pas d'utilisateur
        if (!loading && user === null) {
            console.log("User is null and loading is finished, redirecting to login");
            navigate('/login');
        }
    }, [user, loading, navigate]);

    // Afficher un loader pendant le chargement
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div>Chargement...</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    Vérification de votre session...
                </div>
            </div>
        );
    }

    // Si l'utilisateur n'est pas connecté, ne rien afficher (la redirection se fera dans le useEffect)
    if (user === null) {
        return null;
    }
    
    return (
        <>
            <Header />
            <Chatbox />
            <Shifumi />
        </>
    );
};

export default Pfc;