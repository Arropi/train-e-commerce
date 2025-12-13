import { GenerateTypedHelpersOptions, UploadthingComponentProps, UseUploadthingProps, generateReactHelpers } from "./use-uploadthing-CkqJn3G-.js";
import { ContentField, DropzoneOptions, ErrorMessage, StyleField } from "@uploadthing/shared";
import * as react0 from "react";
import { HTMLProps } from "react";
import * as react_jsx_runtime4 from "react/jsx-runtime";
import { FileRouter } from "uploadthing/types";

//#region src/components/button.d.ts
type ButtonStyleFieldCallbackArgs = {
  __runtime: "react";
  ready: boolean;
  isUploading: boolean;
  uploadProgress: number;
  fileTypes: string[];
  files: File[];
};
type ButtonAppearance = {
  container?: StyleField<ButtonStyleFieldCallbackArgs>;
  button?: StyleField<ButtonStyleFieldCallbackArgs>;
  allowedContent?: StyleField<ButtonStyleFieldCallbackArgs>;
  clearBtn?: StyleField<ButtonStyleFieldCallbackArgs>;
};
type ButtonContent = {
  button?: ContentField<ButtonStyleFieldCallbackArgs>;
  allowedContent?: ContentField<ButtonStyleFieldCallbackArgs>;
  clearBtn?: ContentField<ButtonStyleFieldCallbackArgs>;
};
type UploadButtonProps<TRouter extends FileRouter, TEndpoint extends keyof TRouter> = UploadthingComponentProps<TRouter, TEndpoint> & {
  /**
   * @see https://docs.uploadthing.com/theming#style-using-the-classname-prop
   */
  className?: string;
  /**
   * @see https://docs.uploadthing.com/theming#style-using-the-appearance-prop
   */
  appearance?: ButtonAppearance;
  /**
   * @see https://docs.uploadthing.com/theming#content-customisation
   */
  content?: ButtonContent;
};
/**
 * @remarks It is not recommended using this directly as it requires manually binding generics. Instead, use `createUploadButton`.
 * @example
 * <UploadButton<OurFileRouter, "someEndpoint">
 *   endpoint="someEndpoint"
 *   onUploadComplete={(res) => console.log(res)}
 *   onUploadError={(err) => console.log(err)}
 * />
 */
declare function UploadButton<TRouter extends FileRouter, TEndpoint extends keyof TRouter>(props: FileRouter extends TRouter ? ErrorMessage<"You forgot to pass the generic"> : UploadButtonProps<TRouter, TEndpoint>): react_jsx_runtime4.JSX.Element;
//#endregion
//#region src/components/dropzone.d.ts
type DropzoneStyleFieldCallbackArgs = {
  __runtime: "react";
  ready: boolean;
  isUploading: boolean;
  uploadProgress: number;
  fileTypes: string[];
  isDragActive: boolean;
  files: File[];
};
type DropzoneAppearance = {
  container?: StyleField<DropzoneStyleFieldCallbackArgs>;
  uploadIcon?: StyleField<DropzoneStyleFieldCallbackArgs>;
  label?: StyleField<DropzoneStyleFieldCallbackArgs>;
  allowedContent?: StyleField<DropzoneStyleFieldCallbackArgs>;
  button?: StyleField<DropzoneStyleFieldCallbackArgs>;
};
type DropzoneContent = {
  uploadIcon?: ContentField<DropzoneStyleFieldCallbackArgs>;
  label?: ContentField<DropzoneStyleFieldCallbackArgs>;
  allowedContent?: ContentField<DropzoneStyleFieldCallbackArgs>;
  button?: ContentField<DropzoneStyleFieldCallbackArgs>;
};
type UploadDropzoneProps<TRouter extends FileRouter, TEndpoint extends keyof TRouter> = UploadthingComponentProps<TRouter, TEndpoint> & {
  /**
   * @see https://docs.uploadthing.com/theming#style-using-the-classname-prop
   */
  className?: string;
  /**
   * @see https://docs.uploadthing.com/theming#style-using-the-appearance-prop
   */
  appearance?: DropzoneAppearance;
  /**
   * @see https://docs.uploadthing.com/theming#content-customisation
   */
  content?: DropzoneContent;
  /**
   * Callback called when files are dropped or pasted.
   *
   * @param acceptedFiles - The files that were accepted.
   * @deprecated Use `onChange` instead
   */
  onDrop?: (acceptedFiles: File[]) => void;
};
declare function UploadDropzone<TRouter extends FileRouter, TEndpoint extends keyof TRouter>(props: FileRouter extends TRouter ? ErrorMessage<"You forgot to pass the generic"> : UploadDropzoneProps<TRouter, TEndpoint>): react_jsx_runtime4.JSX.Element;
type DropEvent = Event | React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLElement>;
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
declare function useDropzone({
  accept,
  disabled,
  maxSize,
  minSize,
  multiple,
  maxFiles,
  onDrop
}: DropzoneOptions): {
  getRootProps: () => HTMLProps<HTMLDivElement>;
  getInputProps: () => HTMLProps<HTMLInputElement>;
  rootRef: react0.RefObject<HTMLDivElement | null>;
  isFocused: boolean;
  isFileDialogActive: boolean;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  acceptedFiles: File[];
};
//#endregion
//#region src/components/uploader.d.ts
declare function Uploader<TRouter extends FileRouter, TEndpoint extends keyof TRouter>(props: FileRouter extends TRouter ? ErrorMessage<"You forgot to pass the generic"> : UploadthingComponentProps<TRouter, TEndpoint>): react_jsx_runtime4.JSX.Element;
//#endregion
//#region src/components/index.d.ts
declare const generateUploadButton: <TRouter extends FileRouter>(opts?: GenerateTypedHelpersOptions) => <TEndpoint extends keyof TRouter>(props: Omit<UploadButtonProps<TRouter, TEndpoint>, keyof GenerateTypedHelpersOptions>) => react_jsx_runtime4.JSX.Element;
declare const generateUploadDropzone: <TRouter extends FileRouter>(opts?: GenerateTypedHelpersOptions) => <TEndpoint extends keyof TRouter>(props: Omit<UploadDropzoneProps<TRouter, TEndpoint>, keyof GenerateTypedHelpersOptions>) => react_jsx_runtime4.JSX.Element;
declare const generateUploader: <TRouter extends FileRouter>(opts?: GenerateTypedHelpersOptions) => <TEndpoint extends keyof TRouter>(props: Omit<UploadthingComponentProps<TRouter, TEndpoint>, keyof GenerateTypedHelpersOptions>) => react_jsx_runtime4.JSX.Element;
//#endregion
export { DropEvent, GenerateTypedHelpersOptions, UploadButton, UploadDropzone, UploadDropzoneProps, Uploader, UploadthingComponentProps, UseUploadthingProps, generateReactHelpers, generateUploadButton, generateUploadDropzone, generateUploader, useDropzone };
//# sourceMappingURL=index.d.ts.map