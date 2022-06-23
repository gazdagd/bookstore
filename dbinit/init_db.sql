create user bookstore with PASSWORD 'bookpasswd';
CREATE DATABASE bookstore;
GRANT ALL PRIVILEGES ON DATABASE bookstore TO bookstore;

create user keycloak with PASSWORD 'keypasswd';
CREATE DATABASE keycloak;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;