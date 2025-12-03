const require_chunk = require('./chunk-CUT6urMc.cjs');
const __uploadthing_shared = require_chunk.__toESM(require("@uploadthing/shared"));
const effect_Effect = require_chunk.__toESM(require("effect/Effect"));
const effect_Config = require_chunk.__toESM(require("effect/Config"));
const effect_Data = require_chunk.__toESM(require("effect/Data"));

//#region src/_internal/to-web-request.ts
var InvalidURL = class extends effect_Data.Error {
	_tag = "InvalidURL";
	name = "InvalidURLError";
	constructor(attemptedUrl, base) {
		effect_Effect.runSync(effect_Effect.logError(`Failed to parse URL from request. '${attemptedUrl}' is not a valid URL with base '${base}'.`));
		super({ reason: `Failed to parse URL from request. '${attemptedUrl}' is not a valid URL with base '${base}'.` });
	}
};
const parseURL = (req) => {
	const headers = req.headers;
	let relativeUrl = req.url ?? "/";
	if ("baseUrl" in req && typeof req.baseUrl === "string") relativeUrl = req.baseUrl + relativeUrl;
	const proto = headers?.["x-forwarded-proto"] ?? "http";
	const host = headers?.["x-forwarded-host"] ?? headers?.host;
	const baseUrl = effect_Config.string("url").pipe(effect_Config.withDefault(`${proto.toString()}://${host?.toString()}`));
	return effect_Effect.flatMap(baseUrl, (baseUrl$1) => effect_Effect.try({
		try: () => new URL(relativeUrl, baseUrl$1),
		catch: () => new InvalidURL(relativeUrl, baseUrl$1)
	})).pipe(effect_Effect.catchTag("ConfigError", () => effect_Effect.fail(new InvalidURL(relativeUrl))));
};
const isBodyAllowed = (method) => [
	"POST",
	"PUT",
	"PATCH"
].includes(method);
const getPostBody = (opts) => effect_Effect.async((resume) => {
	const { req } = opts;
	if (!req.method || !isBodyAllowed(req.method)) return resume(effect_Effect.succeed(void 0));
	const contentType = req.headers?.["content-type"];
	if ("body" in req) {
		if (contentType !== "application/json") {
			effect_Effect.runSync(effect_Effect.logError("Expected JSON content type, got:", contentType));
			return resume(new __uploadthing_shared.UploadThingError({
				code: "BAD_REQUEST",
				message: "INVALID_CONTENT_TYPE"
			}));
		}
		if (typeof req.body !== "object") {
			effect_Effect.runSync(effect_Effect.logError("Expected body to be of type 'object', got:", typeof req.body));
			return resume(new __uploadthing_shared.UploadThingError({
				code: "BAD_REQUEST",
				message: "INVALID_BODY"
			}));
		}
		effect_Effect.runSync(effect_Effect.logDebug("Body parsed successfully.", req.body));
		return resume(effect_Effect.succeed(req.body));
	}
	let body = "";
	req.on("data", (data) => body += data);
	req.on("end", () => {
		const parsedBody = effect_Effect.try({
			try: () => JSON.parse(body),
			catch: (err) => new __uploadthing_shared.UploadThingError({
				code: "BAD_REQUEST",
				message: "INVALID_JSON",
				cause: err
			})
		});
		return resume(parsedBody);
	});
});
const toWebRequest = (req, body) => {
	body ??= req.body;
	const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
	const method = req.method ?? "GET";
	const allowsBody = isBodyAllowed(method);
	const headers = new Headers();
	for (const [key, value] of Object.entries(req.headers ?? [])) {
		if (typeof value === "string") headers.set(key, value);
		if (Array.isArray(value)) headers.set(key, value.join(","));
	}
	return parseURL(req).pipe(effect_Effect.catchTag("InvalidURL", (e) => effect_Effect.die(e)), effect_Effect.andThen((url) => new Request(url, {
		method,
		headers,
		...allowsBody ? { body: bodyStr } : {}
	})));
};

//#endregion
Object.defineProperty(exports, 'getPostBody', {
  enumerable: true,
  get: function () {
    return getPostBody;
  }
});
Object.defineProperty(exports, 'toWebRequest', {
  enumerable: true,
  get: function () {
    return toWebRequest;
  }
});