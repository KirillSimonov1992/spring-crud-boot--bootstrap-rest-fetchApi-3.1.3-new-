package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.model.Role;
import web.model.User;
import web.service.role.RoleService;
import web.service.user.UserService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UserRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping(value = "/users/current")
    public ResponseEntity<User> getAuthenticationUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/users/{id}", produces = "application/json")
    public ResponseEntity<User> infoAboutUser(@PathVariable Long id) {
        User user = userService.get(id);
        ResponseEntity<User> tResponseEntity = new ResponseEntity<>(user, HttpStatus.OK);
        return user != null
                ? tResponseEntity
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/users", produces = "application/json")
    public ResponseEntity<List<User>> allUsers() {
        List<User> allUsers = userService.getAll();
        ResponseEntity<List<User>> listResponseEntity = new ResponseEntity<>(allUsers, HttpStatus.OK);
        return allUsers != null
                ? listResponseEntity
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/roles")
    public ResponseEntity<Set<Role>> getAllRoles() {
        Set<Role> allRoles = roleService.getAllRoles();
        return allRoles != null
                ? new ResponseEntity<>(allRoles, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

//    @PutMapping(value = "/users", consumes = "application/json")
//    public ResponseEntity<?> updateUser(@RequestBody User user) {
//        userService.update(user);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @PostMapping(value = "/users", consumes = "application/json")
//    public ResponseEntity<?> createUser(@RequestBody User user) throws Exception {
//        userService.create(user);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @DeleteMapping("/users/{id}")
//    public ResponseEntity<?> delete(@PathVariable Long id) {
//        userService.delete(id);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }


}

