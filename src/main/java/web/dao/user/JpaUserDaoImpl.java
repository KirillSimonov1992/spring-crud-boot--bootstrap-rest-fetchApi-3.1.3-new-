package web.dao.user;

import web.exception.UserException;
import web.model.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;
import java.util.Optional;

@Repository
public class JpaUserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(User user) {
        entityManager.persist(user);
    }

    @Override
    public List<User> getAll() {
        return entityManager.createQuery(
                "select u from User u", User.class
        ).getResultList();
    }

    @Override
    public User get(long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public void update(User user) {
        entityManager.merge(user);
    }

    @Override
    public void delete(long id) {
//        String query = "delete from User u where u.id = :id";
//        entityManager.createQuery(query)
//                .setParameter("id", id)
//                .executeUpdate();
        Query query =  entityManager.createQuery(
                "delete from User u where u.id = :id");
        query.setParameter("id", id);
        query.executeUpdate();
    }

    @Override
    public Optional<User> findUserByName(String email) {
        List<User> users = entityManager.createQuery("select u from User u where u.email = :email", User.class)
                                        .setParameter("email", email)
                                        .getResultList();
        if (users.size() > 1) {
            throw new UserException("In database found users with same email!!!");
        } else if (users.size() == 0) {
            return Optional.empty();
        }
        return Optional.of(users.get(0));
    }
}
