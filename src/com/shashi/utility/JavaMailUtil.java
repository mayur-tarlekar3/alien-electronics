package com.shashi.utility;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;
import jakarta.mail.MessagingException;

public class JavaMailUtil {

	public static void sendMail(String recipientMailId) throws MessagingException {
		sendMail(recipientMailId, "Welcome to Alien Electronics", "Hey! " + recipientMailId + ", Thanks  for Signing Up with us!");
	}

	protected static void sendMail(String recipient, String subject, String htmlTextMessage) throws MessagingException {

		System.out.println("Preparing to send Mail via Brevo HTTP REST API");

		ResourceBundle rb = ResourceBundle.getBundle("application");

		String envEmail = System.getenv("MAIL_EMAIL");
		String emailId = (envEmail != null && !envEmail.trim().isEmpty()) ? envEmail : rb.getString("mailer.email");
		if (emailId == null || emailId.trim().isEmpty()) {
			emailId = "aea906001@smtp-brevo.com";
		}

		String envApiKey = System.getenv("BREVO_API_KEY");
		if (envApiKey == null || envApiKey.trim().isEmpty()) {
			envApiKey = System.getenv("MAIL_PASSWORD");
		}
		if (envApiKey == null || envApiKey.trim().isEmpty()) {
			envApiKey = rb.getString("mailer.password");
		}
		if (envApiKey == null || envApiKey.trim().isEmpty()) {
			envApiKey = "z2bCKDYv4M0TAxhV";
		}

		try {
			URL url = new URL("https://api.brevo.com/v3/smtp/email");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("accept", "application/json");
			conn.setRequestProperty("api-key", envApiKey);
			conn.setRequestProperty("content-type", "application/json");
			conn.setDoOutput(true);

			String jsonPayload = "{"
					+ "\"sender\":{\"name\":\"Alien Electronics\",\"email\":\"" + escapeJson(emailId) + "\"},"
					+ "\"to\":[{\"email\":\"" + escapeJson(recipient) + "\"}],"
					+ "\"subject\":\"" + escapeJson(subject) + "\","
					+ "\"htmlContent\":\"" + escapeJson(htmlTextMessage) + "\""
					+ "}";

			try (OutputStream os = conn.getOutputStream()) {
				byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
				os.write(input, 0, input.length);
			}

			int responseCode = conn.getResponseCode();
			if (responseCode >= 200 && responseCode < 300) {
				System.out.println("Message Sent Successfully!");
			} else {
				throw new Exception("Brevo API returned HTTP status code: " + responseCode);
			}

		} catch (Exception exception) {
			Logger.getLogger(JavaMailUtil.class.getName()).log(Level.SEVERE, null, exception);
			throw new MessagingException("Failed to send email via Brevo REST API: " + exception.getMessage(), exception);
		}

	}

	private static String escapeJson(String input) {
		if (input == null) return "";
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < input.length(); i++) {
			char ch = input.charAt(i);
			switch (ch) {
				case '"':
					sb.append("\\\"");
					break;
				case '\\':
					sb.append("\\\\");
					break;
				case '\b':
					sb.append("\\b");
					break;
				case '\f':
					sb.append("\\f");
					break;
				case '\n':
					sb.append("\\n");
					break;
				case '\r':
					sb.append("\\r");
					break;
				case '\t':
					sb.append("\\t");
					break;
				default:
					if (ch < ' ') {
						String hex = Integer.toHexString(ch);
						sb.append("\\u00").append("000".substring(hex.length())).append(hex);
					} else {
						sb.append(ch);
					}
			}
		}
		return sb.toString();
	}
}
