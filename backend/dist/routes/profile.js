import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import bcrypt from "bcrypt";
import { PROJECT_ROOT } from "../server.js";
function getFieldValue(field) {
    if (!field)
        return undefined;
    if (Array.isArray(field))
        field = field[0];
    if (typeof field.value === "string")
        return field.value;
    if (Buffer.isBuffer(field.value))
        return field.value.toString();
    return undefined;
}
export async function registerProfileRoute(app, prisma) {
    app.get("/api/profile", async (request, reply) => {
        const username = request.query.username; // RECUPERER LE USERNAME DU JWT
        if (!username) {
            reply.status(400).send({ error: "Username is required" });
            return;
        }
        const { code, data } = await getUserInfo(username, prisma);
        reply.status(code).send(data);
    });
    // HANDLE AVATAR REQUEST
    app.post("/api/profile/avatar", async (request, reply) => {
        const file = await request.file();
        console.log("file: ", file);
        if (!file) {
            reply.status(400).send({ error: "Avatar file is required" });
            return;
        }
        const username = getFieldValue(file.fields.username);
        console.log("username: ", username);
        if (!username) {
            reply.status(400).send({ error: "Username is required" });
            return;
        }
        const avatarPath = await updateAvatar(prisma, username, file.file);
        reply.status(200).send({ success: true, avatarPath });
    });
    // HANDLE USERNAME REQUEST
    app.post("/api/profile/username", async (request, reply) => {
        const { username, newUsername } = request.body; // RECUPERER LE USERNAME DU JWT
        if (!username) {
            reply.status(400).send({ error: "Username is required" });
            return;
        }
        try {
            await updateUsername(prisma, username, newUsername);
            reply.status(200).send({ success: true });
        }
        catch (err) {
            reply.status(400).send({
                error: "Username already exists or update failed",
            });
        }
    });
    // HANDLE PASSWORD REQUEST
    app.post("/api/profile/password", async (request, reply) => {
        const { username, newPassword } = request.body; // RECUPERER LE USERNAME DU JWT
        if (!username) {
            reply.status(400).send({ error: "Username is required" });
            return;
        }
        try {
            await updatePassword(prisma, username, newPassword);
            reply.status(200).send({ success: true });
        }
        catch (err) {
            reply.status(400).send({ error: "Update failed" });
        }
    });
    // HANDLE MATCH HISTORY DISPLAY
    app.get("/api/profile/matches", async (request, reply) => {
        const username = request.query.username;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            reply.status(404).send({ error: "User not found" });
        }
        else {
            const matches = await prisma.match.findMany({
                where: {
                    OR: [{ player1Id: user.id }, { player2Id: user.id }],
                },
                orderBy: { playedAt: "desc" },
                include: {
                    player1: { select: { username: true } },
                    player2: { select: { username: true } },
                },
            });
            console.log("Matches : ", matches);
            reply.status(200).send(matches);
        }
    });
}
async function getUserInfo(username, prisma) {
    if (!username) {
        return { code: 401, data: { error: "Not authenticated" } };
    }
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            avatarUrl: true,
            passwordHash: true,
            gamesPlayed: true,
            wins: true,
            losses: true,
        },
    });
    if (!user) {
        return { code: 404, data: { error: "User not found" } };
    }
    return { code: 200, data: user };
}
async function updateUsername(prisma, username, newUsername) {
    await prisma.user.update({
        where: { username },
        data: { username: newUsername },
    });
}
async function updatePassword(prisma, username, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { username },
        data: { passwordHash: hashedPassword },
    });
}
// async function updateAvatar(prisma: PrismaClient, username: string, file: any): Promise<string> {
// 	const uploadPath = path.join(PROJECT_ROOT, "./public/avatars", `${username}.png`);
// 	console.log("uploadPath: ", uploadPath);
// 	await pipeline(file, fs.createWriteStream(uploadPath));
// 	if (fs.existsSync(uploadPath)) {
// 		console.log("✅ Fichier sauvegardé avec succès");
// 		const stats = fs.statSync(uploadPath);
// 		console.log("📁 Taille du fichier:", stats.size, "bytes");
// 	} else {
// 		console.log("❌ Fichier non trouvé après sauvegarde");
// 	}
// 	const avatarPath = `/avatars/${username}.png`;
// 	console.log("avatarPath: ", avatarPath);
// 	await prisma.user.update({
// 		where: { username },
// 		data: { avatarUrl: avatarPath }
// 	});
// 	return avatarPath;
// }
async function updateAvatar(prisma, username, file) {
    const fileExtension = path.extname(file.filename) || ".png";
    const uploadPath = path.join(PROJECT_ROOT, "./public/avatars", `${username}${fileExtension}`);
    console.log("uploadPath: ", uploadPath);
    await pipeline(file, fs.createWriteStream(uploadPath));
    if (fs.existsSync(uploadPath)) {
        console.log("✅ Fichier sauvegardé avec succès");
        const stats = fs.statSync(uploadPath);
        console.log("📁 Taille du fichier:", stats.size, "bytes");
    }
    // 🔥 CHANGEMENT : Le chemin doit correspondre à la configuration static
    const avatarPath = `/public/avatars/${username}${fileExtension}`;
    console.log("avatarPath: ", avatarPath);
    await prisma.user.update({
        where: { username },
        data: { avatarUrl: avatarPath },
    });
    return avatarPath;
}
