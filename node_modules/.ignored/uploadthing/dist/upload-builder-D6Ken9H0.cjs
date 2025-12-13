const require_chunk = require('./chunk-CUT6urMc.cjs');
const require_package = require('./package-BQ_k22T9.cjs');
const require_deprecations = require('./deprecations-DPGpmqha.cjs');
const require_shared_schemas = require('./shared-schemas-CG9VaBtT.cjs');
const __uploadthing_shared = require_chunk.__toESM(require("@uploadthing/shared"));
const effect_Effect = require_chunk.__toESM(require("effect/Effect"));
const __effect_platform_HttpApp = require_chunk.__toESM(require("@effect/platform/HttpApp"));
const __effect_platform_HttpBody = require_chunk.__toESM(require("@effect/platform/HttpBody"));
const __effect_platform_HttpClient = require_chunk.__toESM(require("@effect/platform/HttpClient"));
const __effect_platform_HttpClientRequest = require_chunk.__toESM(require("@effect/platform/HttpClientRequest"));
const __effect_platform_HttpClientResponse = require_chunk.__toESM(require("@effect/platform/HttpClientResponse"));
const __effect_platform_HttpRouter = require_chunk.__toESM(require("@effect/platform/HttpRouter"));
const __effect_platform_HttpServerRequest = require_chunk.__toESM(require("@effect/platform/HttpServerRequest"));
const __effect_platform_HttpServerResponse = require_chunk.__toESM(require("@effect/platform/HttpServerResponse"));
const effect_Config = require_chunk.__toESM(require("effect/Config"));
const effect_Context = require_chunk.__toESM(require("effect/Context"));
const effect_Match = require_chunk.__toESM(require("effect/Match"));
const effect_Redacted = require_chunk.__toESM(require("effect/Redacted"));
const effect_Schema = require_chunk.__toESM(require("effect/Schema"));
const effect_ConfigProvider = require_chunk.__toESM(require("effect/ConfigProvider"));
const effect_Stream = require_chunk.__toESM(require("effect/Stream"));
const effect_ConfigError = require_chunk.__toESM(require("effect/ConfigError"));
const effect_Either = require_chunk.__toESM(require("effect/Either"));
const effect_Layer = require_chunk.__toESM(require("effect/Layer"));
const effect_Logger = require_chunk.__toESM(require("effect/Logger"));
const effect_LogLevel = require_chunk.__toESM(require("effect/LogLevel"));
const effect_Cause = require_chunk.__toESM(require("effect/Cause"));
const effect_Data = require_chunk.__toESM(require("effect/Data"));
const effect_Runtime = require_chunk.__toESM(require("effect/Runtime"));
const __effect_platform_FetchHttpClient = require_chunk.__toESM(require("@effect/platform/FetchHttpClient"));
const __effect_platform_Headers = require_chunk.__toESM(require("@effect/platform/Headers"));
const effect_FiberRef = require_chunk.__toESM(require("effect/FiberRef"));
const effect_ManagedRuntime = require_chunk.__toESM(require("effect/ManagedRuntime"));

//#region src/_internal/config.ts
/**
* Merge in `import.meta.env` to the built-in `process.env` provider
* Prefix keys with `UPLOADTHING_` so we can reference just the name.
* @example
* process.env.UPLOADTHING_TOKEN = "foo"
* Config.string("token"); // Config<"foo">
*/
const envProvider = effect_ConfigProvider.fromEnv().pipe(effect_ConfigProvider.orElse(() => effect_ConfigProvider.fromMap(new Map(Object.entries((0, __uploadthing_shared.filterDefinedObjectValues)({}?.env ?? {}))), { pathDelim: "_" })), effect_ConfigProvider.nested("uploadthing"), effect_ConfigProvider.constantCase);
/**
* Config provider that merges the options from the object
* and environment variables prefixed with `UPLOADTHING_`.
* @remarks Options take precedence over environment variables.
*/
const configProvider = (options) => effect_ConfigProvider.fromJson(options ?? {}).pipe(effect_ConfigProvider.orElse(() => envProvider));
const IsDevelopment = effect_Config.boolean("isDev").pipe(effect_Config.orElse(() => effect_Config.succeed(typeof process !== "undefined" ? process.env.NODE_ENV : void 0).pipe(effect_Config.map((_) => _ === "development"))), effect_Config.withDefault(false));
const UTToken = effect_Schema.Config("token", require_shared_schemas.UploadThingToken).pipe(effect_Effect.catchTags({ ConfigError: (e) => new __uploadthing_shared.UploadThingError({
	code: e._op === "InvalidData" ? "INVALID_SERVER_CONFIG" : "MISSING_ENV",
	message: e._op === "InvalidData" ? "Invalid token. A token is a base64 encoded JSON object matching { apiKey: string, appId: string, regions: string[] }." : "Missing token. Please set the `UPLOADTHING_TOKEN` environment variable or provide a token manually through config.",
	cause: e
}) }));
const ApiUrl = effect_Config.string("apiUrl").pipe(effect_Config.withDefault("https://api.uploadthing.com"), effect_Config.mapAttempt((_) => new URL(_)), effect_Config.map((url) => url.href.replace(/\/$/, "")));
const IngestUrl = effect_Effect.fn(function* (preferredRegion) {
	const { regions, ingestHost } = yield* UTToken;
	const region = preferredRegion ? regions.find((r) => r === preferredRegion) ?? regions[0] : regions[0];
	return yield* effect_Config.string("ingestUrl").pipe(effect_Config.withDefault(`https://${region}.${ingestHost}`), effect_Config.mapAttempt((_) => new URL(_)), effect_Config.map((url) => url.href.replace(/\/$/, "")));
});
const UtfsHost = effect_Config.string("utfsHost").pipe(effect_Config.withDefault("utfs.io"));
const UfsHost = effect_Config.string("ufsHost").pipe(effect_Config.withDefault("ufs.sh"));
const UfsAppIdLocation = effect_Config.literal("subdomain", "path")("ufsAppIdLocation").pipe(effect_Config.withDefault("subdomain"));

