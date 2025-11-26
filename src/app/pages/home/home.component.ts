import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  nombre = '';
  apellidos = '';
  codigo = '';
  errorMsg = '';

  validarYGenerar() {
    if (this.codigo.trim().toLowerCase() === '1dic25') {
      this.errorMsg = '';
      this.generarPDF();
    } else {
      this.errorMsg = 'Código de seguridad incorrecto.';
    }
  }

  generarPDF() {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colores y estilo inspirados por tu branding e imagen
    const azulFondo = [26, 55, 96];
    const azulClaro = [45, 183, 239];
    const azulOscuro = [23, 50, 99];
    const grisClaro = [245, 245, 255];

    // Borde elegante
    doc.setDrawColor(azulClaro[0], azulClaro[1], azulClaro[2]);
    doc.setLineWidth(2.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24, 'S');

    // Fondo azul muy claro para el encabezado
    doc.setFillColor(azulFondo[0], azulFondo[1], azulFondo[2]);
    doc.rect(12, 12, pageWidth - 24, 45, 'F');

    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(34);
    doc.setTextColor(255, 255, 255);
    doc.text('DocencIA', pageWidth / 2, 32, { align: 'center' });

    // Subtítulo
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Fórmate para el futuro educativo.', pageWidth / 2, 42, { align: 'center' });

    // Logo centrado, dimensionando según proporción de la imagen attach (ajustar si prefieres)
    const imgY = 52;
    const imgWidth = 70;
    const imgHeight = 70;
    const imgX = (pageWidth - imgWidth) / 2;

    // Usa la URL pública para la imagen adjuntada
    const imgUrl = "https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/0c5b3ce1-4556-4ec8-9c7a-22ec8bc91a2b";

    this.getBase64ImageFromURL(imgUrl).then(imgDataUrl => {
      doc.addImage(imgDataUrl, 'JPEG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');

      // Sección principal del diploma
      let cursorY = imgY + imgHeight + 15;
      doc.setFont('times', 'bolditalic');
      doc.setFontSize(24);
      doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
      doc.text('Diploma de Formación Certificada', pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 12;
      doc.setDrawColor(azulClaro[0], azulClaro[1], azulClaro[2]);
      doc.setLineWidth(1);
      doc.line(pageWidth * 0.18, cursorY, pageWidth * 0.82, cursorY);

      cursorY += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(30, 30, 30);
      doc.text('Otorgado a:', pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 11;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(`${this.nombre} ${this.apellidos}`, pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text('Por su participación y aprovechamiento en la formación:', pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 10;
      doc.setFont('times', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
      doc.text('Integración de la IA en el ámbito docente', pageWidth / 2, cursorY, { align: 'center' });

      // Datos empresa y ponente
      cursorY += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.setTextColor(30, 30, 30);
      doc.text(`Empresa: DocencIA`, pageWidth / 2, cursorY, { align: 'center' });
      cursorY += 8;
      doc.text(`Ponente: Pedro Palacín Ruiz de la Escalera`, pageWidth / 2, cursorY, { align: 'center' });

      // Sello/firma y fecha
      cursorY += 24;
      doc.setDrawColor(200, 200, 200);
      doc.rect(pageWidth * 0.6, cursorY - 10, 50, 24, 'S'); // Caja para firma/sello
      doc.setFont('times', 'italic');
      doc.setFontSize(12);
      doc.text('Firma y sello', pageWidth * 0.6 + 25, cursorY + 5, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('_______________________', pageWidth * 0.6 + 25, cursorY + 13, { align: 'center' });

      // Fecha (abajo izquierda)
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text('Fecha de expedición:', 22, pageHeight - 28);
      doc.text(`${new Date().toLocaleDateString()}`, 58, pageHeight - 28);

      // Código de diploma o QR - sitio para futuro
      doc.setFontSize(10);
      doc.setTextColor(120, 140, 180);
      doc.text('Código de diploma: DOC-IA-' + new Date().getFullYear().toString().slice(-2) + (Math.floor(1000 + Math.random() * 9000)), pageWidth - 70, pageHeight - 18);

      // Marca de agua
      doc.setFontSize(30);
      doc.setTextColor(225, 235, 255);
      doc.text('DocencIA', pageWidth / 2, pageHeight - 16, { align: 'center', angle: -12 });

      doc.save('Diploma-DocencIA.pdf');
    }).catch(err => {
      console.error('Error cargando imagen:', err);
      doc.save('Diploma-DocencIA.pdf');
    });
  }




  // Función para convertir URL de imagen a base64
  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas context is null');
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  }
}
