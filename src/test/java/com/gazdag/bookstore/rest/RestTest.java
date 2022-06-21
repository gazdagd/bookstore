package com.gazdag.bookstore.rest;

import com.gazdag.bookstore.BookstoreApplication;
import com.gazdag.bookstore.model.Book;
import com.gazdag.bookstore.repository.BookRepository;
import com.tngtech.keycloakmock.api.KeycloakMock;
import com.tngtech.keycloakmock.api.ServerConfig;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.client.Hop;
import org.springframework.hateoas.client.Traverson;
import org.springframework.hateoas.server.core.TypeReferences;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.util.SocketUtils;

import java.net.URI;
import java.util.Collections;
import java.util.List;

import static com.tngtech.keycloakmock.api.TokenConfig.aTokenConfig;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RestTest {

    private static final String USERNAME_1 = "user1";
    private static final String USERNAME_2 = "user2";

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Autowired
    private BookRepository bookRepository;

    private static Traverson traverson;

    private static KeycloakMock mock;

    @BeforeAll
    public static void setUp() {
        int port = SocketUtils.findAvailableTcpPort();
        mock = new KeycloakMock(ServerConfig.aServerConfig().withPort(port).withDefaultRealm("bookstore").build());
        System.setProperty("keycloak.auth-server-url", "http://localhost:" + port + "/auth");
    }

    @BeforeEach
    public void init() {
        traverson = new Traverson(URI.create("http://localhost:" + port + "/api/"), MediaTypes.HAL_JSON);
        bookRepository.deleteAll();
        mock.start();
    }

    @AfterEach
    public void reset() {
        mock.stop();
    }

    private void givenBooks(Book... book) {
        bookRepository.saveAll(List.of(book));
    }

    private static Book.BookBuilder getDefaultBookBuilder() {
        return Book.builder()
                .olid("OL26331930M")
                .isbn("9780590353427")
                .title("Harry Potter and the Sorcerer's Stone")
                ;
    }


    @Test
    public void anonymAccessAllowed() {
        ResponseEntity response = testRestTemplate.getForEntity("/api/books", String.class);
        assertThat(response.getStatusCode(), Matchers.equalTo(HttpStatus.OK));
    }

    @Test
    public void anonymAccessWishedMissing() {
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1))
                .build());

        Object firstBook = traverson
                .follow(Hop.rel("books").withParameter("projection", "withWished"))
                .toObject("$._embedded.books[0]");

        assertThat(firstBook, not(hasProperty("wished")));
    }

    @Test
    public void authAccessWishedPresent() {
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1))
                .build());
        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_2).build());

        Boolean wished = traverson
                .follow(Hop.rel("books")
                        .withParameter("projection", "withWished")
                        .withHeaders(getHeaders(accessToken)))
                .toObject("$._embedded.books[0].wished");

        assertThat(wished, is(false));
    }

    @Test
    public void wishedTrue() {
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1))
                .build());
        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_1).build());

        Boolean wished = traverson
                .follow(Hop.rel("books")
                        .withParameter("projection", "withWished")
                        .withHeaders(getHeaders(accessToken)))
                .toObject("$._embedded.books[0].wished");

        assertThat(wished, is(true));
    }


    @Test
    public void bookQuery() {
        givenBooks(getDefaultBookBuilder()
                        .publisher("Scholastic")
                        .description("description")
                        .wishedBy(List.of(USERNAME_1, USERNAME_2))
                        .build(),
                getDefaultBookBuilder()
                        .title("Harry Potter and the Chamber of Secrets")
                        .isbn("9780439064873")
                        .olid("OL17143778M")
                        .wishedBy(List.of(USERNAME_2))
                        .publisher("Scholastic")
                        .description("description")
                        .build());

        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_1).build());

        TypeReferences.CollectionModelType<Book> collectionModelType =
                new TypeReferences.CollectionModelType<>() {
                };

        CollectionModel<Book> bookResource = traverson
                .follow(Hop.rel("books"))
                .withHeaders(getHeaders(accessToken))
                .toObject(collectionModelType);
        assertThat(bookResource.getContent().size(), Matchers.equalTo(2));
    }

    @Test
    public void addToWishlist() {
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1))
                .build());
        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_2).build());
        setHeaders(accessToken);
        testRestTemplate.put("/api/wishlist/OL26331930M", null);
        assertThat(bookRepository.findById("OL26331930M").get().getWishedBy(), Matchers.hasItem(USERNAME_2));
    }

    @Test
    public void removeFromWishlist() {
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1, USERNAME_2))
                .build());
        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_1).build());
        setHeaders(accessToken);
        testRestTemplate.delete("/api/wishlist/OL26331930M");
        assertThat(bookRepository.findById("OL26331930M").get().getWishedBy(), not(Matchers.hasItem(USERNAME_1)));
    }

    private void setHeaders(String token) {
        testRestTemplate.getRestTemplate().setInterceptors(
                Collections.singletonList((request, body, execution) -> {
                    request.getHeaders()
                            .add("Authorization", "Bearer " + token);
                    return execution.execute(request, body);
                }));
    }

    private static HttpHeaders getHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        return headers;
    }
}