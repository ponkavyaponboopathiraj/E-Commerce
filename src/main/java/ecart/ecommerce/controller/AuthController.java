package ecart.ecommerce.controller;

import ecart.ecommerce.dto.request.RegisterRequest;
import ecart.ecommerce.dto.response.RegisterResponse;
import ecart.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

   
    @PostMapping("/register")
public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
}

}