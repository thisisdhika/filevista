import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { getFolderTree } from "@/services/folders";

const prisma = new PrismaClient();

const app = new Elysia();

app.get("/api/folders", async ({ set }) => {
  try {
    const folders = await getFolderTree();
    set.status = 200;
    return folders;
  } catch (error) {
    set.status = 500;
    return {
      error: error instanceof Error ? error.message : "Failed to fetch folders",
    };
  }
});

app.get("/api/folders/:id", async ({ params, set }) => {
  try {
    const { id } = params;
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: { children: true },
    });
    const files = await prisma.file.findMany({
      where: { folderId: id },
    });

    if (!folder) {
      set.status = 404;
      return { error: "Folder not found" };
    }

    set.status = 200;
    return { folder, files };
  } catch (error) {
    set.status = 500;
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch folder data",
    };
  }
});

app.post("/api/folders", async ({ body, set }) => {
  try {
    const { name, parentId } = body as { name: string; parentId?: string };
    const newFolder = await prisma.folder.create({
      data: {
        name,
        parentId,
      },
    });
    set.status = 201;
    return newFolder;
  } catch (error) {
    set.status = 500;
    return {
      error: error instanceof Error ? error.message : "Failed to create folder",
    };
  }
});

app.put("/api/folders/:id", async ({ params, body, set }) => {
  try {
    const { id } = params;
    const { name } = body as { name: string };
    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: { name },
    });
    set.status = 200;
    return updatedFolder;
  } catch (error) {
    set.status = 500;
    return {
      error: error instanceof Error ? error.message : "Failed to update folder",
    };
  }
});

app.delete("/api/folders/:id", async ({ params, set }) => {
  try {
    const { id } = params;

    await prisma.file.deleteMany({
      where: { folderId: id },
    });

    const deleteFolderRecursively = async (folderId: string) => {
      const subfolders = await prisma.folder.findMany({
        where: { parentId: folderId },
      });

      for (const subfolder of subfolders) {
        await deleteFolderRecursively(subfolder.id);
      }

      await prisma.folder.delete({ where: { id: folderId } });
    };

    await deleteFolderRecursively(id);
    set.status = 204;
    return "Folder deleted successfully";
  } catch (error) {
    set.status = 500;
    return {
      error: error instanceof Error ? error.message : "Failed to delete folder",
    };
  }
});

app.post("/api/files", async ({ body, set }) => {
  try {
    const { name, size, folderId } = body as {
      name: string;
      size: number;
      folderId: string;
    };
    const newFile = await prisma.file.create({
      data: {
        name,
        size,
        folderId,
      },
    });
    set.status = 201;
    return newFile;
  } catch (error) {
    set.status = 500;
    return {
      error: error instanceof Error ? error.message : "Failed to create file",
    };
  }
});

app.delete("/api/files/:id", async ({ params, set }) => {
  try {
    const { id } = params;
    await prisma.file.delete({
      where: { id },
    });
    set.status = 204;
    return "File deleted successfully";
  } catch (error) {
    set.status = 500;
    return {
      error: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
});

export default app;
