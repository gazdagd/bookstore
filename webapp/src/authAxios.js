import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://keycloak.bookstore.net:8080/auth/realms/bookstore/protocol/openid-connect/'
});

export default instance;