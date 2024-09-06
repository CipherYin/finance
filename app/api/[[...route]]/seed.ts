import { Hono } from "hono";
import { exec } from "child_process";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";


const app = new Hono();


app.post("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return new Promise((resolve) => {
    exec("npm run db:seed", (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error}`);
        resolve(c.json({ error: "执行失败" }, 500));
      } else {
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        resolve(c.json({ message: "执行成功" }));
      }
    });
  });
});

export default app;