import "../dist/package-DpScpvTA.js";
import "../dist/deprecations-pLmw6Ytd.js";
import "../dist/shared-schemas-BmG5ARoX.js";
import { UTFiles, UTRegion, createBuilder, makeAdapterHandler } from "../dist/upload-builder-BlFOAnsv.js";
import { toWebRequest } from "../dist/to-web-request-DhP0wXG-.js";
import * as Effect from "effect/Effect";

//#region src/fastify.ts
const createUploadthing = (opts) => createBuilder(opts);
const createRouteHandler = (fastify, opts, done) => {
	const handler = makeAdapterHandler((req, res) => Effect.succeed({
		req,
		res
	}), (req) => toWebRequest(req), opts, "fastify");
	fastify.all("/api/uploadthing", async (req, res) => {
		const response = await handler(req, res);
		return res.status(response.status).headers(Object.fromEntries(response.headers)).send(response.body);
	});
	done();
};

//#endregion
export { UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.js.map