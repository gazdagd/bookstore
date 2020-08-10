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
import org.springframework.util.SocketUtils;

import java.util.Collections;
import java.util.List;

import static com.tngtech.keycloakmock.api.TokenConfig.aTokenConfig;
import static org.hamcrest.MatcherAssert.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WishlistTest {

    private static final String USERNAME_1 = "user1";
    private static final String USERNAME_2 = "user2";

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Autowired
    private BookRepository bookRepository;

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
    public void addToWishlist(){
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1))
                .build());
        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_2).build());
        setHeaders(accessToken);
        testRestTemplate.put("/api/wishlist/OL26331930M", null);
        assertThat(bookRepository.findById("OL26331930M").get().getWishedBy(), Matchers.hasItem(USERNAME_2));
    }

    @Test
    public void removeFromWishlist(){
        givenBooks(getDefaultBookBuilder()
                .wishedBy(List.of(USERNAME_1, USERNAME_2))
                .build());
        String accessToken = mock.getAccessToken(aTokenConfig().withSubject(USERNAME_1).build());
        setHeaders(accessToken);
        testRestTemplate.delete("/api/wishlist/OL26331930M");
        assertThat(bookRepository.findById("OL26331930M").get().getWishedBy(), Matchers.not(Matchers.hasItem(USERNAME_1)));
    }

    private void setHeaders(String token) {
        testRestTemplate.getRestTemplate().setInterceptors(
                Collections.singletonList((request, body, execution) -> {
                    request.getHeaders()
                            .add("Authorization", "Bearer " + token);
                    return execution.execute(request, body);
                }));
    }
}