//#endregion
//#region src/_internal/error-formatter.ts
function defaultErrorFormatter(error) {
	return { message: error.message };
}
function formatError(error, router) {
	const firstSlug = Object.keys(router)[0];
	const errorFormatter = firstSlug ? router[firstSlug]?.errorFormatter ?? defaultErrorFormatter : defaultErrorFormatter;
	return errorFormatter(error);
}

//#endregion
//#region src/_internal/jsonl.ts
const handleJsonLineStream = (schema, onChunk) => (stream) => {
	let buf = "";
	return stream.pipe(effect_Stream.decodeText(), effect_Stream.mapEffect((chunk) => effect_Effect.gen(function* () {
		buf += chunk;
		const parts = buf.split("\n");
		const validChunks = [];
		for (const part of parts) try {
			validChunks.push(JSON.parse(part));
			buf = buf.slice(part.length + 1);
		} catch {}
		yield* effect_Effect.logDebug("Received chunks").pipe(effect_Effect.annotateLogs("chunk", chunk), effect_Effect.annotateLogs("parsedChunks", validChunks), effect_Effect.annotateLogs("buf", buf));
		return validChunks;
	})), effect_Stream.mapEffect(effect_Schema.decodeUnknown(effect_Schema.Array(schema))), effect_Stream.mapEffect(effect_Effect.forEach((part) => onChunk(part))), effect_Stream.runDrain, effect_Effect.withLogSpan("handleJsonLineStream"));
};

//#endregion
//#region src/_internal/logger.ts
/**
* Config.logLevel counter-intuitively accepts LogLevel["label"]
* instead of a literal, ripping it and changing to accept literal
* Effect 4.0 will change this to accept a literal and then we can
* remove this and go back to the built-in validator.
*/
const ConfigLogLevel = (name) => {
	const config = effect_Config.mapOrFail(effect_Config.string(), (literal) => {
		const level = effect_LogLevel.allLevels.find((level$1) => level$1._tag === literal);
		return level === void 0 ? effect_Either.left(effect_ConfigError.InvalidData([], `Expected a log level but received ${literal}`)) : effect_Either.right(level);
	});
	return name === void 0 ? config : effect_Config.nested(config, name);
};
const withMinimalLogLevel = ConfigLogLevel("logLevel").pipe(effect_Config.withDefault(effect_LogLevel.Info), effect_Effect.andThen((level) => effect_Logger.minimumLogLevel(level)), effect_Effect.tapError((e) => effect_Effect.logError("Invalid log level").pipe(effect_Effect.annotateLogs("error", e))), effect_Effect.catchTag("ConfigError", (e) => new __uploadthing_shared.UploadThingError({
	code: "INVALID_SERVER_CONFIG",
	message: "Invalid server configuration",
	cause: e
})), effect_Layer.unwrapEffect);
const LogFormat = effect_Config.literal("json", "logFmt", "structured", "pretty")("logFormat");
const withLogFormat = effect_Effect.gen(function* () {
	const isDev = yield* IsDevelopment;
	const logFormat = yield* LogFormat.pipe(effect_Config.withDefault(isDev ? "pretty" : "json"));
	return effect_Logger[logFormat];
}).pipe(effect_Effect.catchTag("ConfigError", (e) => new __uploadthing_shared.UploadThingError({
	code: "INVALID_SERVER_CONFIG",
	message: "Invalid server configuration",
	cause: e
})), effect_Layer.unwrapEffect);
const logHttpClientResponse = (message, opts) => {
	const mixin = opts?.mixin ?? "json";
	const level = effect_LogLevel.fromLiteral(opts?.level ?? "Debug");
	return (response) => effect_Effect.flatMap(mixin !== "None" ? response[mixin] : effect_Effect.void, () => effect_Effect.logWithLevel(level, `${message} (${response.status})`).pipe(effect_Effect.annotateLogs("response", response)));
};
const logHttpClientError = (message) => (err) => err._tag === "ResponseError" ? logHttpClientResponse(message, { level: "Error" })(err.response) : effect_Effect.logError(message).pipe(effect_Effect.annotateLogs("error", err));

