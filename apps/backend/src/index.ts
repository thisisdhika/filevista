import { cors } from "@elysiajs/cors";
import app from "~/src/controllers/folders";

const port = process.env.PORT || 3000;

app.use(cors());
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
