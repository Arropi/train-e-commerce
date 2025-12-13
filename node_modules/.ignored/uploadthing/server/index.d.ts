import { ACLUpdateOptions, DeleteFilesOptions, FileEsque, FileRouter, GetFileUrlsOptions, GetSignedURLOptions, ListFilesOptions, RenameFileUpdate, RouteHandlerOptions, UTApiOptions, UTFiles, UTRegion, UnsetMarker, UploadBuilder, UploadFileResult, UploadFilesOptions$1 as UploadFilesOptions, UrlWithOverrides } from "../dist/types-Bs3w2d_3.js";
import { CreateBuilderOptions, createBuilder } from "../dist/upload-builder-BcFawEj0.js";
import * as _uploadthing_shared0 from "@uploadthing/shared";
import { ACL, Json, MaybeUrl, UploadThingError, UploadThingError as UploadThingError$1 } from "@uploadthing/shared";
import * as Effect from "effect/Effect";
import "@effect/platform/HttpRouter";
import "effect/Context";

//#region src/_internal/handler.d.ts

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
declare const makeAdapterHandler: <Args extends any[], AdapterArgs extends Record<string, unknown>>(makeAdapterArgs: (...args: Args) => Effect.Effect<AdapterArgs>, toRequest: (...args: Args) => Effect.Effect<Request>, opts: RouteHandlerOptions<FileRouter>, beAdapter?: string) => ((...args: Args) => Promise<Response>);
//#endregion
//#region src/sdk/ut-file.d.ts
interface UTFilePropertyBag extends BlobPropertyBag {
  lastModified?: number | undefined;
  customId?: string | undefined;
}
/**
 * Extension of the Blob class that simplifies setting the `name` and `customId` properties,
 * similar to the built-in File class from Node > 20.
 */
