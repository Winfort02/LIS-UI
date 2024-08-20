export enum EPagination {
  first = 'firstPage',
  next = 'nextPage',
  prev = 'prevPage',
  last = 'lastPage',
}

export enum ActionButtonType {
  add = 'add',
  edit = 'edit',
  delete = 'delete',
}

export enum ButtonLabel {
  ADD = 'Add',
  EDIT = 'Edit',
  DELETE = 'Delete',
  CANCEL = 'Cancel',
  VIEW = 'View Detail',
}

export enum Icon {
  DASHBOARD = 'pi pi-slack',
  FOLDER = 'pi pi-folder',
  LOCK = 'pi pi-lock',
  OPEN_LOCK = 'pi pi-lock-open',
  LOGOUT = 'pi pi-power-off',
  CANCEL = 'pi pi-times',
  EDIT = 'pi pi-pencil',
}

export enum Severity {
  INFO = 'info',
  ERROR = 'error',
  DANGER = 'danger',
}

export enum LocalKeys {
  accessToken = 'access-token',
}

export enum Endpoints {
  CREATE_USER = 'auth/sign-up',
  LOGIN = 'auth/login',
  USERS = 'users',
  PATIENTS = 'patients',
}

export enum ApplicationUrl {
  APPLICATION = 'application',
  SECURITY = 'security',
  USERS = 'users',
  PATIENTS = 'patients',
  USER_LIST = 'application/users',
  PATIENT_LIST = 'application/patients',
  PATIENT_DETAIL = 'application/patient/detail/',
}

export enum ButtonColor {
  SUCCESS = 'p-button-success',
  INFO = 'p-button-info',
  DANGER = 'p-button-danger',
}
