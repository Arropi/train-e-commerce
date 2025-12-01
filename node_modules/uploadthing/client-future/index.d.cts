import { AnyFileRoute, EndpointArg, FileRouter, GenerateUploaderOptions, NewPresignedUrl, RouteRegistry } from "../dist/types-DiVC1t2V.cjs";
import * as effect_Types0 from "effect/Types";
import { LazyArg } from "effect/Function";
import * as Micro from "effect/Micro";
import { FetchContext, FetchError, MaybePromise, UploadAbortedError, UploadAbortedError as UploadAbortedError$1, UploadPausedError, generateClientDropzoneAccept, generateMimeTypes, generatePermittedFileTypes } from "@uploadthing/shared";

//#region src/_internal/random-hex.d.ts
type TraceHeaders = {
  b3: string;
  traceparent: string;
};
//#endregion
//#region src/_internal/client-future.d.ts
declare const XHRError_base: new <A extends Record<string, any> = {}>(args: effect_Types0.Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] }) => Micro.YieldableError & {
  readonly _tag: "XHRError";
} & Readonly<A>;
/**
 * Error indicating the XHR request failed
 * @public
 */
declare class XHRError extends XHRError_base<{
  message: string;
  xhr: unknown;
}> {}
/**
 * Error indicating the network request failed
 * @public
 */
type NetworkError = XHRError | FetchError;
declare const UTStorageError_base: new <A extends Record<string, any> = {}>(args: effect_Types0.Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] }) => Micro.YieldableError & {
  readonly _tag: "UTStorageError";
} & Readonly<A>;
/**
 * Error indicating the upload was rejected during upload to the storage provider
 * @public
 */
declare class UTStorageError extends UTStorageError_base<{
  message: string;
  response: unknown;
}> {}
declare const UTServerError_base: new <A extends Record<string, any> = {}>(args: effect_Types0.Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] }) => Micro.YieldableError & {
  readonly _tag: "UTServerError";
} & Readonly<A>;
/**
 * Error indicating the request to your UploadThing server failed
 * @public
 */
declare class UTServerError<TErrorShape> extends UTServerError_base<{
  message: string;
  cause: unknown;
  /**
   * Matches the shape returned by your error formatter
   */
  data: TErrorShape;
}> {}
/**
 * Error indicating the upload failed
 * @public
 */
type UploadThingClientError<TErrorShape> = UploadAbortedError$1 | NetworkError | UTStorageError | UTServerError<TErrorShape>;
/**
 * A file that has not started uploading yet.
 * Can either be pending for the presigned request to resolve,
 * or pending for the browser to schedule the network request.
 * @public
 */
interface PendingFile extends File {
  status: "pending";
  /**
   * How many bytes of the file has been uploaded
   * @example 0
   */
  sent: number;
  /**
   * The key of the file. Null before the presigned request resolves.
   */
  key: string | null;
  /**
   * The customId of the file. Null before the presigned request resolves, then present if your file route sets it
   */
  customId: string | null;
}
/**
 * A file that is currently uploading.
 * @public
 */
interface UploadingFile extends File {
  status: "uploading";
  /**
   * How many bytes of the file has been uploaded
   * @example 2500
   */
  sent: number;
  /**
   * The key of the file.
   */
  key: string;
  /**
   * The customId of the file, if your file route sets it
   */
  customId: string | null;
}
/**
 * A file that failed to upload.
 * @public
 */
interface FailedFile<TRoute extends AnyFileRoute> extends File {
  status: "failed";
  /**
   * How many bytes of the file were uploaded before the upload failed.
   * @example 2500
   */
  sent: number;
  /**
   * The key of the file.
   */
  key: string;
  /**
   * The customId of the file, if your file route sets it
   */
  customId: string | null;
  /**
   * The error that occurred during the upload.
   */
  reason: UploadThingClientError<TRoute["$types"]["errorShape"]>;
}
/**
 * A file that has been uploaded successfully.
 * @public
 */
interface UploadedFile<TRoute extends AnyFileRoute> extends File {
  status: "uploaded";
  /**
   * How many bytes of the file has been uploaded.
   * @example 10000
   */
  sent: number;
  /**
   * The key of the file.
   */
  key: string;
  /**
   * The customId of the file, if your file route sets it
   */
  customId: string | null;
  /**
   * The url of the file.
   * @example "https://APP_ID.ufs.sh/f/KEY"
   */
  url: string;
  /**
   * The data returned by the serverside `onUploadComplete` callback.
   * @example { uploadedBy: "user_123" }
   */
  data: TRoute["$types"]["output"];
  /**
   * The hash ( <> checksum ) of the file.
   */
  hash: string;
}
/**
 * A web file with additional state properties
 * @public
 */
