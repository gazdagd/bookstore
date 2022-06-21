package com.gazdag.bookstore.repository;

import com.gazdag.bookstore.model.Book;
import com.gazdag.bookstore.model.WithWishedProjection;
import org.springframework.context.annotation.Primary;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(excerptProjection = WithWishedProjection.class)
@CrossOrigin
@Primary
public interface BookRestRepository extends CrudRepository<Book, String> {

    @PreAuthorize("hasRole('admin')")
    @Override
    <S extends Book> S save(S s);

    @PreAuthorize("hasRole('admin')")
    @Override
    void deleteById(String olid);

    @PreAuthorize("hasRole('admin')")
    @Override
    void delete(Book book);
}
