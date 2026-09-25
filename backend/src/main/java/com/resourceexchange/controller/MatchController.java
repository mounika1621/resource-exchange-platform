package com.resourceexchange.controller;

import com.resourceexchange.entity.Resource;
import com.resourceexchange.repository.ResourceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/match")
@CrossOrigin
public class MatchController {

    private final ResourceRepository resourceRepository;

    public MatchController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @GetMapping
    public List<Map<String, Object>> smartMatch(
            @RequestParam String requirement) {

        String query = requirement.toLowerCase().trim();

        List<Resource> resources =
                resourceRepository.findAll();

        return resources.stream()
                .filter(Resource::isAvailability)
                .map(resource -> {

                    int score = calculateScore(
                            query,
                            resource
                    );

                    Map<String, Object> result =
                            new HashMap<>();

                    result.put(
                            "resourceId",
                            resource.getResourceId()
                    );

                    result.put(
                            "title",
                            resource.getTitle()
                    );

                    result.put(
                            "category",
                            resource.getCategory()
                    );

                    result.put(
                            "description",
                            resource.getDescription()
                    );

                    result.put(
                            "condition",
                            resource.getCondition()
                    );

                    result.put(
                            "availability",
                            resource.isAvailability()
                    );

                    result.put(
                            "matchScore",
                            score
                    );

                    return result;
                })
                .filter(r ->
                        (Integer) r.get("matchScore") > 0
                )
                .sorted(
                        Comparator.comparing(
                                (Map<String, Object> r) ->
                                        (Integer) r.get("matchScore")
                        ).reversed()
                )
                .limit(10)
                .collect(Collectors.toList());
    }

  private int calculateScore(
        String query,
        Resource resource) {

    int score = 0;

    String title = resource.getTitle().toLowerCase();
    String category = resource.getCategory().toLowerCase();
    String description = resource.getDescription().toLowerCase();
    String condition = resource.getCondition() == null
            ? ""
            : resource.getCondition().toLowerCase();

    if (query.contains(category)) {
        score += 40;
    }

    String[] words = query.split("\\s+");

    for (String word : words) {
        if (word.length() < 3) continue;

      if (title.equals(word)) {
    score += 60;
} else if (title.contains(word)) {
    score += 40;
}
    }

    if (score > 70) {
        score = 70;
    }

    int descriptionMatches = 0;

    for (String word : words) {
        if (word.length() < 3) continue;

        if (description.contains(word)) {
            descriptionMatches++;
        }
    }

    score += Math.min(descriptionMatches * 5, 20);

    if (!condition.isEmpty()) {
        for (String word : words) {
            if (word.length() >= 3 &&
                    condition.contains(word)) {

                score += 5;
                break;
            }
        }
    }

    // DO NOT add +10 for availability
    return Math.min(score, 100);
}
}
















