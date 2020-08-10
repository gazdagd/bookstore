package com.gazdag.bookstore.service;

import com.gazdag.bookstore.model.Book;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("bookService")
public class BookServiceImpl implements BookService {

    @Override
    public Optional<Boolean> isWished(Book book) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth.getName().equals("anonymousUser")) return Optional.empty();
        return Optional.of(book.getWishedBy().contains(auth.getName()));
    }
}
