import "../dist/package-DpScpvTA.js";
import "../dist/deprecations-pLmw6Ytd.js";
import "../dist/shared-schemas-BmG5ARoX.js";
import { UTFiles, UTRegion, createBuilder, makeAdapterHandler } from "../dist/upload-builder-BlFOAnsv.js";
import { toWebRequest } from "../dist/to-web-request-DhP0wXG-.js";
import * as Effect from "effect/Effect";

//#region src/next-legacy.ts
const createUploadthing = (opts) => createBuilder(opts);
const createRouteHandler = (opts) => {
	const handler = makeAdapterHandler((req, res) => Effect.succeed({
		req,
		res
	}), (req) => toWebRequest(req), opts, "nextjs-pages");
	return async (req, res) => {
		const response = await handler(req, res);
		res.status(response.status);
		for (const [name, value] of response.headers) res.setHeader(name, value);
		return res.json(await response.json());
	};
};

//#endregion
export { UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.js.map