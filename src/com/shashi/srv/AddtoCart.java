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

import com.shashi.beans.DemandBean;
import com.shashi.beans.ProductBean;
import com.shashi.service.impl.CartServiceImpl;
import com.shashi.service.impl.DemandServiceImpl;
import com.shashi.service.impl.ProductServiceImpl;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class AddtoCart
 */
@WebServlet("/AddtoCart")
public class AddtoCart extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public AddtoCart() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		String userName = (String) session.getAttribute("username");
		String password = (String) session.getAttribute("password");
		String usertype = (String) session.getAttribute("usertype");
		Map<String, Object> responseData = new HashMap<>();
		Gson gson = new Gson();

		if (userName == null || password == null || usertype == null || !usertype.equalsIgnoreCase("customer")) {
			responseData.put("status", "error");
			responseData.put("message", "Session Expired, Login Again!");
		} else {
			String userId = userName;
			String prodId = request.getParameter("pid");
			int pQty = Integer.parseInt(request.getParameter("pqty"));

			CartServiceImpl cart = new CartServiceImpl();
			ProductServiceImpl productDao = new ProductServiceImpl();
			ProductBean product = productDao.getProductDetails(prodId);

			int availableQty = product.getProdQuantity();
			int cartQty = cart.getProductCount(userId, prodId);
			pQty += cartQty;

			if (pQty == cartQty) {
				String status = cart.removeProductFromCart(userId, prodId);
				responseData.put("status", "success");
				responseData.put("message", status);
			} else if (availableQty < pQty) {
				String status = "";
				if (availableQty == 0) {
					status = "Product is Out of Stock!";
				} else {
					cart.updateProductToCart(userId, prodId, availableQty);
					status = "Only " + availableQty + " no of " + product.getProdName()
							+ " are available! Added " + availableQty + " to cart.";
				}
				DemandBean demandBean = new DemandBean(userName, product.getProdId(), pQty - availableQty);
				DemandServiceImpl demand = new DemandServiceImpl();
				boolean flag = demand.addProduct(demandBean);

				if (flag)
					status += " We will mail you when it's back in stock!";
				
				responseData.put("status", "warning");
				responseData.put("message", status);
			} else {
				String status = cart.updateProductToCart(userId, prodId, pQty);
				responseData.put("status", "success");
				responseData.put("message", status);
			}
			
			// Include current cart count for UI update
			responseData.put("cartCount", cart.getCartCount(userId));
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
