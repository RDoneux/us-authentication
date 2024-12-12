import { Request, Response, Router } from 'express';
import { userRepository } from '../repositories/user.repository';
import { compare } from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { TokenType } from '../globals/types';
import { User } from '../entities/user.entity';
import { errorLog, infoLog } from '../globals/logging-globals';
import { tokenRepository } from '../repositories/token.repository';

const authenticationController = Router();

authenticationController.post('/login', login);
authenticationController.post('/refresh-token', refreshToken);

async function login(request: Request, response: Response) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      infoLog('no auth header');
      response.status(401).json({ message: 'Missing or invalid Authorization header' });
      return;
    }
    infoLog('past auth header');
    // Extract and decode credentials
    const { username, password } = extractAndDecodeBasicCredentials(authHeader);

    const user: User | null = await userRepository.findOne({ where: { username } });
    if (!user) {
      infoLog('no user');
      response.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    infoLog('past user');

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      infoLog('invalid password');
      response.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    infoLog('past password');

    const { access_token, refresh_token } = await generateTokens(username);
    infoLog('login success');

    response.status(200).json({
      accessToken: access_token,
      refreshToken: refresh_token,
      token_type: 'Bearer',
      expires_in: 900,
    });
  } catch (error) {
    response.status(500).json(error);
  }
}

async function refreshToken(request: Request, response: Response) {
  try {
    const authHeader = request.headers.authorization?.split('Bearer ')[1];
    const secret = process.env.REFRESH_SECRET;

    if (!authHeader || !secret) {
      response.status(401).json('authHeader or refresh secret missing');
      return;
    }

    const { username, type } = verify(authHeader, secret) as JwtPayload;

    const tokenUsed = await tokenRepository.findOne({ where: { token: authHeader } });
    if (tokenUsed) {
      response.status(401).json({ message: 'Token has already been used' });
      return;
    }

    if (type !== TokenType.REFRESH) {
      response.status(401).json({ message: 'Invalid token' });
    }

    const { access_token, refresh_token } = await generateTokens(username);
    // Save refresh token to database
    await tokenRepository.save({ token: authHeader });

    response.status(200).json({
      accessToken: access_token,
      refreshToken: refresh_token,
      token_type: 'Bearer',
      expires_in: 900,
    });
  } catch (error) {
    response.status(500).json(error);
  }
}

async function generateTokens(username: string) {
  if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
    errorLog('Missing secret');
  }
  const access_token = sign(
    { username, type: TokenType.ACCESS },
    process.env.ACCESS_SECRET as string,
    { expiresIn: '15m' }
  );
  const refresh_token = sign(
    { username, type: TokenType.REFRESH },
    process.env.REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );
  return { access_token, refresh_token };
}

function extractAndDecodeBasicCredentials(authHeader: string): {
  username: string;
  password: string;
} {
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  return { username, password };
}

// async function hashPassword(password: string) {
//   try {
//     const saltRounds = 10; // Higher is more secure but slower
//     const hashedPassword = await hash(password, saltRounds);
//     return hashedPassword;
//   } catch (error) {
//     console.error('Error hashing password:', error);
//     throw error;
//   }
// }

export default authenticationController;
