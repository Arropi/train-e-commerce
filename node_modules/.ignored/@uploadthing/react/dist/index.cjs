const require_chunk = require('./chunk-CUT6urMc.cjs');
const require_use_uploadthing = require('./use-uploadthing-Bh3O-Ajc.cjs');
const __uploadthing_shared = require_chunk.__toESM(require("@uploadthing/shared"));
const uploadthing_client = require_chunk.__toESM(require("uploadthing/client"));
const react = require_chunk.__toESM(require("react"));
const react_jsx_runtime = require_chunk.__toESM(require("react/jsx-runtime"));
const file_selector = require_chunk.__toESM(require("file-selector"));

//#region src/utils/usePaste.ts
const usePaste = (callback) => {
	const stableCallback = require_use_uploadthing.useEvent(callback);
	(0, react.useEffect)(() => {
		const controller = new AbortController();
		window.addEventListener("paste", stableCallback, { signal: controller.signal });
		return () => {
			controller.abort();
		};
	}, [stableCallback]);
};

//#endregion
//#region src/components/shared.tsx
function Spinner() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		className: "z-10 block h-5 w-5 animate-spin align-middle text-white",
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 576 512",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"
		})
	});
}
function Cancel({ className, cn,...props }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: cn("fill-none stroke-current stroke-2", className),
		...props,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m4.9 4.9 14.2 14.2" })]
	});
}

