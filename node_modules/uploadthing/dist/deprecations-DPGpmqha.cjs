
//#region src/_internal/deprecations.ts
const logDeprecationWarning = (message) => {
	console.warn(`⚠️ [uploadthing][deprecated] ${message}`);
};

//#endregion
Object.defineProperty(exports, 'logDeprecationWarning', {
  enumerable: true,
  get: function () {
    return logDeprecationWarning;
  }
});