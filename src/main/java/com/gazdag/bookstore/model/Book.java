package com.gazdag.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Book {

    @Id
    private String olid;
    private String isbn;
    private String title;
    private String publisher;
    private Integer numberOfPages;
    @Lob
    private String description;
    @ElementCollection
    private List<String> authors;
    @ElementCollection
    private List<String> genres;
    @ElementCollection(fetch = FetchType.EAGER)
    @JsonIgnore
    private List<String> wishedBy;

}
