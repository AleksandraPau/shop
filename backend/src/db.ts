import { PrismaClient } from '@prisma/client';

// Создаем экземпляр Prisma Client. 
// В контексте Prisma он сам управляет пулом соединений под капотом.
const prisma = new PrismaClient();

// Если сервер ожидает именно "pool" (например, для совместимости с pg)
// Но чаще всего в Prisma-проектах экспортируют сам клиент:
export const pool = prisma; 

export default prisma;
