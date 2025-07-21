import { fastifyMultipart } from "@fastify/multipart";
import * as bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";
import { PROJECT_ROOT } from "../server.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
async function fillUserInArray(parts, reply) {
    const fields = {};
    let avatarFile = null;
    for await (const part of parts) {
        if (part.type === "file" && part.fieldname === "avatar") {
            avatarFile = part;
        }
        else if (part.type === "field") {
            fields[part.fieldname] = part.value;
        }
    }
    const usernameValue = fields.username;
    const passwordValue = fields.password;
    console.log("usernameValue: ", usernameValue);
    console.log("passwordValue: ", passwordValue);
    if (!usernameValue || !passwordValue) {
        reply.code(400).send({
            error: "Invalid user info: missing username or password.",
        });
        return null;
    }
    const hashedPassword = await bcrypt.hash(passwordValue, 10);
    return { usernameValue, passwordValue, hashedPassword, avatarFile };
}
async function saveAvatar(avatarFile, username) {
    console.log("PROJECT_ROOT", PROJECT_ROOT);
    const avatarsDir = path.join(PROJECT_ROOT, "./public/avatars");
    if (!fs.existsSync(avatarsDir)) {
        fs.mkdirSync(avatarsDir, { recursive: true });
    }
    const uploadPath = path.join(avatarsDir, `${username}.png`);
    await pipeline(avatarFile.file, fs.createWriteStream(uploadPath));
    return `./public/avatars/${username}.png`;
}
async function createUser(prisma, username, hashedPassword, avatarPath) {
    console.log("About to create new user");
    console.log("avatarUrl: ", avatarPath);
    // Generate a unique email based on username
    const uniqueEmail = `${username}@transcendme.local`;
    const user = await prisma.user.create({
        data: {
            username,
            passwordHash: hashedPassword,
            email: uniqueEmail,
            avatarUrl: avatarPath || null,
        },
    });
    return user;
}
export async function registerNewUser(app, prisma) {
    app.register(fastifyMultipart);
    app.post("/api/signup", async (request, reply) => {
        const parts = request.parts();
        const userData = await fillUserInArray(parts, reply);
        console.log("userdata: ", userData);
        if (!userData)
            return;
        const { usernameValue, passwordValue, hashedPassword, avatarFile } = userData;
        try {
            let avatarPath = "";
            if (avatarFile)
                avatarPath = await saveAvatar(avatarFile, usernameValue);
            const created = await createUser(prisma, usernameValue, hashedPassword, avatarPath);
            console.log("Created user:", created);
            reply.code(200).send({ success: true });
        }
        catch (err) {
            console.error(err);
            reply
                .code(400)
                .send({ error: "Failed to import User data to the DB" });
        }
    });
}
