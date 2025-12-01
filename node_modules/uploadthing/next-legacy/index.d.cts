import { FileRouter, RouteHandlerOptions, UTFiles, UTRegion, UnsetMarker, UploadBuilder } from "../dist/types-DiVC1t2V.cjs";
import { CreateBuilderOptions } from "../dist/upload-builder-BUa7tovh.cjs";
import * as _uploadthing_shared4 from "@uploadthing/shared";
import { Json } from "@uploadthing/shared";
import { NextApiRequest, NextApiResponse } from "next";

//#region src/next-legacy.d.ts

type AdapterArgs = {
  req: NextApiRequest;
  res: NextApiResponse;
};
declare const createUploadthing: <TErrorShape extends Json>(opts?: CreateBuilderOptions<TErrorShape>) => <TRouteOptions extends _uploadthing_shared4.RouteOptions>(input: _uploadthing_shared4.FileRouterInputConfig, config?: TRouteOptions | undefined) => UploadBuilder<{
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
declare const createRouteHandler: <TRouter extends FileRouter>(opts: RouteHandlerOptions<TRouter>) => (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
//#endregion
export { type FileRouter, UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.d.cts.map