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

  // Colores inspirados en tu imagen
  const azulFondo = [26, 55, 96]; // Fondo oscuro principal
  const azulClaro = [45, 183, 239]; // Azul efecto luz
  const textoPrincipal = [255, 255, 255];

  // Fondo superior azul degradado (simulado con rectángulos)
  doc.setFillColor(26, 55, 96);
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text('DocencIA', pageWidth / 2, 25, { align: 'center' });

  // Subtítulo
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Fórmate para el futuro educativo.', pageWidth / 2, 38, { align: 'center' });

  // Logo centrado, debajo del título
  // Ajusta estos valores si quieres el logo más pequeño o grande según resultado visual
  const imgY = 50;
  const imgWidth = 90;
  const imgHeight = 95;
  const imgX = (pageWidth - imgWidth) / 2;

  const imgUrl = 'assets/img/Docencia.jpg'; // Usa el path correcto

  this.getBase64ImageFromURL(imgUrl).then(imgDataUrl => {
    // Imagen decorativa
    doc.addImage(imgDataUrl, 'JPEG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');

    // Cuerpo del diploma
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(22);
    doc.setFont('times', 'bolditalic');
    doc.text('Diploma de Formación', pageWidth / 2, imgY + imgHeight + 15, { align: 'center' });

    doc.setDrawColor(45, 183, 239);
    doc.setLineWidth(1.5);
    doc.line(pageWidth*0.15, imgY + imgHeight + 22, pageWidth*0.85, imgY + imgHeight + 22);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Otorgado a:', 30, imgY + imgHeight + 35);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${this.nombre} ${this.apellidos}`, 30, imgY + imgHeight + 48);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text('Por la participación en la formación:', 30, imgY + imgHeight + 65);
    doc.setFont('times', 'italic');
    doc.setFontSize(15);
    doc.text('Integración de la IA en el ámbito docente', 30, imgY + imgHeight + 78);

    // Pie de diploma
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(`Empresa: DocencIA`, 30, pageHeight - 35);
    doc.text(`Ponente: Pedro Palacín Ruiz de la Escalera`, 30, pageHeight - 27);
    doc.setTextColor(150,150,150);
    doc.setFontSize(10);
    doc.text('Fecha de expedición:', 30, pageHeight - 16);
    doc.text(`${new Date().toLocaleDateString()}`, 70, pageHeight - 16);

    // Marca de agua o nota digital si quieres:
    doc.setFontSize(15);
    doc.setTextColor(180,200,255);
    doc.text('DocencIA', pageWidth - 40, pageHeight - 10, { align: 'center', angle: -12 });

    doc.save('Diploma-DocencIA.pdf');
  })
  .catch(err => {
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
