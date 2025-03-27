import { createContext, useState, useContext, useEffect } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const msalConfig = {
    auth: {
        clientId: 'bd9a861e-8f53-4478-9906-38ed2be3893b',
        authority: 'https://login.microsoftonline.com/7d12b88a-eb0a-435e-9c73-4baa61a4fa44',
        redirectUri: "http://localhost:5173",
        navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
    system: {
        allowRedirectInIframe: true,
        tokenRenewalOffsetSeconds: 300
    }
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const msalInstance = new PublicClientApplication(msalConfig);

    // Função para inicializar o MSAL
    const initializeMsal = async () => {
        try {
            await msalInstance.initialize();
            return true;
        } catch (error) {
            console.error("Erro ao inicializar MSAL:", error);
            return false;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await initializeMsal();
                
                const accounts = msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    const userData = accounts[0];

                    // Verifica se o email pertence ao domínio correto
                    if (!userData.username.endsWith('@casadomenino.org.br')) {
                        // Se não for do domínio correto, faz logout
                        await logout();
                        throw new Error('Acesso permitido apenas para usuários do domínio @casadomenino.org.br');
                    }

                    console.log('Dados do usuário (sessão existente):', {
                        nome: userData.name,
                        username: userData.username,
                        email: userData.username,
                        id: userData.localAccountId,
                        tenantId: userData.tenantId,
                        ambiente: userData.environment,
                        todosOsDados: userData
                    });
                    
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async () => {
        try {
            await initializeMsal();

            const loginRequest = {
                scopes: ["User.Read"],
                prompt: "select_account"
            };

            const response = await msalInstance.loginPopup(loginRequest);
            
            if (response) {
                const userData = response.account;
                
                // Verifica se o email pertence ao domínio correto
                if (!userData.username.endsWith('@casadomenino.org.br')) {
                    throw new Error('Acesso permitido apenas para usuários do domínio @casadomenino.org.br');
                }

                // Verifica se o tenant ID corresponde ao esperado
                if (userData.tenantId !== '7d12b88a-eb0a-435e-9c73-4baa61a4fa44') {
                    throw new Error('Usuário não pertence à organização autorizada. Por favor, contate o administrador.');
                }

                console.log('Dados do usuário (novo login):', {
                    nome: userData.name,
                    username: userData.username,
                    email: userData.username,
                    id: userData.localAccountId,
                    tenantId: userData.tenantId,
                    ambiente: userData.environment,
                    dadosCompletos: userData,
                    tokenResponse: {
                        idToken: response.idToken,
                        accessToken: response.accessToken,
                        tokenType: response.tokenType,
                        expiresOn: response.expiresOn,
                        scopes: response.scopes
                    }
                });

                setUser(userData);
                setIsAuthenticated(true);
                navigate('/');
            }
        } catch (error) {
            console.error("Erro no login:", error);
            if (error.errorCode === 'AADSTS50020') {
                throw new Error('Usuário não está registrado na organização. Por favor, contate o administrador do sistema.');
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Garante que o MSAL está inicializado
            await initializeMsal();
            
            const logoutRequest = {
                account: msalInstance.getActiveAccount(),
                postLogoutRedirectUri: "http://localhost:5173/login"
            };

            await msalInstance.logoutPopup(logoutRequest);
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error) {
            console.error("Erro no logout:", error);
        }
    };

    const getAccessToken = async () => {
        try {
            const account = msalInstance.getActiveAccount();
            if (!account) {
                throw new Error("Nenhuma conta ativa encontrada");
            }

            const response = await msalInstance.acquireTokenSilent({
                scopes: ["User.Read"],
                account: account
            });

            return response.accessToken;
        } catch (error) {
            console.error("Erro ao obter token:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            logout, 
            loading,
            getAccessToken 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 