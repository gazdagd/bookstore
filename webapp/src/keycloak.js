import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
    realm: process.env.REACT_APP_KEYCLOAK_REALM,
    url: process.env.REACT_APP_KEYCLOAK_URL,
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
});

export default keycloak