//#endregion
//#region src/_internal/parser.ts
var ParserError = class extends effect_Data.TaggedError("ParserError") {
	message = "Input validation failed. The original error with it's validation issues is in the error cause.";
};
function getParseFn(parser) {
	if ("parseAsync" in parser && typeof parser.parseAsync === "function")
 /**
	* Zod
	* TODO (next major): Consider wrapping ZodError in ParserError
	*/
	return parser.parseAsync;
	if (effect_Schema.isSchema(parser))
 /**
	* Effect Schema
	*/
	return (value) => effect_Schema.decodeUnknownPromise(parser)(value).catch((error) => {
		throw new ParserError({ cause: effect_Cause.squash(error[effect_Runtime.FiberFailureCauseId]) });
	});
	if ("~standard" in parser)
 /**
	* Standard Schema
	* TODO (next major): Consider moving this to the top of the function
	*/
	return async (value) => {
		const result = await parser["~standard"].validate(value);
		if (result.issues) throw new ParserError({ cause: result.issues });
		return result.value;
	};
	throw new Error("Invalid parser");
}

//#endregion
//#region src/_internal/route-config.ts
var FileSizeMismatch = class extends effect_Data.Error {
	_tag = "FileSizeMismatch";
	name = "FileSizeMismatchError";
	constructor(type, max, actual) {
		const reason = `You uploaded a ${type} file that was ${(0, __uploadthing_shared.bytesToFileSize)(actual)}, but the limit for that type is ${max}`;
		super({ reason });
	}
};
var FileCountMismatch = class extends effect_Data.Error {
	_tag = "FileCountMismatch";
	name = "FileCountMismatchError";
	constructor(type, boundtype, bound, actual) {
		const reason = `You uploaded ${actual} file(s) of type '${type}', but the ${boundtype} for that type is ${bound}`;
		super({ reason });
	}
};
const assertFilesMeetConfig = (files, routeConfig) => effect_Effect.gen(function* () {
	const counts = {};
	for (const file of files) {
		const type = yield* (0, __uploadthing_shared.matchFileType)(file, (0, __uploadthing_shared.objectKeys)(routeConfig));
		counts[type] = (counts[type] ?? 0) + 1;
		const sizeLimit = routeConfig[type]?.maxFileSize;
		if (!sizeLimit) return yield* new __uploadthing_shared.InvalidRouteConfigError(type, "maxFileSize");
		const sizeLimitBytes = yield* (0, __uploadthing_shared.fileSizeToBytes)(sizeLimit);
		if (file.size > sizeLimitBytes) return yield* new FileSizeMismatch(type, sizeLimit, file.size);
	}
	for (const _key in counts) {
		const key = _key;
		const config = routeConfig[key];
		if (!config) return yield* new __uploadthing_shared.InvalidRouteConfigError(key);
		const count = counts[key];
		const min = config.minFileCount;
		const max = config.maxFileCount;
		if (min > max) return yield* new __uploadthing_shared.UploadThingError({
			code: "BAD_REQUEST",
			message: "Invalid config during file count - minFileCount > maxFileCount",
			cause: `minFileCount must be less than maxFileCount for key ${key}. got: ${min} > ${max}`
		});
		if (count != null && count < min) return yield* new FileCountMismatch(key, "minimum", min, count);
		if (count != null && count > max) return yield* new FileCountMismatch(key, "maximum", max, count);
	}
	return null;
});
const extractRouterConfig = (router) => effect_Effect.forEach((0, __uploadthing_shared.objectKeys)(router), (slug) => effect_Effect.map((0, __uploadthing_shared.fillInputRouteConfig)(router[slug].routerConfig), (config) => ({
	slug,
	config
})));

//#endregion
//#region src/_internal/runtime.ts
const makeRuntime = (fetch, config) => {
	const fetchHttpClient = effect_Layer.provideMerge(__effect_platform_FetchHttpClient.layer, effect_Layer.succeed(__effect_platform_FetchHttpClient.Fetch, fetch));
	const withRedactedHeaders = effect_Layer.effectDiscard(effect_FiberRef.update(__effect_platform_Headers.currentRedactedNames, (_) => _.concat(["x-uploadthing-api-key"])));
	const layer = effect_Layer.provide(effect_Layer.mergeAll(withLogFormat, withMinimalLogLevel, fetchHttpClient, withRedactedHeaders), effect_Layer.setConfigProvider(configProvider(config)));
	return effect_ManagedRuntime.make(layer);
};

//#endregion
//#region src/_internal/types.ts
/**
* Marker used to select the region based on the incoming request
*/
const UTRegion = Symbol("uploadthing-region-symbol");
/**
* Marker used to append a `customId` to the incoming file data in `.middleware()`
* @example
* ```ts
* .middleware((opts) => {
*   return {
*     [UTFiles]: opts.files.map((file) => ({
*       ...file,
*       customId: generateId(),
*     }))
*   };
* })
* ```
*/
const UTFiles = Symbol("uploadthing-custom-id-symbol");

