import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PacientesContext = createContext();

export const PacientesProvider = ({ children }) => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await axios.get("https://n8n-n8n.rmmcki.easypanel.host/webhook/pacientes");
                setPacientes(response.data);
            } catch (err) {
                console.error("Erro ao buscar pacientes:", err);
                setError("Erro ao carregar os pacientes.");
            } finally {
                setLoading(false);
            }
        };

        fetchPacientes();
    }, []);

    return (
        <PacientesContext.Provider value={{ pacientes, loading, error }}>
            {children}
        </PacientesContext.Provider>
    );
};
