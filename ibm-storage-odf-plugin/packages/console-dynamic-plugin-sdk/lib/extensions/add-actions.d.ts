import * as React from 'react';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
import { AccessReviewResourceAttributes } from './console-types';
export declare type AddAction = ExtensionDeclaration<'dev-console.add/action', {
    /** ID used to identify the action. */
    id: string;
    /** The label of the action */
    label: string;
    /** The description of the action. */
    description: string;
    /** The href to navigate to. */
    href: string;
    /** The perspective display icon. */
    icon?: CodeRef<React.ReactNode>;
    /** Optional access review to control visibility / enablement of the action. */
    accessReview?: AccessReviewResourceAttributes[];
}>;
export declare const isAddAction: (e: Extension<any>) => e is ExtensionDeclaration<"dev-console.add/action", {
    /** ID used to identify the action. */
    id: string;
    /** The label of the action */
    label: string;
    /** The description of the action. */
    description: string;
    /** The href to navigate to. */
    href: string;
    /** The perspective display icon. */
    icon?: CodeRef<React.ReactNode>;
    /** Optional access review to control visibility / enablement of the action. */
    accessReview?: AccessReviewResourceAttributes[];
}>;
