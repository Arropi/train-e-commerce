import { ACL, ContentDisposition, Either, EndpointMetadata, ErrorMessage, ExpandedRouteConfig as ExpandedRouteConfig$1, ExtendObjectIf, FetchEsque, FileRouterInputConfig, Json, JsonObject, MaybePromise, MaybeUrl, RouteOptions, SerializedUploadThingError, Simplify, Time, UploadThingError } from "@uploadthing/shared";
import * as LogLevel from "effect/LogLevel";
import * as Config from "effect/Config";
import * as Schema$1 from "effect/Schema";
import { Schema } from "effect/Schema";
import * as Standard from "@standard-schema/spec";
import { Blob as Blob$1 } from "buffer";

//#region src/_internal/logger.d.ts

declare const LogFormat: Config.Config<"json" | "logFmt" | "structured" | "pretty">;
type LogFormat = Config.Config.Success<typeof LogFormat>;
//#endregion
//#region src/_internal/parser.d.ts
type ParseFn<TType> = (input: unknown) => Promise<TType>;
type ParserZodEsque<TInput extends Json, TParsedInput> = {
  _input: TInput;
  _output: TParsedInput;
  parseAsync: ParseFn<TParsedInput>;
};
type JsonParser<In extends Json, Out = In> = ParserZodEsque<In, Out> | Standard.StandardSchemaV1<In, Out> | Schema$1.Schema<Out, In>;
//#endregion
//#region src/_internal/shared-schemas.d.ts
declare const UploadThingToken: Schema$1.transform<Schema$1.transform<Schema$1.Schema<Uint8Array<ArrayBufferLike>, string, never>, Schema$1.transform<typeof Schema$1.Uint8ArrayFromSelf, typeof Schema$1.String>>, Schema$1.transform<Schema$1.SchemaClass<unknown, string, never>, Schema$1.Struct<{
  apiKey: Schema$1.Redacted<Schema$1.filter<typeof Schema$1.String>>;
  appId: typeof Schema$1.String;
  regions: Schema$1.NonEmptyArray<typeof Schema$1.String>;
  ingestHost: Schema$1.optionalWith<typeof Schema$1.String, {
    default: () => string;
  }>;
}>>>;
declare const FileUploadData_base: Schema$1.Class<FileUploadData, {
  name: typeof Schema$1.String;
  size: typeof Schema$1.Number;
  type: typeof Schema$1.String;
  lastModified: Schema$1.optional<typeof Schema$1.Number>;
}, Schema$1.Struct.Encoded<{
  name: typeof Schema$1.String;
  size: typeof Schema$1.Number;
  type: typeof Schema$1.String;
  lastModified: Schema$1.optional<typeof Schema$1.Number>;
}>, never, {
  readonly name: string;
} & {
  readonly size: number;
} & {
  readonly type: string;
} & {
  readonly lastModified?: number | undefined;
}, {}, {}>;
/**
 * =============================================================================
 * ======================== File Type Hierarchy ===============================
 * =============================================================================
 */
/**
 * Properties from the web File object, this is what the client sends when initiating an upload
 */
declare class FileUploadData extends FileUploadData_base {}
declare const FileUploadDataWithCustomId_base: Schema$1.Class<FileUploadDataWithCustomId, {
  name: typeof Schema$1.String;
  size: typeof Schema$1.Number;
  type: typeof Schema$1.String;
  lastModified: Schema$1.optional<typeof Schema$1.Number>;
} & {
  customId: Schema$1.NullOr<typeof Schema$1.String>;
}, {
  readonly name: string;
  readonly size: number;
  readonly type: string;
} & {
  readonly lastModified?: number | undefined;
} & {
  readonly customId: string | null;
} & {}, never, {
  readonly name: string;
} & {
  readonly size: number;
} & {
  readonly type: string;
} & {
  readonly lastModified?: number | undefined;
} & {
  readonly customId: string | null;
}, FileUploadData, {}>;
/**
 * `.middleware()` can add a customId to the incoming file data
 */
