import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class Common {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly spinner = inject(NgxSpinnerService);

    confirm(header: string, message: string, acceptLabel: string = 'Yes', rejectLabel: string = 'No', accept: () => void, reject: () => void): void {
        this.confirmationService.confirm({
            header: header,
            message: message,
            rejectButtonProps: {
                label: rejectLabel || 'No',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: acceptLabel || 'Yes',
                severity: 'primary',
                outlined: true,
            },
            accept: () => {
                accept();
            },
            reject: () => {
                reject();
            }
        });
    }
    showSpinner(): void {
        this.spinner.show();
    }
    hideSpinner(): void {
        this.spinner.hide();
    }
    showMessage(severity: 'success' | 'error' | 'info' | 'warn',summary: string = 'Message',message: string, ): void {
        this.messageService.add({ severity: severity, summary: summary, detail: message });
    }
}
