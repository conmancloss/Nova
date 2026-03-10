// Dev server imports
import { createBareServer } from "@nebula-services/bare-server-node";
import { createServer } from "http";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

//transports
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { chmodSync, writeFileSync } from "fs";

const bare = createBareServer("/bare/", {
	logErrors: true,
	blockLocal: false,
});

wisp.options.allow_loopback_ips = true;
wisp.options.allow_private_ips = true;

const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer()
			.on("request", (req, res) => {
				// Scramjet requires COEP/COOP on ALL routes to enable SharedArrayBuffer
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
				res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

				// Allow service worker to control the full origin scope
				if (req.url === "/sw.js") {
					res.setHeader("Service-Worker-Allowed", "/");
				}

				if (bare.shouldRoute(req)) {
					bare.routeRequest(req, res);
				} else {
					handler(req, res);
				}
			})
			.on("upgrade", (req, socket, head) => {
				if (bare.shouldRoute(req)) {
					bare.routeUpgrade(req, socket, head);
				} else {
					wisp.routeRequest(req, socket, head);
				}
			});
	},
});

fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "../static"),
	decorateReply: false,
	index: ["index.html"],
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./dist"),
	prefix: "/scram/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./assets"),
	prefix: "/scramjet-assets/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: baremuxPath,
	prefix: "/baremux/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: epoxyPath,
	prefix: "/epoxy/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: libcurlPath,
	prefix: "/libcurl/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: bareModulePath,
	prefix: "/baremod/",
	decorateReply: false,
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) || 1337 : 1337;

fastify.get('/debug', async (request, reply) => {
	const { readdirSync, existsSync } = await import('fs');
	const staticPath = join(fileURLToPath(new URL(".", import.meta.url)), "../static");
	const appContents = existsSync("/app") ? readdirSync("/app") : ["no /app"];
	const staticExists = existsSync(staticPath);
	const staticContents = staticExists ? readdirSync(staticPath) : ["not found"];
	return { staticPath, staticExists, staticContents, appContents, cwd: process.cwd() };
});

fastify.listen({
	port: PORT,
	host: "0.0.0.0",
});

fastify.setNotFoundHandler((request, reply) => {
	if (request.url === "/" || request.url === "") {
		return reply.sendFile("index.html");
	}
	console.error("PAGE PUNCHED THROUGH SW - " + request.url);
	reply.code(593).send("punch through");
});

console.log(`Listening on http://localhost:${PORT}/`);

// Only run the dev watcher locally, never on Railway or CI
const isDev = !process.env.RAILWAY_ENVIRONMENT && !process.env.CI;
if (isDev) {
	try {
		writeFileSync(
			".git/hooks/pre-commit",
			"pnpm format\ngit update-index --again"
		);
		chmodSync(".git/hooks/pre-commit", 0o755);
	} catch {}

	const { default: rspackConfig } = await import("./rspack.config.js");
	const { rspack } = await import("@rspack/core");
	const compiler = rspack(rspackConfig);
	compiler.watch({}, (err, stats) => {
		console.log(
			stats
				? stats.toString({
						preset: "minimal",
						colors: true,
						version: false,
					})
				: ""
		);
	});
}
