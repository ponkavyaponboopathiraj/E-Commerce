package ecart.ecommerce.service.impl;

import ecart.ecommerce.dto.response.AdminUserResponse;
import ecart.ecommerce.entity.User;
import ecart.ecommerce.repository.UserRepository;
import ecart.ecommerce.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    public AdminServiceImpl(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }


    // ==========================================
    // GET ALL USERS
    // ==========================================

    @Override
    public List<AdminUserResponse> getAllUsers() {

        List<User> users =
                userRepository.findAll();

        return users.stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ==========================================
    // CONVERT USER → ADMIN USER RESPONSE
    // ==========================================

    private AdminUserResponse convertToResponse(
            User user
    ) {

        AdminUserResponse response =
                new AdminUserResponse();

        response.setId(
                user.getId()
        );

        response.setFirstName(
                user.getFirstName()
        );

        response.setLastName(
                user.getLastName()
        );

        response.setEmail(
                user.getEmail()
        );

        response.setPhoneNumber(
                user.getPhoneNumber()
        );

        response.setRole(
                user.getRole()
        );

        response.setStatus(
                user.getStatus()
        );

        response.setEmailVerified(
                user.getEmailVerified()
        );

        response.setCreatedAt(
                user.getCreatedAt()
        );

        return response;
    }
}