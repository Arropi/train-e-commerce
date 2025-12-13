const require_chunk = require('../dist/chunk-CUT6urMc.cjs');
const require_package = require('../dist/package-BQ_k22T9.cjs');
const require_ut_reporter = require('../dist/ut-reporter-BHoyNnzW.cjs');
const effect_Array = require_chunk.__toESM(require("effect/Array"));
const effect_Micro = require_chunk.__toESM(require("effect/Micro"));
const __uploadthing_shared = require_chunk.__toESM(require("@uploadthing/shared"));
const effect_Predicate = require_chunk.__toESM(require("effect/Predicate"));

//#region src/_internal/client-future.ts
/**
* Error indicating the XHR request failed
* @public
*/
var XHRError = class extends effect_Micro.TaggedError("XHRError") {};
/**
* Error indicating the upload was rejected during upload to the storage provider
* @public
*/
var UTStorageError = class extends effect_Micro.TaggedError("UTStorageError") {};
/**
* Error indicating the request to your UploadThing server failed
* @public
*/
var UTServerError = class extends effect_Micro.TaggedError("UTServerError") {};
/**
* Predicate function to check if a file is pending
* @public
*/
function isPendingFile(file) {
	return file.status === "pending";
}
/**
* Predicate function to check if a file is uploading
* @public
*/
function isUploadingFile(file) {
	return file.status === "uploading";
}
/**
* Predicate function to check if a file is failed
* @public
*/
function isFailedFile(file) {
	return file.status === "failed";
}
/**
* Predicate function to check if a file is uploaded
* @public
*/
function isUploadedFile(file) {
	return file.status === "uploaded";
}
/**
* @internal
*/
function makePendingFile(file) {
	return Object.assign(file, {
		status: "pending",
		sent: 0,
		key: null,
		customId: null
	});
}
/**
* Modifies a pending file to an uploading file in place
* @internal
*/
function transitionToUploading(file, rangeStart) {
	const uploadingFile = file;
	uploadingFile.sent = rangeStart;
	uploadingFile.status = "uploading";
	return uploadingFile;
}
/**
* Modifies an uploading file to an uploaded file in place
* @internal
*/
function transitionToUploaded(file, xhrResult) {
	const uploadedFile = file;
	uploadedFile.status = "uploaded";
	uploadedFile.data = xhrResult.serverData;
	uploadedFile.hash = xhrResult.fileHash;
	uploadedFile.url = xhrResult.ufsUrl;
	return uploadedFile;
}
/**
* Modifies a pending or uploading file to a failed file in place
* @internal
*/
function transitionToFailed(file, reason) {
	const failedFile = file;
	failedFile.status = "failed";
	failedFile.reason = reason;
	return failedFile;
}
/**
* Upload a file to the storage provider
* Throughout the upload, the file's status and progress will be updated
* @remarks This function never rejects
* @internal
*/
function uploadFile(url, { file, files, XHRImpl,...options }) {
	return (0, __uploadthing_shared.fetchEff)(url, {
		method: "HEAD",
		headers: options.traceHeaders
	}).pipe(effect_Micro.map(({ headers }) => Number.parseInt(headers.get("x-ut-range-start") ?? "0")), effect_Micro.map((rangeStart) => transitionToUploading(file, rangeStart)), effect_Micro.tap((uploadingFile) => {
		options.onEvent({
			type: "upload-started",
			file: uploadingFile,
			files
		});
	}), effect_Micro.flatMap((uploadingFile) => effect_Micro.async((resume) => {
		const xhr = new XHRImpl();
		xhr.open("PUT", url, true);
		const rangeStart = uploadingFile.sent;
		xhr.setRequestHeader("Range", `bytes=${rangeStart}-`);
		xhr.setRequestHeader("x-uploadthing-version", require_package.version);
		xhr.setRequestHeader("b3", options.traceHeaders.b3);
		xhr.setRequestHeader("traceparent", options.traceHeaders.traceparent);
		xhr.responseType = "json";
		xhr.upload.addEventListener("progress", (ev) => {
			uploadingFile.sent = rangeStart + ev.loaded;
			options.onEvent({
				type: "upload-progress",
				file: uploadingFile,
				files
			});
		});
		xhr.addEventListener("load", () => {
			if (xhr.status > 299 || effect_Predicate.hasProperty(xhr.response, "error")) resume(new UTStorageError({
				message: String(xhr.response.error),
				response: xhr.response
			}));
			else {
				const uploadedFile = transitionToUploaded(uploadingFile, xhr.response);
				options.onEvent({
					type: "upload-completed",
					file: uploadedFile,
					files
				});
				resume(effect_Micro.succeed(uploadedFile));
			}
		});
		xhr.addEventListener("error", () => {
			resume(new XHRError({
				message: `XHR failed ${xhr.status} ${xhr.statusText}`,
				xhr
			}));
		});
		const formData = new FormData();
		/**
		* iOS/React Native FormData handling requires special attention:
		*
		* Issue: In React Native, iOS crashes with "attempt to insert nil object" when appending File directly
		* to FormData. This happens because iOS tries to create NSDictionary from the file object and expects
		* specific structure {uri, type, name}.
		*
		*
		* Note: Don't try to use Blob or modify File object - iOS specifically needs plain object
		* with these properties to create valid NSDictionary.
		*/
		if ("uri" in file) formData.append("file", {
			uri: file.uri,
			type: file.type,
			name: file.name,
			...rangeStart > 0 && { range: rangeStart }
		});
		else formData.append("file", rangeStart > 0 ? file.slice(rangeStart) : file);
		xhr.send(formData);
		return effect_Micro.sync(() => xhr.abort());
	})), effect_Micro.catchAll((error) => {
		const failedFile = transitionToFailed(file, error);
		options.onEvent({
			type: "upload-failed",
			file: failedFile,
			files
		});
		return effect_Micro.succeed(failedFile);
	}));
}
/**
* Request presigned URLs from your server for a set of files
* @internal
*/
function requestPresignedUrls(options) {
	const reportEventToUT = require_ut_reporter.createUTReporter({
		endpoint: String(options.endpoint),
		package: options.package,
		url: options.url,
		headers: options.headers,
		traceHeaders: options.traceHeaders
	});
	return reportEventToUT("upload", {
		input: options.input,
		files: options.files.map((f) => ({
			name: f.name,
			size: f.size,
			type: f.type,
			lastModified: f.lastModified
		}))
	}).pipe(effect_Micro.mapError((error) => new UTServerError({
		message: error.message,
		cause: error,
		data: error.data
	})));
}
/**
* Upload a set of files to the storage provider
* @internal
*/
function uploadFiles(endpoint, options) {
	const pendingFiles = options.files.map(makePendingFile);
	const traceHeaders = require_ut_reporter.generateTraceHeaders();
	return requestPresignedUrls({
		endpoint,
		files: options.files,
		url: options.url,
		input: options.input,
		headers: options.headers,
		package: options.package,
		traceHeaders
	}).pipe(effect_Micro.map(effect_Array.zip(pendingFiles)), effect_Micro.tap((pairs) => {
		for (const [presigned, file] of pairs) {
			file.key = presigned.key;
			file.customId = presigned.customId;
		}
		options.onEvent({
			type: "presigned-received",
			files: pendingFiles
		});
	}), effect_Micro.flatMap((pairs) => effect_Micro.forEach(pairs, ([presigned, file]) => uploadFile(presigned.url, {
		file,
		files: pendingFiles,
		input: options.input,
		onEvent: options.onEvent,
		XHRImpl: globalThis.XMLHttpRequest,
		traceHeaders
	}), { concurrency: 6 })));
}

