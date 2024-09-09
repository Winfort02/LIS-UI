import { Component, OnInit } from '@angular/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [NgxDocViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent implements OnInit {
  pdfURL: string = '';
  constructor(private dialogConfig: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.loadPDF();
  }

  loadPDF() {
    let binaryData = [];
    binaryData.push(this.dialogConfig.data);
    this.pdfURL = URL.createObjectURL(
      new Blob(binaryData, { type: 'application/pdf' })
    );
  }
}
