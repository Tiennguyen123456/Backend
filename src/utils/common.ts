export function checkPermission(permissions: string[], action: string) {
    const index = permissions.findIndex((item) => item === action);
    if (index >= 0) return true;
    else return false;
}
