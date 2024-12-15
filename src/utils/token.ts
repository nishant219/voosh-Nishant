import jwt from "jsonwebtoken";
import 'dotenv/config';

// Generate Access and Refresh Tokens
function createTokens(user: any) {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default-access-secret';
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret';

  const claims = { user };

  const accessToken = jwt.sign(claims, accessTokenSecret, {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
  });

  const refreshToken = jwt.sign(claims, refreshTokenSecret, {
    algorithm: "HS256",
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  });

  return { accessToken, refreshToken };
}

// Verify Token
function verifyToken(token: string, isAccessToken = true): any {
  try {
    const secret = isAccessToken
      ? process.env.ACCESS_TOKEN_SECRET || 'default-access-secret'
      : process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret';

    return jwt.verify(token, secret, { algorithms: ["HS256"] });
  } catch (err) {
    return null; // Return null for failed verification
  }
}

export { createTokens, verifyToken };
