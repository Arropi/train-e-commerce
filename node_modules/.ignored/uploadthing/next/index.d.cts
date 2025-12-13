import { FileRouter, RouteHandlerOptions, UTFiles, UTRegion, UnsetMarker, UploadBuilder } from "../dist/types-DiVC1t2V.cjs";
import { CreateBuilderOptions } from "../dist/upload-builder-BUa7tovh.cjs";
import * as _uploadthing_shared2 from "@uploadthing/shared";
import { Json } from "@uploadthing/shared";
import { NextRequest } from "next/server";

//#region src/next.d.ts

type AdapterArgs = {
  req: NextRequest;
};
declare const createUploadthing: <TErrorShape extends Json>(opts?: CreateBuilderOptions<TErrorShape>) => <TRouteOptions extends _uploadthing_shared2.RouteOptions>(input: _uploadthing_shared2.FileRouterInputConfig, config?: TRouteOptions | undefined) => UploadBuilder<{
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
declare const createRouteHandler: <TRouter extends FileRouter>(opts: RouteHandlerOptions<TRouter>) => {
  POST: (args_0: NextRequest) => Promise<Response>;
  GET: (args_0: NextRequest) => Promise<Response>;
};
//#endregion
export { type FileRouter, UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.d.cts.map