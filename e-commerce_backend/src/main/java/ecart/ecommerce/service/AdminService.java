package ecart.ecommerce.service;
import ecart.ecommerce.dto.response.AdminUserResponse;
import java.util.List;

public interface AdminService {

    List<AdminUserResponse> getAllUsers();

}