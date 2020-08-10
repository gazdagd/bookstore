package com.gazdag.bookstore.service;

import com.gazdag.bookstore.model.Book;

import java.util.Optional;

public interface BookService {
    Optional<Boolean> isWished(Book book);
}
