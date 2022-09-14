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
import { useTranslation } from "react-i18next";
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon";
import { Tooltip } from "@patternfly/react-core";
import {useCustomPrometheusPoll} from "../custom-prometheus-poll/custom-prometheus-poll"

import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { parseMetricData } from "../../selectors/promethues-utils";
import { humanizeBinaryBytes } from "../../humanize";
import { StorageDashboardQuery } from "../../constants/queries";
import "./storage-efficiency-card.scss";

const StorageEfficiencyCardBody: React.FC<any> = () => {
  const { t } = useTranslation("plugin__ibm-storage-odf-plugin");

  const [metric, error, loading] = useCustomPrometheusPoll({
    query: StorageDashboardQuery.SystemTotalEfficiencySaving,
    endpoint: "api/v1/query" as any,
    samples: 60
  });

  const [saving] =
    !loading && !error ? parseMetricData(metric, humanizeBinaryBytes) : [];
  let status = t("Not available");
  if (saving) {
    status = saving.string;
  }
  return (
    <div className="co-inventory-card__item">
      <div className="co-utilization-card__item-section-multiline">
        <h4 className="pf-c-content pf-m-md">{t("Savings")}</h4>
        <div className="text-secondary">
          {status}
          <span className="ibm-storage-efficiency-card-help">
            <Tooltip
              position="top"
              content={t(
                "The amount of storage saved after applying compression, deduplication and thin-provisioning."
              )}
            >
              <OutlinedQuestionCircleIcon title={t("Status")} />
            </Tooltip>
          </span>
        </div>
      </div>
    </div>
  );
};

const StorageEfficiencyCard: React.FC = () => {
  const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Storage Efficiency")}</CardTitle>
      </CardHeader>
      <CardBody>
        <StorageEfficiencyCardBody />
      </CardBody>
    </Card>
  );
};

export default StorageEfficiencyCard;
