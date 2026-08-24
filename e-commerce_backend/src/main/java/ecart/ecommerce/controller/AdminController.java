package ecart.ecommerce.controller;

import ecart.ecommerce.dto.response.AdminUserResponse;
import ecart.ecommerce.service.AdminService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==========================================
    // GET ALL USERS - ADMIN ONLY
    // ==========================================

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        List<AdminUserResponse> users =
                adminService.getAllUsers();

        return ResponseEntity.ok(users);
    }
}