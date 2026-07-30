package ecart.ecommerce.service.impl;

import ecart.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailServiceImpl(
            JavaMailSender mailSender
    ) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetEmail(
            String toEmail,
            String resetToken
    ) {

        String resetLink =
                "http://localhost:5173/reset-password?token="
                        + resetToken;

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(senderEmail);

        message.setTo(toEmail);

        message.setSubject(
                "DeluLu Cart - Reset Your Password"
        );

        message.setText(
                "Hello,\n\n"
                + "We received a request to reset your "
                + "DeluLu Cart account password.\n\n"
                + "Click the link below to reset your password:\n\n"
                + resetLink
                + "\n\n"
                + "This password reset link is valid for 15 minutes.\n\n"
                + "If you did not request a password reset, "
                + "please ignore this email.\n\n"
                + "Regards,\n"
                + "DeluLu Cart Team"
        );

        mailSender.send(message);
    }
}