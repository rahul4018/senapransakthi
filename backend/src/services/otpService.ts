export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isOtpValid(userOtp: string, realOtp: string, expiry: number) {
  return userOtp === realOtp && Date.now() < expiry;
}
