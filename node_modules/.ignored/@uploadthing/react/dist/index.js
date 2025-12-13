import { __useUploadThingInternal, generateReactHelpers, peerDependencies, useEvent } from "./use-uploadthing-pxkJ3LFs.js";
import { UploadAbortedError, acceptPropAsAcceptAttr, allFilesAccepted, allowedContentTextLabelGenerator, contentFieldToContent, defaultClassListMerger, generateClientDropzoneAccept, generateMimeTypes, generatePermittedFileTypes, getFilesFromClipboardEvent, initialState, isEnterOrSpace, isEventWithFiles, isFileAccepted, isIeOrEdge, isValidQuantity, isValidSize, noop, reducer, resolveMaybeUrlArg, styleFieldToClassName, styleFieldToCssObject, warnIfInvalidPeerDependency } from "@uploadthing/shared";
import { version } from "uploadthing/client";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { fromEvent } from "file-selector";

//#region src/utils/usePaste.ts
const usePaste = (callback) => {
	const stableCallback = useEvent(callback);
	useEffect(() => {
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
	return /* @__PURE__ */ jsx("svg", {
		className: "z-10 block h-5 w-5 animate-spin align-middle text-white",
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 576 512",
		children: /* @__PURE__ */ jsx("path", {
			fill: "currentColor",
			d: "M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"
		})
	});
}
function Cancel({ className, cn,...props }) {
	return /* @__PURE__ */ jsxs("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: cn("fill-none stroke-current stroke-2", className),
		...props,
		children: [/* @__PURE__ */ jsx("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}), /* @__PURE__ */ jsx("path", { d: "m4.9 4.9 14.2 14.2" })]
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
	const { mode = "auto", appendOnPaste = false, cn = defaultClassListMerger } = $props.config ?? {};
	const acRef = useRef(new AbortController());
	const fileInputRef = useRef(null);
	const [uploadProgress, setUploadProgress] = useState($props.__internal_upload_progress ?? 0);
	const [files, setFiles] = useState([]);
	const { startUpload, isUploading, routeConfig } = __useUploadThingInternal(resolveMaybeUrlArg($props.url), $props.endpoint, $props.fetch ?? globalThis.fetch, {
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
	const { fileTypes, multiple } = generatePermittedFileTypes(routeConfig);
	const disabled = !!($props.__internal_button_disabled ?? $props.disabled);
	const state = (() => {
		const ready = $props.__internal_state === "ready" || fileTypes.length > 0;
		if ($props.__internal_state) return $props.__internal_state;
		if (disabled) return "disabled";
		if (!ready) return "readying";
		if (!isUploading) return "ready";
		return "uploading";
	})();
	const uploadFiles = useCallback((files$1) => {
		const input = "input" in $props ? $props.input : void 0;
		startUpload(files$1, input).catch((e) => {
			if (e instanceof UploadAbortedError) $props.onUploadAborted?.();
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
	const inputProps = useMemo(() => ({
		type: "file",
		ref: fileInputRef,
		multiple,
		accept: generateMimeTypes(fileTypes).join(", "),
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
		const pastedFiles = getFilesFromClipboardEvent(event);
		if (!pastedFiles) return;
		let filesToUpload = pastedFiles;
		setFiles((prev) => {
			filesToUpload = [...prev, ...pastedFiles];
			$props.onChange?.(filesToUpload);
			return filesToUpload;
		});
		if (mode === "auto") uploadFiles(files);
	});
	const styleFieldArg = useMemo(() => ({
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
		const customContent = contentFieldToContent($props.content?.button, styleFieldArg);
		if (customContent) return customContent;
		switch (state) {
			case "readying": return "Loading...";
			case "uploading":
				if (uploadProgress >= 100) return /* @__PURE__ */ jsx(Spinner, {});
				return /* @__PURE__ */ jsxs("span", {
					className: "z-50",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "block group-hover:hidden",
						children: [Math.round(uploadProgress), "%"]
					}), /* @__PURE__ */ jsx(Cancel, {
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
	const renderClearButton = () => /* @__PURE__ */ jsx("button", {
		onClick: () => {
			setFiles([]);
			if (fileInputRef.current) fileInputRef.current.value = "";
			$props.onChange?.([]);
		},
		className: cn("h-[1.25rem] cursor-pointer rounded border-none bg-transparent text-gray-500 transition-colors hover:bg-slate-200 hover:text-gray-600", styleFieldToClassName($props.appearance?.clearBtn, styleFieldArg)),
		style: styleFieldToCssObject($props.appearance?.clearBtn, styleFieldArg),
		"data-state": state,
		"data-ut-element": "clear-btn",
		children: contentFieldToContent($props.content?.clearBtn, styleFieldArg) ?? "Clear"
	});
	const renderAllowedContent = () => /* @__PURE__ */ jsx("div", {
		className: cn("h-[1.25rem] text-xs leading-5 text-gray-600", styleFieldToClassName($props.appearance?.allowedContent, styleFieldArg)),
		style: styleFieldToCssObject($props.appearance?.allowedContent, styleFieldArg),
		"data-state": state,
		"data-ut-element": "allowed-content",
		children: contentFieldToContent($props.content?.allowedContent, styleFieldArg) ?? allowedContentTextLabelGenerator(routeConfig)
	});
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-col items-center justify-center gap-1", $props.className, styleFieldToClassName($props.appearance?.container, styleFieldArg)),
		style: {
			"--progress-width": `${uploadProgress}%`,
			...styleFieldToCssObject($props.appearance?.container, styleFieldArg)
		},
		"data-state": state,
		children: [/* @__PURE__ */ jsxs("label", {
			className: cn("group relative flex h-10 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-md text-white after:transition-[width] after:duration-500 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2", "disabled:pointer-events-none", "data-[state=disabled]:cursor-not-allowed data-[state=readying]:cursor-not-allowed", "data-[state=disabled]:bg-blue-400 data-[state=ready]:bg-blue-600 data-[state=readying]:bg-blue-400 data-[state=uploading]:bg-blue-400", "after:absolute after:left-0 after:h-full after:w-[var(--progress-width)] after:content-[''] data-[state=uploading]:after:bg-blue-600", styleFieldToClassName($props.appearance?.button, styleFieldArg)),
			style: styleFieldToCssObject($props.appearance?.button, styleFieldArg),
			"data-state": state,
			"data-ut-element": "button",
			onClick: onUploadClick,
			children: [/* @__PURE__ */ jsx("input", {
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
	const { mode = "manual", appendOnPaste = false, cn = defaultClassListMerger } = $props.config ?? {};
	const acRef = useRef(new AbortController());
	const [files, setFiles] = useState([]);
	const [uploadProgress, setUploadProgress] = useState($props.__internal_upload_progress ?? 0);
	const { startUpload, isUploading, routeConfig } = __useUploadThingInternal(resolveMaybeUrlArg($props.url), $props.endpoint, $props.fetch ?? globalThis.fetch, {
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
	const { fileTypes, multiple } = generatePermittedFileTypes(routeConfig);
	const disabled = !!($props.__internal_dropzone_disabled ?? $props.disabled);
	const state = (() => {
		const ready = $props.__internal_ready ?? ($props.__internal_state === "ready" || fileTypes.length > 0);
		if ($props.__internal_state) return $props.__internal_state;
		if (disabled) return "disabled";
		if (!ready) return "readying";
		if (!isUploading) return "ready";
		return "uploading";
	})();
	const uploadFiles = useCallback((files$1) => {
		const input = "input" in $props ? $props.input : void 0;
		startUpload(files$1, input).catch((e) => {
			if (e instanceof UploadAbortedError) $props.onUploadAborted?.();
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
	const onDrop = useCallback((acceptedFiles) => {
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
		accept: generateClientDropzoneAccept(fileTypes),
		disabled
	});
	usePaste((event) => {
		if (!appendOnPaste) return;
		if (document.activeElement !== rootRef.current) return;
		const pastedFiles = getFilesFromClipboardEvent(event);
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
	const styleFieldArg = useMemo(() => ({
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
		const customContent = contentFieldToContent($props.content?.button, styleFieldArg);
		if (customContent) return customContent;
		switch (state) {
			case "readying": return "Loading...";
			case "uploading":
				if (uploadProgress >= 100) return /* @__PURE__ */ jsx(Spinner, {});
				return /* @__PURE__ */ jsxs("span", {
					className: "z-50",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "block group-hover:hidden",
						children: [Math.round(uploadProgress), "%"]
					}), /* @__PURE__ */ jsx(Cancel, {
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
	return /* @__PURE__ */ jsxs("div", {
		className: cn("mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center", isDragActive && "bg-blue-600/10", $props.className, styleFieldToClassName($props.appearance?.container, styleFieldArg)),
		...getRootProps(),
		style: styleFieldToCssObject($props.appearance?.container, styleFieldArg),
		"data-state": state,
		children: [
			contentFieldToContent($props.content?.uploadIcon, styleFieldArg) ?? /* @__PURE__ */ jsx("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 20 20",
				className: cn("mx-auto block h-12 w-12 align-middle text-gray-400", styleFieldToClassName($props.appearance?.uploadIcon, styleFieldArg)),
				style: styleFieldToCssObject($props.appearance?.uploadIcon, styleFieldArg),
				"data-ut-element": "upload-icon",
				"data-state": state,
				children: /* @__PURE__ */ jsx("path", {
					fill: "currentColor",
					fillRule: "evenodd",
					d: "M5.5 17a4.5 4.5 0 0 1-1.44-8.765a4.5 4.5 0 0 1 8.302-3.046a3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z",
					clipRule: "evenodd"
				})
			}),
			/* @__PURE__ */ jsxs("label", {
				className: cn("relative mt-4 flex w-64 cursor-pointer items-center justify-center text-sm font-semibold leading-6 text-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500", state === "ready" ? "text-blue-600" : "text-gray-500", styleFieldToClassName($props.appearance?.label, styleFieldArg)),
				style: styleFieldToCssObject($props.appearance?.label, styleFieldArg),
				"data-ut-element": "label",
				"data-state": state,
				children: [/* @__PURE__ */ jsx("input", {
					className: "sr-only",
					...getInputProps()
				}), contentFieldToContent($props.content?.label, styleFieldArg) ?? (state === "ready" ? `Choose ${multiple ? "file(s)" : "a file"} or drag and drop` : `Loading...`)]
			}),
			/* @__PURE__ */ jsx("div", {
				className: cn("m-0 h-[1.25rem] text-xs leading-5 text-gray-600", styleFieldToClassName($props.appearance?.allowedContent, styleFieldArg)),
				style: styleFieldToCssObject($props.appearance?.allowedContent, styleFieldArg),
				"data-ut-element": "allowed-content",
				"data-state": state,
				children: contentFieldToContent($props.content?.allowedContent, styleFieldArg) ?? allowedContentTextLabelGenerator(routeConfig)
			}),
			/* @__PURE__ */ jsx("button", {
				className: cn("group relative mt-4 flex h-10 w-36 items-center justify-center overflow-hidden rounded-md border-none text-base text-white", "after:absolute after:left-0 after:h-full after:w-[var(--progress-width)] after:bg-blue-600 after:transition-[width] after:duration-500 after:content-['']", "focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2", "disabled:pointer-events-none", "data-[state=disabled]:cursor-not-allowed data-[state=readying]:cursor-not-allowed", "data-[state=disabled]:bg-blue-400 data-[state=ready]:bg-blue-600 data-[state=readying]:bg-blue-400 data-[state=uploading]:bg-blue-400", styleFieldToClassName($props.appearance?.button, styleFieldArg)),
				style: {
					"--progress-width": `${uploadProgress}%`,
					...styleFieldToCssObject($props.appearance?.button, styleFieldArg)
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
	const acceptAttr = useMemo(() => acceptPropAsAcceptAttr(accept), [accept]);
	const rootRef = useRef(null);
	const inputRef = useRef(null);
	const dragTargetsRef = useRef([]);
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
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
	useEffect(() => {
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
	const onDragEnter = useCallback((event) => {
		event.preventDefault();
		event.persist();
		dragTargetsRef.current = [...dragTargetsRef.current, event.target];
		if (isEventWithFiles(event)) Promise.resolve(fromEvent(event)).then((files) => {
			if (event.isPropagationStopped()) return;
			const fileCount = files.length;
			const isDragAccept = fileCount > 0 && allFilesAccepted({
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
		}).catch(noop);
	}, [
		acceptAttr,
		maxFiles,
		maxSize,
		minSize,
		multiple
	]);
	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.persist();
		const hasFiles = isEventWithFiles(event);
		if (hasFiles) try {
			event.dataTransfer.dropEffect = "copy";
		} catch {
			noop();
		}
		return false;
	}, []);
	const onDragLeave = useCallback((event) => {
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
	const setFiles = useCallback((files) => {
		const acceptedFiles = [];
		files.forEach((file) => {
			const accepted = isFileAccepted(file, acceptAttr);
			const sizeMatch = isValidSize(file, minSize, maxSize);
			if (accepted && sizeMatch) acceptedFiles.push(file);
		});
		if (!isValidQuantity(acceptedFiles, multiple, maxFiles)) acceptedFiles.splice(0);
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
	const onDropCb = useCallback((event) => {
		event.preventDefault();
		event.persist();
		dragTargetsRef.current = [];
		if (isEventWithFiles(event)) Promise.resolve(fromEvent(event)).then((files) => {
			if (event.isPropagationStopped()) return;
			setFiles(files);
		}).catch(noop);
		dispatch({ type: "reset" });
	}, [setFiles]);
	const openFileDialog = useCallback(() => {
		if (inputRef.current) {
			dispatch({ type: "openDialog" });
			inputRef.current.value = "";
			inputRef.current.click();
		}
	}, []);
	const onKeyDown = useCallback((event) => {
		if (!rootRef.current?.isEqualNode(event.target)) return;
		if (isEnterOrSpace(event)) {
			event.preventDefault();
			openFileDialog();
		}
	}, [openFileDialog]);
	const onInputElementClick = useCallback((e) => {
		e.stopPropagation();
		if (state.isFileDialogActive) e.preventDefault();
	}, [state.isFileDialogActive]);
	const onFocus = useCallback(() => dispatch({ type: "focus" }), []);
	const onBlur = useCallback(() => dispatch({ type: "blur" }), []);
	const onClick = useCallback(() => {
		if (isIeOrEdge()) setTimeout(openFileDialog, 0);
		else openFileDialog();
	}, [openFileDialog]);
	const getRootProps = useMemo(() => () => ({
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
	const getInputProps = useMemo(() => () => ({
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-center text-4xl font-bold",
			children: `Upload a file using a button:`
		}), /* @__PURE__ */ jsx(UploadButton, { ...props })]
	}), /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-center text-4xl font-bold",
			children: `...or using a dropzone:`
		}), /* @__PURE__ */ jsx(UploadDropzone, { ...props })]
	})] });
}

//#endregion
//#region src/components/index.tsx
const generateUploadButton = (opts) => {
	warnIfInvalidPeerDependency("@uploadthing/react", peerDependencies.uploadthing, version);
	const url = resolveMaybeUrlArg(opts?.url);
	const fetch = opts?.fetch ?? globalThis.fetch;
	const TypedButton = (props) => /* @__PURE__ */ jsx(UploadButton, {
		...props,
		url,
		fetch
	});
	return TypedButton;
};
const generateUploadDropzone = (opts) => {
	warnIfInvalidPeerDependency("@uploadthing/react", peerDependencies.uploadthing, version);
	const url = resolveMaybeUrlArg(opts?.url);
	const fetch = opts?.fetch ?? globalThis.fetch;
	const TypedDropzone = (props) => /* @__PURE__ */ jsx(UploadDropzone, {
		...props,
		url,
		fetch
	});
	return TypedDropzone;
};
const generateUploader = (opts) => {
	warnIfInvalidPeerDependency("@uploadthing/react", peerDependencies.uploadthing, version);
	const url = resolveMaybeUrlArg(opts?.url);
	const fetch = opts?.fetch ?? globalThis.fetch;
	const TypedUploader = (props) => /* @__PURE__ */ jsx(Uploader, {
		...props,
		url,
		fetch
	});
	return TypedUploader;
};

//#endregion
export { UploadButton, UploadDropzone, Uploader, generateReactHelpers, generateUploadButton, generateUploadDropzone, generateUploader, useDropzone };
//# sourceMappingURL=index.js.map