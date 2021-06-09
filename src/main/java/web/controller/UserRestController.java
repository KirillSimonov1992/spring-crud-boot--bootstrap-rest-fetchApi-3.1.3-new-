package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.service.role.RoleService;
import web.service.user.UserService;

import javax.servlet.http.HttpServletRequest;
import java.util.HashSet;
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
        return (User) userService.loadUserByUsername(authentication.getName());
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

    /*
        ========================================= Проблема =================================
     */
    @PutMapping(value = "/users", consumes = "application/json")
    public void updateUser(@RequestBody User user) {
        System.out.println("awd");
//        userService.update(user);
    }

//    @PostMapping("/admin/user-create")
//    public String createUser(HttpServletRequest request) throws Exception {
//        User newUser = new User(request.getParameter("name"), request.getParameter("surname"),
//                Integer.parseInt(request.getParameter("age")), request.getParameter("password"),
//                request.getParameter("email"), parseSelectRole(request.getParameterMap().get("selectRoles")));
//        userService.create(newUser);
//        return "redirect:/admin/users";
//    }


}