declare class FileUploadDataWithCustomId extends FileUploadDataWithCustomId_base {}
declare const UploadedFileData_base: Schema$1.Class<UploadedFileData, {
  name: typeof Schema$1.String;
  size: typeof Schema$1.Number;
  type: typeof Schema$1.String;
  lastModified: Schema$1.optional<typeof Schema$1.Number>;
} & {
  customId: Schema$1.NullOr<typeof Schema$1.String>;
} & {
  key: typeof Schema$1.String;
  /**
   * @deprecated
   * This field will be removed in uploadthing v9. Use `ufsUrl` instead.
   */
  url: typeof Schema$1.String;
  /**
   * @deprecated
   * This field will be removed in uploadthing v9. Use `ufsUrl` instead.
   */
  appUrl: typeof Schema$1.String;
  ufsUrl: typeof Schema$1.String;
  fileHash: typeof Schema$1.String;
}, {
  readonly name: string;
  readonly size: number;
  readonly type: string;
} & {
  readonly lastModified?: number | undefined;
} & {
  readonly customId: string | null;
} & {} & {
  readonly url: string;
  readonly key: string;
  readonly appUrl: string;
  readonly ufsUrl: string;
  readonly fileHash: string;
} & {}, never, {
  readonly name: string;
} & {
  readonly size: number;
} & {
  readonly type: string;
} & {
  readonly lastModified?: number | undefined;
} & {
  readonly customId: string | null;
} & {
  readonly url: string;
} & {
  readonly key: string;
} & {
  readonly appUrl: string;
} & {
  readonly ufsUrl: string;
} & {
  readonly fileHash: string;
}, FileUploadDataWithCustomId, {}>;
/**
 * When files are uploaded, we get back
 * - a key
 * - URLs for the file
 * - the hash (md5-hex) of the uploaded file's contents
 */
declare class UploadedFileData extends UploadedFileData_base {}
/**
 * When the client has uploaded a file and polled for data returned by `.onUploadComplete()`
 */
interface ClientUploadedFileData<T> extends UploadedFileData {
  /**
   * Matches what's returned from the serverside `onUploadComplete` callback
   */
  readonly serverData: T;
}
declare const NewPresignedUrl_base: Schema$1.Class<NewPresignedUrl, {
  url: typeof Schema$1.String;
  key: typeof Schema$1.String;
  customId: Schema$1.NullOr<typeof Schema$1.String>;
  name: typeof Schema$1.String;
}, Schema$1.Struct.Encoded<{
  url: typeof Schema$1.String;
  key: typeof Schema$1.String;
  customId: Schema$1.NullOr<typeof Schema$1.String>;
  name: typeof Schema$1.String;
}>, never, {
  readonly url: string;
} & {
  readonly name: string;
} & {
  readonly customId: string | null;
} & {
  readonly key: string;
}, {}, {}>;
/**
 * =============================================================================
 * ======================== Server Response Schemas ============================
 * =============================================================================
 */
declare class NewPresignedUrl extends NewPresignedUrl_base {}
declare const UploadActionPayload_base: Schema$1.Class<UploadActionPayload, {
  files: Schema$1.Array$<typeof FileUploadData>;
  input: Schema$1.Schema<Json>;
}, Schema$1.Struct.Encoded<{
  files: Schema$1.Array$<typeof FileUploadData>;
  input: Schema$1.Schema<Json>;
}>, never, {
  readonly input: Json;
} & {
  readonly files: readonly FileUploadData[];
}, {}, {}>;
/**
 * =============================================================================
 * ======================== Client Action Payloads ============================
 * =============================================================================
 */
declare class UploadActionPayload extends UploadActionPayload_base {}
//#endregion
//#region src/_internal/types.d.ts
type UTRegionAlias = "bom1" | "icn1" | "syd1" | "can1" | "fra1" | "zrh1" | "dub1" | "cle1" | "sfo1" | "sea1";
/**
 * Marker used to select the region based on the incoming request
 */
