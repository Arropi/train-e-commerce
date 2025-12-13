import "../dist/package-DpScpvTA.js";
import "../dist/deprecations-pLmw6Ytd.js";
import "../dist/shared-schemas-BmG5ARoX.js";
import { UTFiles, UTRegion, createBuilder, makeAdapterHandler } from "../dist/upload-builder-BlFOAnsv.js";
import * as Effect from "effect/Effect";

//#region src/next.ts
const createUploadthing = (opts) => createBuilder(opts);
const createRouteHandler = (opts) => {
	const handler = makeAdapterHandler((req) => Effect.succeed({ req }), (req) => Effect.succeed(req), opts, "nextjs-app");
	return {
		POST: handler,
		GET: handler
	};
};

//#endregion
export { UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.js.map