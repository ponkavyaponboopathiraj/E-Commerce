package ecart.ecommerce.controller;

import ecart.ecommerce.entity.Category;
import ecart.ecommerce.enums.CategoryStatus;
import ecart.ecommerce.service.CategoryService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }

    // =====================================================
    // ADD CATEGORY
    // =====================================================

    @PostMapping
    public ResponseEntity<Category> addCategory(
            @RequestBody Category category
    ) {

        Category savedCategory =
                categoryService.addCategory(category);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCategory);
    }

    // =====================================================
    // GET ALL CATEGORIES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Category>>
    getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    // =====================================================
    // GET CATEGORY BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Category>
    getCategoryById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                categoryService.getCategoryById(id)
        );
    }

    // =====================================================
    // SEARCH CATEGORY
    // =====================================================

    @GetMapping("/search")
    public ResponseEntity<List<Category>>
    searchCategories(
            @RequestParam String name
    ) {

        return ResponseEntity.ok(
                categoryService.searchCategories(name)
        );
    }

    // =====================================================
    // GET CATEGORY BY STATUS
    // =====================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Category>>
    getCategoriesByStatus(
            @PathVariable CategoryStatus status
    ) {

        return ResponseEntity.ok(
                categoryService.getCategoriesByStatus(
                        status
                )
        );
    }

    // =====================================================
    // UPDATE CATEGORY
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Category>
    updateCategory(
            @PathVariable String id,
            @RequestBody Category category
    ) {

        Category updatedCategory =
                categoryService.updateCategory(
                        id,
                        category
                );

        return ResponseEntity.ok(
                updatedCategory
        );
    }

    // =====================================================
    // UPDATE CATEGORY STATUS
    // =====================================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<Category>
    updateCategoryStatus(
            @PathVariable String id,
            @RequestParam CategoryStatus status
    ) {

        Category updatedCategory =
                categoryService.updateCategoryStatus(
                        id,
                        status
                );

        return ResponseEntity.ok(
                updatedCategory
        );
    }

    // =====================================================
    // DELETE CATEGORY
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteCategory(
            @PathVariable String id
    ) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                "Category deleted successfully."
        );
    }
}