//#endregion
//#region src/_internal/handler.ts
var AdapterArguments = class extends effect_Context.Tag("uploadthing/AdapterArguments")() {};
/**
* Create a request handler adapter for any framework or server library.
* Refer to the existing adapters for examples on how to use this function.
* @public
*
* @param makeAdapterArgs - Function that takes the args from your framework and returns an Effect that resolves to the adapter args.
* These args are passed to the `.middleware`, `.onUploadComplete`, and `.onUploadError` hooks.
* @param toRequest - Function that takes the args from your framework and returns an Effect that resolves to a web Request object.
* @param opts - The router config and other options that are normally passed to `createRequestHandler` of official adapters
* @param beAdapter - [Optional] The adapter name of the adapter, used for telemetry purposes
* @returns A function that takes the args from your framework and returns a promise that resolves to a Response object.
*/
const makeAdapterHandler = (makeAdapterArgs, toRequest, opts, beAdapter) => {
	const managed = makeRuntime(opts.config?.fetch, opts.config);
	const handle = effect_Effect.promise(() => managed.runtime().then(__effect_platform_HttpApp.toWebHandlerRuntime));
	const app = (...args) => effect_Effect.map(effect_Effect.promise(() => managed.runPromise(createRequestHandler(opts, beAdapter ?? "custom"))), effect_Effect.provideServiceEffect(AdapterArguments, makeAdapterArgs(...args)));
	return async (...args) => {
		const result = await handle.pipe(effect_Effect.ap(app(...args)), effect_Effect.ap(toRequest(...args)), effect_Effect.withLogSpan("requestHandler"), managed.runPromise);
		return result;
	};
};
const createRequestHandler = (opts, beAdapter) => effect_Effect.gen(function* () {
	const isDevelopment = yield* IsDevelopment;
	const routerConfig = yield* extractRouterConfig(opts.router);
	const handleDaemon = (() => {
		if (opts.config?.handleDaemonPromise) return opts.config.handleDaemonPromise;
		return isDevelopment ? "void" : "await";
	})();
	if (isDevelopment && handleDaemon === "await") return yield* new __uploadthing_shared.UploadThingError({
		code: "INVALID_SERVER_CONFIG",
		message: "handleDaemonPromise: \"await\" is forbidden in development."
	});
	const GET = effect_Effect.gen(function* () {
		return yield* __effect_platform_HttpServerResponse.json(routerConfig);
	});
	const POST = effect_Effect.gen(function* () {
		const { "uploadthing-hook": uploadthingHook, "x-uploadthing-package": fePackage, "x-uploadthing-version": clientVersion } = yield* __effect_platform_HttpServerRequest.schemaHeaders(effect_Schema.Struct({
			"uploadthing-hook": require_shared_schemas.UploadThingHook.pipe(effect_Schema.optional),
			"x-uploadthing-package": effect_Schema.String.pipe(effect_Schema.optionalWith({ default: () => "unknown" })),
			"x-uploadthing-version": effect_Schema.String.pipe(effect_Schema.optionalWith({ default: () => require_package.version }))
		}));
		if (clientVersion !== require_package.version) {
			const serverVersion = require_package.version;
			yield* effect_Effect.logWarning("Client version mismatch. Things may not work as expected, please sync your versions to ensure compatibility.").pipe(effect_Effect.annotateLogs({
				clientVersion,
				serverVersion
			}));
		}
		const { slug, actionType } = yield* __effect_platform_HttpRouter.schemaParams(effect_Schema.Struct({
			actionType: require_shared_schemas.ActionType.pipe(effect_Schema.optional),
			slug: effect_Schema.String
		}));
		const uploadable = opts.router[slug];
		if (!uploadable) {
			const msg = `No file route found for slug ${slug}`;
			yield* effect_Effect.logError(msg);
			return yield* new __uploadthing_shared.UploadThingError({
				code: "NOT_FOUND",
				message: msg
			});
		}
		const { body, fiber } = yield* effect_Match.value({
			actionType,
			uploadthingHook
		}).pipe(effect_Match.when({
			actionType: "upload",
			uploadthingHook: void 0
		}, () => handleUploadAction({
			uploadable,
			fePackage,
			beAdapter,
			slug
		})), effect_Match.when({
			actionType: void 0,
			uploadthingHook: "callback"
		}, () => handleCallbackRequest({
			uploadable,
			fePackage,
			beAdapter
		})), effect_Match.when({
			actionType: void 0,
			uploadthingHook: "error"
		}, () => handleErrorRequest({ uploadable })), effect_Match.orElse(() => effect_Effect.succeed({
			body: null,
			fiber: null
		})));
		if (fiber) {
			yield* effect_Effect.logDebug("Running fiber as daemon").pipe(effect_Effect.annotateLogs("handleDaemon", handleDaemon));
			if (handleDaemon === "void") {} else if (handleDaemon === "await") yield* fiber.await;
			else if (typeof handleDaemon === "function") handleDaemon(effect_Effect.runPromise(fiber.await));
		}
		yield* effect_Effect.logDebug("Sending response").pipe(effect_Effect.annotateLogs("body", body));
		return yield* __effect_platform_HttpServerResponse.json(body);
	}).pipe(effect_Effect.catchTags({
		ParseError: (e) => __effect_platform_HttpServerResponse.json(formatError(new __uploadthing_shared.UploadThingError({
			code: "BAD_REQUEST",
			message: "Invalid input",
			cause: e.message
		}), opts.router), { status: 400 }),
		UploadThingError: (e) => __effect_platform_HttpServerResponse.json(formatError(e, opts.router), { status: (0, __uploadthing_shared.getStatusCodeFromError)(e) })
	}));
	const appendResponseHeaders = effect_Effect.map(__effect_platform_HttpServerResponse.setHeader("x-uploadthing-version", require_package.version));
	return __effect_platform_HttpRouter.empty.pipe(__effect_platform_HttpRouter.get("*", GET), __effect_platform_HttpRouter.post("*", POST), __effect_platform_HttpRouter.use(appendResponseHeaders));
}).pipe(effect_Effect.withLogSpan("createRequestHandler"));
const handleErrorRequest = (opts) => effect_Effect.gen(function* () {
	const { uploadable } = opts;
	const request = yield* __effect_platform_HttpServerRequest.HttpServerRequest;
	const { apiKey } = yield* UTToken;
	const verified = yield* (0, __uploadthing_shared.verifySignature)(yield* request.text, request.headers["x-uploadthing-signature"] ?? null, apiKey);
	yield* effect_Effect.logDebug(`Signature verified: ${verified}`);
	if (!verified) {
		yield* effect_Effect.logError("Invalid signature");
		return yield* new __uploadthing_shared.UploadThingError({
			code: "BAD_REQUEST",
			message: "Invalid signature"
		});
	}
	const requestInput = yield* __effect_platform_HttpServerRequest.schemaBodyJson(effect_Schema.Struct({
		fileKey: effect_Schema.String,
		error: effect_Schema.String
	}));
	yield* effect_Effect.logDebug("Handling error callback request with input:").pipe(effect_Effect.annotateLogs("json", requestInput));
	const adapterArgs = yield* AdapterArguments;
	const fiber = yield* effect_Effect.tryPromise({
		try: async () => uploadable.onUploadError({
			...adapterArgs,
			error: new __uploadthing_shared.UploadThingError({
				code: "UPLOAD_FAILED",
				message: `Upload failed for ${requestInput.fileKey}: ${requestInput.error}`
			}),
			fileKey: requestInput.fileKey
		}),
		catch: (error) => new __uploadthing_shared.UploadThingError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to run onUploadError",
			cause: error
		})
	}).pipe(effect_Effect.tapError((error) => effect_Effect.logError("Failed to run onUploadError. You probably shouldn't be throwing errors here.").pipe(effect_Effect.annotateLogs("error", error)))).pipe(effect_Effect.ignoreLogged, effect_Effect.forkDaemon);
	return {
		body: null,
		fiber
	};
}).pipe(effect_Effect.withLogSpan("handleErrorRequest"));
const handleCallbackRequest = (opts) => effect_Effect.gen(function* () {
	const { uploadable, fePackage, beAdapter } = opts;
	const request = yield* __effect_platform_HttpServerRequest.HttpServerRequest;
	const { apiKey } = yield* UTToken;
	const verified = yield* (0, __uploadthing_shared.verifySignature)(yield* request.text, request.headers["x-uploadthing-signature"] ?? null, apiKey);
	yield* effect_Effect.logDebug(`Signature verified: ${verified}`);
	if (!verified) {
		yield* effect_Effect.logError("Invalid signature");
		return yield* new __uploadthing_shared.UploadThingError({
			code: "BAD_REQUEST",
			message: "Invalid signature"
		});
	}
	const requestInput = yield* __effect_platform_HttpServerRequest.schemaBodyJson(effect_Schema.Struct({
		status: effect_Schema.String,
		file: require_shared_schemas.UploadedFileData,
		origin: effect_Schema.String,
		metadata: effect_Schema.Record({
			key: effect_Schema.String,
			value: effect_Schema.Unknown
		})
	}));
	yield* effect_Effect.logDebug("Handling callback request with input:").pipe(effect_Effect.annotateLogs("json", requestInput));
	/**
	* Run `.onUploadComplete` as a daemon to prevent the
	* request from UT to potentially timeout.
	*/
	const fiber = yield* effect_Effect.gen(function* () {
		const adapterArgs = yield* AdapterArguments;
		const serverData = yield* effect_Effect.tryPromise({
			try: async () => uploadable.onUploadComplete({
				...adapterArgs,
				file: {
					...requestInput.file,
					get url() {
						require_deprecations.logDeprecationWarning("`file.url` is deprecated and will be removed in uploadthing v9. Use `file.ufsUrl` instead.");
						return requestInput.file.url;
					},
					get appUrl() {
						require_deprecations.logDeprecationWarning("`file.appUrl` is deprecated and will be removed in uploadthing v9. Use `file.ufsUrl` instead.");
						return requestInput.file.appUrl;
					}
				},
				metadata: requestInput.metadata
			}),
			catch: (error) => new __uploadthing_shared.UploadThingError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to run onUploadComplete. You probably shouldn't be throwing errors here.",
				cause: error
			})
		});
		const payload = {
			fileKey: requestInput.file.key,
			callbackData: serverData ?? null
		};
		yield* effect_Effect.logDebug("'onUploadComplete' callback finished. Sending response to UploadThing:").pipe(effect_Effect.annotateLogs("callbackData", payload));
		const httpClient = (yield* __effect_platform_HttpClient.HttpClient).pipe(__effect_platform_HttpClient.filterStatusOk);
		yield* __effect_platform_HttpClientRequest.post(`/callback-result`).pipe(__effect_platform_HttpClientRequest.prependUrl(requestInput.origin), __effect_platform_HttpClientRequest.setHeaders({
			"x-uploadthing-api-key": effect_Redacted.value(apiKey),
			"x-uploadthing-version": require_package.version,
			"x-uploadthing-be-adapter": beAdapter,
			"x-uploadthing-fe-package": fePackage
		}), __effect_platform_HttpClientRequest.bodyJson(payload), effect_Effect.flatMap(httpClient.execute), effect_Effect.tapError(logHttpClientError("Failed to register callback result")), effect_Effect.flatMap(__effect_platform_HttpClientResponse.schemaBodyJson(require_shared_schemas.CallbackResultResponse)), effect_Effect.tap(effect_Effect.log("Sent callback result to UploadThing")), effect_Effect.scoped);
	}).pipe(effect_Effect.ignoreLogged, effect_Effect.forkDaemon);
	return {
		body: null,
		fiber
	};
}).pipe(effect_Effect.withLogSpan("handleCallbackRequest"));
const runRouteMiddleware = (opts) => effect_Effect.gen(function* () {
	const { json: { files, input }, uploadable } = opts;
	yield* effect_Effect.logDebug("Running middleware");
	const adapterArgs = yield* AdapterArguments;
	const metadata = yield* effect_Effect.tryPromise({
		try: async () => uploadable.middleware({
			...adapterArgs,
			input,
			files
		}),
		catch: (error) => error instanceof __uploadthing_shared.UploadThingError ? error : new __uploadthing_shared.UploadThingError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to run middleware",
			cause: error
		})
	});
	if (metadata[UTFiles] && metadata[UTFiles].length !== files.length) {
		const msg = `Expected files override to have the same length as original files, got ${metadata[UTFiles].length} but expected ${files.length}`;
		yield* effect_Effect.logError(msg);
		return yield* new __uploadthing_shared.UploadThingError({
			code: "BAD_REQUEST",
			message: "Files override must have the same length as files",
			cause: msg
		});
	}
	const filesWithCustomIds = yield* effect_Effect.forEach(files, (file, idx) => effect_Effect.gen(function* () {
		const theirs = metadata[UTFiles]?.[idx];
		if (theirs && theirs.size !== file.size) yield* effect_Effect.logWarning("File size mismatch. Reverting to original size");
		return {
			name: theirs?.name ?? file.name,
			size: file.size,
			type: file.type,
			customId: theirs?.customId,
			lastModified: theirs?.lastModified ?? Date.now()
		};
	}));
	return {
		metadata,
		filesWithCustomIds,
		preferredRegion: metadata[UTRegion]
	};
}).pipe(effect_Effect.withLogSpan("runRouteMiddleware"));
const handleUploadAction = (opts) => effect_Effect.gen(function* () {
	const httpClient = (yield* __effect_platform_HttpClient.HttpClient).pipe(__effect_platform_HttpClient.filterStatusOk);
	const { uploadable, fePackage, beAdapter, slug } = opts;
	const json = yield* __effect_platform_HttpServerRequest.schemaBodyJson(require_shared_schemas.UploadActionPayload);
	yield* effect_Effect.logDebug("Handling upload request").pipe(effect_Effect.annotateLogs("json", json));
	yield* effect_Effect.logDebug("Parsing user input");
	const parsedInput = yield* effect_Effect.tryPromise({
		try: () => getParseFn(uploadable.inputParser)(json.input),
		catch: (error) => new __uploadthing_shared.UploadThingError({
			code: "BAD_REQUEST",
			message: "Invalid input",
			cause: error
		})
	});
	yield* effect_Effect.logDebug("Input parsed successfully").pipe(effect_Effect.annotateLogs("input", parsedInput));
	const { metadata, filesWithCustomIds, preferredRegion } = yield* runRouteMiddleware({
		json: {
			input: parsedInput,
			files: json.files
		},
		uploadable
	});
	yield* effect_Effect.logDebug("Parsing route config").pipe(effect_Effect.annotateLogs("routerConfig", uploadable.routerConfig));
	const parsedConfig = yield* (0, __uploadthing_shared.fillInputRouteConfig)(uploadable.routerConfig).pipe(effect_Effect.catchTag("InvalidRouteConfig", (err) => new __uploadthing_shared.UploadThingError({
		code: "BAD_REQUEST",
		message: "Invalid route config",
		cause: err
	})));
	yield* effect_Effect.logDebug("Route config parsed successfully").pipe(effect_Effect.annotateLogs("routeConfig", parsedConfig));
	yield* effect_Effect.logDebug("Validating files meet the config requirements").pipe(effect_Effect.annotateLogs("files", json.files));
	yield* assertFilesMeetConfig(json.files, parsedConfig).pipe(effect_Effect.mapError((e) => new __uploadthing_shared.UploadThingError({
		code: "BAD_REQUEST",
		message: `Invalid config: ${e._tag}`,
		cause: "reason" in e ? e.reason : e.message
	})));
	yield* effect_Effect.logDebug("Files validated.");
	const fileUploadRequests = yield* effect_Effect.forEach(filesWithCustomIds, (file) => effect_Effect.map((0, __uploadthing_shared.matchFileType)(file, (0, __uploadthing_shared.objectKeys)(parsedConfig)), (type) => ({
		name: file.name,
		size: file.size,
		type: file.type || type,
		lastModified: file.lastModified,
		customId: file.customId,
		contentDisposition: parsedConfig[type]?.contentDisposition ?? "inline",
		acl: parsedConfig[type]?.acl
	}))).pipe(effect_Effect.catchTags({
		InvalidFileType: (e) => effect_Effect.die(e),
		UnknownFileType: (e) => effect_Effect.die(e)
	}));
	const routeOptions = uploadable.routeOptions;
	const { apiKey, appId } = yield* UTToken;
	const ingestUrl = yield* IngestUrl(preferredRegion);
	const isDev = yield* IsDevelopment;
	yield* effect_Effect.logDebug("Generating presigned URLs").pipe(effect_Effect.annotateLogs("fileUploadRequests", fileUploadRequests), effect_Effect.annotateLogs("ingestUrl", ingestUrl));
	const presignedUrls = yield* effect_Effect.forEach(fileUploadRequests, (file) => effect_Effect.gen(function* () {
		const key = yield* (0, __uploadthing_shared.generateKey)(file, appId, routeOptions.getFileHashParts);
		const url = yield* (0, __uploadthing_shared.generateSignedURL)(`${ingestUrl}/${key}`, apiKey, {
			ttlInSeconds: routeOptions.presignedURLTTL,
			data: {
				"x-ut-identifier": appId,
				"x-ut-file-name": file.name,
				"x-ut-file-size": file.size,
				"x-ut-file-type": file.type,
				"x-ut-slug": slug,
				"x-ut-custom-id": file.customId,
				"x-ut-content-disposition": file.contentDisposition,
				"x-ut-acl": file.acl
			}
		});
		return {
			url,
			key
		};
	}), { concurrency: "unbounded" });
	const serverReq = yield* __effect_platform_HttpServerRequest.HttpServerRequest;
	const requestUrl = yield* __effect_platform_HttpServerRequest.toURL(serverReq);
	const devHookRequest = yield* effect_Config.string("callbackUrl").pipe(effect_Config.withDefault(requestUrl.origin + requestUrl.pathname), effect_Effect.map((url) => __effect_platform_HttpClientRequest.post(url).pipe(__effect_platform_HttpClientRequest.appendUrlParam("slug", slug))));
	const metadataRequest = __effect_platform_HttpClientRequest.post("/route-metadata").pipe(__effect_platform_HttpClientRequest.prependUrl(ingestUrl), __effect_platform_HttpClientRequest.setHeaders({
		"x-uploadthing-api-key": effect_Redacted.value(apiKey),
		"x-uploadthing-version": require_package.version,
		"x-uploadthing-be-adapter": beAdapter,
		"x-uploadthing-fe-package": fePackage
	}), __effect_platform_HttpClientRequest.bodyJson({
		fileKeys: presignedUrls.map(({ key }) => key),
		metadata,
		isDev,
		callbackUrl: devHookRequest.url,
		callbackSlug: slug,
		awaitServerData: routeOptions.awaitServerData ?? true
	}), effect_Effect.flatMap(httpClient.execute));
	const handleDevStreamError = effect_Effect.fn("handleDevStreamError")(function* (err, chunk) {
		const schema = effect_Schema.parseJson(effect_Schema.Struct({ file: require_shared_schemas.UploadedFileData }));
		const parsedChunk = yield* effect_Schema.decodeUnknown(schema)(chunk);
		const key = parsedChunk.file.key;
		yield* effect_Effect.logError("Failed to forward callback request from dev stream").pipe(effect_Effect.annotateLogs({
			fileKey: key,
			error: err.message
		}));
		const httpResponse = yield* __effect_platform_HttpClientRequest.post("/callback-result").pipe(__effect_platform_HttpClientRequest.prependUrl(ingestUrl), __effect_platform_HttpClientRequest.setHeaders({
			"x-uploadthing-api-key": effect_Redacted.value(apiKey),
			"x-uploadthing-version": require_package.version,
			"x-uploadthing-be-adapter": beAdapter,
			"x-uploadthing-fe-package": fePackage
		}), __effect_platform_HttpClientRequest.bodyJson({
			fileKey: key,
			error: `Failed to forward callback request from dev stream: ${err.message}`
		}), effect_Effect.flatMap(httpClient.execute));
		yield* logHttpClientResponse("Reported callback error to UploadThing")(httpResponse);
	});
	const fiber = yield* effect_Effect.if(isDev, {
		onTrue: () => metadataRequest.pipe(effect_Effect.tapBoth({
			onSuccess: logHttpClientResponse("Registered metadata", { mixin: "None" }),
			onFailure: logHttpClientError("Failed to register metadata")
		}), __effect_platform_HttpClientResponse.stream, handleJsonLineStream(require_shared_schemas.MetadataFetchStreamPart, (chunk) => devHookRequest.pipe(__effect_platform_HttpClientRequest.setHeaders({
			"uploadthing-hook": chunk.hook,
			"x-uploadthing-signature": chunk.signature
		}), __effect_platform_HttpClientRequest.setBody(__effect_platform_HttpBody.text(chunk.payload, "application/json")), httpClient.execute, effect_Effect.tap(logHttpClientResponse("Successfully forwarded callback request from dev stream")), effect_Effect.catchTag("ResponseError", (err) => handleDevStreamError(err, chunk.payload)), effect_Effect.annotateLogs(chunk), effect_Effect.asVoid, effect_Effect.ignoreLogged, effect_Effect.scoped))),
		onFalse: () => metadataRequest.pipe(effect_Effect.tapBoth({
			onSuccess: logHttpClientResponse("Registered metadata"),
			onFailure: logHttpClientError("Failed to register metadata")
		}), effect_Effect.flatMap(__effect_platform_HttpClientResponse.schemaBodyJson(require_shared_schemas.MetadataFetchResponse)), effect_Effect.scoped)
	}).pipe(effect_Effect.forkDaemon);
	const presigneds = presignedUrls.map((p, i) => ({
		url: p.url,
		key: p.key,
		name: fileUploadRequests[i].name,
		customId: fileUploadRequests[i].customId ?? null
	}));
	yield* effect_Effect.logInfo("Sending presigned URLs to client").pipe(effect_Effect.annotateLogs("presignedUrls", presigneds));
	return {
		body: presigneds,
		fiber
	};
}).pipe(effect_Effect.withLogSpan("handleUploadAction"));

