import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Criando o Contexto
export const MyContext = createContext();

// Provedor do Contexto
export const MyProvider = ({ children }) => {
    const [pacientes, setPacientes] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [loadingPacientes, setLoadingPacientes] = useState(true);
    const [loadingProfissionais, setLoadingProfissionais] = useState(true);
    const [error, setError] = useState(null);

    // Buscar pacientes da API
    const fetchPacientes = async () => {
        setLoadingPacientes(true);
        setError(null);
        try {
            const response = await axios.get("https://n8n-n8n.rmmcki.easypanel.host/webhook/pacientes");
            setPacientes(response.data);
        } catch (err) {
            console.error("Erro ao buscar pacientes:", err);
            setError("Erro ao carregar os pacientes.");
        } finally {
            setLoadingPacientes(false);
        }
    };

    // Buscar profissionais da API
    const fetchProfissionais = async () => {
        setLoadingProfissionais(true);
        setError(null);
        try {
            const response = await axios.get("https://n8n-n8n.rmmcki.easypanel.host/webhook/profissionais");
            setProfissionais(response.data);
        } catch (err) {
            console.error("Erro ao buscar profissionais:", err);
            setError("Erro ao carregar os profissionais.");
        } finally {
            setLoadingProfissionais(false);
        }
    };

    // Adicionar um profissional no backend
    const addProfissional = async (nome, funcao) => {
        try {
            await axios.post(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/add-profissional",
                { nome, funcao, ativo: 1 }
            );
            fetchProfissionais(); // Atualiza a lista
        } catch (error) {
            console.error("Erro ao adicionar profissional:", error);
        }
    };

    // Editar um profissional no backend
    const editProfissional = async (profissionalEditado) => {
        try {
            await axios.put(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/update-profissional",
                profissionalEditado
            );
            fetchProfissionais(); // Atualiza os profissionais
        } catch (error) {
            console.error("Erro ao editar:", error);
        }
    };

    // Adicionar um paciente no backend
    const addPaciente = async (nome, historico) => {
        try {
            await axios.post(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/add-paciente",
                { nome, historico, ativo: 1 }
            );
            fetchPacientes(); // Atualiza a lista
        } catch (error) {
            console.error("Erro ao adicionar paciente:", error);
        }
    };

    // Editar um paciente no backend
    const editPaciente = async (pacienteEditado) => {
        try {
            await axios.put(
                "https://n8n-n8n.rmmcki.easypanel.host/webhook/update-paciente",
                pacienteEditado
            );
            fetchPacientes(); // Atualiza os pacientes
        } catch (error) {
            console.error("Erro ao editar paciente:", error);
        }
    };

    useEffect(() => {
        fetchPacientes();
        fetchProfissionais();
    }, []);

    return (
        <MyContext.Provider value={{
            pacientes, loadingPacientes, fetchPacientes, addPaciente, editPaciente,
            profissionais, loadingProfissionais, fetchProfissionais,
            error, addProfissional, editProfissional
        }}>
            {children}
        </MyContext.Provider>
    );
};