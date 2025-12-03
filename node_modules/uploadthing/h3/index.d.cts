import { FileRouter, RouteHandlerOptions, UTFiles, UTRegion, UnsetMarker, UploadBuilder } from "../dist/types-DiVC1t2V.cjs";
import { CreateBuilderOptions } from "../dist/upload-builder-BUa7tovh.cjs";
import * as _uploadthing_shared12 from "@uploadthing/shared";
import { Json } from "@uploadthing/shared";
import * as h30 from "h3";
import { H3Event } from "h3";

//#region src/h3.d.ts

type AdapterArgs = {
  event: H3Event;
};
declare const createUploadthing: <TErrorShape extends Json>(opts?: CreateBuilderOptions<TErrorShape>) => <TRouteOptions extends _uploadthing_shared12.RouteOptions>(input: _uploadthing_shared12.FileRouterInputConfig, config?: TRouteOptions | undefined) => UploadBuilder<{
  _routeOptions: TRouteOptions;
  _input: {
    in: UnsetMarker;
    out: UnsetMarker;
  };
  _metadata: UnsetMarker;
  _adapterFnArgs: AdapterArgs;
  _errorShape: TErrorShape;
  _errorFn: UnsetMarker;
  _output: UnsetMarker;
}>;
declare const createRouteHandler: <TRouter extends FileRouter>(opts: RouteHandlerOptions<TRouter>) => h30.EventHandler<h30.EventHandlerRequest, Promise<Response>>;
//#endregion
export { type FileRouter, UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.d.cts.map