//#endregion
//#region src/components/button.tsx
/**
* @remarks It is not recommended using this directly as it requires manually binding generics. Instead, use `createUploadButton`.
* @example
* <UploadButton<OurFileRouter, "someEndpoint">
*   endpoint="someEndpoint"
*   onUploadComplete={(res) => console.log(res)}
*   onUploadError={(err) => console.log(err)}
* />
*/
function UploadButton(props) {
	const $props = props;
	const { mode = "auto", appendOnPaste = false, cn = __uploadthing_shared.defaultClassListMerger } = $props.config ?? {};
	const acRef = (0, react.useRef)(new AbortController());
	const fileInputRef = (0, react.useRef)(null);
	const [uploadProgress, setUploadProgress] = (0, react.useState)($props.__internal_upload_progress ?? 0);
	const [files, setFiles] = (0, react.useState)([]);
	const { startUpload, isUploading, routeConfig } = require_use_uploadthing.__useUploadThingInternal((0, __uploadthing_shared.resolveMaybeUrlArg)($props.url), $props.endpoint, $props.fetch ?? globalThis.fetch, {
		signal: acRef.current.signal,
		headers: $props.headers,
		onClientUploadComplete: (res) => {
			if (fileInputRef.current) fileInputRef.current.value = "";
			setFiles([]);
			$props.onClientUploadComplete?.(res);
			setUploadProgress(0);
		},
		uploadProgressGranularity: $props.uploadProgressGranularity,
		onUploadProgress: (p) => {
			setUploadProgress(p);
			$props.onUploadProgress?.(p);
		},
		onUploadError: $props.onUploadError,
		onUploadBegin: $props.onUploadBegin,
		onBeforeUploadBegin: $props.onBeforeUploadBegin
	});
	const { fileTypes, multiple } = (0, __uploadthing_shared.generatePermittedFileTypes)(routeConfig);
	const disabled = !!($props.__internal_button_disabled ?? $props.disabled);
	const state = (() => {
		const ready = $props.__internal_state === "ready" || fileTypes.length > 0;
		if ($props.__internal_state) return $props.__internal_state;
		if (disabled) return "disabled";
		if (!ready) return "readying";
		if (!isUploading) return "ready";
		return "uploading";
	})();
	const uploadFiles = (0, react.useCallback)((files$1) => {
		const input = "input" in $props ? $props.input : void 0;
		startUpload(files$1, input).catch((e) => {
			if (e instanceof __uploadthing_shared.UploadAbortedError) $props.onUploadAborted?.();
			else throw e;
		});
	}, [$props, startUpload]);
	const onUploadClick = (e) => {
		if (state === "uploading") {
			e.preventDefault();
			e.stopPropagation();
			acRef.current.abort();
			acRef.current = new AbortController();
			return;
		}
		if (mode === "manual" && files.length > 0) {
			e.preventDefault();
			e.stopPropagation();
			uploadFiles(files);
		}
	};
	const inputProps = (0, react.useMemo)(() => ({
		type: "file",
		ref: fileInputRef,
		multiple,
		accept: (0, __uploadthing_shared.generateMimeTypes)(fileTypes).join(", "),
		onChange: (e) => {
			if (!e.target.files) return;
			const selectedFiles = Array.from(e.target.files);
			$props.onChange?.(selectedFiles);
			if (mode === "manual") {
				setFiles(selectedFiles);
				return;
			}
			uploadFiles(selectedFiles);
		},
		disabled,
		tabIndex: disabled ? -1 : 0
	}), [
		$props,
		disabled,
		fileTypes,
		mode,
		multiple,
		uploadFiles
	]);
	usePaste((event) => {
		if (!appendOnPaste) return;
		if (document.activeElement !== fileInputRef.current) return;
		const pastedFiles = (0, __uploadthing_shared.getFilesFromClipboardEvent)(event);
		if (!pastedFiles) return;
		let filesToUpload = pastedFiles;
		setFiles((prev) => {
			filesToUpload = [...prev, ...pastedFiles];
			$props.onChange?.(filesToUpload);
			return filesToUpload;
		});
		if (mode === "auto") uploadFiles(files);
	});
	const styleFieldArg = (0, react.useMemo)(() => ({
		ready: state !== "readying",
		isUploading: state === "uploading",
		uploadProgress,
		fileTypes,
		files
	}), [
		fileTypes,
		files,
		state,
		uploadProgress
	]);
	const renderButton = () => {
		const customContent = (0, __uploadthing_shared.contentFieldToContent)($props.content?.button, styleFieldArg);
		if (customContent) return customContent;
		switch (state) {
			case "readying": return "Loading...";
			case "uploading":
				if (uploadProgress >= 100) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, {});
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "z-50",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "block group-hover:hidden",
						children: [Math.round(uploadProgress), "%"]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Cancel, {
						cn,
						className: "hidden size-4 group-hover:block"
					})]
				});
			case "disabled":
			case "ready":
			default:
				if (mode === "manual" && files.length > 0) return `Upload ${files.length} file${files.length === 1 ? "" : "s"}`;
				return `Choose File${inputProps.multiple ? `(s)` : ``}`;
		}
	};
	const renderClearButton = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
		onClick: () => {
			setFiles([]);
			if (fileInputRef.current) fileInputRef.current.value = "";
			$props.onChange?.([]);
		},
		className: cn("h-[1.25rem] cursor-pointer rounded border-none bg-transparent text-gray-500 transition-colors hover:bg-slate-200 hover:text-gray-600", (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.clearBtn, styleFieldArg)),
		style: (0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.clearBtn, styleFieldArg),
		"data-state": state,
		"data-ut-element": "clear-btn",
		children: (0, __uploadthing_shared.contentFieldToContent)($props.content?.clearBtn, styleFieldArg) ?? "Clear"
	});
	const renderAllowedContent = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: cn("h-[1.25rem] text-xs leading-5 text-gray-600", (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.allowedContent, styleFieldArg)),
		style: (0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.allowedContent, styleFieldArg),
		"data-state": state,
		"data-ut-element": "allowed-content",
		children: (0, __uploadthing_shared.contentFieldToContent)($props.content?.allowedContent, styleFieldArg) ?? (0, __uploadthing_shared.allowedContentTextLabelGenerator)(routeConfig)
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center gap-1", $props.className, (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.container, styleFieldArg)),
		style: {
			"--progress-width": `${uploadProgress}%`,
			...(0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.container, styleFieldArg)
		},
		"data-state": state,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
			className: cn("group relative flex h-10 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-md text-white after:transition-[width] after:duration-500 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2", "disabled:pointer-events-none", "data-[state=disabled]:cursor-not-allowed data-[state=readying]:cursor-not-allowed", "data-[state=disabled]:bg-blue-400 data-[state=ready]:bg-blue-600 data-[state=readying]:bg-blue-400 data-[state=uploading]:bg-blue-400", "after:absolute after:left-0 after:h-full after:w-[var(--progress-width)] after:content-[''] data-[state=uploading]:after:bg-blue-600", (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.button, styleFieldArg)),
			style: (0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.button, styleFieldArg),
			"data-state": state,
			"data-ut-element": "button",
			onClick: onUploadClick,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				...inputProps,
				className: "sr-only"
			}), renderButton()]
		}), mode === "manual" && files.length > 0 ? renderClearButton() : renderAllowedContent()]
	});
}

