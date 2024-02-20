export interface IListRes<T> {
    collection: T[];
    pagination: {
        meta: {
            current_page: number;
            from: number;
            to: number;
            per_page: number;
            total: number;
            last_page: number;
        };
    };
}