declare const UTRegion: unique symbol;
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
declare const UTFiles: unique symbol;
type UnsetMarker = "unsetMarker" & {
  __brand: "unsetMarker";
};
type ValidMiddlewareObject = {
  [UTRegion]?: UTRegionAlias;
  [UTFiles]?: Partial<FileUploadDataWithCustomId>[];
  [key: string]: unknown;
};
interface AnyParams {
  _routeOptions: any;
  _input: {
    in: any;
    out: any;
  };
  _metadata: any;
  _adapterFnArgs: Record<string, unknown>;
  _errorShape: any;
  _errorFn: any;
  _output: any;
}
type MiddlewareFn<TInput extends Json | UnsetMarker, TOutput extends ValidMiddlewareObject, TArgs extends Record<string, unknown>> = (opts: TArgs & {
  files: Schema.Type<typeof UploadActionPayload>["files"];
  input: TInput extends UnsetMarker ? undefined : TInput;
}) => MaybePromise<TOutput>;
type UploadCompleteFn<TMetadata, TOutput extends JsonObject | void, TArgs extends Record<string, unknown>> = (opts: TArgs & {
  metadata: TMetadata;
  file: UploadedFileData;
}) => MaybePromise<TOutput>;
type UploadErrorFn<TArgs extends Record<string, unknown>> = (input: TArgs & {
  error: UploadThingError;
  fileKey: string;
}) => MaybePromise<void>;
interface UploadBuilder<TParams extends AnyParams> {
  input: <TIn extends Json, TOut>(parser: TParams["_input"]["in"] extends UnsetMarker ? JsonParser<TIn, TOut> : ErrorMessage<"input is already set">) => UploadBuilder<{
    _routeOptions: TParams["_routeOptions"];
    _input: {
      in: TIn;
      out: TOut;
    };
    _metadata: TParams["_metadata"];
    _adapterFnArgs: TParams["_adapterFnArgs"];
    _errorShape: TParams["_errorShape"];
    _errorFn: TParams["_errorFn"];
    _output: UnsetMarker;
  }>;
  middleware: <TOutput extends ValidMiddlewareObject>(fn: TParams["_metadata"] extends UnsetMarker ? MiddlewareFn<TParams["_input"]["out"], TOutput, TParams["_adapterFnArgs"]> : ErrorMessage<"middleware is already set">) => UploadBuilder<{
    _routeOptions: TParams["_routeOptions"];
    _input: TParams["_input"];
    _metadata: TOutput;
    _adapterFnArgs: TParams["_adapterFnArgs"];
    _errorShape: TParams["_errorShape"];
    _errorFn: TParams["_errorFn"];
    _output: UnsetMarker;
  }>;
  onUploadError: (fn: TParams["_errorFn"] extends UnsetMarker ? UploadErrorFn<TParams["_adapterFnArgs"]> : ErrorMessage<"onUploadError is already set">) => UploadBuilder<{
    _routeOptions: TParams["_routeOptions"];
    _input: TParams["_input"];
    _metadata: TParams["_metadata"];
    _adapterFnArgs: TParams["_adapterFnArgs"];
    _errorShape: TParams["_errorShape"];
    _errorFn: UploadErrorFn<TParams["_adapterFnArgs"]>;
    _output: UnsetMarker;
  }>;
  onUploadComplete: <TOutput extends JsonObject | void>(fn: UploadCompleteFn<Simplify<TParams["_metadata"] extends UnsetMarker ? undefined : Omit<TParams["_metadata"], typeof UTFiles | typeof UTRegion>>, TOutput, TParams["_adapterFnArgs"]>) => FileRoute<{
    input: TParams["_input"]["in"] extends UnsetMarker ? undefined : TParams["_input"]["in"];
    output: TParams["_routeOptions"]["awaitServerData"] extends false ? null : TOutput extends void | undefined ? null : TOutput;
    errorShape: TParams["_errorShape"];
  }>;
}
type AnyBuiltUploaderTypes = {
  input: any;
  output: any;
  errorShape: any;
};
interface FileRoute<TTypes extends AnyBuiltUploaderTypes> {
  $types: TTypes;
  routerConfig: FileRouterInputConfig;
  routeOptions: RouteOptions;
  inputParser: JsonParser<any>;
  middleware: MiddlewareFn<any, ValidMiddlewareObject, any>;
  onUploadError: UploadErrorFn<any>;
  errorFormatter: (err: UploadThingError) => any;
  onUploadComplete: UploadCompleteFn<any, any, any>;
}
type AnyFileRoute = FileRoute<AnyBuiltUploaderTypes>;
/**
 * Map actionType to the required payload for that action
 * @todo Look into using @effect/rpc :thinking:
 */
