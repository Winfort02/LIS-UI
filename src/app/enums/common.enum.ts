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
  VIEW = 'View',
  PRINT = 'Print',
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
  HEMATOLOGY = 'hematology',
  URINALYSIS = 'urinalysis',
  REPORTS = 'report',
  TEST = 'tests',
}

export enum ApplicationUrl {
  APPLICATION = 'application',
  SECURITY = 'security',
  USERS = 'users',
  PATIENTS = 'patients',
  USER_LIST = 'application/users',
  PATIENT_LIST = 'application/patients',
  PATIENT_DETAIL = 'application/patient/detail/',
  HEMATOLOGY = 'hematology',
  HEMATOLOGY_LIST = 'application/hematology',
  HEMATOLOGY_DETAIL = 'hematology/detail',
  URINALYSIS = 'urinalysis',
  URINALYSIS_DETAIL = 'application/urinalysis',
  TEST = 'test',
}

export enum ButtonColor {
  SUCCESS = 'p-button-success',
  INFO = 'p-button-info',
  DANGER = 'p-button-danger',
}

export enum ChemicalTestDropdown {
  NEGATIVE = 'NEGATIVE',
  ONE_PLUS = '1+',
  TWO_PLUS = '2+',
  THREE_PLUS = '3+',
  FOUR_PLUS = '4+',
  TRACE = 'TRACE',
  POSITIVE = 'POSITIVE',
  SIX = 6.0,
  SIX_POINT_FIVE = 6.5,
  SEVEN = 7,
  ONE_POINT_ZERO_ONE = 1.01,
  ONE_POINT_ZERO_FIFTEEN = 1.15,
  ONE_POINT_ZERO_TWO = 1.02,
  ONE_POINT_ZERO_TWOFIVE = 1.025,
  ONE_POINT_ZERO_THREE = 1.03,
}

export enum TestType {
  hematology = 'Hematology',
  urinalysis = 'Urinalysis',
  chemistry = 'Chemistry',
}
