package com.gazdag.bookstore.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.util.List;
import java.util.Optional;

@Projection(name = "withWished", types = Book.class)
public interface WithWishedProjection {

    String getOlid();

    String getIsbn();

    String getTitle();

    String getPublisher();

    String getDescription();

    Integer getNumberOfPages();

    List<String> getAuthors();

    List<String> getGenres();

    @Value("#{@bookService.isWished(target)}")
    @JsonInclude(JsonInclude.Include.NON_ABSENT)
    Optional<Boolean> getWished();
}
