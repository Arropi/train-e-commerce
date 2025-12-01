import { FileRouter, RouteHandlerOptions, UTFiles, UTRegion, UnsetMarker, UploadBuilder } from "../dist/types-DiVC1t2V.cjs";
import { CreateBuilderOptions } from "../dist/upload-builder-BUa7tovh.cjs";
import * as _uploadthing_shared8 from "@uploadthing/shared";
import { Json } from "@uploadthing/shared";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

//#region src/fastify.d.ts

type AdapterArgs = {
  req: FastifyRequest;
  res: FastifyReply;
};
declare const createUploadthing: <TErrorShape extends Json>(opts?: CreateBuilderOptions<TErrorShape>) => <TRouteOptions extends _uploadthing_shared8.RouteOptions>(input: _uploadthing_shared8.FileRouterInputConfig, config?: TRouteOptions | undefined) => UploadBuilder<{
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
declare const createRouteHandler: <TRouter extends FileRouter>(fastify: FastifyInstance, opts: RouteHandlerOptions<TRouter>, done: (err?: Error) => void) => void;
//#endregion
export { type FileRouter, UTFiles, createRouteHandler, createUploadthing, UTRegion as experimental_UTRegion };
//# sourceMappingURL=index.d.cts.map