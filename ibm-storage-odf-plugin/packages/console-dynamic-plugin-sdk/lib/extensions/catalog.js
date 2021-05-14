// Type guards
export const isCatalogItemType = (e) => {
    return e.type === 'console.catalog/item-type';
};
export const isCatalogItemProvider = (e) => {
    return e.type === 'console.catalog/item-provider';
};
export const isCatalogItemFilter = (e) => {
    return e.type === 'console.catalog/item-filter';
};
//# sourceMappingURL=catalog.js.map