type AnyFile<TFileRoute extends AnyFileRoute> = PendingFile | UploadingFile | FailedFile<TFileRoute> | UploadedFile<TFileRoute>;
/**
 * Predicate function to check if a file is pending
 * @public
 */
declare function isPendingFile<TRoute extends AnyFileRoute = AnyFileRoute>(file: AnyFile<TRoute>): file is PendingFile;
/**
 * Predicate function to check if a file is uploading
 * @public
 */
declare function isUploadingFile<TRoute extends AnyFileRoute = AnyFileRoute>(file: AnyFile<TRoute>): file is UploadingFile;
/**
 * Predicate function to check if a file is failed
 * @public
 */
declare function isFailedFile<TRoute extends AnyFileRoute = AnyFileRoute>(file: AnyFile<TRoute>): file is FailedFile<TRoute>;
/**
 * Predicate function to check if a file is uploaded
 * @public
 */
declare function isUploadedFile<TRoute extends AnyFileRoute = AnyFileRoute>(file: AnyFile<TRoute>): file is UploadedFile<TRoute>;
/**
 * @internal
 */
declare function makePendingFile(file: File): PendingFile;
/**
 * Modifies a pending or uploading file to a failed file in place
 * @internal
 */
declare function transitionToFailed<TRoute extends AnyFileRoute>(file: PendingFile | UploadingFile, reason: UploadThingClientError<TRoute["$types"]["errorShape"]>): FailedFile<TRoute>;
/**
 * Event emitted when the presigned URLs have been retrieved from your server
 * @public
 */
interface PresignedReceivedEvent<TRoute extends AnyFileRoute> {
  type: "presigned-received";
  /**
   * All files that are being uploaded as part of this action.
   */
  files: AnyFile<TRoute>[];
}
/**
 * Event emitted when a file starts uploading
 * @public
 */
interface UploadStartedEvent<TRoute extends AnyFileRoute> {
  type: "upload-started";
  /**
   * The file that started uploading.
   */
  file: UploadingFile;
  /**
   * All files that are being uploaded as part of this action.
   */
  files: AnyFile<TRoute>[];
}
/**
 * Event emitted when a file is uploading and received a progress update
 * @public
 */
interface UploadProgressEvent<TRoute extends AnyFileRoute> {
  type: "upload-progress";
  /**
   * The file that is currently uploading and received a progress update.
   */
  file: UploadingFile;
  /**
   * All files that are being uploaded as part of this action.
   */
  files: AnyFile<TRoute>[];
}
/**
 * Event emitted when a file has finished uploading
 * @public
 */
interface UploadCompletedEvent<TRoute extends AnyFileRoute> {
  type: "upload-completed";
  /**
   * The file that finished uploading.
   */
  file: UploadedFile<TRoute>;
  /**
   * All files that are being uploaded as part of this action.
   */
  files: AnyFile<TRoute>[];
}
/**
 * Event emitted when a file failed to upload
 * @public
 */
interface UploadFailedEvent<TRoute extends AnyFileRoute> {
  type: "upload-failed";
  /**
   * The file that failed to upload.
   */
  file: FailedFile<TRoute>;
  /**
   * All files that are being uploaded as part of this action.
   */
  files: AnyFile<TRoute>[];
}
interface UploadAbortedEvent<TRoute extends AnyFileRoute> {
  type: "upload-aborted";
  files: AnyFile<TRoute>[];
}
/**
 * Event emitted throughout the upload process
 * @public
 */
type UploadEvent<TRoute extends AnyFileRoute> = PresignedReceivedEvent<TRoute> | UploadStartedEvent<TRoute> | UploadProgressEvent<TRoute> | UploadCompletedEvent<TRoute> | UploadFailedEvent<TRoute> | UploadAbortedEvent<TRoute>;
interface UploadFileOptions<TRoute extends AnyFileRoute> {
  file: PendingFile;
  files: AnyFile<TRoute>[];
  input: TRoute["$types"]["input"];
  onEvent: (event: UploadEvent<TRoute>) => void;
  traceHeaders: TraceHeaders;
  XHRImpl: new () => XMLHttpRequest;
}
/**
 * Upload a file to the storage provider
 * Throughout the upload, the file's status and progress will be updated
 * @remarks This function never rejects
 * @internal
 */
