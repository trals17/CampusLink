import { PrismaClient } from "@prisma/client";

// PrismaClient 인스턴스 생성
const db = new PrismaClient();

// 실제 코드에서는 DB 접근 테스트용 코드를 실행하지 않습니다.
// if (process.env.NODE_ENV === 'development') {
//   db.sMSToken.findUnique({ where: { id: 2 }, include: { user: true } })
//     .then(token => console.log(token))
//     .catch(err => console.error(err));
// }

export default db;
