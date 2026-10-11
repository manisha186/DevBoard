
package LibraryMS.repository;

import LibraryMS.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByProjectId(Long projectId);

    List<Issue> findByProjectIdIn(List<Long> projectIds);

    Optional<Issue> findByIdAndProjectIdIn(Long id, List<Long> projectIds);
}
