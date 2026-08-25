package ecart.ecommerce.service;

import ecart.ecommerce.entity.Category;
import ecart.ecommerce.enums.CategoryStatus;

import java.util.List;

public interface CategoryService {

    Category addCategory(Category category);
    Category getCategoryById(String id);

    List<Category> getAllCategories();
    List<Category> searchCategories(String name);
    List<Category> getCategoriesByStatus(
            CategoryStatus status
    );
    Category updateCategory(
            String id,
            Category category
    );
    Category updateCategoryStatus(
            String id,
            CategoryStatus status
    );
    void deleteCategory(String id);
}