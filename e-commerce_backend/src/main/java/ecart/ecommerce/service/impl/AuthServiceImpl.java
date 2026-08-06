
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
import ecart.ecommerce.service.EmailService;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;


@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
         this.emailService = emailService;
    }

    @Override
    public RegisterResponse register(
            RegisterRequest request
    ) {

        if (userRepository.existsByEmail(
                request.getEmail()
        )) {

            throw new EmailAlreadyExistsException(
                    "Email already exists."
            );
        }
        if (request.getPhoneNumber() != null &&
                userRepository.existsByPhoneNumber(
                        request.getPhoneNumber()
                )) {

            throw new PhoneNumberAlreadyExistsException(
                    "Phone number already exists."
            );
        }
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

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
        user.setRole(
                request.getRole()
        );

        if (request.getRole() == Role.SELLER) {

            user.setStatus(
                    AccountStatus.PENDING_APPROVAL
            );

        } else {

            user.setStatus(
                    AccountStatus.ACTIVE
            );
        }
        user.setEmailVerified(false);

        User savedUser =
                userRepository.save(user);

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

    @Override
    public LoginResponse login(
            LoginRequest request
    )

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


        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new InvalidPasswordException(
                    "Invalid password."
            );
        }


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

if (user.getStatus() == AccountStatus.BLOCKED) {

    throw new IllegalStateException(
            "Your account has been blocked. "
                    + "Please contact the administrator."
    );
}


if (user.getStatus() != AccountStatus.ACTIVE) {

    throw new IllegalStateException(
            "Your account is not active."
    );
}

System.out.println(
        "LOGIN ALLOWED - GENERATING JWT"
);


String token =
        jwtService.generateToken(user);


        if (user.getRole() == Role.SELLER &&
                user.getStatus()
                        == AccountStatus.PENDING_APPROVAL) {

            throw new IllegalStateException(
                    "Your seller account is waiting for admin approval."
            );
        }

        if (user.getStatus()
                == AccountStatus.BLOCKED) {

            throw new IllegalStateException(
                    "Your account has been blocked. "
                    + "Please contact the administrator."
            );
        }

        if (user.getStatus()
                != AccountStatus.ACTIVE) {

            throw new IllegalStateException(
                    "Your account is not active."
            );
        }

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


    public String approveSeller(
            UUID sellerId
    ) {

        User seller =
                userRepository.findById(
                        sellerId
                )
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Seller not found."
                        )
                );


        if (seller.getRole()
                != Role.SELLER) {

            throw new IllegalArgumentException(
                    "The selected user is not a seller."
            );
        }

        if (seller.getStatus()
                != AccountStatus.PENDING_APPROVAL) {

            throw new IllegalStateException(
                    "Seller is not waiting for approval."
            );
        }

        seller.setStatus(
                AccountStatus.ACTIVE
        );
        userRepository.save(
                seller
        );
        emailService.sendSellerApprovalEmail(
        seller.getEmail(),
        seller.getFirstName()
);

        return "Seller approved successfully.";
    }


    @Override
    public ForgotPasswordResponse forgotPassword(
            ForgotPasswordRequest request
    ) {

        User user =
                userRepository.findByEmail(
                        request.getEmail()
                )
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with this email."
                        )
                );

        String resetToken =
                UUID.randomUUID().toString();

        LocalDateTime expiryTime =
                LocalDateTime.now()
                        .plusMinutes(15);

        user.setResetToken(
                resetToken
        );

        user.setResetTokenExpiry(
                expiryTime
        );

        userRepository.save(
                user
        );


        ForgotPasswordResponse response =
                new ForgotPasswordResponse();

        response.setMessage(
                "Password reset token generated successfully. "
                        + "Token: "
                        + resetToken
        );


        return response;
    }

    @Override
public ResetPasswordResponse resetPassword(
        ResetPasswordRequest request) {

    User user = userRepository
            .findByResetToken(request.getToken())
            .orElseThrow(() ->
                    new UserNotFoundException(
                            "Invalid or expired reset token."
                    )
            );

    if (user.getResetTokenExpiry() == null ||
            user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

        throw new IllegalArgumentException(
                "Reset token has expired."
        );
    }

    user.setPassword(
            passwordEncoder.encode(
                    request.getNewPassword()
            )
    );

    user.setResetToken(null);
    user.setResetTokenExpiry(null);

    userRepository.save(user);

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