//#endregion
//#region src/client-future.ts
const version$1 = require_package.version;
/**
* Generate a typed uploader for a given FileRouter
* @public
* @remarks This API is not covered by semver
*/
const future_genUploader = (initOpts) => {
	const routeRegistry = (0, __uploadthing_shared.createIdentityProxy)();
	const controllableUpload = async (slug, options) => {
		const endpoint = typeof slug === "function" ? slug(routeRegistry) : slug;
		const fetchFn = initOpts?.fetch ?? window.fetch;
		const traceHeaders = require_ut_reporter.generateTraceHeaders();
		const pExit = await requestPresignedUrls({
			endpoint: String(endpoint),
			files: options.files,
			url: (0, __uploadthing_shared.resolveMaybeUrlArg)(initOpts?.url),
			input: options.input,
			headers: options.headers,
			traceHeaders
		}).pipe(effect_Micro.provideService(__uploadthing_shared.FetchContext, fetchFn), (effect) => effect_Micro.runPromiseExit(effect, options.signal && { signal: options.signal }));
		if (pExit._tag === "Failure") throw effect_Micro.causeSquash(pExit.cause);
		const presigneds = pExit.value;
		const pendingFiles = options.files.map(makePendingFile);
		options.onEvent({
			type: "presigned-received",
			files: pendingFiles
		});
		const uploads = /* @__PURE__ */ new Map();
		const uploadEffect = (file, presigned) => uploadFile(presigned.url, {
			file,
			files: pendingFiles,
			input: options.input,
			onEvent: options.onEvent,
			traceHeaders,
			XHRImpl: globalThis.XMLHttpRequest
		}).pipe(effect_Micro.provideService(__uploadthing_shared.FetchContext, fetchFn));
		for (const [presigned, file] of effect_Array.zip(presigneds, pendingFiles)) {
			file.key = presigned.key;
			file.customId = presigned.customId;
			const deferred = require_ut_reporter.createDeferred();
			uploads.set(file, {
				presigned,
				deferred
			});
			effect_Micro.runPromiseExit(uploadEffect(file, presigned), { signal: deferred.ac.signal }).then((result) => {
				if (result._tag === "Success") return deferred.resolve(result.value);
				else if (result.cause._tag === "Interrupt") throw new __uploadthing_shared.UploadPausedError();
				throw effect_Micro.causeSquash(result.cause);
			}).catch((err) => {
				if (err instanceof __uploadthing_shared.UploadPausedError) return;
				deferred.reject(err);
			});
		}
		/**
		* Pause an ongoing upload
		* @param file The file upload you want to pause. Can be omitted to pause all files
		*/
		const pauseUpload = (file) => {
			const files = effect_Array.ensure(file ?? options.files);
			for (const file$1 of files) {
				const upload = uploads.get(file$1);
				if (!upload) return;
				if (upload.deferred.ac.signal.aborted) return;
				upload.deferred.ac.abort();
			}
		};
		/**
		* Abort an upload
		* @param file The file upload you want to abort. Can be omitted to abort all files
		*/
		const abortUpload = (file) => {
			const files = effect_Array.ensure(file ?? options.files);
			for (const file$1 of files) {
				const upload = uploads.get(file$1);
				if (!upload) throw "No upload found";
				if (upload.deferred.ac.signal.aborted === false) {
					upload.deferred.ac.abort();
					const failedFile = transitionToFailed(file$1, new __uploadthing_shared.UploadAbortedError());
					upload.deferred.resolve(failedFile);
				}
			}
			options.onEvent({
				type: "upload-aborted",
				files
			});
		};
		options.signal?.addEventListener("abort", () => {
			abortUpload();
		});
		/**
		* Resume a paused upload
		* @param file The file upload you want to resume. Can be omitted to resume all files
		*/
		const resumeUpload = (file) => {
			const files = effect_Array.ensure(file ?? options.files);
			for (const file$1 of files) {
				const upload = uploads.get(file$1);
				if (!upload) throw "No upload found";
				upload.deferred.ac = new AbortController();
				effect_Micro.runPromiseExit(uploadEffect(file$1, upload.presigned), { signal: upload.deferred.ac.signal }).then((result) => {
					if (result._tag === "Success") return upload.deferred.resolve(result.value);
					else if (result.cause._tag === "Interrupt") throw new __uploadthing_shared.UploadPausedError();
					throw effect_Micro.causeSquash(result.cause);
				}).catch((err) => {
					if (err instanceof __uploadthing_shared.UploadPausedError) return;
					upload.deferred.reject(err);
				});
			}
		};
		/**
		* Wait for an upload to complete
		* @param file The file upload you want to wait for. Can be omitted to wait for all files
		*/
		const done = async (file) => {
			const promises = [];
			const files = effect_Array.ensure(file ?? options.files);
			for (const file$1 of files) {
				const upload = uploads.get(file$1);
				if (!upload) throw "No upload found";
				promises.push(upload.deferred.promise);
			}
			const results = await Promise.all(promises);
			return file ? results[0] : results;
		};
		return {
			pauseUpload,
			abortUpload,
			resumeUpload,
			done
		};
	};
	const uploadFiles$1 = (slug, opts) => controllableUpload(slug, opts).then((_) => _.done());
	return {
		uploadFiles: uploadFiles$1,
		createUpload: controllableUpload,
		routeRegistry
	};
};

