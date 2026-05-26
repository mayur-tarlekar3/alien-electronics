package com.shashi.srv;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.shashi.service.impl.OrderServiceImpl;

/**
 * Servlet implementation class OrderServlet
 */
@WebServlet("/OrderServlet")
public class OrderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		String userName = (String) session.getAttribute("username");
		String password = (String) session.getAttribute("password");

		if (userName == null || password == null) {
			java.util.Map<String, String> responseData = new java.util.HashMap<>();
			com.google.gson.Gson gson = new com.google.gson.Gson();
			responseData.put("status", "error");
			responseData.put("message", "Session Expired, Login Again!");
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(gson.toJson(responseData));
			return;
		}

		try {
		double paidAmount = Double.parseDouble(request.getParameter("amount"));
		String status = new OrderServiceImpl().paymentSuccess(userName, paidAmount);

		java.util.Map<String, String> responseData = new java.util.HashMap<>();
		com.google.gson.Gson gson = new com.google.gson.Gson();

		if (status.contains("Successfully")) {
			responseData.put("status", "success");
		} else {
			responseData.put("status", "error");
		}
		responseData.put("message", status);

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(gson.toJson(responseData));
		} catch (NumberFormatException e) {
			java.util.Map<String, String> responseData = new java.util.HashMap<>();
			com.google.gson.Gson gson = new com.google.gson.Gson();
			responseData.put("status", "error");
			responseData.put("message", "Invalid payment amount!");
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
