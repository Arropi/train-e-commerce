import * as tailwindcss_types_config0 from "tailwindcss/types/config";
import { Config } from "tailwindcss";

//#region src/tw/plugin.d.ts

/**
 * UploadThing Tailwind plugin which injects custom variants
 * for the built-in UI components
 * @see https://docs.uploadthing.com/concepts/theming#theming-with-tailwind-css
 *
 * When using this, you need to specify `content` manually. For automatic
 * detection, see {@link withUt}.
 */
declare const uploadthingPlugin: {
  handler: tailwindcss_types_config0.PluginCreator;
  config?: Partial<tailwindcss_types_config0.Config>;
};
//#endregion
//#region src/tw/index.d.ts
/**
 * HOF for Tailwind config that adds the
 * {@link uploadthingPlugin} to the Tailwind config
 * as well as adds content paths to detect the necessary
 * classnames
 */
declare function withUt(twConfig: Config): tailwindcss_types_config0.Config;
//#endregion
export { uploadthingPlugin, withUt };
//# sourceMappingURL=index.d.cts.map