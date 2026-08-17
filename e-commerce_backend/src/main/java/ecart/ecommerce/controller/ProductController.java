package ecart.ecommerce.controller;

import ecart.ecommerce.entity.Notification;
import ecart.ecommerce.entity.Product;
import ecart.ecommerce.enums.ProductStatus;
import ecart.ecommerce.service.ProductService;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    private final MongoTemplate mongoTemplate;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ProductController(
            ProductService productService,
            MongoTemplate mongoTemplate
    ) {

        this.productService = productService;
        this.mongoTemplate = mongoTemplate;
    }


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestBody Product product
    ) {

        Product savedProduct =
                productService.addProduct(product);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProduct);
    }


    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }


    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }


    // =====================================================
    // GET PRODUCTS BY SELLER
    // =====================================================

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Product>> getProductsBySeller(
            @PathVariable String sellerId
    ) {

        return ResponseEntity.ok(
                productService.getProductsBySeller(
                        sellerId
                )
        );
    }


    // =====================================================
    // GET PRODUCTS BY CATEGORY
    // =====================================================

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                productService.getProductsByCategory(
                        category
                )
        );
    }


    // =====================================================
    // GET PRODUCTS BY STATUS
    // =====================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Product>> getProductsByStatus(
            @PathVariable ProductStatus status
    ) {

        return ResponseEntity.ok(
                productService.getProductsByStatus(
                        status
                )
        );
    }


    // =====================================================
    // SEARCH PRODUCTS
    // =====================================================

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String name
    ) {

        return ResponseEntity.ok(
                productService.searchProductsByName(
                        name
                )
        );
    }


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @RequestBody Product product
    ) {

        Product updatedProduct =
                productService.updateProduct(
                        id,
                        product
                );

        return ResponseEntity.ok(
                updatedProduct
        );
    }


    // =====================================================
    // UPDATE PRODUCT STATUS
    // =====================================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<Product> updateProductStatus(
            @PathVariable String id,
            @RequestParam ProductStatus status
    ) {

        Product updatedProduct =
                productService.updateProductStatus(
                        id,
                        status
                );

        return ResponseEntity.ok(
                updatedProduct
        );
    }


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable String id
    ) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                "Product deleted successfully."
        );
    }


    // =====================================================
    // GET SELLER NOTIFICATIONS
    // =====================================================

    @GetMapping("/notifications/{sellerId}")
    public ResponseEntity<List<Notification>>
    getSellerNotifications(
            @PathVariable String sellerId
    ) {

        Query query = new Query(
                Criteria.where("sellerId")
                        .is(sellerId)
        );


        query.with(
                Sort.by(
                        Sort.Direction.DESC,
                        "createdAt"
                )
        );


        List<Notification> notifications =
                mongoTemplate.find(
                        query,
                        Notification.class
                );


        return ResponseEntity.ok(
                notifications
        );
    }
}