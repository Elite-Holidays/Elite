import fetch from 'node-fetch';

/**
 * Middleware to verify Clerk authentication token
 * This checks if the user is authenticated before allowing access to protected routes
 */
export const requireAuth = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }
    
    try {
      // Verify the token with Clerk's session verification endpoint
      const response = await fetch('https://api.clerk.com/v1/session-tokens/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      
      if (!response.ok) {
        console.error('Clerk API error:', await response.text());
        return res.status(401).json({ error: 'Invalid authentication token' });
      }
      
      const userData = await response.json();
      
      // Add the user data to the request object
      req.user = userData.payload;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};