//#endregion
//#region src/sdk/types.d.ts
interface UTApiOptions {
  /**
   * Provide a custom fetch function.
   * @default globalThis.fetch
   */
  fetch?: FetchEsque;
  /**
   * Provide a custom UploadThing token
   * @default process.env.UPLOADTHING_TOKEN
   */
  token?: string;
  /**
   * @default "info"
   */
  logLevel?: LogLevel.Literal;
  /**
   * What format log entries should be in
   * @default "pretty" in development, else "json"
   * @see https://effect.website/docs/guides/observability/logging#built-in-loggers
   */
  logFormat?: Config.Config.Success<typeof LogFormat>;
  /**
   * Set the default key type for file operations. Allows you to set your preferred filter
   * for file keys or custom identifiers without needing to specify it on every call.
   * @default "fileKey"
   */
  defaultKeyType?: "fileKey" | "customId";
  /**
   * URL override for the API server
   */
  apiUrl?: string;
  /**
   * URL override for the ingest server
   */
  ingestUrl?: string;
  /**
   * Hostname override for the CDN hosting the files
   * @default "ufs.sh"
   */
  ufsHost?: string;
  /**
   * Where to put the appId in the URL.
   * @default "subdomain"
   */
  ufsAppIdLocation?: "subdomain" | "path";
}
type UrlWithOverrides = {
  url: MaybeUrl;
  name?: string;
  customId?: string;
};
type BlobEsque = Blob$1 | Blob;
type FileEsque = BlobEsque & {
  name: string;
  lastModified?: number;
  customId?: string | null | undefined;
};
interface UploadFilesOptions$1 {
  contentDisposition?: ContentDisposition;
  acl?: ACL;
  /**
   * AbortSignal that can be used to cancel the upload
   */
  signal?: AbortSignal;
  /**
   * The number of files to upload concurrently. Must be a positive integer between 1 and 25.
   * @default 1
   */
  concurrency?: number;
}
type UploadFileResult = Either<UploadedFileData, SerializedUploadThingError>;
interface KeyTypeOptionsBase {
  /**
   * Whether the provided key is a fileKey or a custom identifier. fileKey is the
   * identifier you get from UploadThing after uploading a file, customId is a
   * custom identifier you provided when uploading a file.
   * @default fileKey
   */
  keyType?: "fileKey" | "customId";
}
interface DeleteFilesOptions extends KeyTypeOptionsBase {}
interface GetFileUrlsOptions extends KeyTypeOptionsBase {}
interface ListFilesOptions {
  limit?: number;
  offset?: number;
}
type KeyRename = {
  fileKey: string;
  newName: string;
};
type CustomIdRename = {
  customId: string;
  newName: string;
};
type RenameFileUpdate = KeyRename | CustomIdRename;
interface GenerateSignedURLOptions {
  /**
   * How long the URL will be valid for.
   * - Must be positive and less than 7 days (604800 seconds).
   * @default 5min
   */
  expiresIn?: Time;
}
interface GetSignedURLOptions extends KeyTypeOptionsBase {
  /**
   * How long the URL will be valid for.
   * - Must be positive and less than 7 days (604800 seconds).
   * - You must accept overrides on the UploadThing dashboard for this option to be accepted.
   * @default app default on UploadThing dashboard
   */
  expiresIn?: Time;
}
interface ACLUpdateOptions extends KeyTypeOptionsBase {}
//#endregion
//#region src/types.d.ts
type FileRouter = Record<string, AnyFileRoute>;
type inferEndpointInput<TFileRoute extends AnyFileRoute> = TFileRoute["$types"]["input"];
type inferEndpointOutput<TFileRoute extends AnyFileRoute> = TFileRoute["$types"]["output"];
type inferErrorShape<TFileRoute extends AnyFileRoute> = TFileRoute["$types"]["errorShape"];
type RouteHandlerConfig = {
  logLevel?: LogLevel.Literal;
  /**
   * What format log entries should be in
   * @default "pretty" in development, else "json"
   * @see https://effect.website/docs/guides/observability/logging#built-in-loggers
   */
  logFormat?: LogFormat;
  /**
   * The full, absolute URL to where your route handler is hosted. UploadThing
   * attempts to automatically detect this value based on the request URL and
   * headers. You can override this if the automatic detection fails.
   * @example URL { https://www.example.com/api/uploadthing }
   */
  callbackUrl?: string;
  token?: string;
  /**
   * Used to determine whether to run dev hook or not
   * @default `env.NODE_ENV === "development" || env.NODE_ENV === "dev"`
   */
  isDev?: boolean;
  /**
   * Used to override the fetch implementation
   * @default `globalThis.fetch`
   */
  fetch?: FetchEsque;
  /**
   * Set how UploadThing should handle the daemon promise before returning a response to the client.
   * You can also provide a synchronous function that will be called before returning a response to
   * the client. This can be useful for things like:
   * -  [`@vercel/functions.waitUntil`](https://vercel.com/docs/functions/functions-api-reference#waituntil)
   * - [`next/after`](https://nextjs.org/blog/next-15-rc#executing-code-after-a-response-with-nextafter-experimental)
   * - or equivalent function from your serverless infrastructure provider that allows asynchronous streaming
   * If deployed on a stateful server, you most likely want "void" to run the daemon in the background.
   * @remarks - `"await"` is not allowed in development environments
   * @default isDev === true ? "void" : "await"
   */
  handleDaemonPromise?: "void" | "await" | ((promise: Promise<unknown>) => void);
  /**
   * URL override for the ingest server
   */
  ingestUrl?: string;
};
type RouteHandlerOptions<TRouter extends FileRouter> = {
  router: TRouter;
  config?: RouteHandlerConfig;
};
type UploadFilesOptions<TFileRoute extends AnyFileRoute> = {
  /**
   * The files to upload
   */
  files: File[];
  /**
   * An AbortSignal to cancel the upload
   * Calling `abort()` on the parent AbortController will
   * cause this function to throw an `UploadAbortedError`
   */
  signal?: AbortSignal | undefined;
  /**
   * Called when presigned URLs have been retrieved and the file upload is about to begin
   */
  onUploadBegin?: ((opts: {
    file: string;
  }) => void) | undefined;
  /**
   * Called continuously as the file is uploaded to the storage provider
   */
  onUploadProgress?: ((opts: {
    /** The file that triggered the progress event */
    file: File;
    /** Percentage of the file that has been uploaded */
    progress: number;
    /** Total bytes of the file that has been uploaded */
    loaded: number;
    /** How many bytes have been uploaded since the last progress event for this file */
    delta: number;
    /** Total bytes uploaded for all files in this upload */
    totalLoaded: number;
    /** Percentage of the total loaded bytes for the upload */
    totalProgress: number;
  }) => void) | undefined;
  /**
   * This option has been moved to your serverside route config.
   * Please opt-in by setting `awaitServerData: false` in your route
   * config instead.
   * ### Example
   * ```ts
   * f(
   *   { image: { maxFileSize: "1MB" } },
   *   { awaitServerData: false }
   * ).middleware(...)
   * ```
   * @deprecated
   * @see https://docs.uploadthing.com/api-reference/server#route-options
   */
  skipPolling?: ErrorMessage<"This option has been moved to your serverside route config. Please use `awaitServerData` in your route config instead.">;
  /**
   * URL to the UploadThing API endpoint
   * @example URL { http://localhost:3000/api/uploadthing }
   * @example URL { https://www.example.com/api/uploadthing }
   * @remarks This option is not required when `uploadFiles` has been generated with `genUploader`
   */
  url: URL;
  /**
   * Set custom headers that'll get sent with requests
   * to your server
   */
  headers?: HeadersInit | (() => MaybePromise<HeadersInit>) | undefined;
  /**
   * The uploadthing package that is making this request, used to identify the client in the server logs
   * @example "@uploadthing/react"
   * @remarks This option is not required when `uploadFiles` has been generated with `genUploader`
   */
  package: string;
} & ExtendObjectIf<inferEndpointInput<TFileRoute>, {
  input: inferEndpointInput<TFileRoute>;
}>;
type CreateUploadOptions<TFileRoute extends AnyFileRoute> = {
  /**
   * The files to upload
   */
  files: File[];
  /**
   * Called continuously as the file is uploaded to the storage provider
   */
  onUploadProgress?: ((opts: {
    /** The file that triggered the progress event */
    file: File;
    /** Percentage of the file that has been uploaded */
    progress: number;
    /** Total bytes of the file that has been uploaded */
    loaded: number;
    /** How many bytes have been uploaded since the last progress event for this file */
    delta: number;
    /** Total bytes uploaded for all files in this upload */
    totalLoaded: number;
    /** Percentage of the total loaded bytes for the upload */
    totalProgress: number;
  }) => void) | undefined;
  /**
   * Set custom headers that'll get sent with requests
   * to your server
   */
  headers?: HeadersInit | (() => MaybePromise<HeadersInit>) | undefined;
} & ExtendObjectIf<inferEndpointInput<TFileRoute>, {
  input: inferEndpointInput<TFileRoute>;
}>;
type GenerateUploaderOptions = {
  /**
   * URL to the UploadThing API endpoint
   * @example /api/uploadthing
   * @example URL { https://www.example.com/api/uploadthing }
   *
   * If relative, host will be inferred from either the `VERCEL_URL` environment variable or `window.location.origin`
   *
   * @default (VERCEL_URL ?? window.location.origin) + "/api/uploadthing"
   */
  url?: string | URL;
  /**
   * Provide a custom fetch implementation.
   * @default `globalThis.fetch`
   * @example
   * ```ts
   * fetch: (input, init) => {
   *   if (input.toString().startsWith(MY_SERVER_URL)) {
   *     // Include cookies in the request to your API
   *     return fetch(input, {
   *       ...init,
   *       credentials: "include",
   *     });
   *   }
   *
   *   return fetch(input, init);
   * }
   * ```
   */
  fetch?: FetchEsque | undefined;
  /**
   * The uploadthing package that is making this request
   * @example "@uploadthing/react"
   *
   * This is used to identify the client in the server logs
   */
  package?: string;
};
type EndpointArg<TRouter extends FileRouter, TEndpoint extends keyof TRouter> = TEndpoint | ((_: RouteRegistry<TRouter>) => TEndpoint);
type RouteRegistry<TRouter extends FileRouter> = { [k in keyof TRouter]: k };
//#endregion
export { ACLUpdateOptions, type AnyFileRoute, type ClientUploadedFileData, CreateUploadOptions, DeleteFilesOptions, EndpointArg, type EndpointMetadata, type ExpandedRouteConfig$1 as ExpandedRouteConfig, FileEsque, type FileRoute, FileRouter, type FileUploadData, type FileUploadDataWithCustomId, GenerateSignedURLOptions, GenerateUploaderOptions, GetFileUrlsOptions, GetSignedURLOptions, ListFilesOptions, type NewPresignedUrl, RenameFileUpdate, RouteHandlerConfig, RouteHandlerOptions, RouteRegistry, UTApiOptions, UTFiles, UTRegion, type UTRegionAlias, UnsetMarker, UploadBuilder, UploadFileResult, UploadFilesOptions, UploadFilesOptions$1, UploadThingToken, type UploadedFileData, UrlWithOverrides, inferEndpointInput, inferEndpointOutput, inferErrorShape };
//# sourceMappingURL=types-DiVC1t2V.d.cts.map