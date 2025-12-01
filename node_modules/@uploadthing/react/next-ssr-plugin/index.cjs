"use client";


const require_chunk = require('../dist/chunk-CUT6urMc.cjs');
const react = require_chunk.__toESM(require("react"));
const react_jsx_runtime = require_chunk.__toESM(require("react/jsx-runtime"));
const next_navigation = require_chunk.__toESM(require("next/navigation"));

//#region src/next-ssr-plugin.tsx
function NextSSRPlugin(props) {
	const id = (0, react.useId)();
	globalThis.__UPLOADTHING = props.routerConfig;
	(0, next_navigation.useServerInsertedHTML)(() => {
		const html = [`globalThis.__UPLOADTHING = ${JSON.stringify(props.routerConfig)};`];
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: html.join("") } }, id);
	});
	return null;
}

//#endregion
exports.NextSSRPlugin = NextSSRPlugin;