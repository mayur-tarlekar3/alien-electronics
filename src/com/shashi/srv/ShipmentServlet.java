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
import com.shashi.service.impl.UserServiceImpl;
import com.shashi.utility.MailMessage;

/**
 * Servlet implementation class ShipmentServlet
 */
@WebServlet("/ShipmentServlet")
public class ShipmentServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public ShipmentServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		String userType = (String) session.getAttribute("usertype");
		if (userType == null || !userType.equals("admin")) {
			java.util.Map<String, String> responseData = new java.util.HashMap<>();
			com.google.gson.Gson gson = new com.google.gson.Gson();
			responseData.put("status", "error");
			responseData.put("message", "Access Denied, Login Again!");
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(gson.toJson(responseData));
			return;
		}

		String orderId = request.getParameter("orderid");
		String prodId = request.getParameter("prodid");
		String userName = request.getParameter("userid");
		
		double amount = 0.0;
		try {
			String amountStr = request.getParameter("amount");
			if (amountStr != null) {
				amount = Double.parseDouble(amountStr);
			}
		} catch (Exception e) {
			// Fallback if amount is not a valid number
		}

		String status = new OrderServiceImpl().shipNow(orderId, prodId);
		
		java.util.Map<String, String> responseData = new java.util.HashMap<>();
		com.google.gson.Gson gson = new com.google.gson.Gson();

		if (status != null && status.contains("successfully")) {
			final String fUserName = userName;
			final String fOrderId = orderId;
			final double fAmount = amount;
			new Thread(() -> {
				MailMessage.orderShipped(fUserName, new UserServiceImpl().getFName(fUserName), fOrderId, fAmount);
			}).start();
			responseData.put("status", "success");
			responseData.put("message", status);
		} else {
			responseData.put("status", "error");
			responseData.put("message", "Failed to ship order. (Order ID: " + orderId + ", Product: " + prodId + "). Ensure the order exists and is not already shipped.");
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
