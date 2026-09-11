import { PrismaClient } from '@prisma/client';
import { PrismockClient } from 'prismock';
import { AppContext } from 'src/AppContext';

export const seed = async () => {
    // Swap in an in-memory Prisma client before any DAOs are constructed,
    // since DAOs capture the model delegate off AppContext.DB at construction time.
    AppContext.DB = new PrismockClient() as unknown as PrismaClient;

    const seededAccount = await AppContext.DB.account.create({
        data: {
            Username: 'test_user',
            Email: 'test@example.com',
            Password: 'not-a-real-hash',
            IsActive: true,
        },
    });

    const seededEntry = await AppContext.DB.entry.create({
        data: {
            AccountId: seededAccount.Id,
            Name: 'Test Entry',
        },
    });

    const seededContentType = await AppContext.DB.contentType.create({
        data: { Name: 'Test Content Type' },
    });

    const seededContent = await AppContext.DB.content.create({
        data: {
            Name: 'Test Content',
            Text: 'Test content text',
            ContentTypeId: seededContentType.Id,
        },
    });

    await AppContext.DB.entryView.create({
        data: {
            EntryId: seededEntry.Id,
            ContentId: seededContent.Id,
            Latitude: 42.991616,
            Longitude: -81.3039616,
        },
    });
}