export interface IPermissionRoleRes<T> {
    collection: T[];
    count: number;
}

export interface ICollectionRoleRes {
    id: number
    name: string
}
