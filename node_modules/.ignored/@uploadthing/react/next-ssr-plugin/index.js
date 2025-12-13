"use client";


import { useId } from "react";
import { jsx } from "react/jsx-runtime";
import { useServerInsertedHTML } from "next/navigation";

//#region src/next-ssr-plugin.tsx
function NextSSRPlugin(props) {
	const id = useId();
	globalThis.__UPLOADTHING = props.routerConfig;
	useServerInsertedHTML(() => {
		const html = [`globalThis.__UPLOADTHING = ${JSON.stringify(props.routerConfig)};`];
		return /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: html.join("") } }, id);
	});
	return null;
}

//#endregion
export { NextSSRPlugin };
//# sourceMappingURL=index.js.map