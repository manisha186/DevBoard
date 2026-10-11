
package LibraryMS.repository;

import LibraryMS.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwnerEmail(String ownerEmail);
    Optional<Project> findByIdAndOwnerEmail(Long id, String ownerEmail);
}
