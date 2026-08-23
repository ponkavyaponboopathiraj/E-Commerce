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

        @Column(
                name = "first_name",
                nullable = false
        )
        private String firstName;


        @Column(
                name = "last_name",
                nullable = false
        )
        private String lastName;

        @Column(
                nullable = false,
                unique = true
        )
        private String email;

        @Column(
                name = "phone_number",
                unique = true
        )
        private String phoneNumber;

        @Column(
                nullable = false
        )
        private String password;


        @Enumerated(EnumType.STRING)
        @Column(
                nullable = false
        )
        private Role role;


        @Enumerated(EnumType.STRING)
        @Column(
                nullable = false
        )
        private AccountStatus status;


        @Column(
                name = "email_verified",
                nullable = false
        )
        private Boolean emailVerified = false;


        @Column(
                name = "reset_token",
                unique = true
        )
        private String resetToken;


        @Column(
                name = "reset_token_expiry"
        )
        private LocalDateTime resetTokenExpiry;

        @CreationTimestamp
        @Column(
                name = "created_at",
                nullable = false,
                updatable = false
        )
        private LocalDateTime createdAt;



        @UpdateTimestamp
        @Column(
                name = "updated_at",
                nullable = false
        )
        private LocalDateTime updatedAt;



        public User() {
        }

        public UUID getId() {

            return id;
        }

        public void setId(UUID id) {

            this.id = id;
        }

        public String getFirstName() {

            return firstName;
        }

        public void setFirstName(String firstName) {

            this.firstName = firstName;
        }

        public String getLastName() {

            return lastName;
        }

        public void setLastName(String lastName) {

            this.lastName = lastName;
        }

        public String getEmail() {

            return email;
        }

        public void setEmail(String email) {

            this.email = email;
        }


        public String getPhoneNumber() {

            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {

            this.phoneNumber = phoneNumber;
        }

        @Override
        public String getPassword() {

            return password;
        }


        public void setPassword(String password) {

            this.password = password;
        }

        public Role getRole() {

            return role;
        }

        public void setRole(Role role) {

            this.role = role;
        }

        public AccountStatus getStatus() {

            return status;
        }

        public void setStatus(AccountStatus status) {

            this.status = status;
        }

        public Boolean getEmailVerified() {

            return emailVerified;
        }

        public void setEmailVerified(Boolean emailVerified) {

            this.emailVerified = emailVerified;
        }


        public String getResetToken() {

            return resetToken;
        }

        public void setResetToken(String resetToken) {

            this.resetToken = resetToken;
        }

        public LocalDateTime getResetTokenExpiry() {

            return resetTokenExpiry;
        }

        public void setResetTokenExpiry(
                LocalDateTime resetTokenExpiry
        ) {

            this.resetTokenExpiry = resetTokenExpiry;
        }

        public LocalDateTime getCreatedAt() {

            return createdAt;
        }

        public LocalDateTime getUpdatedAt() {

            return updatedAt;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {

            return List.of(
                    new SimpleGrantedAuthority(
                            "ROLE_" + role.name()
                    )
            );
        }

        @Override
        public String getUsername() {

            return email;
        }

        @Override
        public boolean isAccountNonExpired() {

            return true;
        }

        @Override
        public boolean isAccountNonLocked() {

            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {

            return true;
        }

        @Override
        public boolean isEnabled() {

            return status == AccountStatus.ACTIVE;
        }

    }