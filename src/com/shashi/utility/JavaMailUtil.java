package com.shashi.utility;

import java.util.Properties;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

public class JavaMailUtil {
	public static void sendMail(String recipientMailId) throws MessagingException {

		System.out.println("Preparing to send Mail");
		Properties properties = new Properties();
		properties.put("mail.smtp.host", "smtp-relay.brevo.com");
		properties.put("mail.smtp.port", "587");
		properties.put("mail.smtp.auth", "true");
		properties.put("mail.smtp.starttls.enable", "true");

		ResourceBundle rb = ResourceBundle.getBundle("application");

		String envEmail = System.getenv("MAIL_EMAIL");

		String emailId = (envEmail != null && !envEmail.trim().isEmpty()) ? envEmail : rb.getString("mailer.email");
		if (emailId == null || emailId.trim().isEmpty()) {
			emailId = "aea906001@smtp-brevo.com";
		}

		Session session = Session.getInstance(properties, new Authenticator() {

			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(
					"aea906001@smtp-brevo.com",
					"z2bCKDYv4M0TAxhV"
				);
			}

		});

		Message message = prepareMessage(session, emailId, recipientMailId);

		Transport.send(message);

		System.out.println("Message Sent Successfully!");

	}

	private static Message prepareMessage(Session session, String myAccountEmail, String recipientEmail) {

		try {

			Message message = new MimeMessage(session);

			message.setFrom(new InternetAddress(myAccountEmail));
			message.setRecipient(Message.RecipientType.TO, new InternetAddress(recipientEmail));
			message.setSubject("Welcome to Alien Electronics");
			message.setText("Hey! " + recipientEmail + ", Thanks  for Signing Up with us!");
			return message;

		} catch (Exception exception) {
			Logger.getLogger(JavaMailUtil.class.getName()).log(Level.SEVERE, null, exception);
		}
		return null;

	}

	protected static void sendMail(String recipient, String subject, String htmlTextMessage) throws MessagingException {

		System.out.println("Preparing to send Mail");
		Properties properties = new Properties();
		properties.put("mail.smtp.host", "smtp-relay.brevo.com");
		properties.put("mail.smtp.port", "587");
		properties.put("mail.smtp.auth", "true");
		properties.put("mail.smtp.starttls.enable", "true");

		ResourceBundle rb = ResourceBundle.getBundle("application");

		String envEmail = System.getenv("MAIL_EMAIL");

		String emailId = (envEmail != null && !envEmail.trim().isEmpty()) ? envEmail : rb.getString("mailer.email");
		if (emailId == null || emailId.trim().isEmpty()) {
			emailId = "aea906001@smtp-brevo.com";
		}

		Session session = Session.getInstance(properties, new Authenticator() {

			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(
					"aea906001@smtp-brevo.com",
					"z2bCKDYv4M0TAxhV"
				);
			}

		});

		Message message = prepareMessage(session, emailId, recipient, subject, htmlTextMessage);

		Transport.send(message);

		System.out.println("Message Sent Successfully!");

	}

	private static Message prepareMessage(Session session, String myAccountEmail, String recipientEmail, String subject,
			String htmlTextMessage) {

		try {

			Message message = new MimeMessage(session);

			message.setFrom(new InternetAddress(myAccountEmail));
			message.setRecipient(Message.RecipientType.TO, new InternetAddress(recipientEmail));
			message.setSubject(subject);
			message.setContent(htmlTextMessage, "text/html");
			return message;

		} catch (Exception exception) {
			Logger.getLogger(JavaMailUtil.class.getName()).log(Level.SEVERE, null, exception);
		}
		return null;

	}
}
