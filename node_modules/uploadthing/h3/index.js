import "../dist/package-DpScpvTA.js";
import "../dist/deprecations-pLmw6Ytd.js";
import "../dist/shared-schemas-BmG5ARoX.js";
import { UTFiles, UTRegion, createBuilder, makeAdapterHandler } from "../dist/upload-builder-BlFOAnsv.js";
import * as Effect from "effect/Effect";
import { defineEventHandler, toWebRequest } from "h3";

//#region src/h3.ts
const createUploadthing = (opts) => createBuilder(opts);
const createRouteHandler = (opts) => {
	const handler = makeAdapterHandler((event) => Effect.succeed({ event }), (event) => Effect.succeed(toWebRequest(event)), opts, "h3");
	return defineEventHandler(handler);
};

//#endregion
export { UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.js.map