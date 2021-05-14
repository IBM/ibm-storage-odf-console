// Type guards
export const isHrefNavItem = (e) => e.type === 'console.navigation/href';
export const isResourceNSNavItem = (e) => e.type === 'console.navigation/resource-ns';
export const isResourceClusterNavItem = (e) => e.type === 'console.navigation/resource-cluster';
export const isSeparator = (e) => e.type === 'console.navigation/separator';
export const isNavSection = (e) => e.type === 'console.navigation/section';
export const isNavItem = (e) => {
    return isHrefNavItem(e) || isResourceNSNavItem(e) || isResourceClusterNavItem(e);
};
//# sourceMappingURL=navigation.js.map