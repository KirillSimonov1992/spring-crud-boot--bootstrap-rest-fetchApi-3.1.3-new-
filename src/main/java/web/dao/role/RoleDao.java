package web.dao.role;

import web.model.Role;
import web.model.User;

import java.util.Set;

public interface RoleDao {
    void create(String nameRole, User user);
    Role getRole(String name);
    Set<Role> getAllRoles();
    Role getRoleByName(String nameRole);
}
