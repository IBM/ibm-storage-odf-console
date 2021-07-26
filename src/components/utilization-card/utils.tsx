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
  humanizeNumber,
  humanizeSeconds,
  secondsToNanoSeconds,
} from "../../humanize";

type HumanizeResult = {
  string: string;
  value: number;
  unit: string;
};
type Humanize = {
  (
    v: React.ReactText,
    initialUnit?: string,
    preferredUnit?: string
  ): HumanizeResult;
};
export const humanizeIOPS: Humanize = (value) => {
  const humanizedNumber = humanizeNumber(value);
  const unit = "IOPS";
  return {
    ...humanizedNumber,
    string: `${humanizedNumber.value} ${humanizedNumber.unit}`,
    unit,
  };
};

export const humanizeLatency: Humanize = (value) => {
  const humanizedTime = humanizeSeconds(
    secondsToNanoSeconds(value),
    null,
    "ms"
  );
  return humanizedTime;
};

export enum ByteDataTypes {
  BinaryBytes = "binaryBytes",
  BinaryBytesWithoutB = "binaryBytesWithoutB",
  DecimalBytes = "decimalBytes",
  DecimalBytesWithoutB = "decimalBytesWithoutB",
}
