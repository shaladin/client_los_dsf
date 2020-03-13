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
        reject("objectStore does not exists: " + storeName);
    }
}
/**
 * @param {?} db
 * @param {?} options
 * @return {?}
 */
export function createTransaction(db, options) {
    /** @type {?} */
    var trans = db.transaction(options.storeName, options.dbMode);
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
        function (e) {
            reject(e);
        }),
        complete: (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            resolve();
        }),
        abort: (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            reject(e);
        })
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW5kZXhlZC1kYi8iLCJzb3VyY2VzIjpbInV0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSw2QkFNQzs7O0lBTEEsNEJBQWtCOztJQUNsQix5QkFBMkI7O0lBQzNCLHdCQUF5Qjs7SUFDekIsMkJBQTRCOztJQUM1Qix3QkFBWTs7Ozs7OztBQUdiLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxFQUFlLEVBQUUsU0FBaUI7SUFDbkUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELENBQUM7Ozs7Ozs7QUFFRCxNQUFNLFVBQVUseUJBQXlCLENBQUMsRUFBZSxFQUFFLFNBQWlCLEVBQUUsTUFBZ0I7SUFDN0YsSUFBSSxDQUFDLEVBQUUsRUFBRTtRQUNSLE1BQU0sQ0FBQyxxRkFBcUYsQ0FBQyxDQUFDO0tBQzlGO0lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRTtRQUN0QyxNQUFNLENBQUMsa0NBQWdDLFNBQVcsQ0FBQyxDQUFDO0tBQ3BEO0FBQ0YsQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUFDLEVBQWUsRUFBRSxPQUFnQjs7UUFDOUQsS0FBSyxHQUFtQixFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM3RSxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDOUIsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ3BDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUM5QixPQUFPLEtBQUssQ0FBQztBQUNkLENBQUM7Ozs7Ozs7O0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLElBQVMsRUFBRSxTQUFjLEVBQUUsTUFBZ0IsRUFBRSxPQUFpQjtJQUM5RixPQUFPO1FBQ04sU0FBUyxFQUFFLFNBQVM7UUFDcEIsTUFBTSxFQUFFLElBQUk7UUFDWixLQUFLOzs7O1FBQUUsVUFBQyxDQUFRO1lBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFBO1FBQ0QsUUFBUTs7OztRQUFFLFVBQUMsQ0FBUTtZQUNsQixPQUFPLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQTtRQUNELEtBQUs7Ozs7UUFBRSxVQUFDLENBQVE7WUFDZixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUE7S0FDRCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgT3B0aW9ucyB7XG5cdHN0b3JlTmFtZTogc3RyaW5nO1xuXHRkYk1vZGU6IElEQlRyYW5zYWN0aW9uTW9kZTtcblx0ZXJyb3I6IChlOiBFdmVudCkgPT4gYW55O1xuXHRjb21wbGV0ZTogKGU6IEV2ZW50KSA9PiBhbnk7XG5cdGFib3J0PzogYW55O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTdG9yZU5hbWUoZGI6IElEQkRhdGFiYXNlLCBzdG9yZU5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhzdG9yZU5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVCZWZvcmVUcmFuc2FjdGlvbihkYjogSURCRGF0YWJhc2UsIHN0b3JlTmFtZTogc3RyaW5nLCByZWplY3Q6IEZ1bmN0aW9uKSB7XG5cdGlmICghZGIpIHtcblx0XHRyZWplY3QoJ1lvdSBuZWVkIHRvIHVzZSB0aGUgb3BlbkRhdGFiYXNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIGRhdGFiYXNlIGJlZm9yZSB5b3UgcXVlcnkgaXQhJyk7XG5cdH1cblx0aWYgKCF2YWxpZGF0ZVN0b3JlTmFtZShkYiwgc3RvcmVOYW1lKSkge1xuXHRcdHJlamVjdChgb2JqZWN0U3RvcmUgZG9lcyBub3QgZXhpc3RzOiAke3N0b3JlTmFtZX1gKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNhY3Rpb24oZGI6IElEQkRhdGFiYXNlLCBvcHRpb25zOiBPcHRpb25zKTogSURCVHJhbnNhY3Rpb24ge1xuXHRsZXQgdHJhbnM6IElEQlRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24ob3B0aW9ucy5zdG9yZU5hbWUsIG9wdGlvbnMuZGJNb2RlKTtcblx0dHJhbnMub25lcnJvciA9IG9wdGlvbnMuZXJyb3I7XG5cdHRyYW5zLm9uY29tcGxldGUgPSBvcHRpb25zLmNvbXBsZXRlO1xuXHR0cmFucy5vbmFib3J0ID0gb3B0aW9ucy5hYm9ydDtcblx0cmV0dXJuIHRyYW5zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3B0aW9uc0dlbmVyYXRvcih0eXBlOiBhbnksIHN0b3JlTmFtZTogYW55LCByZWplY3Q6IEZ1bmN0aW9uLCByZXNvbHZlOiBGdW5jdGlvbik6IE9wdGlvbnMge1xuXHRyZXR1cm4ge1xuXHRcdHN0b3JlTmFtZTogc3RvcmVOYW1lLFxuXHRcdGRiTW9kZTogdHlwZSxcblx0XHRlcnJvcjogKGU6IEV2ZW50KSA9PiB7XG5cdFx0XHRyZWplY3QoZSk7XG5cdFx0fSxcblx0XHRjb21wbGV0ZTogKGU6IEV2ZW50KSA9PiB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSxcblx0XHRhYm9ydDogKGU6IEV2ZW50KSA9PiB7XG5cdFx0XHRyZWplY3QoZSk7XG5cdFx0fVxuXHR9O1xufVxuIl19