declare function uploadFile<TRoute extends AnyFileRoute>(url: string, {
  file,
  files,
  XHRImpl,
  ...options
}: UploadFileOptions<TRoute>): Micro.Micro<UploadedFile<TRoute> | FailedFile<TRoute>, never, FetchContext>;
interface RequestPresignedUrlsOptions<TRouter extends FileRouter, TEndpoint extends keyof TRouter> {
  /**
   * The URL to your UploadThing server endpoint
   * @example URL { https://www.example.com/api/uploadthing }
   */
  url: URL;
  /**
   * The slug to your UploadThing FileRoute
   * @example "imageUploader"
   */
  endpoint: TEndpoint;
  /**
   * The files to request presigned URLs for
   */
  files: File[];
  /**
   * The route input for the endpoint
   */
  input?: TRouter[TEndpoint]["$types"]["input"];
  /**
   * Custom headers to send with the request
   * @example { Authorization: "Bearer 123" }
   */
  headers?: HeadersInit | LazyArg<MaybePromise<HeadersInit>> | undefined;
  /**
   * Custom trace headers to send with the request
   */
  traceHeaders: TraceHeaders;
  /**
   * The uploadthing package that is making this request, used to identify the client in the server logs
   * @example "@uploadthing/react"
   */
  package?: string | undefined;
}
/**
 * Request presigned URLs from your server for a set of files
 * @internal
 */
declare function requestPresignedUrls<TRouter extends FileRouter, TEndpoint extends keyof TRouter>(options: RequestPresignedUrlsOptions<TRouter, TEndpoint>): Micro.Micro<ReadonlyArray<NewPresignedUrl>, UTServerError<TRouter[TEndpoint]["$types"]["errorShape"]>, FetchContext>;
interface UploadFilesOptions<TRoute extends AnyFileRoute> {
  url: URL;
  files: File[];
  input?: TRoute["$types"]["input"];
  onEvent: (event: UploadEvent<TRoute>) => void;
  headers?: HeadersInit | LazyArg<MaybePromise<HeadersInit>> | undefined;
  package?: string | undefined;
  signal?: AbortSignal | undefined;
}
/**
 * Upload a set of files to the storage provider
 * @internal
 */
declare function uploadFiles<TRouter extends FileRouter, TEndpoint extends keyof TRouter>(endpoint: TEndpoint, options: UploadFilesOptions<TRouter[TEndpoint]>): Micro.Micro<(FailedFile<TRouter[TEndpoint]> | UploadedFile<TRouter[TEndpoint]>)[], UTServerError<TRouter[TEndpoint]["$types"]["errorShape"]>, FetchContext>;
//#endregion
//#region src/client-future.d.ts
declare const version: string;
/**
 * Generate a typed uploader for a given FileRouter
 * @public
 * @remarks This API is not covered by semver
 */
declare const future_genUploader: <TRouter extends FileRouter>(initOpts?: GenerateUploaderOptions) => {
  uploadFiles: <TEndpoint extends keyof TRouter>(slug: EndpointArg<TRouter, TEndpoint>, opts: Omit<UploadFilesOptions<TRouter[TEndpoint]>, keyof GenerateUploaderOptions>) => Promise<(FailedFile<TRouter[TEndpoint]> | UploadedFile<TRouter[TEndpoint]>)[]>;
  createUpload: <TEndpoint extends keyof TRouter>(slug: EndpointArg<TRouter, TEndpoint>, options: Omit<UploadFilesOptions<TRouter[TEndpoint]>, keyof GenerateUploaderOptions>) => Promise<{
    pauseUpload: (file?: File) => void;
    abortUpload: (file?: File) => void;
    resumeUpload: (file?: File) => void;
    done: <T extends AnyFile<TRouter[TEndpoint]> | void = void>(file?: T) => Promise<T extends AnyFile<TRouter[TEndpoint]> ? UploadedFile<TRouter[TEndpoint]> | FailedFile<TRouter[TEndpoint]> : (UploadedFile<TRouter[TEndpoint]> | FailedFile<TRouter[TEndpoint]>)[]>;
  }>;
  /**
   * Identity object that can be used instead of raw strings
   * that allows "Go to definition" in your IDE to bring you
   * to the backend definition of a route.
   */
  routeRegistry: RouteRegistry<TRouter>;
};
//#endregion
export { AnyFile, FailedFile, NetworkError, PendingFile, PresignedReceivedEvent, RequestPresignedUrlsOptions, UTServerError, UTStorageError, UploadAbortedError, UploadAbortedEvent, UploadCompletedEvent, UploadEvent, UploadFailedEvent, UploadFileOptions, UploadFilesOptions, UploadPausedError, UploadProgressEvent, UploadStartedEvent, UploadThingClientError, UploadedFile, UploadingFile, XHRError, future_genUploader, generateClientDropzoneAccept, generateMimeTypes, generatePermittedFileTypes, isFailedFile, isPendingFile, isUploadedFile, isUploadingFile, makePendingFile, requestPresignedUrls, transitionToFailed, uploadFile, uploadFiles, version };
//# sourceMappingURL=index.d.cts.map