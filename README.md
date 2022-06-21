# Bookstore
This is a personal study project for practicing technical skills. It is not intended to present production ready solution and it is focus on particular things like:
- Create React application with Material UI
- Integrate React client side application with Spring Boot backend
- Use Keycloak as authentication/authorization solution
- Deploy with docker compose

To run it:
- clone repo
- cd bookstore
- mvn clean install (use java 11)
- add "127.0.0.1 keycloak.bookstore.net" to your hosts file
- docker-compose up -d
- login to keycloak administration (localhost:8080) console and create a user with credentials
- open localhost:8081

## Screenshots
### Book list without authentication
![Book list without authentication](/book-list-page.png)
### Admin page
![Admin page](/admin-page.png)
### Single book page
![Single book page](/read-book-page.png)