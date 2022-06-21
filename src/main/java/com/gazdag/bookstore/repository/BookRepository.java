package com.gazdag.bookstore.repository;

import com.gazdag.bookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RestResource(exported = false)
public interface BookRepository extends JpaRepository<Book, String> {
}
