/**
 * Copyright contributors to the ibm-storage-odf-console project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export enum Colors {
  AVAILABLE = "#b8bbbe",
  OTHER = "#000",
  LINK = "#0066cc",
}

export const COLORMAP = [
  "rgb(236, 122, 8)",
  "rgb(139, 193, 247)",
  "rgb(76, 177, 64)",
  "rgb(160, 158, 220)",
  "rgb(0, 149, 150)",
];

export const OTHER = "Other";
export const CLUSTERWIDE = "Cluster-wide";
export const BUCKETCLASSKIND = "BucketClass";

export const OTHER_TOOLTIP =
  "All other capacity usage that are not a part of the top 5 consumers.";
export const CLUSTERWIDE_TOOLTIP =
  "Any NON Object bucket claims that were created via an S3 client or via the NooBaa UI system.";
