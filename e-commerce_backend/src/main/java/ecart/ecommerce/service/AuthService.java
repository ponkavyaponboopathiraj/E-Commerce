package ecart.ecommerce.service;

import ecart.ecommerce.dto.request.ForgotPasswordRequest;
import ecart.ecommerce.dto.request.LoginRequest;
import ecart.ecommerce.dto.request.RegisterRequest;
import ecart.ecommerce.dto.request.ResetPasswordRequest;

import ecart.ecommerce.dto.response.ForgotPasswordResponse;
import ecart.ecommerce.dto.response.LoginResponse;
import ecart.ecommerce.dto.response.RegisterResponse;
import ecart.ecommerce.dto.response.ResetPasswordResponse;
import ecart.ecommerce.entity.User;
import java.util.List;
import java.util.UUID;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request);
    ResetPasswordResponse resetPassword( ResetPasswordRequest request);
      String approveSeller(UUID sellerId);
      List<User> getPendingSellers();
      

}