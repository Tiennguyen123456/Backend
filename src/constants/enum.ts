export enum Languages {
    English = "en",
    VietNamese = "vi",
}

export enum DeviceType {
    Mobile = "mobile",
    Tablet = "tablet",
    Desktop = "desktop",
}

export enum APIStatus {
    SUCCESS = "success",
    ERROR = "error",
}

export enum MessageCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
}

export enum EStatus {
    ALL = "ALL",
    NEW = "NEW",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED",
    DONE = "DONE",
    CANCEL = "CANCEL",
    PAUSED = "PAUSED",
    RUNNING = "RUNNING",
    STOPPED = "STOPPED",
    SUCCESS = "SUCCESS",
    FINISHED  = "FINISHED",
    PROCESSING = "PROCESSING",
    PENDING = "PENDING",
    ERROR = "ERROR",
    CHECKIN = "CHECKIN",
    UNCHECKIN = "UNCHECKIN",
}

export enum EStatusAction {
    START = "START",
    PAUSE = "PAUSE",
    STOP = "STOP",
}

export enum RoleEnable {
    Active = 1,
    Inactive = 0,
}

export enum RoleGuard {
    API = "api",
}

export enum ScanQRCamera {
    DEFAULT = "environment",
    USER = "user"
}

export enum LandingPageEnable {
    On = 1,
    Off = 0
}
