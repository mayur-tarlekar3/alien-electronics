package com.shashi.srv;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.shashi.beans.DemandBean;
import com.shashi.service.impl.DemandServiceImpl;

@WebServlet("/GetDemandSrv")
public class GetDemandSrv extends HttpServlet {
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
            DemandServiceImpl demandService = new DemandServiceImpl();
            List<DemandBean> demands = demandService.getAllDemands();
            
            responseData.put("status", "success");
            responseData.put("demands", demands);
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
