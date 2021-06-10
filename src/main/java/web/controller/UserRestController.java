package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.service.role.RoleService;
import web.service.user.UserService;

import java.util.List;
import java.util.Set;

@RestController
public class UserRestController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UserRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping(value = "/users/current")
    public User getAuthenticationUser(Authentication authentication) {
        User user = (User) userService.loadUserByUsername(authentication.getName());
        return user;
    }

    @GetMapping(value = "/users/{id}", produces = "application/json")
    public User infoAboutUser(@PathVariable Long id) {
        return userService.get(id);
    }

    @GetMapping(value = "/users", produces = "application/json")
    public List<User> allUsers() {
        List<User> all = userService.getAll();
        return all;
    }

    @GetMapping(value = "/roles")
    public Set<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @PutMapping(value = "/users", consumes = "application/json")
    public void updateUser(@RequestBody User user) {
        userService.update(user);
    }

    @PostMapping(value = "/users", consumes = "application/json")
    public void createUser(@RequestBody User user) throws Exception {
        userService.create(user);
    }

    @DeleteMapping("/users/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }


}

