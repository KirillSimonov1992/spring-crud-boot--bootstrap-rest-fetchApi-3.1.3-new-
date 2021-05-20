package web.service.role;

import org.springframework.beans.factory.annotation.Autowired;
import web.dao.role.RoleDaoImpl;
import web.model.User;

public class RoleServiceImpl implements RoleService {

    private RoleDaoImpl roleDao;

    @Autowired
    public RoleServiceImpl(RoleDaoImpl roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    public void create(String nameRole, User user) {
        roleDao.create(nameRole, user);
    }
}
