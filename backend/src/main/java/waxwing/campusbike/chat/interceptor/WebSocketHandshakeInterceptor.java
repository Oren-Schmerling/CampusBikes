package waxwing.campusbike.chat.interceptor;

import java.security.Principal;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import waxwing.campusbike.auth.util.JwtUtil; 

public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private static final Logger log = LoggerFactory.getLogger(WebSocketHandshakeInterceptor.class);

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            String token = servletRequest.getServletRequest().getParameter("token");

            if (token == null || token.trim().isEmpty() || !JwtUtil.validateToken(token)) {
                log.warn("Handshake rejected - Invalid or missing JWT.");
                return false; 
            }
            
            try {
                String username = JwtUtil.getUsernameFromToken(token);
                
                attributes.put("username", username);
                
                Principal authenticatedPrincipal = new Principal() {
                    @Override
                    public String getName() {
                        return username; 
                    }
                };
                
                attributes.put("user", authenticatedPrincipal); 

                log.info("Handshake accepted via JWT for user: {}", username);
                return true; 
                
            } catch (Exception e) {
                log.error("Handshake rejected - Failed to extract username.", e);
                return false;
            }
        }
        
        log.warn("Handshake rejected - Request is not a ServletServerHttpRequest.");
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        if (exception != null) {
            log.error("Handshake failed with exception", exception);
        }
    }
}