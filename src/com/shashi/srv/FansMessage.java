package com.shashi.srv;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.shashi.utility.MailMessage;

/**
 * Servlet implementation class fansMessage
 */
@WebServlet("/fansMessage")
public class FansMessage extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String name = request.getParameter("name");
		String email = request.getParameter("email");
		String comments = request.getParameter("comments");

		Map<String, String> responseData = new HashMap<>();
		Gson gson = new Gson();

		String htmlTextMessage = "<html>" + "<body>"
				+ "<h2 style='color:green;'>Message to Alien Electronics</h2>" + ""
				+ "Fans Message Received !!<br/><br/> Name: " + name + "," + "<br/><br/> Email Id: " + email
				+ "<br><br/>" + "Comment: " + "<span style='color:grey;'>" + comments + "</span>"
				+ "<br/><br/>We are glad that fans are choosing us! <br/><br/>Thanks & Regards<br/><br/>Auto Generated Mail"
				+ "</body>" + "</html>";
		
		String adminEmail = System.getenv("MAIL_EMAIL");
		if (adminEmail == null || adminEmail.trim().isEmpty()) {
			java.util.ResourceBundle rb = java.util.ResourceBundle.getBundle("application");
			adminEmail = rb.getString("mailer.email");
		}
		
		String message = MailMessage.sendMessage(adminEmail, "Fans Message | " + name + " | " + email,
				htmlTextMessage);
		
		if ("SUCCESS".equals(message)) {
			responseData.put("status", "success");
			responseData.put("message", "Comments Sent Successfully");
		} else {
			responseData.put("status", "error");
			responseData.put("message", "Failed: Please Configure mailer.email and password in application.properties first");
		}

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(gson.toJson(responseData));
	}

}
