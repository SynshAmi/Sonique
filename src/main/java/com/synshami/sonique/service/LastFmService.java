package com.synshami.sonique.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.synshami.sonique.config.LastFmProperties;
import com.synshami.sonique.exception.AuthenticationException;
import com.synshami.sonique.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class LastFmService {
    private final RestTemplate restTemplate;
    private final LastFmProperties lastFmProperties;

    public JsonNode getArtistInfo(String artistName)
    {
        String url = UriComponentsBuilder
                .fromHttpUrl(lastFmProperties.getBaseUrl())
                .queryParam("method", "artist.getInfo")
                .queryParam("artist", artistName)
                .queryParam("api_key", lastFmProperties.getApiKey())
                .queryParam("format", "json")
                .toUriString();

        try {
            ResponseEntity<String> response=restTemplate.getForEntity(url, String.class);

            if(response.getBody()==null)
            {
                throw new IllegalStateException("Last.fm response was empty");
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            if (rootNode.has("error")) {
                int errorCode = rootNode.path("error").asInt();
                String message = rootNode.path("message").asText("Last.fm returned an error");
                if (errorCode == 6) {
                    throw new ResourceNotFoundException("Artist not found on Last.fm: " + artistName);
                } else if (errorCode == 4 || errorCode == 10) {
                    throw new AuthenticationException("Last.fm authentication failed: " + message);
                } else {
                    throw new RuntimeException("Last.fm error (" + errorCode + "): " + message);
                }
            }

            return rootNode;

        } catch (RestClientException ex) {
            throw new RuntimeException(
                    "Failed to fetch artist info from Last.fm", ex);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException("Failed to parse Last.fm response", ex);
        }
    }

    public JsonNode getArtistTopTags(String artistName)
    {
        String url = UriComponentsBuilder
                .fromHttpUrl(lastFmProperties.getBaseUrl())
                .queryParam("method", "artist.getTopTags")
                .queryParam("artist", artistName)
                .queryParam("api_key", lastFmProperties.getApiKey())
                .queryParam("format", "json")
                .toUriString();

        try {
            ResponseEntity<String> response=restTemplate.getForEntity(url, String.class);

            if(response.getBody()==null)
            {
                throw new IllegalStateException("Last.fm response was empty");
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            if (rootNode.has("error")) {
                int errorCode = rootNode.path("error").asInt();
                String message = rootNode.path("message").asText("Last.fm returned an error");
                if (errorCode == 6) {
                    throw new ResourceNotFoundException("Artist not found on Last.fm: " + artistName);
                } else if (errorCode == 4 || errorCode == 10) {
                    throw new AuthenticationException("Last.fm authentication failed: " + message);
                } else {
                    throw new RuntimeException("Last.fm error (" + errorCode + "): " + message);
                }
            }

            return rootNode;

        } catch (RestClientException ex) {
            throw new RuntimeException(
                    "Failed to fetch artist tags from Last.fm", ex);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException("Failed to parse Last.fm response", ex);
        }
    }
}
