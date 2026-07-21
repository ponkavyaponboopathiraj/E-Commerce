package ecart.ecommerce.entity;

import ecart.ecommerce.enums.AccountStatus;
import ecart.ecommerce.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Default Constructor
    public User() {
    }

    // Get ID
    public UUID getId() {
        return id;
    }

    // Set ID
    public void setId(UUID id) {
        this.id = id;
    }

    // Get First Name
    public String getFirstName() {
        return firstName;
    }

    // Set First Name
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    // Get Last Name
    public String getLastName() {
        return lastName;
    }

    // Set Last Name
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    // Get Email
    public String getEmail() {
        return email;
    }

    // Set Email
    public void setEmail(String email) {
        this.email = email;
    }

    // Get Phone Number
    public String getPhoneNumber() {
        return phoneNumber;
    }

    // Set Phone Number
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    // Get Password
    @Override
    public String getPassword() {
        return password;
    }

    // Set Password
    public void setPassword(String password) {
        this.password = password;
    }

    // Get Role
    public Role getRole() {
        return role;
    }

    // Set Role
    public void setRole(Role role) {
        this.role = role;
    }

    // Get Account Status
    public AccountStatus getStatus() {
        return status;
    }

    // Set Account Status
    public void setStatus(AccountStatus status) {
        this.status = status;
    }

    // Get Email Verified
    public Boolean getEmailVerified() {
        return emailVerified;
    }

    // Set Email Verified
    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    // Get Created At
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Get Updated At
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // =========================================================
    // Spring Security UserDetails Methods
    // =========================================================

    /**
     * Returns the roles/authorities of the user.
     *
     * Example:
     * CUSTOMER -> ROLE_CUSTOMER
     * SELLER   -> ROLE_SELLER
     * ADMIN    -> ROLE_ADMIN
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    /**
     * Spring Security uses this as the username.
     *
     * In our application, email is the login username.
     */
    @Override
    public String getUsername() {

        return email;
    }

    /**
     * Checks whether the user's account has expired.
     *
     * Currently always true.
     */
    @Override
    public boolean isAccountNonExpired() {

        return true;
    }

    /**
     * Checks whether the user's account is locked.
     *
     * Currently always true.
     */
    @Override
    public boolean isAccountNonLocked() {

        return true;
    }

    /**
     * Checks whether the user's credentials have expired.
     *
     * Currently always true.
     */
    @Override
    public boolean isCredentialsNonExpired() {

        return true;
    }

    /**
     * Checks whether the account is enabled.
     *
     * Only ACTIVE users are enabled.
     */
    @Override
    public boolean isEnabled() {

        return status == AccountStatus.ACTIVE;
    }
}