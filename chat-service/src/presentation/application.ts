import express, { Response, Request, } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { routes } from '@/infrastructure/routes';
import errorHandler from '@/_lib/utils/middleware/errorHandler';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import chatHandler from '@/infrastructure/database/socket/socketHandler';
import cors from 'cors';

const app: any = express();
const server: http.Server = http.createServer(app);

const FRONTEND_URL = "http://localhost:5173";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
chatHandler(io);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Submission-Service ON!',
  });
});

app.use('/api', routes());
app.use(errorHandler);

export { server };  
