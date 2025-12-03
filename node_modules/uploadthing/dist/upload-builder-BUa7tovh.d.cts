import { UnsetMarker, UploadBuilder } from "./types-DiVC1t2V.cjs";
import { FileRouterInputConfig, Json, RouteOptions, UploadThingError } from "@uploadthing/shared";

//#region src/_internal/upload-builder.d.ts
type CreateBuilderOptions<TErrorShape extends Json> = {
  errorFormatter: (err: UploadThingError) => TErrorShape;
};
/**
 * Create a builder for your backend adapter.
 * Refer to the existing adapters for examples on how to use this function.
 * @public
 *
 * @param opts - Options for the builder
 * @returns A file route builder for making UploadThing file routes
 */
declare function createBuilder<TAdapterFnArgs extends Record<string, unknown>, TErrorShape extends Json = {
  message: string;
}>(opts?: CreateBuilderOptions<TErrorShape>): <TRouteOptions extends RouteOptions>(input: FileRouterInputConfig, config?: TRouteOptions) => UploadBuilder<{
  _routeOptions: TRouteOptions;
  _input: {
    in: UnsetMarker;
    out: UnsetMarker;
  };
  _metadata: UnsetMarker;
  _adapterFnArgs: TAdapterFnArgs;
  _errorShape: TErrorShape;
  _errorFn: UnsetMarker;
  _output: UnsetMarker;
}>;
//#endregion
export { CreateBuilderOptions, createBuilder };
//# sourceMappingURL=upload-builder-BUa7tovh.d.cts.map