package ecart.ecommerce.config;

import ecart.ecommerce.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // =========================================================
    // Password Encryption
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // CORS Configuration
    // React Frontend: http://localhost:5173
    // Spring Boot Backend: http://localhost:8080
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // Allow React Frontend
        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        // Allow HTTP Methods
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        // Allow All Headers
        configuration.setAllowedHeaders(
                List.of("*")
        );

        // Allow Credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        // Apply CORS configuration to all APIs
        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // =========================================================
    // Security Configuration
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =================================================
                // Enable CORS
                // =================================================
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // =================================================
                // Disable CSRF
                // =================================================
                .csrf(csrf ->
                        csrf.disable()
                )

                // =================================================
                // Disable Form Login
                // =================================================
                .formLogin(form ->
                        form.disable()
                )

                // =================================================
                // Disable HTTP Basic Authentication
                // =================================================
                .httpBasic(basic ->
                        basic.disable()
                )

                // =================================================
                // JWT is Stateless
                // =================================================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =================================================
                // Handle Unauthorized and Access Denied
                // =================================================
                .exceptionHandling(exception -> exception

                        // -------------------------------------------------
                        // 401 - JWT Missing or Invalid
                        // -------------------------------------------------
                        .authenticationEntryPoint(
                                (request, response, authException) -> {

                                    response.setStatus(
                                            HttpServletResponse.SC_UNAUTHORIZED
                                    );

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            "{\"message\":\"Unauthorized - JWT token is required\"}"
                                    );
                                }
                        )

                        // -------------------------------------------------
                        // 403 - Valid JWT but Insufficient Role
                        // -------------------------------------------------
                        .accessDeniedHandler(
                                (request, response,
                                 accessDeniedException) -> {

                                    response.setStatus(
                                            HttpServletResponse.SC_FORBIDDEN
                                    );

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            "{\"message\":\"Access Denied - You do not have permission to access this resource\"}"
                                    );
                                }
                        )
                )

                // =================================================
                // Authorization Rules
                // =================================================
                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------
                        // Register API - Public
                        // -------------------------------------------------
                        .requestMatchers(
                                "/api/auth/register"
                        )
                        .permitAll()

                        // -------------------------------------------------
                        // Login API - Public
                        // -------------------------------------------------
                        .requestMatchers(
                                "/api/auth/login"
                        )
                        .permitAll()

                        // -------------------------------------------------
                        // All Other APIs - JWT Required
                        // -------------------------------------------------
                        .anyRequest()
                        .authenticated()
                )

                // =================================================
                // Add JWT Authentication Filter
                // =================================================
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}