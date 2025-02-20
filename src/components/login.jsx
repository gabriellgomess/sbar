import { PublicClientApplication } from "@azure/msal-browser";

const cliente_id = 'bd9a861e-8f53-4478-9906-38ed2be3893b';
const id_secreto = '55745fb3-de15-4fbd-9142-b56781077062';
const id_locatario = 'd24cf088-ea91-4d3a-851a-6ee342039d7f';

const msalConfig = {
  auth: {
    clientId: cliente_id,
    authority: `https://login.microsoftonline.com/${id_locatario}`,
    redirectUri: "http://localhost:5173",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const login = async () => {
  try {
    // Aguarde a inicialização antes de chamar loginPopup
    await msalInstance.initialize();

    const loginResponse = await msalInstance.loginPopup({
      scopes: ["user.read"],
    });

    console.log("Token recebido:", loginResponse.accessToken);
  } catch (error) {
    console.error("Erro no login:", error);
  }
};

export default login;
