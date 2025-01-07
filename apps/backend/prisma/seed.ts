import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create root folders
  const folderA = await prisma.folder.create({
    data: { name: "Folder A", parentId: null },
  });

  const folderB = await prisma.folder.create({
    data: { name: "Folder B", parentId: null },
  });

  // Create subfolders
  const folderA1 = await prisma.folder.create({
    data: { name: "Folder A1", parentId: folderA.id },
  });

  const folderA2 = await prisma.folder.create({
    data: { name: "Folder A2", parentId: folderA.id },
  });

  const folderB1 = await prisma.folder.create({
    data: { name: "Folder B1", parentId: folderB.id },
  });

  const folderA1a = await prisma.folder.create({
    data: { name: "Folder A1a", parentId: folderA1.id },
  });

  // Create files in folders
  await prisma.file.createMany({
    data: [
      { name: "File 1 in Folder A", size: 1024, folderId: folderA.id },
      { name: "File 2 in Folder A", size: 2048, folderId: folderA.id },
      { name: "File 1 in Folder A1", size: 512, folderId: folderA1.id },
      { name: "File 1 in Folder B1", size: 1024, folderId: folderB1.id },
      { name: "File 1 in Folder A1a", size: 1024, folderId: folderA1a.id },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