//#endregion
//#region src/components/dropzone.tsx
function UploadDropzone(props) {
	const $props = props;
	const { mode = "manual", appendOnPaste = false, cn = __uploadthing_shared.defaultClassListMerger } = $props.config ?? {};
	const acRef = (0, react.useRef)(new AbortController());
	const [files, setFiles] = (0, react.useState)([]);
	const [uploadProgress, setUploadProgress] = (0, react.useState)($props.__internal_upload_progress ?? 0);
	const { startUpload, isUploading, routeConfig } = require_use_uploadthing.__useUploadThingInternal((0, __uploadthing_shared.resolveMaybeUrlArg)($props.url), $props.endpoint, $props.fetch ?? globalThis.fetch, {
		signal: acRef.current.signal,
		headers: $props.headers,
		onClientUploadComplete: (res) => {
			setFiles([]);
			$props.onClientUploadComplete?.(res);
			setUploadProgress(0);
		},
		uploadProgressGranularity: $props.uploadProgressGranularity,
		onUploadProgress: (p) => {
			setUploadProgress(p);
			$props.onUploadProgress?.(p);
		},
		onUploadError: $props.onUploadError,
		onUploadBegin: $props.onUploadBegin,
		onBeforeUploadBegin: $props.onBeforeUploadBegin
	});
	const { fileTypes, multiple } = (0, __uploadthing_shared.generatePermittedFileTypes)(routeConfig);
	const disabled = !!($props.__internal_dropzone_disabled ?? $props.disabled);
	const state = (() => {
		const ready = $props.__internal_ready ?? ($props.__internal_state === "ready" || fileTypes.length > 0);
		if ($props.__internal_state) return $props.__internal_state;
		if (disabled) return "disabled";
		if (!ready) return "readying";
		if (!isUploading) return "ready";
		return "uploading";
	})();
	const uploadFiles = (0, react.useCallback)((files$1) => {
		const input = "input" in $props ? $props.input : void 0;
		startUpload(files$1, input).catch((e) => {
			if (e instanceof __uploadthing_shared.UploadAbortedError) $props.onUploadAborted?.();
			else throw e;
		});
	}, [$props, startUpload]);
	const onUploadClick = (e) => {
		if (state === "uploading") {
			e.preventDefault();
			e.stopPropagation();
			acRef.current.abort();
			acRef.current = new AbortController();
			return;
		}
		if (mode === "manual" && files.length > 0) {
			e.preventDefault();
			e.stopPropagation();
			uploadFiles(files);
		}
	};
	const onDrop = (0, react.useCallback)((acceptedFiles) => {
		$props.onDrop?.(acceptedFiles);
		$props.onChange?.(acceptedFiles);
		setFiles(acceptedFiles);
		if (mode === "auto") uploadFiles(acceptedFiles);
	}, [
		$props,
		mode,
		uploadFiles
	]);
	const { getRootProps, getInputProps, isDragActive, rootRef } = useDropzone({
		onDrop,
		multiple,
		accept: (0, __uploadthing_shared.generateClientDropzoneAccept)(fileTypes),
		disabled
	});
	usePaste((event) => {
		if (!appendOnPaste) return;
		if (document.activeElement !== rootRef.current) return;
		const pastedFiles = (0, __uploadthing_shared.getFilesFromClipboardEvent)(event);
		if (!pastedFiles?.length) return;
		let filesToUpload = pastedFiles;
		setFiles((prev) => {
			filesToUpload = [...prev, ...pastedFiles];
			$props.onChange?.(filesToUpload);
			return filesToUpload;
		});
		$props.onChange?.(filesToUpload);
		if (mode === "auto") uploadFiles(filesToUpload);
	});
	const styleFieldArg = (0, react.useMemo)(() => ({
		ready: state !== "readying",
		isUploading: state === "uploading",
		uploadProgress,
		fileTypes,
		files,
		isDragActive
	}), [
		fileTypes,
		files,
		state,
		uploadProgress,
		isDragActive
	]);
	const getUploadButtonContents = () => {
		const customContent = (0, __uploadthing_shared.contentFieldToContent)($props.content?.button, styleFieldArg);
		if (customContent) return customContent;
		switch (state) {
			case "readying": return "Loading...";
			case "uploading":
				if (uploadProgress >= 100) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, {});
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "z-50",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "block group-hover:hidden",
						children: [Math.round(uploadProgress), "%"]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Cancel, {
						cn,
						className: "hidden size-4 group-hover:block"
					})]
				});
			case "disabled":
			case "ready":
			default:
				if (mode === "manual" && files.length > 0) return `Upload ${files.length} file${files.length === 1 ? "" : "s"}`;
				return `Choose File${multiple ? `(s)` : ``}`;
		}
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: cn("mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center", isDragActive && "bg-blue-600/10", $props.className, (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.container, styleFieldArg)),
		...getRootProps(),
		style: (0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.container, styleFieldArg),
		"data-state": state,
		children: [
			(0, __uploadthing_shared.contentFieldToContent)($props.content?.uploadIcon, styleFieldArg) ?? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 20 20",
				className: cn("mx-auto block h-12 w-12 align-middle text-gray-400", (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.uploadIcon, styleFieldArg)),
				style: (0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.uploadIcon, styleFieldArg),
				"data-ut-element": "upload-icon",
				"data-state": state,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					fill: "currentColor",
					fillRule: "evenodd",
					d: "M5.5 17a4.5 4.5 0 0 1-1.44-8.765a4.5 4.5 0 0 1 8.302-3.046a3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z",
					clipRule: "evenodd"
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				className: cn("relative mt-4 flex w-64 cursor-pointer items-center justify-center text-sm font-semibold leading-6 text-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500", state === "ready" ? "text-blue-600" : "text-gray-500", (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.label, styleFieldArg)),
				style: (0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.label, styleFieldArg),
				"data-ut-element": "label",
				"data-state": state,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					className: "sr-only",
					...getInputProps()
				}), (0, __uploadthing_shared.contentFieldToContent)($props.content?.label, styleFieldArg) ?? (state === "ready" ? `Choose ${multiple ? "file(s)" : "a file"} or drag and drop` : `Loading...`)]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: cn("m-0 h-[1.25rem] text-xs leading-5 text-gray-600", (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.allowedContent, styleFieldArg)),
				style: (0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.allowedContent, styleFieldArg),
				"data-ut-element": "allowed-content",
				"data-state": state,
				children: (0, __uploadthing_shared.contentFieldToContent)($props.content?.allowedContent, styleFieldArg) ?? (0, __uploadthing_shared.allowedContentTextLabelGenerator)(routeConfig)
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: cn("group relative mt-4 flex h-10 w-36 items-center justify-center overflow-hidden rounded-md border-none text-base text-white", "after:absolute after:left-0 after:h-full after:w-[var(--progress-width)] after:bg-blue-600 after:transition-[width] after:duration-500 after:content-['']", "focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2", "disabled:pointer-events-none", "data-[state=disabled]:cursor-not-allowed data-[state=readying]:cursor-not-allowed", "data-[state=disabled]:bg-blue-400 data-[state=ready]:bg-blue-600 data-[state=readying]:bg-blue-400 data-[state=uploading]:bg-blue-400", (0, __uploadthing_shared.styleFieldToClassName)($props.appearance?.button, styleFieldArg)),
				style: {
					"--progress-width": `${uploadProgress}%`,
					...(0, __uploadthing_shared.styleFieldToCssObject)($props.appearance?.button, styleFieldArg)
				},
				onClick: onUploadClick,
				"data-ut-element": "button",
				"data-state": state,
				type: "button",
				disabled: files.length === 0 || state === "disabled",
				children: getUploadButtonContents()
			})
		]
	});
}
/**
* A React hook that creates a drag 'n' drop area.
*
* ### Example
*
* ```tsx
* function MyDropzone() {
*   const { getRootProps, getInputProps } = useDropzone({
*     onDrop: acceptedFiles => {
*       // do something with the File objects, e.g. upload to some server
*     }
*   });
*
*   return (
*     <div {...getRootProps()}>
*       <input {...getInputProps()} />
*       <p>Drag and drop some files here, or click to select files</p>
*     </div>
*   )
* }
* ```
*/
function useDropzone({ accept, disabled = false, maxSize = Number.POSITIVE_INFINITY, minSize = 0, multiple = true, maxFiles = 0, onDrop }) {
	const acceptAttr = (0, react.useMemo)(() => (0, __uploadthing_shared.acceptPropAsAcceptAttr)(accept), [accept]);
	const rootRef = (0, react.useRef)(null);
	const inputRef = (0, react.useRef)(null);
	const dragTargetsRef = (0, react.useRef)([]);
	const [state, dispatch] = (0, react.useReducer)(__uploadthing_shared.reducer, __uploadthing_shared.initialState);
	(0, react.useEffect)(() => {
		const onWindowFocus = () => {
			if (state.isFileDialogActive) setTimeout(() => {
				if (inputRef.current) {
					const { files } = inputRef.current;
					if (!files?.length) dispatch({ type: "closeDialog" });
				}
			}, 300);
		};
		const controller = new AbortController();
		window.addEventListener("focus", onWindowFocus, { signal: controller.signal });
		return () => {
			controller.abort();
		};
	}, [state.isFileDialogActive]);
	(0, react.useEffect)(() => {
		const onDocumentDrop = (event) => {
			if (rootRef.current?.contains(event.target)) return;
			event.preventDefault();
			dragTargetsRef.current = [];
		};
		const onDocumentDragOver = (e) => e.preventDefault();
		const controller = new AbortController();
		document.addEventListener("dragover", onDocumentDragOver, {
			capture: false,
			signal: controller.signal
		});
		document.addEventListener("drop", onDocumentDrop, {
			capture: false,
			signal: controller.signal
		});
		return () => {
			controller.abort();
		};
	}, []);
	const onDragEnter = (0, react.useCallback)((event) => {
		event.preventDefault();
		event.persist();
		dragTargetsRef.current = [...dragTargetsRef.current, event.target];
		if ((0, __uploadthing_shared.isEventWithFiles)(event)) Promise.resolve((0, file_selector.fromEvent)(event)).then((files) => {
			if (event.isPropagationStopped()) return;
			const fileCount = files.length;
			const isDragAccept = fileCount > 0 && (0, __uploadthing_shared.allFilesAccepted)({
				files,
				accept: acceptAttr,
				minSize,
				maxSize,
				multiple,
				maxFiles
			});
			const isDragReject = fileCount > 0 && !isDragAccept;
			dispatch({
				type: "setDraggedFiles",
				payload: {
					isDragAccept,
					isDragReject,
					isDragActive: true
				}
			});
		}).catch(__uploadthing_shared.noop);
	}, [
		acceptAttr,
		maxFiles,
		maxSize,
		minSize,
		multiple
	]);
	const onDragOver = (0, react.useCallback)((event) => {
		event.preventDefault();
		event.persist();
		const hasFiles = (0, __uploadthing_shared.isEventWithFiles)(event);
		if (hasFiles) try {
			event.dataTransfer.dropEffect = "copy";
		} catch {
			(0, __uploadthing_shared.noop)();
		}
		return false;
	}, []);
	const onDragLeave = (0, react.useCallback)((event) => {
		event.preventDefault();
		event.persist();
		const targets = dragTargetsRef.current.filter((target) => rootRef.current?.contains(target));
		const targetIdx = targets.indexOf(event.target);
		if (targetIdx !== -1) targets.splice(targetIdx, 1);
		dragTargetsRef.current = targets;
		if (targets.length > 0) return;
		dispatch({
			type: "setDraggedFiles",
			payload: {
				isDragActive: false,
				isDragAccept: false,
				isDragReject: false
			}
		});
	}, []);
	const setFiles = (0, react.useCallback)((files) => {
		const acceptedFiles = [];
		files.forEach((file) => {
			const accepted = (0, __uploadthing_shared.isFileAccepted)(file, acceptAttr);
			const sizeMatch = (0, __uploadthing_shared.isValidSize)(file, minSize, maxSize);
			if (accepted && sizeMatch) acceptedFiles.push(file);
		});
		if (!(0, __uploadthing_shared.isValidQuantity)(acceptedFiles, multiple, maxFiles)) acceptedFiles.splice(0);
		dispatch({
			type: "setFiles",
			payload: { acceptedFiles }
		});
		onDrop(acceptedFiles);
	}, [
		acceptAttr,
		maxFiles,
		maxSize,
		minSize,
		multiple,
		onDrop
	]);
	const onDropCb = (0, react.useCallback)((event) => {
		event.preventDefault();
		event.persist();
		dragTargetsRef.current = [];
		if ((0, __uploadthing_shared.isEventWithFiles)(event)) Promise.resolve((0, file_selector.fromEvent)(event)).then((files) => {
			if (event.isPropagationStopped()) return;
			setFiles(files);
		}).catch(__uploadthing_shared.noop);
		dispatch({ type: "reset" });
	}, [setFiles]);
	const openFileDialog = (0, react.useCallback)(() => {
		if (inputRef.current) {
			dispatch({ type: "openDialog" });
			inputRef.current.value = "";
			inputRef.current.click();
		}
	}, []);
	const onKeyDown = (0, react.useCallback)((event) => {
		if (!rootRef.current?.isEqualNode(event.target)) return;
		if ((0, __uploadthing_shared.isEnterOrSpace)(event)) {
			event.preventDefault();
			openFileDialog();
		}
	}, [openFileDialog]);
	const onInputElementClick = (0, react.useCallback)((e) => {
		e.stopPropagation();
		if (state.isFileDialogActive) e.preventDefault();
	}, [state.isFileDialogActive]);
	const onFocus = (0, react.useCallback)(() => dispatch({ type: "focus" }), []);
	const onBlur = (0, react.useCallback)(() => dispatch({ type: "blur" }), []);
	const onClick = (0, react.useCallback)(() => {
		if ((0, __uploadthing_shared.isIeOrEdge)()) setTimeout(openFileDialog, 0);
		else openFileDialog();
	}, [openFileDialog]);
	const getRootProps = (0, react.useMemo)(() => () => ({
		ref: rootRef,
		role: "presentation",
		...!disabled ? {
			tabIndex: 0,
			onKeyDown,
			onFocus,
			onBlur,
			onClick,
			onDragEnter,
			onDragOver,
			onDragLeave,
			onDrop: onDropCb
		} : {}
	}), [
		disabled,
		onBlur,
		onClick,
		onDragEnter,
		onDragLeave,
		onDragOver,
		onDropCb,
		onFocus,
		onKeyDown
	]);
	const getInputProps = (0, react.useMemo)(() => () => ({
		ref: inputRef,
		type: "file",
		style: { display: "none" },
		accept: acceptAttr,
		multiple,
		tabIndex: -1,
		...!disabled ? {
			onChange: onDropCb,
			onClick: onInputElementClick
		} : {}
	}), [
		acceptAttr,
		multiple,
		onDropCb,
		onInputElementClick,
		disabled
	]);
	return {
		...state,
		getRootProps,
		getInputProps,
		rootRef
	};
}

