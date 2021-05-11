// Type guards
export const isDetailsTab = (e) => {
    return e.type === 'topology.details/tab';
};
export const isDetailsTabSection = (e) => {
    return e.type === 'topology.details/tab-section';
};
export const isDetailsResourceLink = (e) => {
    return e.type === 'topology.details/resource-link';
};
export const isDetailsResourceAlert = (e) => {
    return e.type === 'topology.details/resource-alert';
};
//# sourceMappingURL=topology-details.js.map