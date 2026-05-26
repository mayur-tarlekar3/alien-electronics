package com.shashi.srv;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.shashi.service.impl.OrderServiceImpl;
import com.shashi.service.impl.ProductServiceImpl;
import com.shashi.service.impl.DemandServiceImpl;

@WebServlet("/GetAdminStatsSrv")
public class GetAdminStatsSrv extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        String userType = (String) session.getAttribute("usertype");

        Map<String, Object> responseData = new HashMap<>();
        Gson gson = new Gson();

        if (userType == null || !userType.equals("admin")) {
            responseData.put("status", "error");
            responseData.put("message", "Access Denied!");
        } else {
            OrderServiceImpl orderService = new OrderServiceImpl();
            ProductServiceImpl productService = new ProductServiceImpl();
            DemandServiceImpl demandService = new DemandServiceImpl();
            
            // Basic stats
            int totalOrders = orderService.getAllOrders().size();
            int totalProducts = productService.getAllProducts().size();
            int totalDemands = demandService.getAllDemands().size();
            
            // Count pending orders
            long pendingOrders = orderService.getAllOrders().stream()
                    .filter(o -> o.getShipped() == 0).count();
            
            // Count shipped orders
            long shippedOrders = orderService.getAllOrders().stream()
                    .filter(o -> o.getShipped() == 1).count();

            // Count delivered orders
            long deliveredOrders = orderService.getAllOrders().stream()
                    .filter(o -> o.getShipped() == 2).count();
            
            responseData.put("status", "success");
            responseData.put("totalOrders", totalOrders);
            responseData.put("totalProducts", totalProducts);
            responseData.put("totalDemands", totalDemands);
            responseData.put("pendingOrders", pendingOrders);
            responseData.put("shippedOrders", shippedOrders);
            responseData.put("deliveredOrders", deliveredOrders);
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
