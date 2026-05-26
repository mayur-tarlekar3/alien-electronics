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
import com.shashi.service.impl.UserServiceImpl;
import com.shashi.utility.MailMessage;

@WebServlet("/DeliveredServlet")
public class DeliveredServlet extends HttpServlet {
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
            String orderId = request.getParameter("orderid");
            String prodId = request.getParameter("prodid");
            String userName = request.getParameter("userid");
            double amount = 0.0;
            try {
                amount = Double.parseDouble(request.getParameter("amount"));
            } catch (Exception e) {}
            
            String status = new OrderServiceImpl().markAsDelivered(orderId, prodId);
            
            if ("FAILURE".equalsIgnoreCase(status)) {
                responseData.put("status", "error");
                responseData.put("message", "Failed to mark as delivered.");
            } else {
                final String fUserName = userName;
                final String fOrderId = orderId;
                final double fAmount = amount;
                new Thread(() -> {
                    MailMessage.orderDelivered(fUserName, new UserServiceImpl().getFName(fUserName), fOrderId, fAmount);
                }).start();
                responseData.put("status", "success");
                responseData.put("message", status);
            }
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
