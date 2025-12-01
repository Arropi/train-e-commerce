const require_chunk = require('./chunk-CUT6urMc.cjs');
const __uploadthing_shared = require_chunk.__toESM(require("@uploadthing/shared"));
const uploadthing_client = require_chunk.__toESM(require("uploadthing/client"));
const react = require_chunk.__toESM(require("react"));

//#region package.json
var peerDependencies = {
	"next": "*",
	"react": "^17.0.2 || ^18.0.0 || ^19.0.0",
	"uploadthing": "^7.2.0"
};

//#endregion
//#region src/utils/useEvent.ts
const noop = () => void 0;
/**
* Suppress the warning when using useLayoutEffect with SSR. (https://reactjs.org/link/uselayouteffect-ssr)
* Make use of useInsertionEffect if available.
*/
const useInsertionEffect = typeof window !== "undefined" ? react.default.useInsertionEffect : noop;
/**
* Similar to useCallback, with a few subtle differences:
* - The returned function is a stable reference, and will always be the same between renders
* - No dependency lists required
* - Properties or state accessed within the callback will always be "current"
*/
function useEvent(callback) {
	const latestRef = react.default.useRef(useEvent_shouldNotBeInvokedBeforeMount);
	useInsertionEffect(() => {
		latestRef.current = callback;
	}, [callback]);
	const stableRef = react.default.useRef(null);
	stableRef.current ??= function() {
		return latestRef.current.apply(this, arguments);
	};
	return stableRef.current;
}
/**
* Render methods should be pure, especially when concurrency is used,
* so we will throw this error if the callback is called while rendering.
*/
function useEvent_shouldNotBeInvokedBeforeMount() {
	throw new Error("INVALID_USEEVENT_INVOCATION: the callback from useEvent cannot be invoked before the component has mounted.");
}

//#endregion
//#region src/utils/useFetch.ts
function useFetch(fetch, url, options) {
	const cache = (0, react.useRef)({});
	const cancelRequest = (0, react.useRef)(false);
	const initialState = {
		error: void 0,
		data: void 0
	};
	const fetchReducer = (state$1, action) => {
		switch (action.type) {
			case "loading": return { ...initialState };
			case "fetched": return {
				...initialState,
				data: action.payload
			};
			case "error": return {
				...initialState,
				error: action.payload
			};
			default: return state$1;
		}
	};
	const [state, dispatch] = (0, react.useReducer)(fetchReducer, initialState);
	(0, react.useEffect)(() => {
		if (!url) return;
		cancelRequest.current = false;
		const fetchData = async () => {
			dispatch({ type: "loading" });
			if (cache.current[url]) {
				dispatch({
					type: "fetched",
					payload: cache.current[url]
				});
				return;
			}
			try {
				const response = await fetch(url, options);
				if (!response.ok) throw new Error(response.statusText);
				const dataOrError = await (0, __uploadthing_shared.safeParseJSON)(response);
				if (dataOrError instanceof Error) throw dataOrError;
				cache.current[url] = dataOrError;
				if (cancelRequest.current) return;
				dispatch({
					type: "fetched",
					payload: dataOrError
				});
			} catch (error) {
				if (cancelRequest.current) return;
				dispatch({
					type: "error",
					payload: error
				});
			}
		};
		fetchData();
		return () => {
			cancelRequest.current = true;
		};
	}, [url]);
	return state;
}
var useFetch_default = useFetch;

