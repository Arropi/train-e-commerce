const require_chunk = require('../dist/chunk-CUT6urMc.cjs');
const node_path = require_chunk.__toESM(require("node:path"));
const tailwindcss_plugin = require_chunk.__toESM(require("tailwindcss/plugin"));

//#region src/tw/plugin.ts
/**
* UploadThing Tailwind plugin which injects custom variants
* for the built-in UI components
* @see https://docs.uploadthing.com/concepts/theming#theming-with-tailwind-css
*
* When using this, you need to specify `content` manually. For automatic
* detection, see {@link withUt}.
*/
const uploadthingPlugin = (0, tailwindcss_plugin.default)(($) => {
	$.addVariant("ut-button", "&>*[data-ut-element=\"button\"]");
	$.addVariant("ut-allowed-content", "&>*[data-ut-element=\"allowed-content\"]");
	$.addVariant("ut-label", "&>*[data-ut-element=\"label\"]");
	$.addVariant("ut-upload-icon", "&>*[data-ut-element=\"upload-icon\"]");
	$.addVariant("ut-clear-btn", "&>*[data-ut-element=\"clear-btn\"]");
	$.addVariant("ut-readying", "&[data-state=\"readying\"]");
	$.addVariant("ut-ready", "&[data-state=\"ready\"]");
	$.addVariant("ut-uploading", "&[data-state=\"uploading\"]");
});

//#endregion
//#region src/tw/index.ts
/**
* Add more here when additional UI packages are added
*/
const PACKAGES = [
	"react",
	"solid",
	"svelte",
	"vue"
];
/**
* HOF for Tailwind config that adds the
* {@link uploadthingPlugin} to the Tailwind config
* as well as adds content paths to detect the necessary
* classnames
*/
function withUt(twConfig) {
	const contentPaths = PACKAGES.map((pkg) => {
		try {
			const resolved = require.resolve(`@uploadthing/${pkg}`, { paths: [...module.paths, process.cwd()] });
			return (0, node_path.dirname)(resolved) + node_path.sep + "**";
		} catch {
			return null;
		}
	}).filter((s) => s != null);
	if (contentPaths.length === 0) console.warn(`
  [uploadthing]: Unable to resolve path for uploadthing UI packages. As a workaround, you can manually add the paths to your content paths: 
    - Find where your package manager has installed the distribution files, e.g. './node_modules/@uploadthing/react'.
      Note: If you have a monorepo, you may need to look up the tree to find the correct path.
    - Add the path to the 'content' field in your Tailwind configuration: 
      content: [
        // your other content paths
       './node_modules/@uploadthing/react/dist**' // <-- add this line
      ]
    `);
	if (Array.isArray(twConfig.content)) twConfig.content.push(...contentPaths);
	else twConfig.content.files.push(...contentPaths);
	twConfig.plugins ??= [];
	twConfig.plugins.push(uploadthingPlugin);
	return twConfig;
}

//#endregion
exports.uploadthingPlugin = uploadthingPlugin;
exports.withUt = withUt;