declare class UTFile extends Blob {
  name: string;
  lastModified: number;
  customId: string | undefined;
  constructor(parts: BlobPart[], name: string, options?: UTFilePropertyBag);
}
//#endregion
//#region src/sdk/index.d.ts
declare class UTApi {
  private fetch;
  private defaultKeyType;
  private runtime;
  private opts;
  constructor(options?: UTApiOptions);
  private requestUploadThing;
  private executeAsync;
  /**
   * Upload files to UploadThing storage.
   *
   * @example
   * await uploadFiles(new File(["foo"], "foo.txt"));
   *
   * @example
   * await uploadFiles([
   *   new File(["foo"], "foo.txt"),
   *   new File(["bar"], "bar.txt"),
   * ]);
   */
  uploadFiles(files: FileEsque, opts?: UploadFilesOptions): Promise<UploadFileResult>;
  uploadFiles(files: FileEsque[], opts?: UploadFilesOptions): Promise<UploadFileResult[]>;
  /**
   * @param {string} url The URL of the file to upload
   * @param {Json} metadata JSON-parseable metadata to attach to the uploaded file(s)
   *
   * @example
   * await uploadFileFromUrl("https://uploadthing.com/f/2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
   *
   * @example
   * await uploadFileFromUrl([
   *   "https://uploadthing.com/f/2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg",
   *   "https://uploadthing.com/f/1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"
   * ])
   */
  uploadFilesFromUrl(urls: MaybeUrl | UrlWithOverrides, opts?: UploadFilesOptions): Promise<UploadFileResult>;
  uploadFilesFromUrl(urls: (MaybeUrl | UrlWithOverrides)[], opts?: UploadFilesOptions): Promise<UploadFileResult[]>;
  /**
   * Request to delete files from UploadThing storage.
   * @param {string | string[]} fileKeys
   *
   * @example
   * await deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
   *
   * @example
   * await deleteFiles(["2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg","1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"])
   *
   * @example
   * await deleteFiles("myCustomIdentifier", { keyType: "customId" })
   */
  deleteFiles: (keys: string[] | string, opts?: DeleteFilesOptions) => Promise<{
    readonly success: boolean;
    readonly deletedCount: number;
  }>;
  /**
   * Request file URLs from UploadThing storage.
   * @param {string | string[]} fileKeys
   *
   * @example
   * const data = await getFileUrls("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
   * console.log(data); // [{key: "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg", url: "https://uploadthing.com/f/2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg"}]
   *
   * @example
   * const data = await getFileUrls(["2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg","1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"])
   * console.log(data) // [{key: "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg", url: "https://uploadthing.com/f/2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg" },{key: "1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg", url: "https://uploadthing.com/f/1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"}]
   *
   * @deprecated - See https://docs.uploadthing.com/working-with-files#accessing-files for info how to access files
   */
  getFileUrls: (keys: string[] | string, opts?: GetFileUrlsOptions) => Promise<{
    readonly data: readonly {
      readonly url: string;
      readonly key: string;
    }[];
  }>;
  /**
   * Request file list from UploadThing storage.
   * @param {object} opts
   * @param {number} opts.limit The maximum number of files to return
   * @param {number} opts.offset The number of files to skip
   *
   * @example
   * const data = await listFiles({ limit: 1 });
   * console.log(data); // { key: "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg", id: "2e0fdb64-9957-4262-8e45-f372ba903ac8" }
   */
  listFiles: (opts?: ListFilesOptions) => Promise<{
    readonly files: readonly {
      readonly name: string;
      readonly size: number;
      readonly customId: string | null;
      readonly key: string;
      readonly id: string;
      readonly status: "Deletion Pending" | "Failed" | "Uploaded" | "Uploading";
      readonly uploadedAt: number;
    }[];
    readonly hasMore: boolean;
  }>;
  renameFiles: (updates: RenameFileUpdate | RenameFileUpdate[]) => Promise<{
    readonly success: boolean;
  }>;
  getUsageInfo: () => Promise<{
    readonly totalBytes: number;
    readonly appTotalBytes: number;
    readonly filesUploaded: number;
    readonly limitBytes: number;
  }>;
  /**
   * Generate a presigned url for a private file
   * Unlike {@link getSignedURL}, this method does not make a fetch request to the UploadThing API
   * and is the recommended way to generate a presigned url for a private file.
   **/
  generateSignedURL: (key: string, opts?: GetSignedURLOptions) => Promise<{
    ufsUrl: string;
  }>;
  /**
   * Request a presigned url for a private file(s)
   * @remarks This method is no longer recommended as it makes a fetch
   * request to the UploadThing API which incurs redundant latency. It
   * will be deprecated in UploadThing v8 and removed in UploadThing v9.
   *
   * @see {@link generateSignedURL} for a more efficient way to generate a presigned url
   **/
  getSignedURL: (key: string, opts?: GetSignedURLOptions) => Promise<{
    readonly url: string;
    readonly ufsUrl: string;
  }>;
  /**
   * Update the ACL of a file or set of files.
   *
   * @example
   * // Make a single file public
   * await utapi.updateACL("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg", "public-read");
   *
   * // Make multiple files private
   * await utapi.updateACL(
   *   [
   *     "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg",
   *     "1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg",
   *   ],
   *   "private",
   * );
   */
  updateACL: (keys: string | string[], acl: ACL, opts?: ACLUpdateOptions) => Promise<{
    readonly success: boolean;
  }>;
}
//#endregion
//#region src/server.d.ts
type AdapterArgs$1 = {
  req: Request;
};
declare const createUploadthing: <TErrorShape extends Json>(opts?: CreateBuilderOptions<TErrorShape>) => <TRouteOptions extends _uploadthing_shared0.RouteOptions>(input: _uploadthing_shared0.FileRouterInputConfig, config?: TRouteOptions | undefined) => UploadBuilder<{
  _routeOptions: TRouteOptions;
  _input: {
    in: UnsetMarker;
    out: UnsetMarker;
  };
  _metadata: UnsetMarker;
  _adapterFnArgs: AdapterArgs$1;
  _errorShape: TErrorShape;
  _errorFn: UnsetMarker;
  _output: UnsetMarker;
}>;
declare const createRouteHandler: <TRouter extends FileRouter>(opts: RouteHandlerOptions<TRouter>) => (args_0: Request | {
  request: Request;
}) => Promise<Response>;
declare const extractRouterConfig: (router: FileRouter) => {
  slug: string;
  config: _uploadthing_shared0.ExpandedRouteConfig;
}[];
//#endregion
export { type FileRouter, UTApi, UTFile, UTFiles, UploadThingError, createBuilder, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion, extractRouterConfig, makeAdapterHandler };
//# sourceMappingURL=index.d.ts.map