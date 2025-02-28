/*
* Tell ts to grab request type from express
* add account property using decleration merging
*/

import { Account } from '@prisma/client';
declare global{
    namespace Express{
        interface Request {
            account: Account
        }
    }
}