// Keep your business logic separate from route handlers.
// generate codes / send emails / verify codes

import speakeasy from 'speakeasy';
import {sendEmail} from '../sendEmail';

export function generateEmailCode() 
{
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function verifyEmailCode(user, code) 
{
  const now = new Date();
  return user.twoFactorCode === code && user.twoFactorCodeExpires > now;
}

export function generateTOTPSecret(username: string) 
{
  return speakeasy.generateSecret({ name: `YourApp (${username})` }); //YOU APP NAME
}

export function verifyTOTPCode(secret: string, code: string) 
{
  return speakeasy.totp.verify({ secret, encoding: 'base32', token: code, window: 1 });
}

export async function send2FACodeEmail(email: string, code: string) {
  await sendEmail(email, 'Your 2FA code', `<b>Your code is: ${code}</b>`);
}
