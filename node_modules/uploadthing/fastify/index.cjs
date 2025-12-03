const require_chunk = require('../dist/chunk-CUT6urMc.cjs');
require('../dist/package-BQ_k22T9.cjs');
require('../dist/deprecations-DPGpmqha.cjs');
require('../dist/shared-schemas-CG9VaBtT.cjs');
const require_upload_builder = require('../dist/upload-builder-D6Ken9H0.cjs');
const require_to_web_request = require('../dist/to-web-request-BQtxSXgE.cjs');
const effect_Effect = require_chunk.__toESM(require("effect/Effect"));

//#region src/fastify.ts
const createUploadthing = (opts) => require_upload_builder.createBuilder(opts);
const createRouteHandler = (fastify, opts, done) => {
	const handler = require_upload_builder.makeAdapterHandler((req, res) => effect_Effect.succeed({
		req,
		res
	}), (req) => require_to_web_request.toWebRequest(req), opts, "fastify");
	fastify.all("/api/uploadthing", async (req, res) => {
		const response = await handler(req, res);
		return res.status(response.status).headers(Object.fromEntries(response.headers)).send(response.body);
	});
	done();
};

//#endregion
exports.UTFiles = require_upload_builder.UTFiles;
exports.createRouteHandler = createRouteHandler;
exports.createUploadthing = createUploadthing;
exports.experimental_UTRegion = require_upload_builder.UTRegion;