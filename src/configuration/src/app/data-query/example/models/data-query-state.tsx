export interface IDataQueryState {
    isDeleting?: boolean;
    isTesting?: boolean;
}

export interface IDataQueryStates {
    [itemId: string]: IDataQueryState | undefined;
}

