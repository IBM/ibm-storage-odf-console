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
import * as React from "react";

import {
  MenuItem,
  SelectOption,
  SelectGroup,
} from "@patternfly/react-core";

type GroupedSelectItems = {
  group: string;
  items: string[];
}[];

export const getSelectOptions = (selectItems: string[]): React.ReactElement[] =>
  selectItems.map((item) => <SelectOption key={item} value={item} />);

export const getGroupedSelectOptions = (
  groupedSelectItems: GroupedSelectItems
): React.ReactElement[] =>
  groupedSelectItems.map(({ group, items }) => (
    <SelectGroup key={group} label={group}>
      {getSelectOptions(items)}
    </SelectGroup>
  ));

// --- Menu migration: OptionsMenuItemGroup/OptionsMenuItem -> MenuItem ---
export const getMenuItems = (
  dropdownItems: GroupedSelectItems,
  selectedItems: string[],
  onSelect: (e: React.MouseEvent, id?: string) => void
): React.ReactElement[] => {
  // We flatten to a single array of MenuItems.
  // Each group renders a disabled "header" MenuItem (for label),
  // followed by its actual selectable items.
  return dropdownItems.flatMap(({ group, items }, groupIdx) => [
    // Group header (non-interactive)
    <MenuItem
      key={`group-header-${groupIdx}-${group}`}
      isDisabled
      className="nb-data-consumption-card__dropdown-item--hide-list-style"
      // Prevent pointer/click & style like a label
      style={{ fontWeight: 600, pointerEvents: "none" }}
    >
      {group}
    </MenuItem>,

    // Selectable items
    ...items.map((item) => (
      <MenuItem
        key={item}
        itemId={item}
        isSelected={selectedItems.includes(item)}
        onClick={(e) => onSelect(e, item)}
      >
        {item}
      </MenuItem>
    )),
  ]);
};
