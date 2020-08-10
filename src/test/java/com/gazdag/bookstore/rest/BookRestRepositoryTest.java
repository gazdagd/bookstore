package com.gazdag.bookstore.rest;

import com.gazdag.bookstore.model.Book;
import com.gazdag.bookstore.repository.BookRepository;
import com.gazdag.bookstore.repository.BookRestRepository;
import com.tngtech.keycloakmock.api.KeycloakMock;
import org.hamcrest.Matchers;
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
import org.springframework.util.SocketUtils;

import java.net.URI;
import java.util.List;

import static com.tngtech.keycloakmock.api.TokenConfig.aTokenConfig;
import static org.hamcrest.MatcherAssert.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class BookRestRepositoryTest {

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
        mock = new KeycloakMock(port, "bookstore");
        System.setProperty("keycloak.auth-server-url", "http://localhost:" + port + "/auth");
        mock.start();
    }

    @BeforeEach
    public void init() {
        traverson = new Traverson(URI.create("http://localhost:" + port + "/api/"), MediaTypes.HAL_JSON);
        bookRepository.deleteAll();
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

        Object wished = traverson
                .follow(Hop.rel("books"))
                .toObject("$._embedded.books[0].wished");

        assertThat(wished, Matchers.nullValue());
    }

    @Test
    public void authAccessWishedPresent() {
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1))
                .build());
        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_2).build());

        Object wished = traverson
                .follow(Hop.rel("books"))
                .withHeaders(getHeaders(accessToken))
                .toObject("$._embedded.books[0].wished");

        assertThat(wished, Matchers.notNullValue());
    }

    @Test
    public void wishedTrue() {
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1))
                .build());
        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_1).build());

        Boolean wished = traverson
                .follow(Hop.rel("books"))
                .withHeaders(getHeaders(accessToken))
                .toObject("$._embedded.books[0].wished");

        assertThat(wished, Matchers.equalTo(true));
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

    private static HttpHeaders getHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        return headers;
    }

}
