package com.shashi.srv;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.shashi.beans.UserBean;
import com.shashi.service.impl.UserServiceImpl;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class RegisterSrv
 */
@WebServlet("/RegisterSrv")
public class RegisterSrv extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try {
		String userName = request.getParameter("username");
		Long mobileNo = Long.parseLong(request.getParameter("mobile"));
		String emailId = request.getParameter("email");
		String address = request.getParameter("address");
		int pinCode = Integer.parseInt(request.getParameter("pincode"));
		String password = request.getParameter("password");
		String confirmPassword = request.getParameter("confirmPassword");
		String status = "";
		Map<String, String> responseData = new HashMap<>();
		Gson gson = new Gson();

		if (password != null && password.equals(confirmPassword)) {
			UserBean user = new UserBean(userName, mobileNo, emailId, address, pinCode, password);

			UserServiceImpl dao = new UserServiceImpl();

			status = dao.registerUser(user);
			
			if (status.contains("Successfully")) {
				responseData.put("status", "success");
			} else {
				responseData.put("status", "error");
			}
			responseData.put("message", status);
		} else {
			responseData.put("status", "error");
			responseData.put("message", "Password not matching!");
		}

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(gson.toJson(responseData));
		} catch (NumberFormatException e) {
			Map<String, String> responseData = new HashMap<>();
			Gson gson = new Gson();
			responseData.put("status", "error");
			responseData.put("message", "Invalid mobile number or pincode format!");
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(gson.toJson(responseData));
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doGet(request, response);
	}

}
