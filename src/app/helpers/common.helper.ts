import { Message } from 'primeng/api';
import { Severity } from '../enums/common.enum';

export class CommonHelper<T> {
  commonDialogOption(data?: T) {
    return {
      header: 'Update Details',
      width: '35%',
      style: { minWidth: '455px', maxWidth: '970px' },
      position: 'top',
      focusOnShow: false,
      data: data,
    };
  }

  commonConfrimation() {
    return {
      target: event?.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectVisible: false,
      acceptIcon: 'none',
      acceptLabel: 'Delete',
    };
  }

  commonMessages = (severity: Severity, summary: string): Message[] => {
    return [{ severity, summary }];
  };
}
