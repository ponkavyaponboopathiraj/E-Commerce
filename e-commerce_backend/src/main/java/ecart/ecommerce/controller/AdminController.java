
package ecart.ecommerce.controller;

import ecart.ecommerce.dto.response.AdminUserResponse;
import ecart.ecommerce.entity.Product;
import ecart.ecommerce.enums.ProductStatus;
import ecart.ecommerce.service.AdminService;
import ecart.ecommerce.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;

    public AdminController(
            AdminService adminService,
            ProductService productService
    ) {
        this.adminService = adminService;
        this.productService = productService;
    }


    // ==========================================
    // USERS
    // ==========================================

    // GET ALL USERS - ADMIN ONLY

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        List<AdminUserResponse> users =
                adminService.getAllUsers();

        return ResponseEntity.ok(users);
    }


    // ==========================================
    // PRODUCTS
    // ==========================================

    // GET ALL PRODUCTS

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }


    // GET PRODUCT BY ID

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }


    // GET PRODUCTS BY STATUS

    @GetMapping("/products/status/{status}")
    public ResponseEntity<List<Product>> getProductsByStatus(
            @PathVariable ProductStatus status
    ) {

        return ResponseEntity.ok(
                productService.getProductsByStatus(status)
        );
    }


    // SEARCH PRODUCTS

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String name
    ) {

        return ResponseEntity.ok(
                productService.searchProductsByName(name)
        );
    }


    // UPDATE PRODUCT

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @RequestBody Product product
    ) {

        return ResponseEntity.ok(
                productService.updateProduct(
                        id,
                        product
                )
        );
    }


    // UPDATE PRODUCT STATUS

    @PatchMapping("/products/{id}/status")
    public ResponseEntity<Product> updateProductStatus(
            @PathVariable String id,
            @RequestParam ProductStatus status
    ) {

        return ResponseEntity.ok(
                productService.updateProductStatus(
                        id,
                        status
                )
        );
    }


    // DELETE PRODUCT

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable String id
    ) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                "Product deleted successfully."
        );
    }
}