//#endregion
//#region src/_internal/upload-builder.ts
function internalCreateBuilder(initDef = {}) {
	const _def = {
		$types: {},
		routerConfig: { image: { maxFileSize: "4MB" } },
		routeOptions: { awaitServerData: true },
		inputParser: {
			parseAsync: () => Promise.resolve(void 0),
			_input: void 0,
			_output: void 0
		},
		middleware: () => ({}),
		onUploadError: () => {},
		onUploadComplete: () => void 0,
		errorFormatter: initDef.errorFormatter ?? defaultErrorFormatter,
		...initDef
	};
	return {
		input(userParser) {
			return internalCreateBuilder({
				..._def,
				inputParser: userParser
			});
		},
		middleware(userMiddleware) {
			return internalCreateBuilder({
				..._def,
				middleware: userMiddleware
			});
		},
		onUploadComplete(userUploadComplete) {
			return {
				..._def,
				onUploadComplete: userUploadComplete
			};
		},
		onUploadError(userOnUploadError) {
			return internalCreateBuilder({
				..._def,
				onUploadError: userOnUploadError
			});
		}
	};
}
/**
* Create a builder for your backend adapter.
* Refer to the existing adapters for examples on how to use this function.
* @public
*
* @param opts - Options for the builder
* @returns A file route builder for making UploadThing file routes
*/
function createBuilder(opts) {
	return (input, config) => {
		return internalCreateBuilder({
			routerConfig: input,
			routeOptions: config ?? {},
			...opts
		});
	};
}

