const require_chunk = require('./chunk-CUT6urMc.cjs');
const __uploadthing_shared = require_chunk.__toESM(require("@uploadthing/shared"));
const effect_Schema = require_chunk.__toESM(require("effect/Schema"));

//#region src/_internal/shared-schemas.ts
const ContentDispositionSchema = effect_Schema.Literal(...__uploadthing_shared.ValidContentDispositions);
const ACLSchema = effect_Schema.Literal(...__uploadthing_shared.ValidACLs);
/**
* Valid options for the `?actionType` query param
*/
const ActionType = effect_Schema.Literal("upload");
/**
* Valid options for the `uploadthing-hook` header
* for requests coming from UT server
*/
const UploadThingHook = effect_Schema.Literal("callback", "error");
/**
* =============================================================================
* =========================== Configuration ===================================
* =============================================================================
*/
const DecodeString = effect_Schema.transform(effect_Schema.Uint8ArrayFromSelf, effect_Schema.String, {
	decode: (data) => new TextDecoder().decode(data),
	encode: (data) => new TextEncoder().encode(data)
});
const ParsedToken = effect_Schema.Struct({
	apiKey: effect_Schema.Redacted(effect_Schema.String.pipe(effect_Schema.startsWith("sk_"))),
	appId: effect_Schema.String,
	regions: effect_Schema.NonEmptyArray(effect_Schema.String),
	ingestHost: effect_Schema.String.pipe(effect_Schema.optionalWith({ default: () => "ingest.uploadthing.com" }))
});
const UploadThingToken = effect_Schema.Uint8ArrayFromBase64.pipe(effect_Schema.compose(DecodeString), effect_Schema.compose(effect_Schema.parseJson(ParsedToken)));
/**
* =============================================================================
* ======================== File Type Hierarchy ===============================
* =============================================================================
*/
/**
* Properties from the web File object, this is what the client sends when initiating an upload
*/
var FileUploadData = class extends effect_Schema.Class("FileUploadData")({
	name: effect_Schema.String,
	size: effect_Schema.Number,
	type: effect_Schema.String,
	lastModified: effect_Schema.Number.pipe(effect_Schema.optional)
}) {};
/**
* `.middleware()` can add a customId to the incoming file data
*/
var FileUploadDataWithCustomId = class extends FileUploadData.extend("FileUploadDataWithCustomId")({ customId: effect_Schema.NullOr(effect_Schema.String) }) {};
/**
* When files are uploaded, we get back
* - a key
* - URLs for the file
* - the hash (md5-hex) of the uploaded file's contents
*/
var UploadedFileData = class extends FileUploadDataWithCustomId.extend("UploadedFileData")({
	key: effect_Schema.String,
	url: effect_Schema.String,
	appUrl: effect_Schema.String,
	ufsUrl: effect_Schema.String,
	fileHash: effect_Schema.String
}) {};
var MetadataFetchStreamPart = class extends effect_Schema.Class("MetadataFetchStreamPart")({
	payload: effect_Schema.String,
	signature: effect_Schema.String,
	hook: UploadThingHook
}) {};
var MetadataFetchResponse = class extends effect_Schema.Class("MetadataFetchResponse")({ ok: effect_Schema.Boolean }) {};
var CallbackResultResponse = class extends effect_Schema.Class("CallbackResultResponse")({ ok: effect_Schema.Boolean }) {};
/**
* =============================================================================
* ======================== Client Action Payloads ============================
* =============================================================================
*/
var UploadActionPayload = class extends effect_Schema.Class("UploadActionPayload")({
	files: effect_Schema.Array(FileUploadData),
	input: effect_Schema.Unknown
}) {};

//#endregion
Object.defineProperty(exports, 'ActionType', {
  enumerable: true,
  get: function () {
    return ActionType;
  }
});
Object.defineProperty(exports, 'CallbackResultResponse', {
  enumerable: true,
  get: function () {
    return CallbackResultResponse;
  }
});
Object.defineProperty(exports, 'MetadataFetchResponse', {
  enumerable: true,
  get: function () {
    return MetadataFetchResponse;
  }
});
Object.defineProperty(exports, 'MetadataFetchStreamPart', {
  enumerable: true,
  get: function () {
    return MetadataFetchStreamPart;
  }
});
Object.defineProperty(exports, 'UploadActionPayload', {
  enumerable: true,
  get: function () {
    return UploadActionPayload;
  }
});
Object.defineProperty(exports, 'UploadThingHook', {
  enumerable: true,
  get: function () {
    return UploadThingHook;
  }
});
Object.defineProperty(exports, 'UploadThingToken', {
  enumerable: true,
  get: function () {
    return UploadThingToken;
  }
});
Object.defineProperty(exports, 'UploadedFileData', {
  enumerable: true,
  get: function () {
    return UploadedFileData;
  }
});