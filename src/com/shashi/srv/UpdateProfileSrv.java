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
import com.shashi.beans.UserBean;
import com.shashi.service.impl.UserServiceImpl;

@WebServlet("/UpdateProfileSrv")
public class UpdateProfileSrv extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        String userName = (String) session.getAttribute("username");
        String usertype = (String) session.getAttribute("usertype");

        Map<String, Object> responseData = new HashMap<>();
        Gson gson = new Gson();

        if (userName == null || usertype == null || !usertype.equalsIgnoreCase("customer")) {
            responseData.put("status", "error");
            responseData.put("message", "Session Expired, Login Again!");
        } else {
            try {
                String name = request.getParameter("name");
                Long mobile = Long.parseLong(request.getParameter("mobile"));
                String email = request.getParameter("email");
                String address = request.getParameter("address");
                int pincode = Integer.parseInt(request.getParameter("pincode"));
                String password = request.getParameter("password");

                UserBean user = new UserBean(name, mobile, email, address, pincode, password);
                UserServiceImpl userService = new UserServiceImpl();
                String status = userService.updateUserProfile(user);

                if (status.contains("Successfully")) {
                    responseData.put("status", "success");
                    // Update session data
                    session.setAttribute("userdata", user);
                    session.setAttribute("password", password);
                } else {
                    responseData.put("status", "error");
                }
                responseData.put("message", status);
                responseData.put("user", user);

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
        doGet(request, response);
    }
}
