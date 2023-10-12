function extractToken(bearerToken: string): string {
  console.log('Extracting token');
  const parts = bearerToken.split(' ');

  // console.log("Part 1" + parts[0])
  // console.log("Part 2" + parts[1])

  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1]; // this is your actual token
  } else {
    throw new Error('Bearer token malformed');
  }
}

export { extractToken };
