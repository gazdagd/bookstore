package com.gazdag.bookstore.service;

public interface WishlistService {

    void add(String userName, String olid);

    void remove(String userName, String olid);

}
