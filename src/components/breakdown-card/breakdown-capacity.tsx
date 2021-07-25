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
import "./breakdown-card.scss";
import classNames from "classnames";

export const TotalCapacityBody: React.FC<TotalCapacityBodyProps> = ({
  value,
  className,
}) => {
  return (
    <p
      className={classNames(
        "capacity-breakdown-card__capacity-body",
        className
      )}
    >
      {value}
    </p>
  );
};

type TotalCapacityBodyProps = {
  value: string;
  className?: string;
};
