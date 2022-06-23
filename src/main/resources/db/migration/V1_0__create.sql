create table book(
    olid VARCHAR(255) NOT NULL,
    isbn VARCHAR(255),
    title VARCHAR(255),
    publisher VARCHAR(255),
    number_of_pages INTEGER,
    description TEXT,
    PRIMARY KEY (olid)
);

create table book_authors(
    book_olid VARCHAR(255) NOT NULL,
    authors VARCHAR(255),
    CONSTRAINT fk_book_authors FOREIGN KEY(book_olid) REFERENCES book(olid)
);

create table book_genres(
    book_olid VARCHAR(255) NOT NULL,
    genres VARCHAR(255),
    CONSTRAINT fk_book_genres FOREIGN KEY(book_olid) REFERENCES book(olid)
);

create table book_wished_by(
    book_olid VARCHAR(255) NOT NULL,
    wished_by VARCHAR(255),
    CONSTRAINT fk_book_wished_by FOREIGN KEY(book_olid) REFERENCES book(olid)
);