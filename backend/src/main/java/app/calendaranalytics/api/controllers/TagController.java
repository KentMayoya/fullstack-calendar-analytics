package app.calendaranalytics.api.controllers;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import app.calendaranalytics.api.dtos.TagDto;
import app.calendaranalytics.api.dtos.UpsertTagRequestDto;
import app.calendaranalytics.api.exception.DuplicateResourceException;
import app.calendaranalytics.api.services.TagService;

/**
 * Defines the API endpoint for creating and upserting tags in Supabase.
 */
@RestController
@RequestMapping("/api/v1/tags")
public class TagController {

    // A Spring-managed Bean that provides business logic methods for the Tag
    // entity.
    private final TagService tagService;

    /**
     * Constructs the TagController with a dependency on the TagService.
     *
     * @param tagService The service managing tag-related business logic.
     */
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    /**
     * Creates a new tag (if a tag does not already exist in the database) and
     * associates it to the user.
     *
     * @param requestDto A JSON containing the tag's name.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A TagDto of the newly created tag.
     * @throws DuplicateResourceException If a tag with the same name already
     * exists for the user.
     */
    @PostMapping
    public ResponseEntity<TagDto> createTag(@RequestBody UpsertTagRequestDto requestDto,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        TagDto newTag = tagService.createTag(userId, requestDto.getName());
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newTag.getId())
                .toUri();
        return ResponseEntity.created(location).body(newTag);
    }

    /**
     * Retrieves a list of all the tags related to the user specified in
     * authentication.
     *
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A 200 OK Response with a list of TagDtos in its body.
     */
    @GetMapping
    public ResponseEntity<List<TagDto>> getTags(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<TagDto> tags = tagService.getTags(userId);
        return ResponseEntity.ok(tags);
    }

    /**
     * Updates the name of the tag that matches the current user and tag id to
     * the name in the request body.
     *
     * @param id The tag's id.
     * @param requestDto The request body which contains the updated name.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A 200 OK Response with the updated TagDto in its body.
     * @throws DuplicateResourceException If a tag with the same name already
     * exists for the user.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TagDto> updateTagName(@PathVariable UUID id,
            @RequestBody UpsertTagRequestDto requestDto,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        TagDto tag = tagService.updateTagName(userId, id, requestDto.getName());
        return ResponseEntity.ok(tag);
    }
}
