package com.gazdag.bookstore.controller;

import com.gazdag.bookstore.service.WishlistService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishController {

    private final WishlistService wishlistService;

    public WishController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PutMapping("/{olid}")
    @PreAuthorize("isAuthenticated()")
    public void addToWishlist(Authentication authentication, @PathVariable String olid){
        wishlistService.add(authentication.getName(), olid);
    }

    @DeleteMapping("/{olid}")
    @PreAuthorize("isAuthenticated()")
    public void removeFromWishlist(Authentication authentication, @PathVariable String olid){
        wishlistService.remove(authentication.getName(), olid);
    }

}
