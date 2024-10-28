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
  USER = 'pi pi-users',
  PATIENT = 'pi pi-user-plus',
  TOOL = 'pi pi-hammer',
  TEST = 'pi pi-filter-slash',
  RESULT = 'pi pi-file-check',
  STOCK = 'pi pi-box',
  STOCK_ITEM = 'pi pi-book',
  EXPIRED = 'pi pi-ban',
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
  CHEMSTRY = 'chemistry',
  APPARATUS = 'apparatus',
  STOCKS = 'stock',
  CHANGE_PASSWORD = 'auth/change-password',
  EXPIRED = 'stock-expired',
  DASHBOARD = 'dashboard',
}

export enum StockMode {
  IN = 'stock-in',
  OUT = 'stock-out',
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
  CHEMSTRY = 'chemistry',
  CHEMSTRY_DETAIL = 'application/urinalysis',
  CHEMSTRY_LIST = 'application/chemistry',
  APPARATUS = 'apparatus',
  APPARATUS_LIST = 'application/apparatus',
  STOCK_IN = 'stock-in',
  STOCKS_ITEM = 'stock-item',
  STOCK = 'stocks',
  STOCK_OUT_LIST = 'stock-out-list',
  STOCK_IN_LIST = 'stock-in-list',
  EXPIRED = 'expire-item',
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
  HAZY = 'HAZY',
  SLIGHTLY_CLOUDY = 'SLIGHTLY CLOUDY',
  CLOUDY = 'CLOUDY',
  TURBID = 'TURBID',
  FEW = 'FEW',
  RARE = 'RARE',
  MODERATE = 'MODERATE',
  MANY = 'MANY',
}

export enum TestType {
  hematology = 'Hematology',
  urinalysis = 'Urinalysis',
  chemistry = 'Chemistry',
}

export enum Unit {
  PACKS = 'packs',
  BOTTLES = 'bottles',
  BOX = 'box',
  PCS = 'pcs',
  TRAYS = 'trays',
}

export enum STOCK_SELECTION_MODE {
  OUT = 'STOCK_OUT',
  IN = 'STOCK_IN',
}
