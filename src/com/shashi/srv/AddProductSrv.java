package com.shashi.srv;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import com.shashi.service.impl.ProductServiceImpl;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class AddProductSrv
 */
@WebServlet("/AddProductSrv")
@MultipartConfig(maxFileSize = 16177215)
public class AddProductSrv extends HttpServlet {
	private static final long serialVersionUID = 1L;

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
			try {
				String prodName = request.getParameter("name");
				String prodType = request.getParameter("type");
				String prodInfo = request.getParameter("info");
				double prodPrice = Double.parseDouble(request.getParameter("price"));
				int prodQuantity = Integer.parseInt(request.getParameter("quantity"));

				Part part = request.getPart("image");
				InputStream prodImage = (part != null) ? part.getInputStream() : null;

				ProductServiceImpl product = new ProductServiceImpl();
				String status = product.addProduct(prodName, prodType, prodInfo, prodPrice, prodQuantity, prodImage);

				if (status.contains("Successfully")) {
					responseData.put("status", "success");
				} else {
					responseData.put("status", "error");
				}
				responseData.put("message", status);

			} catch (Exception e) {
				responseData.put("status", "error");
				responseData.put("message", "Error: " + e.getMessage());
			}
		}

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(gson.toJson(responseData));

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		String userType = (String) session.getAttribute("usertype");

		Map<String, String> responseData = new HashMap<>();
		Gson gson = new Gson();

		if (userType == null || !userType.equals("admin")) {
			responseData.put("status", "error");
			responseData.put("message", "Access Denied!");
		} else {
			try {
				String prodName     = request.getParameter("name");
				String prodType     = request.getParameter("type");
				String prodInfo     = request.getParameter("info");
				double prodPrice    = Double.parseDouble(request.getParameter("price"));
				int    prodQuantity = Integer.parseInt(request.getParameter("quantity"));

				Part part = request.getPart("image");
				InputStream prodImage = (part != null && part.getSize() > 0) ? part.getInputStream() : null;

				ProductServiceImpl product = new ProductServiceImpl();
				String status = product.addProduct(prodName, prodType, prodInfo, prodPrice, prodQuantity, prodImage);

				if (status.contains("Successfully")) {
					responseData.put("status", "success");
				} else {
					responseData.put("status", "error");
				}
				responseData.put("message", status);

			} catch (Exception e) {
				responseData.put("status", "error");
				responseData.put("message", "Error: " + e.getMessage());
			}
		}

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(gson.toJson(responseData));
	}

}
