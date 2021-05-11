import { Reducer } from 'redux';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
/** Adds new reducer to Console Redux store which operates on `plugins.<scope>` substate. */
export declare type ReduxReducer = ExtensionDeclaration<'console.redux-reducer', {
    /** The key to represent the reducer-managed substate within the Redux state object. */
    scope: string;
    /** The reducer function, operating on the reducer-managed substate. */
    reducer: CodeRef<Reducer>;
}>;
export declare const isReduxReducer: (e: Extension<any>) => e is ExtensionDeclaration<"console.redux-reducer", {
    /** The key to represent the reducer-managed substate within the Redux state object. */
    scope: string;
    /** The reducer function, operating on the reducer-managed substate. */
    reducer: CodeRef<Reducer<any, import("redux").AnyAction>>;
}>;
