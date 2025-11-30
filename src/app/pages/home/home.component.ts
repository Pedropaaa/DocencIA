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

    // Fondo azul oscuro
    doc.setFillColor(azulFondo[0], azulFondo[1], azulFondo[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F'); // 'F' = filled

    // Borde elegante
    doc.setDrawColor(azulClaro[0], azulClaro[1], azulClaro[2]);
    doc.setLineWidth(2.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24, 'S');

    // Logo centrado, dimensionando según proporción de la imagen attach (ajustar si prefieres)
    const imgY = 40;
    const imgWidth = 72.97;
    const imgHeight = 100;
    const imgX = (pageWidth - imgWidth) / 2;

    // Usa la URL pública para la imagen adjuntada
    const imgUrl = './assets/img/DocenciaDEF.png';

    this.getBase64ImageFromURL(imgUrl).then(imgDataUrl => {
      doc.addImage(imgDataUrl, 'JPEG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');

      // Sección principal del diploma
      let cursorY = imgY + imgHeight + 15;
      doc.setFont('times', 'bolditalic');
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('Diploma de Formación Certificada', pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 12;
      doc.setDrawColor(azulClaro[0], azulClaro[1], azulClaro[2]);
      doc.setLineWidth(1);
      doc.line(pageWidth * 0.18, cursorY, pageWidth * 0.82, cursorY);

      cursorY += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('Otorgado a:', pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 11;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text(`${this.nombre} ${this.apellidos}`, pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('Por su participación y aprovechamiento en la formación:', pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 10;
      doc.setFont('times', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('Integración de la IA en el ámbito docente', pageWidth / 2, cursorY, { align: 'center' });

      cursorY += 26;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('Ponente: Pedro Palacín Ruiz de la Escalera', pageWidth / 2, cursorY, { align: 'center' });

      // Fecha (abajo izquierda)
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('Fecha de expedición:', 22, pageHeight - 28);
      doc.text(`     ${new Date().toLocaleDateString()}`, 58, pageHeight - 28);


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
