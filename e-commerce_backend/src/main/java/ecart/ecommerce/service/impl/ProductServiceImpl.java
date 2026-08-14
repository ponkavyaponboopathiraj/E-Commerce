package ecart.ecommerce.service.impl;

import ecart.ecommerce.entity.Product;
import ecart.ecommerce.enums.ProductStatus;
import ecart.ecommerce.repository.ProductRepository;
import ecart.ecommerce.service.ProductService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(
            ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }
    @Override
    public Product addProduct(Product product) {

        LocalDateTime now = LocalDateTime.now();

        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        product.setStatus(
                getAutomaticStatus(product.getStock())
        );

        return productRepository.save(product);
    }

    @Override
    public Product getProductById(String id) {

        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );
    }

    @Override
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsBySeller(
            String sellerId
    ) {

        return productRepository
                .findBySellerId(sellerId);
    }

    @Override
    public List<Product> getProductsByCategory(
            String category
    ) {

        return productRepository
                .findByCategory(category);
    }

    @Override
    public List<Product> getProductsByStatus(
            ProductStatus status
    ) {

        return productRepository
                .findByStatus(status);
    }

    @Override
    public List<Product> searchProductsByName(
            String name
    ) {

        return productRepository
                .findByNameContainingIgnoreCase(name);
    }

    @Override
    public Product updateProduct(
            String id,
            Product updatedProduct
    ) {

        Product existingProduct =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: "
                                                + id
                                )
                        );

        existingProduct.setName(
                updatedProduct.getName()
        );

        existingProduct.setDescription(
                updatedProduct.getDescription()
        );

        existingProduct.setCategory(
                updatedProduct.getCategory()
        );

        existingProduct.setPrice(
                updatedProduct.getPrice()
        );

        existingProduct.setStock(
                updatedProduct.getStock()
        );

        existingProduct.setAttributes(
                updatedProduct.getAttributes()
        );

        existingProduct.setStatus(
                getAutomaticStatus(
                        updatedProduct.getStock()
                )
        );

        existingProduct.setUpdatedAt(
                LocalDateTime.now()
        );

        return productRepository.save(
                existingProduct
        );
    }

    @Override
    public Product updateProductStatus(
            String id,
            ProductStatus status
    ) {

        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: "
                                                + id
                                )
                        );

        if (product.getStock() != null
                && product.getStock() <= 0) {

            product.setStatus(
                    ProductStatus.INACTIVE
            );

        } else {

            product.setStatus(status);
        }

        product.setUpdatedAt(
                LocalDateTime.now()
        );

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(String id) {

        if (!productRepository.existsById(id)) {

            throw new RuntimeException(
                    "Product not found with id: " + id
            );
        }

        productRepository.deleteById(id);
    }

    private ProductStatus getAutomaticStatus(
            Integer stock
    ) {

        if (stock == null) {

            return ProductStatus.INACTIVE;
        }
        if (stock <= 0) {

            return ProductStatus.INACTIVE;
        }

        return ProductStatus.ACTIVE;
    }
}