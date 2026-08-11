
package ecart.ecommerce.service.impl;

import ecart.ecommerce.entity.Product;
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

        LocalDateTime now =
                LocalDateTime.now();

        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        if (product.getStockQuantity() != null &&
                product.getStockQuantity() > 0) {

            product.setStatus(
                    ecart.ecommerce.enums.ProductStatus.IN_STOCK
            );

        } else {

            product.setStatus(
                    ecart.ecommerce.enums.ProductStatus.OUT_OF_STOCK
            );
        }

        return productRepository.save(product);
    }

    @Override
    public Product getProductById(
            String id
    ) {

        return productRepository.findById(id)
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
            String status
    ) {

        ecart.ecommerce.enums.ProductStatus productStatus;

        try {

            productStatus =
                    ecart.ecommerce.enums.ProductStatus
                            .valueOf(
                                    status.toUpperCase()
                            );

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid product status: "
                            + status
            );
        }

        return productRepository
                .findByStatus(productStatus);
    }

    @Override
    public Product updateProduct(
            String id,
            Product updatedProduct
    ) {

        Product existingProduct =
                productRepository.findById(id)
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


        if (updatedProduct.getStockQuantity() != null &&
                updatedProduct.getStockQuantity() > 0) {

            existingProduct.setStatus(
                    ecart.ecommerce.enums.ProductStatus.IN_STOCK
            );

        } else {

            existingProduct.setStatus(
                    ecart.ecommerce.enums.ProductStatus.OUT_OF_STOCK
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

