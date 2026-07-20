package ecart.ecommerce.service.impl;

import ecart.ecommerce.dto.request.RegisterRequest;
import ecart.ecommerce.dto.response.RegisterResponse;
import ecart.ecommerce.entity.User;
import ecart.ecommerce.enums.AccountStatus;
import ecart.ecommerce.exception.EmailAlreadyExistsException;
import ecart.ecommerce.exception.PhoneNumberAlreadyExistsException;
import ecart.ecommerce.repository.UserRepository;
import ecart.ecommerce.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ecart.ecommerce.dto.request.LoginRequest;
import ecart.ecommerce.dto.response.LoginResponse;
import ecart.ecommerce.exception.UserNotFoundException;
import ecart.ecommerce.exception.InvalidPasswordException;
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        // Check Email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists.");
        }

        // Check Phone Number
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new PhoneNumberAlreadyExistsException("Phone number already exists.");
        }

        // Create User Object
        User user = new User();

        user.setFirstName(request.getFirstName());

        user.setLastName(request.getLastName());

        user.setEmail(request.getEmail());

        user.setPhoneNumber(request.getPhoneNumber());

        // Encrypt Password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(request.getRole());

        user.setStatus(AccountStatus.ACTIVE);

        user.setEmailVerified(false);

      // Save User
User savedUser = userRepository.save(user);

// Response
RegisterResponse response = new RegisterResponse();

response.setMessage("Registration Successful");
response.setUserId(savedUser.getId());
response.setEmail(savedUser.getEmail());
response.setRole(savedUser.getRole().name());

// Debug
System.out.println("========== RESPONSE ==========");
System.out.println("Message : " + response.getMessage());
System.out.println("UserId  : " + response.getUserId());
System.out.println("Email   : " + response.getEmail());
System.out.println("Role    : " + response.getRole());
System.out.println("==============================");

return response;
    }
    @Override
public LoginResponse login(LoginRequest request) {

    // Check whether email exists
    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new UserNotFoundException("User not found with this email."));

    // Verify Password
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new InvalidPasswordException("Invalid password.");
    }

    // Create Response
    LoginResponse response = new LoginResponse();

    response.setMessage("Login Successful");
    response.setUserId(user.getId());
    response.setEmail(user.getEmail());
    response.setRole(user.getRole().name());

    return response;
}
}