//#endregion
//#region src/use-uploadthing.ts
const useRouteConfig = (fetch, url, endpoint) => {
	const maybeServerData = globalThis.__UPLOADTHING;
	const { data } = useFetch_default(fetch, maybeServerData ? void 0 : url.href);
	return (maybeServerData ?? data)?.find((x) => x.slug === endpoint)?.config;
};
/**
* @internal - This is an internal function. Use `generateReactHelpers` instead.
* The actual hook we export for public usage is generated from `generateReactHelpers`
* which has the URL and FileRouter generic pre-bound.
*/
function useUploadThingInternal(url, endpoint, fetch, opts) {
	const progressGranularity = opts?.uploadProgressGranularity ?? "coarse";
	const { uploadFiles, routeRegistry } = (0, uploadthing_client.genUploader)({
		fetch,
		url,
		package: "@uploadthing/react"
	});
	const [isUploading, setUploading] = (0, react.useState)(false);
	const uploadProgress = (0, react.useRef)(0);
	const fileProgress = (0, react.useRef)(/* @__PURE__ */ new Map());
	const startUpload = useEvent(async (...args) => {
		const files = await opts?.onBeforeUploadBegin?.(args[0]) ?? args[0];
		const input = args[1];
		setUploading(true);
		files.forEach((f) => fileProgress.current.set(f, 0));
		opts?.onUploadProgress?.(0);
		try {
			const res = await uploadFiles(endpoint, {
				signal: opts?.signal,
				headers: opts?.headers,
				files,
				onUploadProgress: (progress) => {
					if (!opts?.onUploadProgress) return;
					fileProgress.current.set(progress.file, progress.progress);
					let sum = 0;
					fileProgress.current.forEach((p) => {
						sum += p;
					});
					const averageProgress = (0, __uploadthing_shared.roundProgress)(Math.min(100, sum / fileProgress.current.size), progressGranularity);
					if (averageProgress !== uploadProgress.current) {
						opts.onUploadProgress(averageProgress);
						uploadProgress.current = averageProgress;
					}
				},
				onUploadBegin({ file }) {
					if (!opts?.onUploadBegin) return;
					opts.onUploadBegin(file);
				},
				input
			});
			await opts?.onClientUploadComplete?.(res);
			return res;
		} catch (e) {
			/**
			* This is the only way to introduce this as a non-breaking change
			* TODO: Consider refactoring API in the next major version
			*/
			if (e instanceof __uploadthing_shared.UploadAbortedError) throw e;
			let error;
			if (e instanceof __uploadthing_shared.UploadThingError) error = e;
			else {
				error = (0, __uploadthing_shared.INTERNAL_DO_NOT_USE__fatalClientError)(e);
				console.error("Something went wrong. Please contact UploadThing and provide the following cause:", error.cause instanceof Error ? error.cause.toString() : error.cause);
			}
			await opts?.onUploadError?.(error);
		} finally {
			setUploading(false);
			fileProgress.current = /* @__PURE__ */ new Map();
			uploadProgress.current = 0;
		}
	});
	const _endpoint = (0, __uploadthing_shared.unwrap)(endpoint, routeRegistry);
	const routeConfig = useRouteConfig(fetch, url, _endpoint);
	return {
		startUpload,
		isUploading,
		routeConfig
	};
}
/** @internal - This is an internal function. Use `generateReactHelpers` instead. */
const __useUploadThingInternal = useUploadThingInternal;
const generateReactHelpers = (initOpts) => {
	(0, __uploadthing_shared.warnIfInvalidPeerDependency)("@uploadthing/react", peerDependencies.uploadthing, uploadthing_client.version);
	const fetch = initOpts?.fetch ?? globalThis.fetch;
	const url = (0, __uploadthing_shared.resolveMaybeUrlArg)(initOpts?.url);
	const clientHelpers = (0, uploadthing_client.genUploader)({
		fetch,
		url,
		package: "@uploadthing/react"
	});
	function useUploadThing(endpoint, opts) {
		return __useUploadThingInternal(url, endpoint, fetch, opts);
	}
	function getRouteConfig(slug) {
		const maybeServerData = globalThis.__UPLOADTHING;
		const endpoint = (0, __uploadthing_shared.unwrap)(slug, clientHelpers.routeRegistry);
		const config = maybeServerData?.find((x) => x.slug === endpoint)?.config;
		if (!config) throw new Error(`No config found for endpoint "${endpoint.toString()}". Please make sure to use the NextSSRPlugin in your Next.js app.`);
		return config;
	}
	return {
		useUploadThing,
		...clientHelpers,
		getRouteConfig
	};
};

//#endregion
Object.defineProperty(exports, '__useUploadThingInternal', {
  enumerable: true,
  get: function () {
    return __useUploadThingInternal;
  }
});
Object.defineProperty(exports, 'generateReactHelpers', {
  enumerable: true,
  get: function () {
    return generateReactHelpers;
  }
});
Object.defineProperty(exports, 'peerDependencies', {
  enumerable: true,
  get: function () {
    return peerDependencies;
  }
});
Object.defineProperty(exports, 'useEvent', {
  enumerable: true,
  get: function () {
    return useEvent;
  }
});