
package LibraryMS;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import LibraryMS.repository.ProjectRepository;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Get only the logged-in user's projects
    @GetMapping
    public List<Project> getAllProjects(Authentication authentication) {
        String email = authentication.getName();
        return projectRepository.findByOwnerEmail(email);
    }

    // Create a project for the logged-in user
    @PostMapping
    public Project createProject(
            @RequestBody Project project,
            Authentication authentication) {

        
        project.setOwnerEmail(authentication.getName());

        return projectRepository.save(project);
    }

    // Update only the logged-in user's project
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project updatedProject,
            Authentication authentication) {

        Project project = projectRepository
                .findByIdAndOwnerEmail(id, authentication.getName())
                .orElseThrow(() ->
                    new RuntimeException("Project not found or access denied"));

        project.setName(updatedProject.getName());
        project.setDescription(updatedProject.getDescription());

        return projectRepository.save(project);
    }

    // Delete only the logged-in user's project
    @DeleteMapping("/{id}")
    public void deleteProject(
            @PathVariable Long id,
            Authentication authentication) {

        Project project = projectRepository
                .findByIdAndOwnerEmail(id, authentication.getName())
                .orElseThrow(() ->
                    new RuntimeException("Project not found or access denied"));

        projectRepository.delete(project);
    }
}