//#endregion
exports.UTServerError = UTServerError;
exports.UTStorageError = UTStorageError;
Object.defineProperty(exports, 'UploadAbortedError', {
  enumerable: true,
  get: function () {
    return __uploadthing_shared.UploadAbortedError;
  }
});
Object.defineProperty(exports, 'UploadPausedError', {
  enumerable: true,
  get: function () {
    return __uploadthing_shared.UploadPausedError;
  }
});
exports.XHRError = XHRError;
exports.future_genUploader = future_genUploader;
Object.defineProperty(exports, 'generateClientDropzoneAccept', {
  enumerable: true,
  get: function () {
    return __uploadthing_shared.generateClientDropzoneAccept;
  }
});
Object.defineProperty(exports, 'generateMimeTypes', {
  enumerable: true,
  get: function () {
    return __uploadthing_shared.generateMimeTypes;
  }
});
Object.defineProperty(exports, 'generatePermittedFileTypes', {
  enumerable: true,
  get: function () {
    return __uploadthing_shared.generatePermittedFileTypes;
  }
});
exports.isFailedFile = isFailedFile;
exports.isPendingFile = isPendingFile;
exports.isUploadedFile = isUploadedFile;
exports.isUploadingFile = isUploadingFile;
exports.makePendingFile = makePendingFile;
exports.requestPresignedUrls = requestPresignedUrls;
exports.transitionToFailed = transitionToFailed;
exports.uploadFile = uploadFile;
exports.uploadFiles = uploadFiles;
exports.version = version$1;