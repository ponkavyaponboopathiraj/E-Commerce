package ecart.ecommerce.service.impl;

import ecart.ecommerce.entity.Category;
import ecart.ecommerce.enums.CategoryStatus;
import ecart.ecommerce.repository.CategoryRepository;
import ecart.ecommerce.service.CategoryService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryServiceImpl
        implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository
    ) {
        this.categoryRepository = categoryRepository;
    }

    // =====================================================
    // ADD CATEGORY
    // =====================================================

    @Override
    public Category addCategory(Category category) {

        if (category == null) {
            throw new RuntimeException(
                    "Category cannot be null."
            );
        }

        if (category.getName() == null
                || category.getName().isBlank()) {

            throw new RuntimeException(
                    "Category name is required."
            );
        }

        String categoryName =
                category.getName().trim();

        // Check duplicate category
        if (categoryRepository
                .existsByNameIgnoreCase(categoryName)) {

            throw new RuntimeException(
                    "Category already exists: "
                            + categoryName
            );
        }

        category.setName(categoryName);

        // Default status
        category.setStatus(
                CategoryStatus.ACTIVE
        );

        LocalDateTime now =
                LocalDateTime.now();

        category.setCreatedAt(now);
        category.setUpdatedAt(now);

        return categoryRepository.save(category);
    }

    // =====================================================
    // GET CATEGORY BY ID
    // =====================================================

    @Override
    public Category getCategoryById(String id) {

        return categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with id: "
                                        + id
                        )
                );
    }

    // =====================================================
    // GET ALL CATEGORIES
    // =====================================================

    @Override
    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }

    // =====================================================
    // SEARCH CATEGORIES
    // =====================================================

    @Override
    public List<Category> searchCategories(
            String name
    ) {

        if (name == null || name.isBlank()) {

            return categoryRepository.findAll();
        }

        return categoryRepository
                .findByNameContainingIgnoreCase(
                        name.trim()
                );
    }

    // =====================================================
    // GET BY STATUS
    // =====================================================

    @Override
    public List<Category> getCategoriesByStatus(
            CategoryStatus status
    ) {

        if (status == null) {

            throw new RuntimeException(
                    "Category status is required."
            );
        }

        return categoryRepository
                .findByStatus(status);
    }

    // =====================================================
    // UPDATE CATEGORY
    // =====================================================

    @Override
    public Category updateCategory(
            String id,
            Category updatedCategory
    ) {

        Category existingCategory =
                categoryRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found with id: "
                                                + id
                                )
                        );

        if (updatedCategory == null) {

            throw new RuntimeException(
                    "Category data cannot be null."
            );
        }

        if (updatedCategory.getName() == null
                || updatedCategory.getName().isBlank()) {

            throw new RuntimeException(
                    "Category name is required."
            );
        }

        String newName =
                updatedCategory.getName().trim();

        // Check duplicate name
        if (!existingCategory
                .getName()
                .equalsIgnoreCase(newName)
                && categoryRepository
                .existsByNameIgnoreCase(newName)) {

            throw new RuntimeException(
                    "Category already exists: "
                            + newName
            );
        }

        existingCategory.setName(newName);

        existingCategory.setDescription(
                updatedCategory.getDescription()
        );

        existingCategory.setImage(
                updatedCategory.getImage()
        );

        existingCategory.setUpdatedAt(
                LocalDateTime.now()
        );

        return categoryRepository.save(
                existingCategory
        );
    }

    // =====================================================
    // UPDATE CATEGORY STATUS
    // =====================================================

    @Override
    public Category updateCategoryStatus(
            String id,
            CategoryStatus status
    ) {

        Category category =
                categoryRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found with id: "
                                                + id
                                )
                        );

        if (status == null) {

            throw new RuntimeException(
                    "Category status is required."
            );
        }

        category.setStatus(status);

        category.setUpdatedAt(
                LocalDateTime.now()
        );

        return categoryRepository.save(category);
    }

    // =====================================================
    // DELETE CATEGORY
    // =====================================================

    @Override
    public void deleteCategory(String id) {

        if (!categoryRepository.existsById(id)) {

            throw new RuntimeException(
                    "Category not found with id: "
                            + id
            );
        }

        categoryRepository.deleteById(id);
    }
}