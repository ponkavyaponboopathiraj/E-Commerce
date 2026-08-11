
package ecart.ecommerce.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "products")
public class Product {

    // =========================================================
    // PRODUCT ID
    // =========================================================

    @Id
    private String id;


    // =========================================================
    // SELLER ID
    // =========================================================

    /*
     * This stores the PostgreSQL User UUID of the seller.
     *
     * MongoDB Product
     *        ↓
     * sellerId
     *        ↓
     * PostgreSQL users.id
     */

    private String sellerId;


    // =========================================================
    // BASIC PRODUCT INFORMATION
    // =========================================================

    private String name;

    private String description;

    private BigDecimal price;

    private String brand;

    private String category;


    // =========================================================
    // INVENTORY
    // =========================================================

    private Integer stock;


    // =========================================================
    // PRODUCT STATUS
    // =========================================================

    /*
     * ACTIVE
     * INACTIVE
     * DISCONTINUED
     */

    private ProductStatus status;


    // =========================================================
    // PRODUCT IMAGES
    // =========================================================

    /*
     * Multiple product images can be stored here.
     *
     * Example:
     *
     * [
     *     "image1.jpg",
     *     "image2.jpg",
     *     "image3.jpg"
     * ]
     */

    private List<String> images = new ArrayList<>();


    // =========================================================
    // DYNAMIC PRODUCT ATTRIBUTES
    // =========================================================

    /*
     * Different categories require different attributes.
     *
     * Dress:
     * {
     *     "size": "M",
     *     "color": "Black",
     *     "material": "Cotton",
     *     "fit": "Regular"
     * }
     *
     * Mobile:
     * {
     *     "ram": "8GB",
     *     "storage": "128GB",
     *     "processor": "Snapdragon",
     *     "battery": "5000mAh"
     * }
     *
     * Shoes:
     * {
     *     "size": "9",
     *     "color": "White",
     *     "material": "Leather",
     *     "sole": "Rubber"
     * }
     */

    private Map<String, Object> attributes = new HashMap<>();


    // =========================================================
    // CREATED / UPDATED TIME
    // =========================================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Product() {
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }


    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }


    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }


    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }


    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }


    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(
            Map<String, Object> attributes
    ) {
        this.attributes = attributes;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }
}

