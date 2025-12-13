import { version } from "./package-DpScpvTA.js";
import * as Micro from "effect/Micro";
import { UploadThingError, fetchEff, getErrorTypeFromStatusCode, parseResponseJson } from "@uploadthing/shared";
import { unsafeCoerce } from "effect/Function";

//#region src/_internal/deferred.ts
const createDeferred = () => {
	let resolve;
	let reject;
	const ac = new AbortController();
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return {
		promise,
		ac,
		resolve,
		reject
	};
};

//#endregion
//#region src/_internal/random-hex.ts
const randomHexString = (function() {
	const characters = "abcdef0123456789";
	const charactersLength = 16;
	return function(length) {
		let result = "";
		for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
	};
})();
const generateTraceHeaders = () => {
	const traceId = randomHexString(32);
	const spanId = randomHexString(16);
	const sampled = "01";
	return {
		b3: `${traceId}-${spanId}-${sampled}`,
		traceparent: `00-${traceId}-${spanId}-${sampled}`
	};
};

//#endregion
//#region src/_internal/ut-reporter.ts
const createAPIRequestUrl = (config) => {
	const url = new URL(config.url);
	const queryParams = new URLSearchParams(url.search);
	queryParams.set("actionType", config.actionType);
	queryParams.set("slug", config.slug);
	url.search = queryParams.toString();
	return url;
};
/**
* Creates a "client" for reporting events to the UploadThing server via the user's API endpoint.
* Events are handled in "./handler.ts starting at L112"
*/
const createUTReporter = (cfg) => (type, payload) => Micro.gen(function* () {
	const url = createAPIRequestUrl({
		url: cfg.url,
		slug: cfg.endpoint,
		actionType: type
	});
	const headers = new Headers(yield* Micro.promise(async () => typeof cfg.headers === "function" ? await cfg.headers() : cfg.headers));
	if (cfg.package) headers.set("x-uploadthing-package", cfg.package);
	headers.set("x-uploadthing-version", version);
	headers.set("Content-Type", "application/json");
	headers.set("b3", cfg.traceHeaders.b3);
	headers.set("traceparent", cfg.traceHeaders.traceparent);
	const response = yield* fetchEff(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers
	}).pipe(
		Micro.andThen(parseResponseJson),
		/**
		* We don't _need_ to validate the response here, just cast it for now.
		* As of now, @effect/schema includes quite a few bytes we cut out by this...
		* We have "strong typing" on the backend that ensures the shape should match.
		*/
		Micro.map(unsafeCoerce),
		Micro.catchTag("FetchError", (e) => Micro.fail(new UploadThingError({
			code: "INTERNAL_CLIENT_ERROR",
			message: `Failed to report event "${type}" to UploadThing server`,
			cause: e
		}))),
		Micro.catchTag("BadRequestError", (e) => Micro.fail(new UploadThingError({
			code: getErrorTypeFromStatusCode(e.status),
			message: e.getMessage(),
			cause: e.json
		}))),
		Micro.catchTag("InvalidJson", (e) => Micro.fail(new UploadThingError({
			code: "INTERNAL_CLIENT_ERROR",
			message: "Failed to parse response from UploadThing server",
			cause: e
		})))
	);
	return response;
});

//#endregion
export { createDeferred, createUTReporter, generateTraceHeaders };
//# sourceMappingURL=ut-reporter-Dlppchbx.js.map