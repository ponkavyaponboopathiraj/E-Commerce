package ecart.ecommerce.controller;
import ecart.ecommerce.dto.request.ForgotPasswordRequest;
import ecart.ecommerce.dto.request.LoginRequest;
import ecart.ecommerce.dto.request.RegisterRequest;
import ecart.ecommerce.dto.request.ResetPasswordRequest;
import ecart.ecommerce.dto.response.ForgotPasswordResponse;
import ecart.ecommerce.dto.response.LoginResponse;
import ecart.ecommerce.dto.response.RegisterResponse;
import ecart.ecommerce.dto.response.ResetPasswordResponse;
import ecart.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import ecart.ecommerce.entity.User;
import org.springframework.web.bind.annotation.*;
import ecart.ecommerce.dto.response.AdminUserResponse;
import ecart.ecommerce.service.AdminService;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.UUID;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
private final AdminService adminService;

public AuthController(AuthService authService,
                      AdminService adminService) {
    this.authService = authService;
    this.adminService = adminService;
}
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid
            @RequestBody
            RegisterRequest request
    ) {

        RegisterResponse response =
                authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid
            @RequestBody
            LoginRequest request
    ) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity
                .ok(response);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
            @Valid
            @RequestBody
            ForgotPasswordRequest request
    ) {

        ForgotPasswordResponse response =
                authService.forgotPassword(request);

        return ResponseEntity
                .ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(
            @Valid
            @RequestBody
            ResetPasswordRequest request
    ) {

        ResetPasswordResponse response =
                authService.resetPassword(request);

        return ResponseEntity
                .ok(response);
    }
    
    @PutMapping(
            "/admin/approve-seller/{sellerId}"
    )
    public ResponseEntity<String> approveSeller(
            @PathVariable UUID sellerId
    ) 
    {

        String response =
                authService.approveSeller(
                        sellerId
                );

        return ResponseEntity
                .ok(response);
    }
    @GetMapping("/admin/pending-sellers")
public ResponseEntity<List<User>> getPendingSellers() {

    List<User> sellers =
            authService.getPendingSellers();

    return ResponseEntity.ok(sellers);
}
    @PutMapping("/admin/reject-seller/{sellerId}")

public ResponseEntity<String> rejectSeller(

        @PathVariable UUID sellerId

)
 {
    String response =

            authService.rejectSeller(

                    sellerId

            );

    return ResponseEntity.ok(

            response

    );

}
 // ==========================================
    // ADMIN - GET ALL USERS
    // ==========================================

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        List<AdminUserResponse> users =
                adminService.getAllUsers();

        return ResponseEntity.ok(users);
    }
}
