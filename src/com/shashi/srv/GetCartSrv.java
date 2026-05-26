package com.shashi.srv;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
import com.shashi.utility.DBUtil;

@WebServlet("/GetCartSrv")
public class GetCartSrv extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        String userName = (String) session.getAttribute("username");
        String password = (String) session.getAttribute("password");

        Map<String, Object> responseData = new HashMap<>();
        Gson gson = new Gson();

        if (userName == null || password == null) {
            responseData.put("status", "error");
            responseData.put("message", "Session Expired, Login Again!");
        } else {
            // JOIN usercart with product table so frontend gets prodName + prodPrice
            List<Map<String, Object>> enrichedItems = new ArrayList<>();
            double total = 0;
            int count = 0;

            Connection con = DBUtil.provideConnection();
            PreparedStatement ps = null;
            ResultSet rs = null;

            try {
                ps = con.prepareStatement(
                    "SELECT c.prodid, c.quantity, p.pname, p.pprice, p.ptype, p.pinfo " +
                    "FROM usercart c " +
                    "INNER JOIN product p ON c.prodid = p.pid " +
                    "WHERE c.username = ?"
                );
                ps.setString(1, userName);
                rs = ps.executeQuery();

                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    String prodId = rs.getString("prodid");
                    int    qty    = rs.getInt("quantity");
                    double price  = rs.getDouble("pprice");

                    item.put("prodId",    prodId);
                    item.put("quantity",  qty);
                    item.put("prodName",  rs.getString("pname"));
                    item.put("prodPrice", price);
                    item.put("prodType",  rs.getString("ptype"));
                    item.put("prodInfo",  rs.getString("pinfo"));

                    enrichedItems.add(item);
                    total += price * qty;
                    count += qty;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                DBUtil.closeConnection(con);
                DBUtil.closeConnection(ps);
                DBUtil.closeConnection(rs);
            }

            responseData.put("status", "success");
            responseData.put("items",  enrichedItems);
            responseData.put("total",  total);
            responseData.put("count",  count);
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
