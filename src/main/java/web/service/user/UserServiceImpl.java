package web.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.dao.role.RoleDao;
import web.dao.user.UserDao;
import web.exception.UserException;
import web.model.Role;
import web.model.User;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;
    private final RoleDao roleDao;

    @Autowired
    public UserServiceImpl(@Qualifier("jpaUserDaoImpl") UserDao userDao, @Qualifier("roleDaoImpl") RoleDao roleDao) {
        this.userDao = userDao;
        this.roleDao = roleDao;
    }

    @Transactional
    @Override
    public void create(User user) throws Exception {
        Optional<User> optUserFromDB = userDao.findUserByName(user.getName());
        if (optUserFromDB.isPresent()) {
            throw new UserException("User with this name exist in database");
        }
        userDao.create(user);
    }

    @Transactional(readOnly = true)
    @Override
    public List<User> getAll() {
        return userDao.getAll();
    }

    @Transactional(readOnly = true)
    @Override
    public User get(long id) {
        return userDao.get(id);
    }

    @Transactional
    @Override
    public void update(User user) {
        userDao.update(user);
    }

    @Transactional
    @Override
    public void delete(long id) {
        userDao.delete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> optUser = userDao.findUserByName(email);
        if (!optUser.isPresent()) {
            throw new UsernameNotFoundException("This user not found");
        }
        return optUser.get();
    }
}
