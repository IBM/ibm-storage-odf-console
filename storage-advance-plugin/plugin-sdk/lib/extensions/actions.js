// Type Guards
export const isActionProvider = (e) => {
    return e.type === 'console.action/provider';
};
export const isResourceActionProvider = (e) => {
    return e.type === 'console.action/resource-provider';
};
export const isActionGroup = (e) => {
    return e.type === 'console.action/group';
};
export const isActionFilter = (e) => {
    return e.type === 'console.action/filter';
};
//# sourceMappingURL=actions.js.map