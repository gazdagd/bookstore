package com.gazdag.bookstore.service;

import com.gazdag.bookstore.repository.BookRepository;
import org.springframework.stereotype.Service;

@Service
public class WishlistServiceImpl implements WishlistService{

    private final BookRepository bookRepository;

    public WishlistServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void add(String userName, String olid) {
        bookRepository.findById(olid).ifPresent(
                book -> {
                    book.getWishedBy().add(userName);
                    bookRepository.save(book);
                }
        );
    }

    @Override
    public void remove(String userName, String olid) {
        bookRepository.findById(olid).ifPresent(
                book -> {
                    book.getWishedBy().removeIf(item -> item.equals(userName));
                    bookRepository.save(book);
                }
        );
    }
}
