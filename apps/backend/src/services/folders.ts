import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getFolderTree = async (parentId: string | null = null) => {
  const folders = await prisma.folder.findMany({
    where: { parentId: parentId },
    include: {
      children: true,
    },
  });

  for (const folder of folders) {
    folder.children = await getFolderTree(folder.id);
  }

  return folders;
};
