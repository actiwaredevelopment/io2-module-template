/**
 * Make all nested properties in T and T itself required
 */
type NestedRequired<T> = {
    [P in keyof T]-?: NestedRequired<T[P]>;
};

