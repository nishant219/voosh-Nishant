import cron from 'node-cron';

interface BlacklistedToken {
  token: string;
  timestamp: number;
}

class TokenBlacklistManager {
  private static instance: TokenBlacklistManager;
  private blacklist: Map<string, BlacklistedToken> = new Map();

  private constructor() {
    // Setup cleanup cron job
    this.setupCleanupCron();
  }

  public static getInstance(): TokenBlacklistManager {
    if (!TokenBlacklistManager.instance) {
      TokenBlacklistManager.instance = new TokenBlacklistManager();
    }
    return TokenBlacklistManager.instance;
  }

  // Add token to the blacklist
  public addToBlacklist(token: string): void {
    this.blacklist.set(token, { token, timestamp: Date.now() });
  }

  // Check if a token is blacklisted
  public isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }

  // Cleanup expired tokens (older than 1 hour)
  private cleanupExpiredTokens(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000; // 1 hour in milliseconds

    for (const [token, tokenInfo] of this.blacklist.entries()) {
      if (tokenInfo.timestamp < oneHourAgo) {
        this.blacklist.delete(token);
      }
    }
    console.log(`Blacklist cleanup complete. Remaining tokens: ${this.blacklist.size}`);
  }

  // Set up a cron job to clean expired tokens every hour
  private setupCleanupCron(): void {
    cron.schedule('0 * * * *', () => {
      this.cleanupExpiredTokens();
    });
  }
}

export default TokenBlacklistManager;
