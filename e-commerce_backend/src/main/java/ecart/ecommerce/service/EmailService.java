package ecart.ecommerce.service;

public interface EmailService {

    void sendPasswordResetEmail(
            String toEmail,
            String resetToken
    );
    public void sendSellerApprovalEmail(
        String toEmail,
        String sellerName
);
}