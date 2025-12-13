const require_chunk = require('../dist/chunk-CUT6urMc.cjs');
require('../dist/package-BQ_k22T9.cjs');
require('../dist/deprecations-DPGpmqha.cjs');
require('../dist/shared-schemas-CG9VaBtT.cjs');
const require_upload_builder = require('../dist/upload-builder-D6Ken9H0.cjs');
const effect_Effect = require_chunk.__toESM(require("effect/Effect"));

//#region src/next.ts
const createUploadthing = (opts) => require_upload_builder.createBuilder(opts);
const createRouteHandler = (opts) => {
	const handler = require_upload_builder.makeAdapterHandler((req) => effect_Effect.succeed({ req }), (req) => effect_Effect.succeed(req), opts, "nextjs-app");
	return {
		POST: handler,
		GET: handler
	};
};

//#endregion
exports.UTFiles = require_upload_builder.UTFiles;
exports.createRouteHandler = createRouteHandler;
exports.createUploadthing = createUploadthing;
exports.experimental_UTRegion = require_upload_builder.UTRegion;