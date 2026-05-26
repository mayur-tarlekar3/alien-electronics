package com.shashi.srv;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.shashi.service.impl.ProductServiceImpl;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/RemoveProductSrv")
public class RemoveProductSrv extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public RemoveProductSrv() {
		super();

	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		String userType = (String) session.getAttribute("usertype");
		String userName = (String) session.getAttribute("username");
		String password = (String) session.getAttribute("password");

		Map<String, String> responseData = new HashMap<>();
		Gson gson = new Gson();

		if (userType == null || !userType.equals("admin")) {
			responseData.put("status", "error");
			responseData.put("message", "Access Denied!");
		} else {
			String prodId = request.getParameter("prodid");
			ProductServiceImpl product = new ProductServiceImpl();
			String status = product.removeProduct(prodId);

			if (status.contains("Successfully")) {
				responseData.put("status", "success");
			} else {
				responseData.put("status", "error");
			}
			responseData.put("message", status);
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
