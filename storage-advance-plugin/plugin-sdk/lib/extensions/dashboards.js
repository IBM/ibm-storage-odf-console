// Type guards
export const isDashboardsTab = (e) => e.type === 'console.dashboards/tab';
export const isDashboardsCard = (e) => e.type === 'console.dashboards/card';
export const isDashboardsOverviewHealthPrometheusSubsystem = (e) => e.type === 'console.dashboards/overview/health/prometheus';
export const isDashboardsOverviewURLSubsystem = (e) => e.type === 'console.dashboards/overview/health/url';
export const isDashboardsOverviewHealthResourceSubsystem = (e) => e.type === 'console.dashboards/overview/health/resource';
export const isDashboardsOverviewHealthOperator = (e) => e.type === 'console.dashboards/overview/health/operator';
export const isDashboardsInventoryItemGroup = (e) => e.type === 'console.dashboards/inventory/item/group';
export const isDashboardsOverviewInventoryItem = (e) => e.type === 'console.dashboards/inventory/item';
export const isDashboardsOverviewResourceActivity = (e) => e.type === 'console.dashboards/overview/activity/resource';
//# sourceMappingURL=dashboards.js.map