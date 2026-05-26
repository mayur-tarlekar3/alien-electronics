package com.shashi.srv;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.shashi.beans.ProductBean;
import com.shashi.service.impl.ProductServiceImpl;

@WebServlet("/GetProductsSrv")
public class GetProductsSrv extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String type = request.getParameter("type");
        String search = request.getParameter("search");

        ProductServiceImpl productService = new ProductServiceImpl();
        List<ProductBean> products;

        if (search != null && !search.isEmpty()) {
            products = productService.searchAllProducts(search);
        } else if (type != null && !type.isEmpty() && !type.equalsIgnoreCase("all")) {
            products = productService.getAllProductsByType(type);
        } else {
            products = productService.getAllProducts();
        }

        Gson gson = new Gson();
        com.shashi.service.impl.OrderServiceImpl orderService = new com.shashi.service.impl.OrderServiceImpl();
        java.util.List<com.shashi.beans.OrderBean> allOrders = orderService.getAllOrders();

        java.util.List<java.util.Map<String, Object>> productList = new java.util.ArrayList<>();
        for (ProductBean product : products) {
            java.util.Map<String, Object> pMap = new java.util.HashMap<>();
            pMap.put("prodId", product.getProdId());
            pMap.put("prodName", product.getProdName());
            pMap.put("prodType", product.getProdType());
            pMap.put("prodInfo", product.getProdInfo());
            pMap.put("prodPrice", product.getProdPrice());
            pMap.put("prodQuantity", product.getProdQuantity());
            
            // Calculate sold quantity
            int soldQty = allOrders.stream()
                    .filter(o -> o.getProductId().equals(product.getProdId()))
                    .mapToInt(com.shashi.beans.OrderBean::getQuantity)
                    .sum();
            pMap.put("soldQty", soldQty);
            
            productList.add(pMap);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(productList));
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
