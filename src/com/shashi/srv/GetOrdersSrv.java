package com.shashi.srv;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.shashi.beans.OrderDetails;
import com.shashi.service.impl.OrderServiceImpl;

@WebServlet("/GetOrdersSrv")
public class GetOrdersSrv extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		String userName = (String) session.getAttribute("username");
		String password = (String) session.getAttribute("password");

		response.setContentType("application/json");
		PrintWriter pw = response.getWriter();
		Gson gson = new com.google.gson.GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();

		if (userName == null || password == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			pw.print(gson.toJson("Session Expired, Login Again!!"));
			return;
		}

		List<OrderDetails> orders = new OrderServiceImpl().getAllOrderDetails(userName);

		pw.print(gson.toJson(orders));
		pw.flush();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
