import { Server, Socket } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import {prisma} from '../db';

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

