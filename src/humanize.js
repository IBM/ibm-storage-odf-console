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
import * as _ from "lodash-es";
export const units = {};
export const validate = {};

const TYPES = {
  numeric: {
    units: ["", "k", "m", "b"],
    space: false,
    divisor: 1000,
  },
  decimalBytes: {
    units: ["B", "KB", "MB", "GB", "TB", "PB", "EB"],
    space: true,
    divisor: 1000,
  },
  decimalBytesWithoutB: {
    units: ["", "k", "M", "G", "T", "P", "E"],
    space: true,
    divisor: 1000,
  },
  binaryBytes: {
    units: ["B", "KiB", "MiB", "GiB", "TiB", "PiB"],
    space: true,
    divisor: 1024,
  },
  binaryBytesWithoutB: {
    units: ["i", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei"],
    space: true,
    divisor: 1024,
  },
  SI: {
    units: ["", "k", "M", "G", "T", "P", "E"],
    space: false,
    divisor: 1000,
  },
  decimalBytesPerSec: {
    units: ["Bps", "KBps", "MBps", "GBps", "TBps", "PBps", "EBps"],
    space: true,
    divisor: 1000,
  },
  packetsPerSec: {
    units: ["pps", "kpps"],
    space: true,
    divisor: 1000,
  },
  seconds: {
    units: ["ns", "μs", "ms", "s"],
    space: true,
    divisor: 1000,
  },
};

export const getType = (name) => {
  const type = TYPES[name];
  if (!_.isPlainObject(type)) {
    return {
      units: [],
      space: false,
      divisor: 1000,
    };
  }
  return type;
};

const convertBaseValueToUnits = (
value,
unitArray,
divisor,
initialUnit,
preferredUnit
) => {
const sliceIndex = initialUnit ? unitArray.indexOf(initialUnit) : 0;
const units_ = unitArray.slice(sliceIndex);

if (preferredUnit || preferredUnit === "") {
  const unitIndex = units_.indexOf(preferredUnit);
  if (unitIndex !== -1) {
    return {
      value: value / divisor ** unitIndex,
      unit: preferredUnit,
    };
  }
}

let unit = units_.shift();
while (value >= divisor && units_.length > 0) {
  value = value / divisor;
  unit = units_.shift();
}
return { value, unit };
};

const getDefaultFractionDigits = (value) => {
if (value < 1) {
  return 3;
}
if (value < 100) {
  return 2;
}
return 1;
};

const formatValue = (value, options) => {
const fractionDigits = getDefaultFractionDigits(value);
const { locales, ...rest } = _.defaults(options, {
  maximumFractionDigits: fractionDigits,
});

// 2nd check converts -0 to 0.
if (!isFinite(value) || value === 0) {
  value = 0;
}
return Intl.NumberFormat(locales, rest).format(value);
};

const round = (units.round = (value, fractionDigits) => {
if (!isFinite(value)) {
  return 0;
}
const multiplier = Math.pow(
  10,
  fractionDigits || getDefaultFractionDigits(value)
);
return Math.round(value * multiplier) / multiplier;
});


const humanize = (units.humanize = (
value,
typeName,
useRound = false,
initialUnit,
preferredUnit
) => {
const type = getType(typeName);

if (!isFinite(value)) {
  value = 0;
}

let converted = convertBaseValueToUnits(
  value,
  type.units,
  type.divisor,
  initialUnit,
  preferredUnit
);

if (useRound) {
  converted.value = round(converted.value);
  converted = convertBaseValueToUnits(
    converted.value,
    type.units,
    type.divisor,
    converted.unit,
    preferredUnit
  );
}

const formattedValue = formatValue(converted.value);

return {
  string: type.space
    ? `${formattedValue} ${converted.unit}`
    : formattedValue + converted.unit,
  unit: converted.unit,
  value: converted.value,
};
});

export const humanizeBinaryBytes = (v, initialUnit, preferredUnit) =>
humanize(v, "binaryBytes", true, initialUnit, preferredUnit);
