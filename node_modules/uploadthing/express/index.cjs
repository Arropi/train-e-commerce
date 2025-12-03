const require_chunk = require('../dist/chunk-CUT6urMc.cjs');
require('../dist/package-BQ_k22T9.cjs');
require('../dist/deprecations-DPGpmqha.cjs');
require('../dist/shared-schemas-CG9VaBtT.cjs');
const require_upload_builder = require('../dist/upload-builder-D6Ken9H0.cjs');
const require_to_web_request = require('../dist/to-web-request-BQtxSXgE.cjs');
const effect_Effect = require_chunk.__toESM(require("effect/Effect"));
const node_stream = require_chunk.__toESM(require("node:stream"));
const express = require_chunk.__toESM(require("express"));

//#region src/express.ts
const createUploadthing = (opts) => require_upload_builder.createBuilder(opts);
const createRouteHandler = (opts) => {
	const handler = require_upload_builder.makeAdapterHandler((req, res) => effect_Effect.succeed({
		req,
		res
	}), (req) => effect_Effect.flatMap(require_to_web_request.getPostBody({ req }), (body) => require_to_web_request.toWebRequest(req, body)).pipe(effect_Effect.orDie), opts, "express");
	return (0, express.Router)().all("/", async (req, res) => {
		const response = await handler(req, res);
		res.writeHead(response.status, Object.fromEntries(response.headers));
		if (response.body) node_stream.Readable.fromWeb(response.body).pipe(res);
		else res.end();
	});
};

//#endregion
exports.UTFiles = require_upload_builder.UTFiles;
exports.createRouteHandler = createRouteHandler;
exports.createUploadthing = createUploadthing;
exports.experimental_UTRegion = require_upload_builder.UTRegion;