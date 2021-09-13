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
import classNames from "classnames";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Split,
  SplitItem,
} from "@patternfly/react-core";

type BreadCrumbsProps = {
  breadcrumbs: { name: string; path: string }[];
};

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ breadcrumbs }) => (
  <Breadcrumb>
    {breadcrumbs.map((crumb, i, { length }) => {
      const isLast = i === length - 1;

      return (
        <BreadcrumbItem key={i} isActive={isLast}>
          {isLast ? (
            crumb.name
          ) : (
            <Link
              className="pf-c-breadcrumb__link"
              to={crumb.path}
              data-test-id={`breadcrumb-link-${i}`}
            >
              {crumb.name}
            </Link>
          )}
        </BreadcrumbItem>
      );
    })}
  </Breadcrumb>
);

type PageHeadingProps = {
  breadcrumbs?: { name: string; path: string }[];
  children?: React.ReactChildren;
  style?: any;
  title?: string | JSX.Element;
  badge?: React.ReactNode;
  className?: string;
};

const PageHeading: React.FC<PageHeadingProps> = (props) => {
  const { title, breadcrumbs, style, badge, className } = props;
  const resourceTitle = title;
  const showBreadcrumbs = !!breadcrumbs;
  return (
    <div
      className={classNames(
        "co-m-nav-title",
        "co-m-nav-title--detail",
        { "co-m-nav-title--breadcrumbs": showBreadcrumbs },
        className
      )}
      style={style}
    >
      {showBreadcrumbs && (
        <Split style={{ alignItems: "baseline" }}>
          <SplitItem isFilled>
            <BreadCrumbs breadcrumbs={breadcrumbs} />
          </SplitItem>
          {badge && (
            <SplitItem>
              <span className="co-m-pane__heading-badge">{badge}</span>
            </SplitItem>
          )}
        </Split>
      )}
      <h1 className="co-m-pane__heading">
        <div className="co-m-pane__name co-resource-item">
          <span
            data-test-id="resource-title"
            className="co-resource-item__resource-name"
          >
            {resourceTitle}
          </span>
        </div>
      </h1>
      {props.children}
    </div>
  );
};

export default PageHeading;
