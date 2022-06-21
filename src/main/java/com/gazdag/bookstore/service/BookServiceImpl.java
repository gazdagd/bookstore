package com.gazdag.bookstore.service;

import com.gazdag.bookstore.model.Book;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("bookService")
@Slf4j
public class BookServiceImpl implements BookService {

    @Override
    public Optional<Boolean> isWished(Book book) {
        log.info("Use withWished projection...");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("Authenticated user: " + auth.getName() + " isAuth " + auth.isAuthenticated());
        log.info("Wished by: " + book.getWishedBy());
        if(auth.getName().equals("anonymousUser")) return Optional.empty();
        return Optional.of(book.getWishedBy().contains(auth.getName()));
    }
}
