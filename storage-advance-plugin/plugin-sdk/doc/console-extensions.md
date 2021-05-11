# OpenShift Console Extension Types

1. [`console.action/filter`](#console.action/filter)
2. [`console.action/group`](#console.action/group)
3. [`console.action/provider`](#console.action/provider)
4. [`console.action/resource-provider`](#console.action/resource-provider)
5. [`console.alert-action`](#console.alert-action)
6. [`console.catalog/item-filter`](#console.catalog/item-filter)
7. [`console.catalog/item-provider`](#console.catalog/item-provider)
8. [`console.catalog/item-type`](#console.catalog/item-type)
9. [`console.context-provider`](#console.context-provider)
10. [`console.dashboards/card`](#console.dashboards/card)
11. [`console.dashboards/inventory/item`](#console.dashboards/inventory/item)
12. [`console.dashboards/inventory/item/group`](#console.dashboards/inventory/item/group)
13. [`console.dashboards/overview/activity/resource`](#console.dashboards/overview/activity/resource)
14. [`console.dashboards/overview/health/operator`](#console.dashboards/overview/health/operator)
15. [`console.dashboards/overview/health/prometheus`](#console.dashboards/overview/health/prometheus)
16. [`console.dashboards/overview/health/resource`](#console.dashboards/overview/health/resource)
17. [`console.dashboards/overview/health/url`](#console.dashboards/overview/health/url)
18. [`console.dashboards/tab`](#console.dashboards/tab)
19. [`console.file-upload`](#console.file-upload)
20. [`console.flag`](#console.flag)
21. [`console.flag/createIBMStorage`](#console.flag/createIBMStorage)
22. [`console.flag/foo`](#console.flag/foo)
23. [`console.flag/model`](#console.flag/model)
24. [`console.global-config`](#console.global-config)
25. [`console.navigation/href`](#console.navigation/href)
26. [`console.navigation/resource-cluster`](#console.navigation/resource-cluster)
27. [`console.navigation/resource-ns`](#console.navigation/resource-ns)
28. [`console.navigation/section`](#console.navigation/section)
29. [`console.navigation/separator`](#console.navigation/separator)
30. [`console.page/resource/details`](#console.page/resource/details)
31. [`console.page/resource/list`](#console.page/resource/list)
32. [`console.page/resource/tab`](#console.page/resource/tab)
33. [`console.page/route`](#console.page/route)
34. [`console.page/route/standalone`](#console.page/route/standalone)
35. [`console.pvc/alert`](#console.pvc/alert)
36. [`console.pvc/create-prop`](#console.pvc/create-prop)
37. [`console.pvc/delete`](#console.pvc/delete)
38. [`console.pvc/status`](#console.pvc/status)
39. [`console.redux-reducer`](#console.redux-reducer)
40. [`console.resource-metadata`](#console.resource-metadata)
41. [`console.storage-provider`](#console.storage-provider)
42. [`console.telemetry/listener`](#console.telemetry/listener)
43. [`console.yaml-template`](#console.yaml-template)
44. [`dev-console.add/action`](#dev-console.add/action)
45. [`topology.details/resource-alert`](#topology.details/resource-alert)
46. [`topology.details/resource-link`](#topology.details/resource-link)
47. [`topology.details/tab`](#topology.details/tab)
48. [`topology.details/tab-section`](#topology.details/tab-section)

---

## `console.action/filter`

### Summary

ActionFilter can be used to filter an action

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `contextId` | `string` | no | The context ID helps to narrow the scope of contributed actions to a particular area of the application. Ex - topology, helm |
| `filter` | `CodeRef<(scope: any, action: Action) => boolean>` | no | A function which will filter actions based on some conditions.<br/>scope: The scope in which actions should be provided for.<br/>Note: hook may be required if we want to remove the ModifyCount action from a deployment with HPA |

---

## `console.action/group`

### Summary

ActionGroup contributes an action group that can also be a submenu

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | ID used to identify the action section. |
| `label` | `string` | yes | The label to display in the UI.<br/>Required for submenus. |
| `submenu` | `boolean` | yes | Whether this group should be displayed as submenu |
| `insertBefore` | `string \| string[]` | yes | Insert this item before the item referenced here.<br/>For arrays, the first one found in order is used. |
| `insertAfter` | `string \| string[]` | yes | Insert this item after the item referenced here.<br/>For arrays, the first one found in order is used.<br/>insertBefore takes precedence. |

---

## `console.action/provider`

### Summary

ActionProvider contributes a hook that returns list of actions for specific context

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `contextId` | `string` | no | The context ID helps to narrow the scope of contributed actions to a particular area of the application. Ex - topology, helm |
| `provider` | `CodeRef<ExtensionHook<Action[], any>>` | no | A react hook which returns actions for the given scope.<br/>If contextId = `resource` then the scope will always be a K8s resource object |

---

## `console.action/resource-provider`

### Summary

ResourceActionProvider contributes a hook that returns list of actions for specific resource model

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `model` | `ExtensionK8sGroupModel` | no | The model for which this provider provides actions for. |
| `provider` | `CodeRef<ExtensionHook<Action[], any>>` | no | A react hook which returns actions for the given resource model |

---

## `console.alert-action`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `alert` | `string` | no |  |
| `text` | `string` | no |  |
| `action` | `CodeRef<(alert: any) => void>` | no |  |

---

## `console.catalog/item-filter`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `catalogId` | `string \| string[]` | no | The unique identifier for the catalog this provider contributes to. |
| `type` | `string` | no | Type ID for the catalog item type. |
| `filter` | `CodeRef<(item: CatalogItem) => boolean>` | no | Filters items of a specific type. Value is a function that takes CatalogItem[] and returns a subset based on the filter criteria. |

---

## `console.catalog/item-provider`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `catalogId` | `string \| string[]` | no | The unique identifier for the catalog this provider contributes to. |
| `type` | `string` | no | Type ID for the catalog item type. |
| `provider` | `CodeRef<ExtensionHook<CatalogItem<any>[], CatalogExtensionHookOptions>>` | no | Fetch items and normalize it for the catalog. Value is a react effect hook. |
| `priority` | `number` | yes | Priority for this provider. Defaults to 0. Higher priority providers may override catalog<br/>items provided by other providers. |

---

## `console.catalog/item-type`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `type` | `string` | no | Type for the catalog item. |
| `title` | `string` | no | Title for the catalog item. |
| `catalogDescription` | `string` | yes | Description for the type specific catalog. |
| `typeDescription` | `string` | yes | Description for the catalog item type. |
| `filters` | `CatalogItemAttribute[]` | yes | Custom filters specific to the catalog item. |
| `groupings` | `CatalogItemAttribute[]` | yes | Custom groupings specific to the catalog item. |

---

## `console.context-provider`

### Summary

Adds new React context provider to Console application root.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `provider` | `CodeRef<Provider<T>>` | no | Context Provider component. |
| `useValueHook` | `CodeRef<() => T>` | no | Hook for the Context value. |

---

## `console.dashboards/card`

### Summary

Adds a new dashboard card.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `tab` | `string` | no | The id of the dashboard tab to which the card will be added. |
| `position` | `'LEFT' \| 'RIGHT' \| 'MAIN'` | no | The grid position of the card on the dashboard. |
| `loader` | `CodeRef<React.ComponentType<{}>>` | no | Dashboard card component. |
| `span` | `DashboardCardSpan` | yes | Card's vertical span in the column. Ignored for small screens, defaults to 12. |

---

## `console.dashboards/inventory/item`

### Summary

Adds a resource tile to the overview inventory card.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `model` | `CodeRef<T>` | no | The model for `resource` which will be fetched. Used to get the model's `label` or `abbr`. |
| `mapper` | `CodeRef<StatusGroupMapper<T, R>>` | yes | Function which maps various statuses to groups. |
| `additionalResources` | `CodeRef<WatchK8sResources<R>>` | yes | Additional resources which will be fetched and passed to the `mapper` function. |

---

## `console.dashboards/inventory/item/group`

### Summary

Adds an inventory status group.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | The id of the status group. |
| `icon` | `CodeRef<React.ReactElement<any, string \| React.JSXElementConstructor<any>>>` | no | React component representing the status group icon. |

---

## `console.dashboards/overview/activity/resource`

### Summary

Adds an activity to the Activity Card of Overview Dashboard where the triggering of activity is based on watching a K8s resource.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `k8sResource` | `CodeRef<FirehoseResource & { isList: true; }>` | no | The utilization item to be replaced. |
| `loader` | `CodeRef<React.ComponentType<K8sActivityProps<T>>>` | no | Loader for the corresponding action component. |
| `isActivity` | `CodeRef<(resource: T) => boolean>` | yes | Function which determines if the given resource represents the action. If not defined, every resource represents activity. |
| `getTimestamp` | `CodeRef<(resource: T) => Date>` | yes | Timestamp for the given action, which will be used for ordering. |

---

## `console.dashboards/overview/health/operator`

### Summary

Adds a health subsystem to the status card of Overview dashboard where the source of status is a K8s REST API.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `title` | `string` | no | Title of operators section in the popup. |
| `resources` | `CodeRef<FirehoseResource[]>` | no | Kubernetes resources which will be fetched and passed to `healthHandler`. |
| `getOperatorsWithStatuses` | `CodeRef<GetOperatorsWithStatuses<T>>` | yes | Resolves status for the operators. |
| `operatorRowLoader` | `CodeRef<React.ComponentType<OperatorRowProps<T>>>` | yes | Loader for popup row component. |
| `viewAllLink` | `string` | yes | Links to all resources page. If not provided then a list page of the first resource from resources prop is used. |

---

## `console.dashboards/overview/health/prometheus`

### Summary

Adds a health subsystem to the status card of Overview dashboard where the source of status is Prometheus.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `title` | `string` | no | The display name of the subsystem. |
| `healthHandler` | `CodeRef<PrometheusHealthHandler>` | no | Resolve the subsystem's health. |
| `additionalResource` | `CodeRef<FirehoseResource>` | yes | Additional resource which will be fetched and passed to `healthHandler`. |
| `popupComponent` | `CodeRef<React.ComponentType<PrometheusHealthPopupProps>>` | yes | Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. |
| `popupTitle` | `string` | yes | The title of the popover. |
| `disallowedProviders` | `string[]` | yes | Cloud providers which for which the subsystem should be hidden. |

---

## `console.dashboards/overview/health/resource`

### Summary

Adds a health subsystem to the status card of Overview dashboard where the source of status is a K8s Resource.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `title` | `string` | no | The display name of the subsystem. |
| `resources` | `CodeRef<WatchK8sResources<T>>` | no | Kubernetes resources which will be fetched and passed to `healthHandler`. |
| `healthHandler` | `CodeRef<ResourceHealthHandler<T>>` | no | Resolve the subsystem's health. |
| `popupComponent` | `CodeRef<WatchK8sResults<T>>` | yes | Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. |
| `popupTitle` | `string` | yes | The title of the popover. |

---

## `console.dashboards/overview/health/url`

### Summary

Adds a health subsystem to the status card of Overview dashboard where the source of status is a K8s REST API.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `title` | `string` | no | The display name of the subsystem. |
| `url` | `string` | no | The URL to fetch data from. It will be prefixed with base k8s URL. |
| `healthHandler` | `CodeRef<URLHealthHandler<T, K8sResourceCommon \| K8sResourceCommon[]>>` | no | Resolve the subsystem's health. |
| `additionalResource` | `CodeRef<FirehoseResource>` | yes | Additional resource which will be fetched and passed to `healthHandler`. |
| `popupComponent` | `CodeRef<React.ComponentType<{ healthResult?: T; healthResultError?: any; k8sResult?: FirehoseResult<R>; }>>` | yes | Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. |
| `popupTitle` | `string` | yes | The title of the popover. |

---

## `console.dashboards/tab`

### Summary

Adds a new dashboard tab, placed after the Overview tab.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | A unique tab identifier, used as tab link `href` and when adding cards to this tab. |
| `title` | `string` | no | The title of the tab. |

---

## `console.file-upload`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `fileExtensions` | `string[]` | no | Supported file extensions. |
| `handler` | `CodeRef<FileUploadHandler>` | no | Function which handles the file drop action. |

---

## `console.flag`

### Summary

Gives full control over Console feature flags.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `handler` | `CodeRef<(callback: SetFeatureFlag) => void>` | no | Used to set/unset arbitrary feature flags. |

---

## `console.flag/createIBMStorage`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `handler` | `CodeRef<(SetFooFeatureFlag: CreateIBMStorageProgs) => React.ReactNode>` | no | Used to set/unset arbitrary feature flags. |

---

## `console.flag/foo`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `handler` | `CodeRef<(SetFooFeatureFlag: SetFooFeatureFlag) => void>` | no | Used to set/unset arbitrary feature flags. |

---

## `console.flag/model`

### Summary

Adds new Console feature flag driven by the presence of a CRD on the cluster.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `flag` | `string` | no | The name of the flag to set once the CRD is detected. |
| `model` | `ExtensionK8sModel` | no | The model which refers to a `CustomResourceDefinition`. |

---

## `console.global-config`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | Unique identifier for the cluster config resource instance. |
| `name` | `string` | no | The name of the cluster config resource instance. |
| `model` | `ExtensionK8sModel` | no | The model which refers to a cluster config resource. |
| `namespace` | `string` | no | The namespace of the cluster config resource instance. |

---

## `console.navigation/href`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | A unique identifier for this item. |
| `name` | `string` | no | The name of this item. |
| `href` | `string` | no | The link href value. |
| `perspective` | `string` | yes | The perspective ID to which this item belongs to. If not specified, contributes to the default perspective. |
| `section` | `string` | yes | Navigation section to which this item belongs to. If not specified, render this item as a top level link. |
| `dataAttributes` | `{ [key: string]: string; }` | yes | Adds data attributes to the DOM. |
| `startsWith` | `string[]` | yes | Mark this item as active when the URL starts with one of these paths. |
| `insertBefore` | `string \| string[]` | yes | Insert this item before the item referenced here. For arrays, the first one found in order is used. |
| `insertAfter` | `string \| string[]` | yes | Insert this item after the item referenced here. For arrays, the first one found in order is used. `insertBefore` takes precedence. |
| `namespaced` | `boolean` | yes | if true, adds /ns/active-namespace to the end |
| `prefixNamespaced` | `boolean` | yes | if true, adds /k8s/ns/active-namespace to the begining |

---

## `console.navigation/resource-cluster`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | A unique identifier for this item. |
| `model` | `ExtensionK8sModel` | no | The model for which this nav item links to. |
| `perspective` | `string` | yes | The perspective ID to which this item belongs to. If not specified, contributes to the default perspective. |
| `section` | `string` | yes | Navigation section to which this item belongs to. If not specified, render this item as a top level link. |
| `dataAttributes` | `{ [key: string]: string; }` | yes | Adds data attributes to the DOM. |
| `startsWith` | `string[]` | yes | Mark this item as active when the URL starts with one of these paths. |
| `insertBefore` | `string \| string[]` | yes | Insert this item before the item referenced here. For arrays, the first one found in order is used. |
| `insertAfter` | `string \| string[]` | yes | Insert this item after the item referenced here. For arrays, the first one found in order is used. `insertBefore` takes precedence. |
| `name` | `string` | yes | Overrides the default name. If not supplied the name of the link will equal the plural value of the model. |

---

## `console.navigation/resource-ns`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | A unique identifier for this item. |
| `model` | `ExtensionK8sModel` | no | The model for which this nav item links to. |
| `perspective` | `string` | yes | The perspective ID to which this item belongs to. If not specified, contributes to the default perspective. |
| `section` | `string` | yes | Navigation section to which this item belongs to. If not specified, render this item as a top level link. |
| `dataAttributes` | `{ [key: string]: string; }` | yes | Adds data attributes to the DOM. |
| `startsWith` | `string[]` | yes | Mark this item as active when the URL starts with one of these paths. |
| `insertBefore` | `string \| string[]` | yes | Insert this item before the item referenced here. For arrays, the first one found in order is used. |
| `insertAfter` | `string \| string[]` | yes | Insert this item after the item referenced here. For arrays, the first one found in order is used. `insertBefore` takes precedence. |
| `name` | `string` | yes | Overrides the default name. If not supplied the name of the link will equal the plural value of the model. |

---

## `console.navigation/section`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | A unique identifier for this item. |
| `perspective` | `string` | yes | The perspective ID to which this item belongs to. If not specified, contributes to the default perspective. |
| `dataAttributes` | `{ [key: string]: string; }` | yes | Adds data attributes to the DOM. |
| `insertBefore` | `string \| string[]` | yes | Insert this item before the item referenced here. For arrays, the first one found in order is used. |
| `insertAfter` | `string \| string[]` | yes | Insert this item after the item referenced here. For arrays, the first one found in order is used. `insertBefore` takes precedence. |
| `name` | `string` | yes | Name of this section. If not supplied, only a separator will be shown above the section. |

---

## `console.navigation/separator`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | A unique identifier for this item. |
| `perspective` | `string` | yes | The perspective ID to which this item belongs to. If not specified, contributes to the default perspective. |
| `section` | `string` | yes | Navigation section to which this item belongs to. If not specified, render this item as a top level link. |
| `dataAttributes` | `{ [key: string]: string; }` | yes | Adds data attributes to the DOM. |
| `insertBefore` | `string \| string[]` | yes | Insert this item before the item referenced here. For arrays, the first one found in order is used. |
| `insertAfter` | `string \| string[]` | yes | Insert this item after the item referenced here. For arrays, the first one found in order is used. `insertBefore` takes precedence. |

---

## `console.page/resource/details`

### Summary

Adds new resource details page to Console router.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `model` | `ExtensionK8sModel` | no | The model for which this resource page links to. |
| `component` | `CodeRef<React.ComponentType<{ match: match<{}>; namespace: string; model: ExtensionK8sModel; }>>` | no |  |

---

## `console.page/resource/list`

### Summary

Adds new resource list page to Console router.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `model` | `ExtensionK8sModel` | no | The model for which this resource page links to. |
| `component` | `CodeRef<React.ComponentType<{ match: match<{}>; namespace: string; model: ExtensionK8sModel; }>>` | no |  |

---

## `console.page/resource/tab`

### Summary

Adds new resource tab page to Console router.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `model` | `ExtensionK8sModel` | no | The model for which this resource page links to. |
| `component` | `CodeRef<React.ComponentType<RouteComponentProps<{}, StaticContext, any>>>` | no | The component to be rendered when the route matches. |
| `name` | `string` | no | The name of the tab. |
| `href` | `string` | yes | The optional href for the tab link. If not provided, the first `path` is used. |
| `exact` | `boolean` | yes | When true, will only match if the path matches the `location.pathname` exactly. |

---

## `console.page/route`

### Summary

Adds new page to Console router.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `component` | `CodeRef<React.ComponentType<RouteComponentProps<{}, StaticContext, any>>>` | no | The component to be rendered when the route matches. |
| `path` | `string \| string[]` | no | Valid URL path or array of paths that `path-to-regexp@^1.7.0` understands. |
| `perspective` | `string` | yes | The perspective to which this page belongs to. If not specified, contributes to all perspectives. |
| `exact` | `boolean` | yes | When true, will only match if the path matches the `location.pathname` exactly. |

---

## `console.page/route/standalone`

### Summary

Adds new standalone page (rendered outside the common page layout) to Console router.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `component` | `CodeRef<React.ComponentType<RouteComponentProps<{}, StaticContext, any>>>` | no | The component to be rendered when the route matches. |
| `path` | `string \| string[]` | no | Valid URL path or array of paths that `path-to-regexp@^1.7.0` understands. |
| `exact` | `boolean` | yes | When true, will only match if the path matches the `location.pathname` exactly. |

---

## `console.pvc/alert`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `alert` | `CodeRef<React.ComponentType<{ pvc: K8sResourceCommon; }>>` | no | The alert component. |

---

## `console.pvc/create-prop`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `label` | `string` | no | Label for the create prop action. |
| `path` | `string` | no | Path for the create prop action. |

---

## `console.pvc/delete`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `predicate` | `CodeRef<(pvc: K8sResourceCommon) => boolean>` | no | Predicate that tells whether to use the extension or not. |
| `onPVCKill` | `CodeRef<(pvc: K8sResourceCommon) => Promise<void>>` | no | Method for the PVC delete operation. |
| `alert` | `CodeRef<React.ComponentType<{ pvc: K8sResourceCommon; }>>` | no | Alert component to show additional information. |

---

## `console.pvc/status`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `priority` | `number` | no | Priority for the status component. Bigger value means higher priority. |
| `status` | `CodeRef<React.ComponentType<{ pvc: K8sResourceCommon; }>>` | no | The status component. |
| `predicate` | `CodeRef<(pvc: K8sResourceCommon) => boolean>` | no | Predicate that tells whether to render the status component or not. |

---

## `console.redux-reducer`

### Summary

Adds new reducer to Console Redux store which operates on `plugins.<scope>` substate.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `scope` | `string` | no | The key to represent the reducer-managed substate within the Redux state object. |
| `reducer` | `CodeRef<Reducer<any, AnyAction>>` | no | The reducer function, operating on the reducer-managed substate. |

---

## `console.resource-metadata`

### Summary

Customize the display of models by overriding values retrieved and generated through API discovery.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `model` | `ExtensionK8sGroupModel` | no | The model to customize. May specify only a group, or optional version and kind. |
| `badge` | `'tech' \| 'dev'` | yes | Whether to consider this model reference as tech preview or dev preview. |
| `color` | `string` | yes | The color to associate to this model. |
| `label` | `string` | yes | Override the label. Requires `kind` be provided. |
| `labelPlural` | `string` | yes | Override the plural label. Requires `kind` be provided. |
| `abbr` | `string` | yes | Customize the abbreviation. Defaults to All uppercase chars in the kind up to 4 characters long. Requires `kind` be provided. |

---

## `console.storage-provider`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `name` | `string` | no |  |
| `Component` | `CodeRef<React.ComponentType<Partial<RouteComponentProps<{}, StaticContext, any>>>>` | no |  |

---

## `console.telemetry/listener`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `listener` | `CodeRef<TelemetryEventListener>` | no | Listen for telemetry events |

---

## `console.yaml-template`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `model` | `ExtensionK8sModel` | no | Model associated with the template. |
| `template` | `string` | no | The YAML template. |
| `name` | `string` | no | The name of the template. Use the name `default` to mark this as the default template. |

---

## `dev-console.add/action`

### Summary

(not available)

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | ID used to identify the action. |
| `label` | `string` | no | The label of the action |
| `description` | `string` | no | The description of the action. |
| `href` | `string` | no | The href to navigate to. |
| `icon` | `CodeRef<React.ReactNode>` | yes | The perspective display icon. |
| `accessReview` | `AccessReviewResourceAttributes[]` | yes | Optional access review to control visibility / enablement of the action. |

---

## `topology.details/resource-alert`

### Summary

DetailsResourceAlert contributes an alert for specific topology context or graph element.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | The ID of this alert. Used to save state if the alert should be shown after dismissed. |
| `title` | `string` | no | The title of the alert |
| `contentProvider` | `CodeRef<(element: GraphElement) => DetailsResourceAlertContent>` | no | Hook to return the contents of the Alert. |
| `dismissible` | `boolean` | yes | Whether to show a dismiss button. false by default |

---

## `topology.details/resource-link`

### Summary

DetailsResourceLink contributes a link for specific topology context or graph element.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `link` | `CodeRef<(element: GraphElement) => React.Component \| undefined>` | no | Return the resource link if provided, otherwise undefined.<br/>Use ResourceIcon and ResourceLink for styles. |
| `priority` | `number` | yes | A higher priority factory will get the first chance to create the link. |

---

## `topology.details/tab`

### Summary

DetailsTab contributes a tab for the topology details panel.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | A unique identifier for this details tab. |
| `label` | `string` | no | The tab label to display in the UI. |
| `insertBefore` | `string \| string[]` | yes | Insert this item before the item referenced here.<br/>For arrays, the first one found in order is used. |
| `insertAfter` | `string \| string[]` | yes | Insert this item after the item referenced here.<br/>For arrays, the first one found in order is used.<br/>insertBefore takes precedence. |

---

## `topology.details/tab-section`

### Summary

DetailsTabSection contributes a section for a specific tab in topology details panel.

### Properties

| Name | Value Type | Optional | Description |
| ---- | ---------- | -------- | ----------- |
| `id` | `string` | no | A unique identifier for this details tab section. |
| `tab` | `string` | no | The parent tab ID that this section should contribute to. |
| `section` | `CodeRef<(element: GraphElement) => React.Component \| undefined>` | no | Returns a section for the graph element or undefined if not provided.<br/>SDK component: <Section title={<optional>}>... padded area </Section> |
| `insertBefore` | `string \| string[]` | yes | Insert this item before the item referenced here.<br/>For arrays, the first one found in order is used. |
| `insertAfter` | `string \| string[]` | yes | Insert this item after the item referenced here.<br/>For arrays, the first one found in order is used.<br/>insertBefore takes precedence. |

