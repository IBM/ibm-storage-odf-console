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
	MenuItemGroup,
	MenuItem,
	SelectOption,
	SelectGroup
} from '@patternfly/react-core';

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

export const getOptionsMenuItems = (
  dropdownItems: GroupedSelectItems,
  selectedItems: string[],
  onSelect: (e) => void
) => {
  return dropdownItems.map(({ group, items }) => (
    <MenuItemGroup
      className="nb-data-consumption-card__dropdown-item--hide-list-style"
      key={group}
      groupTitle={group}
    >
      {items.map((item) => (
        <MenuItem
          onSelect={onSelect}
          isSelected={selectedItems.includes(item)}
          id={item}
          key={item}
        >
          {item}
        </MenuItem>
      ))}
    </MenuItemGroup>
  ));
};
