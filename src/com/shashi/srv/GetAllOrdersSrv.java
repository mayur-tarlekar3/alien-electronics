package com.shashi.srv;

import java.io.IOException;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.shashi.beans.OrderBean;
import com.shashi.service.impl.OrderServiceImpl;

@WebServlet("/GetAllOrdersSrv")
public class GetAllOrdersSrv extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		String userName = (String) session.getAttribute("username");
		String password = (String) session.getAttribute("password");
		String userType = (String) session.getAttribute("usertype");

		Map<String, Object> responseData = new HashMap<>();
		Gson gson = new Gson();

		if (userName == null || password == null || userType == null || !userType.equals("admin")) {
			responseData.put("status", "error");
			responseData.put("message", "Access Denied!");
		} else {
			List<Map<String, Object>> ordersList = new java.util.ArrayList<>();
			java.sql.Connection con = com.shashi.utility.DBUtil.provideConnection();
			java.sql.PreparedStatement ps = null;
			java.sql.ResultSet rs = null;
			try {
				ps = con.prepareStatement(
					"SELECT o.orderid, o.prodid, o.quantity, o.amount, o.shipped, t.username, t.time, u.address " +
					"FROM orders o " +
					"INNER JOIN transactions t ON o.orderid = t.transid " +
					"INNER JOIN user u ON t.username = u.email " +
					"ORDER BY t.time DESC"
				);
				rs = ps.executeQuery();
				java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				while (rs.next()) {
					Map<String, Object> order = new HashMap<>();
					order.put("transactionId", rs.getString("orderid"));
					order.put("productId", rs.getString("prodid"));
					order.put("quantity", rs.getInt("quantity"));
					order.put("amount", rs.getDouble("amount"));
					order.put("shipped", rs.getInt("shipped"));
					order.put("userName", rs.getString("username"));
					order.put("address", rs.getString("address"));
					order.put("time", rs.getTimestamp("time") != null ? sdf.format(rs.getTimestamp("time")) : "N/A");
					ordersList.add(order);
				}
			} catch (java.sql.SQLException e) {
				e.printStackTrace();
			} finally {
				com.shashi.utility.DBUtil.closeConnection(con);
				com.shashi.utility.DBUtil.closeConnection(ps);
				com.shashi.utility.DBUtil.closeConnection(rs);
			}
			
			responseData.put("status", "success");
			responseData.put("orders", ordersList);
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
