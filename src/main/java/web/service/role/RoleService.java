package web.service.role;


import web.model.Role;
import web.model.User;

import java.util.Set;

public interface RoleService {
    void create(String nameRole, User user);
    Set<Role> getAllRoles();
    Role getRoleByName(String nameRole);
}
