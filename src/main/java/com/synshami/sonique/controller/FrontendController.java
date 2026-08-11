package com.synshami.sonique.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    /**
     * Forwards all non-API and non-static file routes to the frontend's index.html
     * This ensures that SPA (React) routes like /identity or /compatibility
     * can be refreshed directly in the browser without returning a 404.
     */
    @RequestMapping(value = {
        "/identity",
        "/compatibility",
        "/account",
        // Catch-all for other potential SPA routes, ignoring files with extensions (like .js, .css)
        "/{path:[^\\.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
