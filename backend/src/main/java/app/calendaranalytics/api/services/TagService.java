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
     * Constructs the TagService with a dependency on the TagRepository.
     *
     * @param calendarRepository The repository responsible for Calendar data
     * access.
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
}
