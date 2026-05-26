package com.shashi.utility;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ResourceBundle;

public class DBUtil {

	public static Connection provideConnection() {
		Connection con = null;
		try {
			ResourceBundle rb = ResourceBundle.getBundle("application");
			
			// Try to get values from Environment Variables first (for Cloud Deployment)
			String envUrl = System.getenv("DB_URL");
			String envUser = System.getenv("DB_USER");
			String envPass = System.getenv("DB_PASS");

			String connectionString = (envUrl != null) ? envUrl : rb.getString("db.connectionString");
			String driverName = rb.getString("db.driverName");
			String username = (envUser != null) ? envUser : rb.getString("db.username");
			String password = (envPass != null) ? envPass : rb.getString("db.password");
			
			try {
				Class.forName(driverName);
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			}
			con = DriverManager.getConnection(connectionString, username, password);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return con;
	}

	public static void closeConnection(Connection con) {
		try {
			if (con != null && !con.isClosed()) {

				con.close();
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void closeConnection(ResultSet rs) {
		try {
			if (rs != null && !rs.isClosed()) {
				try {
					rs.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void closeConnection(PreparedStatement ps) {
		try {
			if (ps != null && !ps.isClosed()) {
				try {
					ps.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
