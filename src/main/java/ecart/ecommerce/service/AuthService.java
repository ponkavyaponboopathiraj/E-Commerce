package ecart.ecommerce.service;

import ecart.ecommerce.dto.request.RegisterRequest;
import ecart.ecommerce.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);
        LoginResponse login(LoginRequest request);


}

