
package ecart.ecommerce.service.impl;

import ecart.ecommerce.entity.Product;
import ecart.ecommerce.enums.ProductStatus;
import ecart.ecommerce.repository.ProductRepository;
import ecart.ecommerce.service.ProductService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl
        implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(
            ProductRepository productRepository
    ) {

        this.productRepository =
                productRepository;
    }

    @Override
    public Product addProduct(
            Product product
    ) {

        LocalDateTime now =
                LocalDateTime.now();

        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        if (product.getStatus() == null) {

            product.setStatus(
                    ProductStatus.ACTIVE
            );
        }

        return productRepository.save(product);
    }

    @Override
    public Product getProductById(
            String id
    ) {

        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: "
                                        + id
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

        existingProduct.setStockQuantity(
                updatedProduct.getStockQuantity()
        );

        existingProduct.setAttributes(
                updatedProduct.getAttributes()
        );

        if (updatedProduct.getStatus() != null) {

            existingProduct.setStatus(
                    updatedProduct.getStatus()
            );
        }
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

        product.setStatus(status);

        product.setUpdatedAt(
                LocalDateTime.now()
        );

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(
            String id
    ) {

        if (!productRepository.existsById(id)) {

            throw new RuntimeException(
                    "Product not found with id: "
                            + id
            );
        }

        productRepository.deleteById(id);
    }
}

