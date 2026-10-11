
package LibraryMS;

import LibraryMS.repository.IssueRepository;
import LibraryMS.repository.ProjectRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
})
public class IssueController {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;

    public IssueController(
            IssueRepository issueRepository,
            ProjectRepository projectRepository) {
        this.issueRepository = issueRepository;
        this.projectRepository = projectRepository;
    }

    // Get only issues belonging to the user's projects
    @GetMapping
    public List<Issue> getAllIssues(Authentication authentication) {
        List<Long> projectIds = getUserProjectIds(authentication);
        return issueRepository.findByProjectIdIn(projectIds);
    }

    // Get issues for a project owned by the user
    @GetMapping("/project/{projectId}")
    public List<Issue> getIssuesByProject(
            @PathVariable Long projectId,
            Authentication authentication) {

        requireProjectOwnership(projectId, authentication);
        return issueRepository.findByProjectId(projectId);
    }

    // Create an issue only under the user's own project
    @PostMapping
    public Issue createIssue(
            @RequestBody Issue issue,
            Authentication authentication) {

        requireProjectOwnership(issue.getProjectId(), authentication);

        

        if (issue.getStatus() == null || issue.getStatus().isBlank()) {
            issue.setStatus("OPEN");
        }

        if (issue.getPriority() == null || issue.getPriority().isBlank()) {
            issue.setPriority("MEDIUM");
        }

        return issueRepository.save(issue);
    }

    // Update only issues belonging to the user's projects
    @PutMapping("/{id}")
    public Issue updateIssue(
            @PathVariable Long id,
            @RequestBody Issue updatedIssue,
            Authentication authentication) {

        List<Long> projectIds = getUserProjectIds(authentication);

        Issue issue = issueRepository
                .findByIdAndProjectIdIn(id, projectIds)
                .orElseThrow(() ->
                    new RuntimeException("Issue not found or access denied"));

        requireProjectOwnership(updatedIssue.getProjectId(), authentication);

        issue.setTitle(updatedIssue.getTitle());
        issue.setDescription(updatedIssue.getDescription());
        issue.setPriority(updatedIssue.getPriority());
        issue.setStatus(updatedIssue.getStatus());
        issue.setProjectId(updatedIssue.getProjectId());

        return issueRepository.save(issue);
    }

    // Delete only issues belonging to the user's projects
    @DeleteMapping("/{id}")
    public void deleteIssue(
            @PathVariable Long id,
            Authentication authentication) {

        List<Long> projectIds = getUserProjectIds(authentication);

        Issue issue = issueRepository
                .findByIdAndProjectIdIn(id, projectIds)
                .orElseThrow(() ->
                    new RuntimeException("Issue not found or access denied"));

        issueRepository.delete(issue);
    }

    private List<Long> getUserProjectIds(Authentication authentication) {
        return projectRepository
                .findByOwnerEmail(authentication.getName())
                .stream()
                .map(Project::getId)
                .toList();
    }

    private void requireProjectOwnership(
            Long projectId,
            Authentication authentication) {

        if (projectId == null ||
                !projectRepository
                    .findByIdAndOwnerEmail(
                        projectId, authentication.getName())
                    .isPresent()) {
            throw new RuntimeException("Project not found or access denied");
        }
    }
}
