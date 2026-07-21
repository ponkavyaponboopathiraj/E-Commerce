package ecart.ecommerce.security;

import ecart.ecommerce.entity.User;
import ecart.ecommerce.repository.UserRepository;
import ecart.ecommerce.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Get Authorization Header
        String authHeader = request.getHeader("Authorization");

        // Check whether Authorization Header exists
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT Token
        String token = authHeader.substring(7);

        try {

            // Extract Email from JWT Token
            String email = jwtService.extractEmail(token);

            // Check whether user is already authenticated
            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                // Find User from Database
                User user = userRepository.findByEmail(email)
                        .orElse(null);

                // Check User exists
                if (user != null) {

                    // Validate JWT Token
                    if (jwtService.isTokenValid(token, user)) {

                        // Create Authentication Object
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        user.getAuthorities()
                                );

                        // Set Request Details
                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        // Set Authentication in Security Context
                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);
                    }
                }
            }

        } catch (Exception ex) {

            // Invalid JWT Token
            System.out.println(
                    "JWT Authentication Failed: " + ex.getMessage()
            );
        }

        // Continue Filter Chain
        filterChain.doFilter(request, response);
    }
}