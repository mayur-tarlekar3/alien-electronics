package com.shashi.utility;

import jakarta.mail.MessagingException;

public class MailMessage {
	public static void registrationSuccess(String emailId, String name) {
		String recipient = emailId;
		String subject = "Registration Successfull";
		String htmlTextMessage = "" + "<html>" + "<body>"
				+ "<h2 style='color:green;'>Welcome to Alien Electronics</h2>" + "" + "Hi " + name + ","
				+ "<br><br>Thanks for singing up with Alien Electronics.<br>"
				+ "We are glad that you choose us. We invite you to check out our latest collection of new electonics appliances."
				+ "<br>We are providing upto 60% OFF on most of the electronic gadgets. So please visit our site and explore the collections."
				+ "<br><br>Our Online electronics is growing in a larger amount these days and we are in high demand so we thanks all of you for "
				+ "making us up to that level. We Deliver Product to your house with no extra delivery charges and we also have collection of most of the"
				+ "branded items.<br><br>As a Welcome gift for our New Customers we are providing additional 10% OFF Upto 500 Rs for the first product purchase. "
				+ "<br>To avail this offer you only have "
				+ "to enter the promo code given below.<br><br><br> PROMO CODE: " + "ALIEN500<br><br><br>"
				+ "Have a good day!<br>" 
                + "<p style='font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; margin-top: 40px;'>"
                + "This is an automated message from <strong>Alien Electronics</strong>. All rights reserved."
                + "</p>"
                + "</body>" + "</html>";
		try {
			JavaMailUtil.sendMail(recipient, subject, htmlTextMessage);
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void transactionSuccess(String recipientEmail, String name, String transId, double transAmount) {
		String recipient = recipientEmail;
		String subject = "Order Placed Successfully - Alien Electronics";
		String htmlTextMessage = "<html>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>" +
                "<h2 style='color: #4f46e5;'>Hey " + name + "!</h2>" +
                "<p>We're excited to let you know that your order has been received and is now being processed.</p>" +
                "<div style='background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;'>" +
                "<h3 style='margin-top: 0;'>Order Summary</h3>" +
                "<p style='margin: 5px 0;'><strong>Order ID:</strong> <span style='color: #4f46e5;'>" + transId + "</span></p>" +
                "<p style='margin: 5px 0;'><strong>Amount Paid:</strong> <span style='color: #10b981;'>&#8377;" + transAmount + "</span></p>" +
                "</div>" +
                "<p>Thank you for choosing <strong>Alien Electronics</strong>. We'll notify you as soon as your items are shipped!</p>" +
                "<p style='font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; margin-top: 40px;'>" +
                "<strong>Note:</strong> This is a transaction notification from a demonstration environment. No real funds have been captured.<br/>" +
                "&copy; 2024 Alien Electronics. All rights reserved." +
                "</p>" +
                "</div>" +
                "</body>" +
                "</html>";

		try {
			JavaMailUtil.sendMail(recipient, subject, htmlTextMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public static void orderShipped(String recipientEmail, String name, String transId, double transAmount) {
		String recipient = recipientEmail;
		String subject = "Your Order has been Shipped! - Alien Electronics";
		String htmlTextMessage = "<html>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>" +
                "<h2 style='color: #4f46e5;'>Great News, " + name + "!</h2>" +
                "<p>Your order is on its way! We've handed it off to our delivery partner.</p>" +
                "<div style='background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;'>" +
                "<h3 style='margin-top: 0;'>Shipment Details</h3>" +
                "<p style='margin: 5px 0;'><strong>Order ID:</strong> <span style='color: #4f46e5;'>" + transId + "</span></p>" +
                "<p style='margin: 5px 0;'><strong>Amount:</strong> <span style='color: #10b981;'>&#8377;" + transAmount + "</span></p>" +
                "<p style='margin: 5px 0;'><strong>Status:</strong> <span style='color: #fbbf24;'>Shipped & In Transit</span></p>" +
                "</div>" +
                "<p>Thank you for shopping with <strong>Alien Electronics</strong>. We hope you enjoy your new gadget!</p>" +
                "<p style='font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; margin-top: 40px;'>" +
                "<strong>Note:</strong> This is a shipping notification from a demonstration environment. No real shipment has been dispatched.<br/>" +
                "&copy; 2024 Alien Electronics. All rights reserved." +
                "</p>" +
                "</div>" +
                "</body>" +
                "</html>";

		try {
			JavaMailUtil.sendMail(recipient, subject, htmlTextMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public static void orderDelivered(String recipientEmail, String name, String transId, double transAmount) {
		String recipient = recipientEmail;
		String subject = "Order Delivered Successfully! - Alien Electronics";
		String htmlTextMessage = "<html>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>" +
                "<h2 style='color: #10b981;'>Delivered!</h2>" +
                "<p>Hey " + name + ", your order has been successfully delivered. We hope it's everything you expected!</p>" +
                "<div style='background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;'>" +
                "<h3 style='margin-top: 0;'>Delivery Summary</h3>" +
                "<p style='margin: 5px 0;'><strong>Order ID:</strong> <span style='color: #4f46e5;'>" + transId + "</span></p>" +
                "<p style='margin: 5px 0;'><strong>Amount:</strong> <span style='color: #10b981;'>&#8377;" + transAmount + "</span></p>" +
                "<p style='margin: 5px 0;'><strong>Status:</strong> <span style='color: #10b981;'>Successfully Delivered</span></p>" +
                "</div>" +
                "<p>If you have any questions, feel free to contact us. Thanks for being a valued customer of <strong>Alien Electronics</strong>!</p>" +
                "<p style='font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; margin-top: 40px;'>" +
                "<strong>Note:</strong> This is a delivery confirmation from a demonstration environment.<br/>" +
                "&copy; 2024 Alien Electronics. All rights reserved." +
                "</p>" +
                "</div>" +
                "</body>" +
                "</html>";

		try {
			JavaMailUtil.sendMail(recipient, subject, htmlTextMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public static void productAvailableNow(String recipientEmail, String name, String prodName, String prodId) {
		String recipient = recipientEmail;
		String subject = "Product " + prodName + " is Now Available at Alien Electronics";
		String htmlTextMessage = "<html>" + "  <body>" + "    <p>" + "      Hey " + name + ",<br/><br/>"
				+ "      We are glad that you shop with Alien Electronics!" + "      <br/><br/>"
				+ "      As per your recent browsing history, we seen that you were searching for an item that was not available in sufficient amount"
				+ " at that time. <br/><br/>"
				+ "We are glad to say that the product named <font style=\"color:green;font-weight:bold;\">" + prodName
				+ "</font> with " + "product Id <font style=\"color:green;font-weight:bold;\">" + prodId
				+ "</font> is now available to shop in our store!"
				+ "<br/><h6>Please Note that this is a demo projet Email and you have not made any real transaction with us and not ordered anything till now!</h6>"
				+ "      <br/>" + "      Here is The product detail which is now available to shop:<br/>"
				+ "      <br/>"
				+ "      <font style=\"color:red;font-weight:bold;\">Product Id: </font><font style=\"color:green;font-weight:bold;\">"
				+ prodId + " " + "      </font><br/>" + "      <br/>"
				+ "      <font style=\"color:red;font-weight:bold;\">Product Name: </font> <font style=\"color:green;font-weight:bold;\">"
				+ prodName + "</font>" + "      <br/><br/>" + "      Thanks for shopping with us!<br/><br/>"
				+ "      Come Shop Again! <br/<br/><br/> <font style=\"color:green;font-weight:bold;\">Alien Electronics.</font>"
				+ "    </p>" + "    " + "  </body>" + "</html>";

		try {
			JavaMailUtil.sendMail(recipient, subject, htmlTextMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public static String sendMessage(String toEmailId, String subject, String htmlTextMessage) {
		try {
			JavaMailUtil.sendMail(toEmailId, subject, htmlTextMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
			return "FAILURE";
		}
		return "SUCCESS";
	}
}
