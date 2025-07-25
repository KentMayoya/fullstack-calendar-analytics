package app.calendaranalytics.api.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.calendaranalytics.api.dtos.TagDto;
import app.calendaranalytics.api.entities.Tag;
import app.calendaranalytics.api.entities.User;
import app.calendaranalytics.api.exception.DuplicateResourceException;
import app.calendaranalytics.api.exception.ResourceNotFoundException;
import app.calendaranalytics.api.repositories.TagRepository;
import app.calendaranalytics.api.repositories.UserRepository;

/**
 * A Service class that handles business logic for the Tag entity.
 */
@Service
public class TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    /**
     * Constructs the TagService with a dependency on the tag and user
     * repositories.
     *
     * @param tagRepository The repository responsible for tag data access.
     * @param userRepository The repository responsible for user data access.
     */
    public TagService(TagRepository tagRepository, UserRepository userRepository) {
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a Tag and stores in the database.
     *
     * @param userId The userId to relate the tag to.
     * @param name The name of the tag to be created.
     * @return A TagDto of the newly created tag.
     * @throws DuplicateResourceException If a tag with the same name already
     * exists for the user.
     */
    @Transactional
    public TagDto createTag(UUID userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not "
                + "found: " + userId));
        Optional<Tag> existingTag = tagRepository.findByUserAndName(user, name);
        if (existingTag.isPresent()) {
            throw new DuplicateResourceException("Tag with name '" + name
                    + "' already exists.");
        } else {
            Tag newTag = new Tag();
            newTag.setId(UUID.randomUUID());
            newTag.setName(name);
            newTag.setUser(user);
            newTag.setCreatedAt(Instant.now());
            tagRepository.save(newTag);
            return mapToDto(newTag);
        }
    }

    /**
     * Retrieves a list of TagDtos related to the specified user.
     *
     * @param userId The userId to search for related tags.
     * @return A list of TagDtos related to the userId.
     */
    @Transactional
    public List<TagDto> getTags(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not "
                + "found: " + userId));
        List<Tag> tags = tagRepository.findAllByUser(user);
        return tags.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing tag's name in the database.
     *
     * @param userId The id of the user the tag belongs to.
     * @param id The tag's id to update.
     * @param name The tag's new name.
     * @return A TagDto of the updated Tag.
     * @throws DuplicateResourceException If a duplicate tag exists.
     */
    @Transactional
    public TagDto updateTagName(UUID userId, UUID id, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not "
                + "found: " + userId));
        Tag tagToUpdate = tagRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag "
                + id + " not found for user " + userId));
        if (name.equals(tagToUpdate.getName())) {
            // No change to make. Return early.
            return mapToDto(tagToUpdate);
        }
        throwExceptionIfDuplicateExists(user, name);
        tagToUpdate.setName(name);
        tagRepository.save(tagToUpdate);
        return mapToDto(tagToUpdate);
    }

    /**
     * Deletes the tag with the specified id for a user from the database.
     *
     * @param userId The id of the user the tag belongs to.
     * @param id The tag's id to delete.
     */
    @Transactional
    public void deleteTag(UUID userId, UUID id) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not "
                + "found: " + userId));
        Tag tagToDelete = tagRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag "
                + id + " not found for user " + userId));
        tagRepository.delete(tagToDelete);
    }

    /**
     * Helper method that maps the private Tag Entity to the public TagDto.
     *
     * @param tagEntity The Tag entity to convert.
     */
    private TagDto mapToDto(Tag tagEntity) {
        TagDto dto = new TagDto();
        dto.setId(tagEntity.getId());
        dto.setName(tagEntity.getName());
        return dto;
    }

    /**
     * Checks if a tag for a specific user with a specific name exists in the
     * database. If so, throws a DuplicateResourceException.
     *
     * @param user The user the tag belongs to.
     * @param name The name of the tag.
     * @throws DuplicateResourceException If a duplicate tag exists.
     */
    private void throwExceptionIfDuplicateExists(User user, String name) {
        Optional<Tag> existingTag = tagRepository.findByUserAndName(user, name);
        if (existingTag.isPresent()) {
            throw new DuplicateResourceException("Tag with name '" + name
                    + "' already exists.");
        }
    }
}
