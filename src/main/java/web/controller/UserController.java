package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import web.model.User;
import web.service.user.UserService;

import java.util.ArrayList;
import java.util.List;

@Controller
public class UserController {

	private final UserService userService;

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@RequestMapping(value = "login", method = RequestMethod.GET)
	public String loginPage() {
		return "login";
	}

	@GetMapping("/user/{id}")
	public String showUser(Model model, @PathVariable Long id) {
		model.addAttribute("users", userService.get(id));
		return "user/index";
	}

	@GetMapping("/admin/users")
	public String showUsers(Model model) {
		model.addAttribute("users", userService.getAll());
		return "user/index";
	}

	@GetMapping("/admin/user-create")
	public String createUserForm(User user) {
		return "user/user-create";
	}

	@PostMapping("/admin/user-create")
	public String createUser(User user) throws Exception {
		userService.create(user);
		return "redirect:/admin/users";
	}

	@GetMapping("/admin/user-delete/{id}")
	public String delete(@PathVariable("id") Long id) {
		userService.delete(id);
		return "redirect:/admin/users";
	}

	@GetMapping("/admin/user-update/{id}")
	public String updateUserForm(@PathVariable("id") Long id, Model model) {
		model.addAttribute("user", userService.get(id));
		return "user/user-update";
	}

	@PostMapping("/admin/user-update")
	public String updateUser(User user) {
		userService.update(user);
		return "redirect:/admin/users";
	}


}