//#endregion
//#region src/components/uploader.tsx
function Uploader(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: "text-center text-4xl font-bold",
			children: `Upload a file using a button:`
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UploadButton, { ...props })]
	}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: "text-center text-4xl font-bold",
			children: `...or using a dropzone:`
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UploadDropzone, { ...props })]
	})] });
}

//#endregion
//#region src/components/index.tsx
const generateUploadButton = (opts) => {
	(0, __uploadthing_shared.warnIfInvalidPeerDependency)("@uploadthing/react", require_use_uploadthing.peerDependencies.uploadthing, uploadthing_client.version);
	const url = (0, __uploadthing_shared.resolveMaybeUrlArg)(opts?.url);
	const fetch = opts?.fetch ?? globalThis.fetch;
	const TypedButton = (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UploadButton, {
		...props,
		url,
		fetch
	});
	return TypedButton;
};
const generateUploadDropzone = (opts) => {
	(0, __uploadthing_shared.warnIfInvalidPeerDependency)("@uploadthing/react", require_use_uploadthing.peerDependencies.uploadthing, uploadthing_client.version);
	const url = (0, __uploadthing_shared.resolveMaybeUrlArg)(opts?.url);
	const fetch = opts?.fetch ?? globalThis.fetch;
	const TypedDropzone = (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UploadDropzone, {
		...props,
		url,
		fetch
	});
	return TypedDropzone;
};
const generateUploader = (opts) => {
	(0, __uploadthing_shared.warnIfInvalidPeerDependency)("@uploadthing/react", require_use_uploadthing.peerDependencies.uploadthing, uploadthing_client.version);
	const url = (0, __uploadthing_shared.resolveMaybeUrlArg)(opts?.url);
	const fetch = opts?.fetch ?? globalThis.fetch;
	const TypedUploader = (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Uploader, {
		...props,
		url,
		fetch
	});
	return TypedUploader;
};

//#endregion
exports.UploadButton = UploadButton;
exports.UploadDropzone = UploadDropzone;
exports.Uploader = Uploader;
exports.generateReactHelpers = require_use_uploadthing.generateReactHelpers;
exports.generateUploadButton = generateUploadButton;
exports.generateUploadDropzone = generateUploadDropzone;
exports.generateUploader = generateUploader;
exports.useDropzone = useDropzone;