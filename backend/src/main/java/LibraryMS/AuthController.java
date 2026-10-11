
package LibraryMS;

import LibraryMS.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (user.getUsername() == null || user.getUsername().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null
                || user.getPassword().length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Enter a username, email, and password of at least 8 characters."));
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email is already registered."));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("DEVELOPER");

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", savedUser.getId(),
                "username", savedUser.getUsername(),
                "email", savedUser.getEmail(),
                "role", savedUser.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> credentials) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Email and password are required."));
        }

        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(
                        password, user.getPassword()))
                .<ResponseEntity<?>>map(user -> {

                    String token = jwtService.generateToken(
                            user.getEmail(), user.getRole());

                    return ResponseEntity.ok(Map.of(
                            "id", user.getId(),
                            "username", user.getUsername(),
                            "email", user.getEmail(),
                            "role", user.getRole(),
                            "token", token
                    ));
                })
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message",
                                        "Invalid email or password.")));
    }
}
