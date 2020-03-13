/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function Options() { }
if (false) {
    /** @type {?} */
    Options.prototype.storeName;
    /** @type {?} */
    Options.prototype.dbMode;
    /** @type {?} */
    Options.prototype.error;
    /** @type {?} */
    Options.prototype.complete;
    /** @type {?|undefined} */
    Options.prototype.abort;
}
/**
 * @param {?} db
 * @param {?} storeName
 * @return {?}
 */
export function validateStoreName(db, storeName) {
    return db.objectStoreNames.contains(storeName);
}
/**
 * @param {?} db
 * @param {?} storeName
 * @param {?} reject
 * @return {?}
 */
export function validateBeforeTransaction(db, storeName, reject) {
    if (!db) {
        reject('You need to use the openDatabase function to create a database before you query it!');
    }
    if (!validateStoreName(db, storeName)) {
        reject(`objectStore does not exists: ${storeName}`);
    }
}
/**
 * @param {?} db
 * @param {?} options
 * @return {?}
 */
export function createTransaction(db, options) {
    /** @type {?} */
    let trans = db.transaction(options.storeName, options.dbMode);
    trans.onerror = options.error;
    trans.oncomplete = options.complete;
    trans.onabort = options.abort;
    return trans;
}
/**
 * @param {?} type
 * @param {?} storeName
 * @param {?} reject
 * @param {?} resolve
 * @return {?}
 */
export function optionsGenerator(type, storeName, reject, resolve) {
    return {
        storeName: storeName,
        dbMode: type,
        error: (/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            reject(e);
        }),
        complete: (/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            resolve();
        }),
        abort: (/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            reject(e);
        })
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW5kZXhlZC1kYi8iLCJzb3VyY2VzIjpbInV0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSw2QkFNQzs7O0lBTEEsNEJBQWtCOztJQUNsQix5QkFBMkI7O0lBQzNCLHdCQUF5Qjs7SUFDekIsMkJBQTRCOztJQUM1Qix3QkFBWTs7Ozs7OztBQUdiLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxFQUFlLEVBQUUsU0FBaUI7SUFDbkUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELENBQUM7Ozs7Ozs7QUFFRCxNQUFNLFVBQVUseUJBQXlCLENBQUMsRUFBZSxFQUFFLFNBQWlCLEVBQUUsTUFBZ0I7SUFDN0YsSUFBSSxDQUFDLEVBQUUsRUFBRTtRQUNSLE1BQU0sQ0FBQyxxRkFBcUYsQ0FBQyxDQUFDO0tBQzlGO0lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRTtRQUN0QyxNQUFNLENBQUMsZ0NBQWdDLFNBQVMsRUFBRSxDQUFDLENBQUM7S0FDcEQ7QUFDRixDQUFDOzs7Ozs7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsRUFBZSxFQUFFLE9BQWdCOztRQUM5RCxLQUFLLEdBQW1CLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzdFLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUM5QixLQUFLLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDcEMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzlCLE9BQU8sS0FBSyxDQUFDO0FBQ2QsQ0FBQzs7Ozs7Ozs7QUFFRCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsSUFBUyxFQUFFLFNBQWMsRUFBRSxNQUFnQixFQUFFLE9BQWlCO0lBQzlGLE9BQU87UUFDTixTQUFTLEVBQUUsU0FBUztRQUNwQixNQUFNLEVBQUUsSUFBSTtRQUNaLEtBQUs7Ozs7UUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQTtRQUNELFFBQVE7Ozs7UUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1FBQ1gsQ0FBQyxDQUFBO1FBQ0QsS0FBSzs7OztRQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7WUFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFBO0tBQ0QsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIE9wdGlvbnMge1xuXHRzdG9yZU5hbWU6IHN0cmluZztcblx0ZGJNb2RlOiBJREJUcmFuc2FjdGlvbk1vZGU7XG5cdGVycm9yOiAoZTogRXZlbnQpID0+IGFueTtcblx0Y29tcGxldGU6IChlOiBFdmVudCkgPT4gYW55O1xuXHRhYm9ydD86IGFueTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlU3RvcmVOYW1lKGRiOiBJREJEYXRhYmFzZSwgc3RvcmVOYW1lOiBzdHJpbmcpIHtcblx0cmV0dXJuIGRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoc3RvcmVOYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQmVmb3JlVHJhbnNhY3Rpb24oZGI6IElEQkRhdGFiYXNlLCBzdG9yZU5hbWU6IHN0cmluZywgcmVqZWN0OiBGdW5jdGlvbikge1xuXHRpZiAoIWRiKSB7XG5cdFx0cmVqZWN0KCdZb3UgbmVlZCB0byB1c2UgdGhlIG9wZW5EYXRhYmFzZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBkYXRhYmFzZSBiZWZvcmUgeW91IHF1ZXJ5IGl0IScpO1xuXHR9XG5cdGlmICghdmFsaWRhdGVTdG9yZU5hbWUoZGIsIHN0b3JlTmFtZSkpIHtcblx0XHRyZWplY3QoYG9iamVjdFN0b3JlIGRvZXMgbm90IGV4aXN0czogJHtzdG9yZU5hbWV9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zYWN0aW9uKGRiOiBJREJEYXRhYmFzZSwgb3B0aW9uczogT3B0aW9ucyk6IElEQlRyYW5zYWN0aW9uIHtcblx0bGV0IHRyYW5zOiBJREJUcmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKG9wdGlvbnMuc3RvcmVOYW1lLCBvcHRpb25zLmRiTW9kZSk7XG5cdHRyYW5zLm9uZXJyb3IgPSBvcHRpb25zLmVycm9yO1xuXHR0cmFucy5vbmNvbXBsZXRlID0gb3B0aW9ucy5jb21wbGV0ZTtcblx0dHJhbnMub25hYm9ydCA9IG9wdGlvbnMuYWJvcnQ7XG5cdHJldHVybiB0cmFucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wdGlvbnNHZW5lcmF0b3IodHlwZTogYW55LCBzdG9yZU5hbWU6IGFueSwgcmVqZWN0OiBGdW5jdGlvbiwgcmVzb2x2ZTogRnVuY3Rpb24pOiBPcHRpb25zIHtcblx0cmV0dXJuIHtcblx0XHRzdG9yZU5hbWU6IHN0b3JlTmFtZSxcblx0XHRkYk1vZGU6IHR5cGUsXG5cdFx0ZXJyb3I6IChlOiBFdmVudCkgPT4ge1xuXHRcdFx0cmVqZWN0KGUpO1xuXHRcdH0sXG5cdFx0Y29tcGxldGU6IChlOiBFdmVudCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0sXG5cdFx0YWJvcnQ6IChlOiBFdmVudCkgPT4ge1xuXHRcdFx0cmVqZWN0KGUpO1xuXHRcdH1cblx0fTtcbn1cbiJdfQ==