package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.service.role.RoleService;
import web.service.user.UserService;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
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

	@RequestMapping(value = "login", method = RequestMethod.GET)
	public String loginPage() {
		return "login";
	}

	@GetMapping("/user/{id}")
	public String showUser(Model model, @PathVariable Long id, Authentication authentication) {
		User loginUser = (User) userService.loadUserByUsername(authentication.getName());
		// Email loging user
		model.addAttribute("email", loginUser.getEmail());
		// Roles logging user
		List<String> collect = loginUser.getRoles().stream().map(Role::toString).sorted().collect(Collectors.toList());
		model.addAttribute("roles", collect);
		List<User> col = new ArrayList<>(1);
		col.add(loginUser);
		model.addAttribute("users", col);
		return "user/index";
	}

	@GetMapping("/admin/users")
	public String showUsers(Model model, Authentication authentication) {
		User loginUser = (User) userService.loadUserByUsername(authentication.getName());
		// Email loging user
		model.addAttribute("email", loginUser.getEmail());
		// Roles logging user
		List<String> collect = loginUser.getRoles().stream().map(Role::toString).sorted().collect(Collectors.toList());
		model.addAttribute("roles", collect);
		// All users
		model.addAttribute("users", userService.getAll());
		// All roles
		model.addAttribute("allRoles", roleService.getAllRoles().stream().map(Role::toString).sorted().collect(Collectors.toList()));
		return "user/index";
	}

//	@GetMapping("/admin/user-create")
//	public String createUserForm(User user) {
//		return "user/user-create";
//	}

	@PostMapping("/admin/user-create")
	public String createUser(HttpServletRequest request) throws Exception {
		User newUser = new User(request.getParameter("name"), request.getParameter("surname"),
				Integer.parseInt(request.getParameter("age")), request.getParameter("password"),
				request.getParameter("email"), parseSelectRole(request.getParameterMap().get("selectRoles")));
		userService.create(newUser);
		return "redirect:/admin/users";
	}

	@GetMapping("/admin/user-delete/{id}")
	public String delete(@PathVariable("id") Long id) {
		userService.delete(id);
		return "redirect:/admin/users";
	}

//	@GetMapping("/admin/user-update/{id}")
//	public String updateUserForm(@PathVariable("id") Long id, Model model) {
//		model.addAttribute("user", userService.get(id));
//		return "user/user-update";
//	}

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