
package ecart.ecommerce.controller;

import ecart.ecommerce.entity.Product;
import ecart.ecommerce.enums.ProductStatus;
import ecart.ecommerce.service.ProductService;
import ecart.ecommerce.entity.Notification;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final MongoTemplate mongoTemplate;
    public ProductController(ProductService productService, MongoTemplate mongoTemplate )
   {
        this.productService = productService;
         this.mongoTemplate = mongoTemplate;
    }

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

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Product>> getProductsBySeller(
            @PathVariable String sellerId
    ) {

        return ResponseEntity.ok(
                productService.getProductsBySeller(sellerId)
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                productService.getProductsByCategory(category)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Product>> getProductsByStatus(
            @PathVariable ProductStatus status
    ) {

        return ResponseEntity.ok(
                productService.getProductsByStatus(status)
        );
    }
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String name
    ) {

        return ResponseEntity.ok(
                productService.searchProductsByName(name)
        );
    }

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
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable String id
    ) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                "Product deleted successfully."
        );
    }
    @GetMapping("/notifications/{sellerId}")
public ResponseEntity<List<Notification>> getSellerNotifications(
        @PathVariable String sellerId
) {

    Query query = new Query(
            Criteria.where("sellerId").is(sellerId)
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

