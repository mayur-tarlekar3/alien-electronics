package com.shashi.srv;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * CORS filter — allows cross-origin requests from the React dev server.
 * Ensures session cookies (JSESSIONID) are allowed across origins.
 */
@WebFilter("/*")
public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  httpReq = (HttpServletRequest)  request;
        HttpServletResponse httpRes = (HttpServletResponse) response;

        String origin = httpReq.getHeader("Origin");
        
        // Always allow credentials for cross-origin requests
        httpRes.setHeader("Access-Control-Allow-Credentials", "true");
        
        // Set Access-Control-Allow-Origin to the requesting origin instead of *
        if (origin != null) {
            httpRes.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            // Fallback for requests without Origin header (like direct browser hits)
            httpRes.setHeader("Access-Control-Allow-Origin", "*");
        }

        httpRes.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpRes.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
        httpRes.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
        httpRes.setHeader("Access-Control-Max-Age", "3600");

        // Handle pre-flight OPTIONS request
        if ("OPTIONS".equalsIgnoreCase(httpReq.getMethod())) {
            httpRes.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
