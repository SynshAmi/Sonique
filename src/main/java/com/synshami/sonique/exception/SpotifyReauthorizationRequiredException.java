package com.synshami.sonique.exception;

public class SpotifyReauthorizationRequiredException extends AuthenticationException {
    public SpotifyReauthorizationRequiredException(String message) {
        super(message);
    }

    public SpotifyReauthorizationRequiredException(String message, Throwable cause) {
        super(message, cause);
    }
}
