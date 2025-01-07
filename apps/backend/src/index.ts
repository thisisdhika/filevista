import { cors } from "@elysiajs/cors";
import app from "~/src/controllers/folders";

app.use(cors());
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
