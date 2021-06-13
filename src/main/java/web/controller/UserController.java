package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.service.role.RoleService;
import web.service.user.UserService;

import javax.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
public class UserController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping( "login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/user")
    public String showUser() {
        return "index";
    }

    @GetMapping("/admin/users")
    public String showUsers() {
        return "index";
    }

    @PostMapping("/admin/user-create")
    public String createUser(HttpServletRequest request) throws Exception {
        User newUser = new User(request.getParameter("name"), request.getParameter("surname"),
                Integer.parseInt(request.getParameter("age")), request.getParameter("password"),
                request.getParameter("email"), parseSelectRole(request.getParameterMap().get("selectRoles")));
        newUser.setActive(true);
        userService.create(newUser);
        return "redirect:/admin/users";
    }

    @GetMapping("/admin/user-delete/{id}")
    public String delete(@PathVariable("id") Long id) {
        userService.delete(id);
        return "redirect:/admin/users";
    }

    @PostMapping("/admin/user-update")
    public String updateUser(HttpServletRequest request) {
        User updateUser = new User(Long.parseLong(request.getParameter("id")), request.getParameter("name"), request.getParameter("surname"),
                Integer.parseInt(request.getParameter("age")), request.getParameter("password"),
                request.getParameter("email"), parseSelectRole(request.getParameterMap().get("selectRoles")));
        userService.update(updateUser);
        return "redirect:/admin/users";
    }

    private Set<Role> parseSelectRole(String[] nameRoles) {
        Set<Role> roles = new HashSet<>();
        for (String nameRole: nameRoles) {
            Role role = roleService.getRoleByName(nameRole);
            roles.add(role);
        }
        return roles;
    }


}