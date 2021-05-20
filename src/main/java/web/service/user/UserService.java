package web.service.user;

import org.springframework.security.core.userdetails.UserDetailsService;
import web.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    void create(User user) throws Exception;
    List<User> getAll();
    User get(long id);
    void update(User user);
    void delete(long id);
}
