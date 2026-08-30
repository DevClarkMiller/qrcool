import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingTypes = await prisma.contentType.findMany({
    select: { Name: true },
  });

  const names = ['Redirect', 'HTML', 'Image', 'Video', 'Audio', 'Text', 'File'];

  for (const name of names) {
    const alreadyExists = existingTypes.some((type) => type.Name === name);

    if (!alreadyExists) {
      await prisma.contentType.create({
        data: { Name: name },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error('Prisma seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
