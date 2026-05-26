package com.shashi.srv;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.shashi.beans.ProductBean;
import com.shashi.service.impl.ProductServiceImpl;

/**
 * Servlet implementation class UpdateProductSrv
 */
@WebServlet("/UpdateProductSrv")
@MultipartConfig(maxFileSize = 16177215)
public class UpdateProductSrv extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public UpdateProductSrv() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
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
				String prodId = request.getParameter("pid");
				String prodName = request.getParameter("name");
				String prodType = request.getParameter("type");
				String prodInfo = request.getParameter("info");
				double prodPrice = Double.parseDouble(request.getParameter("price"));
				int prodQuantity = Integer.parseInt(request.getParameter("quantity"));

				Part part = request.getPart("image");
				InputStream prodImage = (part != null && part.getSize() > 0) ? part.getInputStream() : null;

				ProductServiceImpl dao = new ProductServiceImpl();
				ProductBean product = new ProductBean();
				product.setProdId(prodId);
				product.setProdName(prodName);
				product.setProdInfo(prodInfo);
				product.setProdPrice(prodPrice);
				product.setProdQuantity(prodQuantity);
				product.setProdType(prodType);
				product.setProdImage(prodImage);

				String status = "";
				if (prodImage != null) {
					// Update everything including image
					ProductBean prevProduct = dao.getProductDetails(prodId);
					status = dao.updateProduct(prevProduct, product);
				} else {
					// Update fields only
					status = dao.updateProductWithoutImage(prodId, product);
				}

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
