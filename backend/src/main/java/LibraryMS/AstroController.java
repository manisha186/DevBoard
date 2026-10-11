
package LibraryMS;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/astro")
public class AstroController {

    private final AstroService astroService;

    public AstroController(AstroService astroService) {
        this.astroService = astroService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(
            @RequestBody Map<String, String> request) {

        String question = request.get("question");

        if (question == null || question.isBlank()) {
            return Map.of("error", "Please enter a question.");
        }

        String answer = astroService.askAstro(question);

        return Map.of("answer", answer);
    }
}
