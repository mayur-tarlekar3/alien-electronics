package com.shashi.srv;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.shashi.beans.UserBean;
import com.shashi.service.impl.UserServiceImpl;

/**
 * Servlet implementation class LoginSrv
 */
@WebServlet("/LoginSrv")
public class LoginSrv extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String userName = request.getParameter("username");
		String password = request.getParameter("password");
		String userType = request.getParameter("usertype");

		Map<String, Object> responseData = new HashMap<>();
		Gson gson = new Gson();

		if (userType == null) {
			responseData.put("status", "error");
			responseData.put("message", "User type is required.");
		} else if (userType.equals("admin")) { // Login as Admin

			if (password != null && password.equals("admin") && userName != null && userName.equals("admin@gmail.com")) {
				responseData.put("status", "success");
				responseData.put("message", "Admin logged in successfully");
				responseData.put("userType", "admin");
				
				HttpSession session = request.getSession(true); // Create new session
				session.setAttribute("username", userName);
				session.setAttribute("password", password);
				session.setAttribute("usertype", userType);
			} else {
				responseData.put("status", "error");
				responseData.put("message", "Login Denied! Invalid Admin credentials.");
			}

		} else { // Login as customer

			UserServiceImpl udao = new UserServiceImpl();
			String status = udao.isValidCredential(userName, password);

			if (status != null && status.equalsIgnoreCase("valid")) {
				UserBean user = udao.getUserDetails(userName, password);
				
				responseData.put("status", "success");
				responseData.put("message", "User logged in successfully");
				responseData.put("userType", "customer");
				responseData.put("user", user);

				HttpSession session = request.getSession(true); // Create new session
				session.setAttribute("userdata", user);
				session.setAttribute("username", userName);
				session.setAttribute("password", password);
				session.setAttribute("usertype", "customer");
			} else {
				responseData.put("status", "error");
				responseData.put("message", status != null ? status : "Invalid Username or password.");
			}
		}

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(gson.toJson(responseData));
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
