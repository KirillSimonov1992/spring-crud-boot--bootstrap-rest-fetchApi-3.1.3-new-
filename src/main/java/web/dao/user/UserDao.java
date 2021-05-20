package web.dao.user;

import web.model.User;

import java.util.List;
import java.util.Optional;

public interface UserDao {
    void create(User user);
    List<User> getAll();
    User get(long id);
    void update(User user);
    void delete(long id);
    Optional<User> findUserByName(String userName);
}
