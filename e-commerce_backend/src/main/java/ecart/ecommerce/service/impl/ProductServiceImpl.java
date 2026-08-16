package ecart.ecommerce.service.impl;

import ecart.ecommerce.entity.Notification;
import ecart.ecommerce.entity.Product;
import ecart.ecommerce.enums.NotificationType;
import ecart.ecommerce.enums.ProductStatus;
import ecart.ecommerce.repository.ProductRepository;
import ecart.ecommerce.service.ProductService;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final MongoTemplate mongoTemplate;

    // CONSTRUCTOR


    public ProductServiceImpl(
            ProductRepository productRepository,
            MongoTemplate mongoTemplate
    ) {

        this.productRepository = productRepository;
        this.mongoTemplate = mongoTemplate;
    }


    
    // ADD PRODUCT

    @Override
    public Product addProduct(Product product) {

        LocalDateTime now = LocalDateTime.now();

        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        Integer stock = product.getStock();

        ProductStatus automaticStatus =
                getAutomaticStatus(stock);

        product.setStatus(automaticStatus);

        Product savedProduct =
                productRepository.save(product);



        // Notification
        createStockNotification(
                savedProduct,
                null,
                stock
        );


        return savedProduct;
    }

    // GET PRODUCT BY ID
   

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


    
    // GET ALL PRODUCTS
    

    @Override
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }


    // GET PRODUCTS BY SELLER

    @Override
    public List<Product> getProductsBySeller(
            String sellerId
    ) {

        return productRepository
                .findBySellerId(sellerId);
    }

    // GET PRODUCTS BY CATEGORY

    @Override
    public List<Product> getProductsByCategory(
            String category
    ) {

        return productRepository
                .findByCategory(category);
    }

    // GET PRODUCTS BY STATUS


    @Override
    public List<Product> getProductsByStatus(
            ProductStatus status
    ) {

        return productRepository
                .findByStatus(status);
    }


    // SEARCH PRODUCTS
   
    @Override
    public List<Product> searchProductsByName(
            String name
    ) {

        return productRepository
                .findByNameContainingIgnoreCase(name);
    }


    
    // UPDATE PRODUCT
    

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


        // Previous stock
        Integer oldStock =
                existingProduct.getStock();


        // New stock
        Integer newStock =
                updatedProduct.getStock();


        // Update basic details
       
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

        existingProduct.setBrand(
                updatedProduct.getBrand()
        );

        existingProduct.setImages(
                updatedProduct.getImages()
        );

        existingProduct.setStock(
                newStock
        );

        existingProduct.setAttributes(
                updatedProduct.getAttributes()
        );

        // Automatic stock status
        

        existingProduct.setStatus(
                getAutomaticStatus(newStock)
        );


        existingProduct.setUpdatedAt(
                LocalDateTime.now()
        );


        Product savedProduct =
                productRepository.save(
                        existingProduct
                );

        // Stock Notification
      

        createStockNotification(
                savedProduct,
                oldStock,
                newStock
        );


        return savedProduct;
    }

    // UPDATE PRODUCT STATUS
   

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

        // Stock = 0
        // Force INACTIVE
        

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


        return productRepository.save(
                product
        );
    }


    // DELETE PRODUCT
   

    @Override
    public void deleteProduct(String id) {

        if (!productRepository.existsById(id)) {

            throw new RuntimeException(
                    "Product not found with id: " + id
            );
        }

        productRepository.deleteById(id);
    }

    // AUTOMATIC PRODUCT STATUS
    

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

    // CREATE STOCK NOTIFICATION
    private void createStockNotification(
            Product product,
            Integer oldStock,
            Integer newStock
    ) {


        if (newStock == null) {

            return;
        }


        // OUT OF STOCK
       

        if (newStock == 0) {

            Notification notification =
                    new Notification();

            notification.setSellerId(
                    product.getSellerId()
            );

            notification.setProductId(
                    product.getId()
            );

            notification.setProductName(
                    product.getName()
            );

            notification.setType(
                    NotificationType.OUT_OF_STOCK
            );

            notification.setMessage(
                    product.getName()
                            + " is out of stock."
            );

            notification.setRead(false);

            notification.setCreatedAt(
                    LocalDateTime.now()
            );

            mongoTemplate.save(notification);

            return;
        }

        // BACK IN STOCK
      

        if (oldStock != null
                && oldStock == 0
                && newStock > 0) {

            Notification notification =
                    new Notification();

            notification.setSellerId(
                    product.getSellerId()
            );

            notification.setProductId(
                    product.getId()
            );

            notification.setProductName(
                    product.getName()
            );

            notification.setType(
                    NotificationType.BACK_IN_STOCK
            );

            notification.setMessage(
                    product.getName()
                            + " is back in stock. "
                            + "Available stock: "
                            + newStock
            );

            notification.setRead(false);

            notification.setCreatedAt(
                    LocalDateTime.now()
            );

            mongoTemplate.save(notification);

            return;
        }
        // LOW STOCK

        if (newStock > 0
                && newStock <= 5) {

            Notification notification =
                    new Notification();

            notification.setSellerId(
                    product.getSellerId()
            );

            notification.setProductId(
                    product.getId()
            );

            notification.setProductName(
                    product.getName()
            );

            notification.setType(
                    NotificationType.LOW_STOCK
            );

            notification.setMessage(
                    product.getName()
                            + " stock is low. "
                            + "Only "
                            + newStock
                            + " items left."
            );

            notification.setRead(false);

            notification.setCreatedAt(
                    LocalDateTime.now()
            );

            mongoTemplate.save(notification);
        }
    }
}