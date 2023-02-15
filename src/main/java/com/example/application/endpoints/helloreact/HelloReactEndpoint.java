package com.example.application.endpoints.helloreact;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@AnonymousAllowed
public class HelloReactEndpoint {

    @Nonnull
    public String Duplicate(@Nonnull String duplicate) {
            return "Hello " + duplicate;
        }

    public String Invalid(@Nonnull String invalid) {
        return "Hello " + invalid;
    }

    public String nonEnglish(@Nonnull String nonEnglish) {
        return "Hello " + nonEnglish;
    }
    }
