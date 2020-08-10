package com.gazdag.bookstore.bootstrap;

import com.gazdag.bookstore.model.Book;
import com.gazdag.bookstore.repository.BookRepository;
import org.keycloak.adapters.tomcat.SimplePrincipal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private BookRepository bookRepository;

    public DataLoader(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        SecurityContextHolder.setContext(getSecurityContext());
        bookRepository.save(Book.builder()
                .olid("OL26331930M")
                .title("Harry Potter and the Sorcerer's Stone")
                .isbn("9780590353427")
                .numberOfPages(309)
                .publisher("Scholastic")
                .authors(List.of("J. K. Rowling"))
                .genres(List.of("Adventure", "Fantasy"))
                .wishedBy(List.of("10926e39-0889-4183-9c29-4d384396f0e8", "259ccb7a-5a2a-401e-9271-9418d4140cf2"))
                .build());
        bookRepository.save(Book.builder()
                .olid("OL17143778M")
                .title("Harry Potter and the Chamber of Secrets")
                .isbn("9780439064873")
                .numberOfPages(341)
                .publisher("Scholastic")
                .authors(List.of("J. K. Rowling"))
                .genres(List.of("Adventure", "Fantasy"))
                .build());
    }

    private SecurityContext getSecurityContext(){
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("admin"));
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(new TestingAuthenticationToken(new SimplePrincipal("user"), null, authorities));
        return securityContext;
    }
}