//#endregion
Object.defineProperty(exports, 'AdapterArguments', {
  enumerable: true,
  get: function () {
    return AdapterArguments;
  }
});
Object.defineProperty(exports, 'ApiUrl', {
  enumerable: true,
  get: function () {
    return ApiUrl;
  }
});
Object.defineProperty(exports, 'IngestUrl', {
  enumerable: true,
  get: function () {
    return IngestUrl;
  }
});
Object.defineProperty(exports, 'UTFiles', {
  enumerable: true,
  get: function () {
    return UTFiles;
  }
});
Object.defineProperty(exports, 'UTRegion', {
  enumerable: true,
  get: function () {
    return UTRegion;
  }
});
Object.defineProperty(exports, 'UTToken', {
  enumerable: true,
  get: function () {
    return UTToken;
  }
});
Object.defineProperty(exports, 'UfsAppIdLocation', {
  enumerable: true,
  get: function () {
    return UfsAppIdLocation;
  }
});
Object.defineProperty(exports, 'UfsHost', {
  enumerable: true,
  get: function () {
    return UfsHost;
  }
});
Object.defineProperty(exports, 'configProvider', {
  enumerable: true,
  get: function () {
    return configProvider;
  }
});
Object.defineProperty(exports, 'createBuilder', {
  enumerable: true,
  get: function () {
    return createBuilder;
  }
});
Object.defineProperty(exports, 'createRequestHandler', {
  enumerable: true,
  get: function () {
    return createRequestHandler;
  }
});
Object.defineProperty(exports, 'extractRouterConfig', {
  enumerable: true,
  get: function () {
    return extractRouterConfig;
  }
});
Object.defineProperty(exports, 'logHttpClientError', {
  enumerable: true,
  get: function () {
    return logHttpClientError;
  }
});
Object.defineProperty(exports, 'logHttpClientResponse', {
  enumerable: true,
  get: function () {
    return logHttpClientResponse;
  }
});
Object.defineProperty(exports, 'makeAdapterHandler', {
  enumerable: true,
  get: function () {
    return makeAdapterHandler;
  }
});
Object.defineProperty(exports, 'makeRuntime', {
  enumerable: true,
  get: function () {
    return makeRuntime;
  }
});