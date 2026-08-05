
package ecart.ecommerce.service.impl;

import ecart.ecommerce.dto.request.ForgotPasswordRequest;
import ecart.ecommerce.dto.request.LoginRequest;
import ecart.ecommerce.dto.request.RegisterRequest;
import ecart.ecommerce.dto.request.ResetPasswordRequest;

import ecart.ecommerce.dto.response.ForgotPasswordResponse;
import ecart.ecommerce.dto.response.LoginResponse;
import ecart.ecommerce.dto.response.RegisterResponse;
import ecart.ecommerce.dto.response.ResetPasswordResponse;

import ecart.ecommerce.entity.User;
import ecart.ecommerce.enums.AccountStatus;
import ecart.ecommerce.enums.Role;

import ecart.ecommerce.exception.EmailAlreadyExistsException;
import ecart.ecommerce.exception.InvalidPasswordException;
import ecart.ecommerce.exception.PhoneNumberAlreadyExistsException;
import ecart.ecommerce.exception.UserNotFoundException;

import ecart.ecommerce.repository.UserRepository;
import ecart.ecommerce.service.AuthService;
import ecart.ecommerce.service.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // =========================================================
    // REGISTER
    // =========================================================

    @Override
    public RegisterResponse register(
            RegisterRequest request
    ) {

        // =====================================================
        // CHECK EMAIL
        // =====================================================

        if (userRepository.existsByEmail(
                request.getEmail()
        )) {

            throw new EmailAlreadyExistsException(
                    "Email already exists."
            );
        }


        // =====================================================
        // CHECK PHONE NUMBER
        // =====================================================

        if (request.getPhoneNumber() != null &&
                userRepository.existsByPhoneNumber(
                        request.getPhoneNumber()
                )) {

            throw new PhoneNumberAlreadyExistsException(
                    "Phone number already exists."
            );
        }


        // =====================================================
        // CREATE USER
        // =====================================================

        User user = new User();

        user.setFirstName(
                request.getFirstName()
        );

        user.setLastName(
                request.getLastName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPhoneNumber(
                request.getPhoneNumber()
        );


        // =====================================================
        // ENCRYPT PASSWORD
        // =====================================================

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        // =====================================================
        // SET ROLE
        // =====================================================

        user.setRole(
                request.getRole()
        );


        // =====================================================
        // SET ACCOUNT STATUS
        // =====================================================

        /*
         * CUSTOMER
         * -------------------------
         * Customer can login immediately.
         *
         * Status = ACTIVE
         *
         *
         * SELLER
         * -------------------------
         * Seller requires Admin approval.
         *
         * Status = PENDING_APPROVAL
         *
         *
         * ADMIN
         * -------------------------
         * Admin account is active.
         *
         * Status = ACTIVE
         */

        if (request.getRole() == Role.SELLER) {

            user.setStatus(
                    AccountStatus.PENDING_APPROVAL
            );

        } else {

            user.setStatus(
                    AccountStatus.ACTIVE
            );
        }


        // =====================================================
        // EMAIL VERIFICATION
        // =====================================================

        user.setEmailVerified(false);


        // =====================================================
        // SAVE USER
        // =====================================================

        User savedUser =
                userRepository.save(user);


        // =====================================================
        // REGISTER RESPONSE
        // =====================================================

        RegisterResponse response =
                new RegisterResponse();

        if (request.getRole() == Role.SELLER) {

            response.setMessage(
                    "Seller registration successful. "
                    + "Your account is waiting for admin approval."
            );

        } else {

            response.setMessage(
                    "Registration Successful"
            );
        }

        response.setUserId(
                savedUser.getId()
        );

        response.setEmail(
                savedUser.getEmail()
        );

        response.setRole(
                savedUser.getRole().name()
        );


        return response;
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @Override
    public LoginResponse login(
            LoginRequest request
    )
    
            // =====================================================
        // STEP 1: FIND USER
        // =====================================================

    {User user =
        userRepository.findByEmail(
                request.getEmail()
        )
        .orElseThrow(() ->
                new UserNotFoundException(
                        "User not found with this email."
                )
        );

System.out.println("🔥 DB USER EMAIL  = " + user.getEmail());
System.out.println("🔥 DB USER ROLE   = " + user.getRole());
System.out.println("🔥 DB USER STATUS = " + user.getStatus());

        // =====================================================
        // STEP 2: VERIFY PASSWORD
        // =====================================================

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new InvalidPasswordException(
                    "Invalid password."
            );
        }


        // =====================================================
        // STEP 3: CHECK SELLER APPROVAL
        // =====================================================

        /*
         * IMPORTANT:
         *
         * Seller registered successfully
         * but Admin has not approved yet.
         *
         * In this situation:
         *
         * - Do NOT generate JWT
         * - Do NOT create LoginResponse
         * - Do NOT allow seller login
         *
         * Expected Response:
         *
         * {
         *     "message":
         *     "Your seller account is waiting for admin approval."
         * }
         */

// =====================================================
// CHECK SELLER APPROVAL
// =====================================================

System.out.println("========== LOGIN STATUS CHECK ==========");
System.out.println("Email  : " + user.getEmail());
System.out.println("Role   : " + user.getRole());
System.out.println("Status : " + user.getStatus());
System.out.println("========================================");


if (user.getRole() == Role.SELLER &&
        user.getStatus() == AccountStatus.PENDING_APPROVAL) {

    System.out.println(
            "SELLER LOGIN BLOCKED - WAITING FOR ADMIN APPROVAL"
    );

    throw new IllegalStateException(
            "Your seller account is waiting for admin approval."
    );
}


// =====================================================
// CHECK BLOCKED ACCOUNT
// =====================================================

if (user.getStatus() == AccountStatus.BLOCKED) {

    throw new IllegalStateException(
            "Your account has been blocked. "
                    + "Please contact the administrator."
    );
}


// =====================================================
// CHECK ACCOUNT STATUS
// =====================================================

if (user.getStatus() != AccountStatus.ACTIVE) {

    throw new IllegalStateException(
            "Your account is not active."
    );
}


// =====================================================
// ONLY ACTIVE USERS CAN GENERATE JWT
// =====================================================

System.out.println(
        "LOGIN ALLOWED - GENERATING JWT"
);


// =====================================================
// GENERATE JWT TOKEN
// =====================================================

String token =
        jwtService.generateToken(user);


        if (user.getRole() == Role.SELLER &&
                user.getStatus()
                        == AccountStatus.PENDING_APPROVAL) {

            throw new IllegalStateException(
                    "Your seller account is waiting for admin approval."
            );
        }


        // =====================================================
        // STEP 4: CHECK BLOCKED ACCOUNT
        // =====================================================

        if (user.getStatus()
                == AccountStatus.BLOCKED) {

            throw new IllegalStateException(
                    "Your account has been blocked. "
                    + "Please contact the administrator."
            );
        }


        // =====================================================
        // STEP 5: CHECK ACCOUNT STATUS
        // =====================================================

        if (user.getStatus()
                != AccountStatus.ACTIVE) {

            throw new IllegalStateException(
                    "Your account is not active."
            );
        }


        // =====================================================
        // STEP 6: GENERATE JWT
        // =========================================================

        /*
         * JWT will ONLY be generated when:
         *
         * AccountStatus = ACTIVE
         *
         * Therefore:
         *
         * PENDING_APPROVAL -> No JWT
         * BLOCKED          -> No JWT
         * ACTIVE           -> JWT generated
         */

        // String token =
        //         jwtService.generateToken(user);


        // =====================================================
        // STEP 7: CREATE LOGIN RESPONSE
        // =====================================================

        LoginResponse response =
                new LoginResponse();

        response.setMessage(
                "Login Successful"
        );

        response.setUserId(
                user.getId()
        );

        response.setEmail(
                user.getEmail()
        );

        response.setRole(
                user.getRole().name()
        );

        response.setToken(
                token
        );


        return response;
    }


    // =========================================================
    // APPROVE SELLER
    // =========================================================

    /*
     * ADMIN APPROVAL FLOW
     *
     * SELLER REGISTER
     *        ↓
     * PENDING_APPROVAL
     *        ↓
     * ADMIN APPROVES
     *        ↓
     * ACTIVE
     *        ↓
     * SELLER CAN LOGIN
     */

    public String approveSeller(
            UUID sellerId
    ) {

        // =====================================================
        // FIND SELLER
        // =====================================================

        User seller =
                userRepository.findById(
                        sellerId
                )
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Seller not found."
                        )
                );


        // =====================================================
        // CHECK USER ROLE
        // =====================================================

        if (seller.getRole()
                != Role.SELLER) {

            throw new IllegalArgumentException(
                    "The selected user is not a seller."
            );
        }


        // =====================================================
        // CHECK CURRENT STATUS
        // =====================================================

        if (seller.getStatus()
                != AccountStatus.PENDING_APPROVAL) {

            throw new IllegalStateException(
                    "Seller is not waiting for approval."
            );
        }


        // =====================================================
        // APPROVE SELLER
        // =====================================================

        seller.setStatus(
                AccountStatus.ACTIVE
        );


        // =====================================================
        // SAVE SELLER
        // =====================================================

        userRepository.save(
                seller
        );


        // =====================================================
        // SUCCESS RESPONSE
        // =====================================================

        return "Seller approved successfully.";
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @Override
    public ForgotPasswordResponse forgotPassword(
            ForgotPasswordRequest request
    ) {

        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepository.findByEmail(
                        request.getEmail()
                )
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with this email."
                        )
                );


        // =====================================================
        // GENERATE RESET TOKEN
        // =====================================================

        String resetToken =
                UUID.randomUUID().toString();


        // =====================================================
        // TOKEN EXPIRY - 15 MINUTES
        // =====================================================

        LocalDateTime expiryTime =
                LocalDateTime.now()
                        .plusMinutes(15);


        // =====================================================
        // SAVE RESET TOKEN
        // =====================================================

        user.setResetToken(
                resetToken
        );

        user.setResetTokenExpiry(
                expiryTime
        );

        userRepository.save(
                user
        );


        // =====================================================
        // CREATE RESPONSE
        // =====================================================

        ForgotPasswordResponse response =
                new ForgotPasswordResponse();

        response.setMessage(
                "Password reset token generated successfully. "
                        + "Token: "
                        + resetToken
        );


        return response;
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @Override
    public ResetPasswordResponse resetPassword(
            ResetPasswordRequest request
    ) 
    {

        // =====================================================
        // FIND USER BY RESET TOKEN
        // =====================================================

        User user =
                userRepository
                        .findByResetToken(
                                request.getToken()
                        )
                        .orElseThrow(() ->
                                new UserNotFoundException(
                                        "Invalid or expired reset token."
                                )
                        );


        // =====================================================
        // CHECK TOKEN EXPIRY
        // =====================================================

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry()
                        .isBefore(
                                LocalDateTime.now()
                        )) {

            throw new IllegalArgumentException(
                    "Reset token has expired."
            );
        }


        // =====================================================
        // ENCRYPT NEW PASSWORD
        // =====================================================

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );


        user.setPassword(
                encodedPassword
        );


        // =====================================================
        // CLEAR RESET TOKEN
        // =====================================================

        user.setResetToken(
                null
        );

        user.setResetTokenExpiry(
                null
        );


        // =====================================================
        // SAVE USER
        // =====================================================

        userRepository.save(
                user
        );


        // =====================================================
        // RESPONSE
        // =====================================================

        ResetPasswordResponse response =
                new ResetPasswordResponse();

        response.setMessage(
                "Password reset successfully."
        );


        return response;
    }
    @Override
public List<User> getPendingSellers() {

    return userRepository.findByRoleAndStatus(
            Role.SELLER,
            AccountStatus.PENDING_APPROVAL
    );
}

}