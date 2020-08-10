import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/auth/realms/bookstore/protocol/openid-connect/'
});

export default instance;