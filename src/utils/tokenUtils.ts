function extractToken(bearerToken: string): string {
    const parts = bearerToken.split(' ');

    if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];  // this is your actual token
    } else {
        throw new Error('Bearer token malformed');
    }
}

export { extractToken };
