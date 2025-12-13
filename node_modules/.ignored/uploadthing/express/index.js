import "../dist/package-DpScpvTA.js";
import "../dist/deprecations-pLmw6Ytd.js";
import "../dist/shared-schemas-BmG5ARoX.js";
import { UTFiles, UTRegion, createBuilder, makeAdapterHandler } from "../dist/upload-builder-BlFOAnsv.js";
import { getPostBody, toWebRequest } from "../dist/to-web-request-DhP0wXG-.js";
import * as Effect from "effect/Effect";
import { Readable } from "node:stream";
import { Router } from "express";

//#region src/express.ts
const createUploadthing = (opts) => createBuilder(opts);
const createRouteHandler = (opts) => {
	const handler = makeAdapterHandler((req, res) => Effect.succeed({
		req,
		res
	}), (req) => Effect.flatMap(getPostBody({ req }), (body) => toWebRequest(req, body)).pipe(Effect.orDie), opts, "express");
	return Router().all("/", async (req, res) => {
		const response = await handler(req, res);
		res.writeHead(response.status, Object.fromEntries(response.headers));
		if (response.body) Readable.fromWeb(response.body).pipe(res);
		else res.end();
	});
};

//#endregion
export { UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.js.map