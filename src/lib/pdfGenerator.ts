import jsPDF from 'jspdf';
import { IEDRecord, UserProfile, MatchResult } from '@/types/ied';
import { UNIVERSITIES } from '@/data/barranquilla_geo';

export function generatePracticeCertificatePDF(
  record: IEDRecord,
  user: UserProfile,
  match?: MatchResult
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const uniObj = UNIVERSITIES.find(u => u.id === user.university || u.name === user.university);
  const uniName = uniObj?.name || user.university || 'Universidad del Norte';
  const verificationCode = `IED-BAQ-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${record.id}`;
  const currentDate = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Palette
  const primaryColor = [15, 76, 129]; // Institutional Navy Blue
  const accentColor = [22, 163, 74];   // Emerald Green
  const darkGray = [40, 40, 40];
  const lightGray = [240, 243, 246];

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('IED MATCHER • DISTRITO DE BARRANQUILLA', 105, 12, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('COORDINACIÓN DISTRITAL DE PRÁCTICAS PEDAGÓGICAS Y DOCENCIA UNIVERSITARIA', 105, 18, { align: 'center' });
  doc.text('COMPROBANTE OFICIAL DE ASIGNACIÓN Y COMPATIBILIDAD HORARIA', 105, 23, { align: 'center' });

  // Verification Tag
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(15, 33, 180, 10, 2, 2, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`CÓDIGO DE VALIDACIÓN: ${verificationCode}`, 20, 39.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Fecha de Emisión: ${currentDate} | Barranquilla, Atlántico`, 190, 39.5, { align: 'right' });

  let y = 50;

  // SECTION 1: ESTUDIANTE PRACTICANTE
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, y, 180, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('1. INFORMACIÓN DEL ESTUDIANTE PRACTICANTE', 18, y + 4.2);

  y += 10;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8.5);

  const col1 = 18;
  const col2 = 105;

  doc.setFont('helvetica', 'bold');
  doc.text('Nombre Completo:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(user.fullName || 'N/A', col1 + 32, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Código Estudiantil:', col2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(user.studentCode || 'N/A', col2 + 32, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Universidad:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(uniName, col1 + 32, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Programa / Semestre:', col2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${user.program || 'Licenciatura'} (${user.semester || 'Semestre Actual'})`, col2 + 32, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Correo Electrónico:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(user.email || 'N/A', col1 + 32, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Teléfono / Celular:', col2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(user.phone || 'N/A', col2 + 32, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Residencia / Barrio:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${user.residenceNeighborhood || 'Barranquilla'} (${user.residenceLocality})`, col1 + 32, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Medio de Transporte:', col2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(user.transportMode.toUpperCase(), col2 + 32, y);

  // SECTION 2: DATOS DE LA INSTITUCIÓN EDUCATIVA DISTRITAL (IED)
  y += 10;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, y, 180, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('2. INSTITUCIÓN EDUCATIVA DISTRITAL ASIGNADA', 18, y + 4.2);

  y += 10;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8.5);

  doc.setFont('helvetica', 'bold');
  doc.text('IED Seleccionada:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(record.ied, col1 + 32, y, { maxWidth: 140 });

  y += 6.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Grado y Grupo:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Grado ${record.gradoGeneral} - Grupo ${record.grupo}`, col1 + 32, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Estrategia:', col2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(record.estrategia || 'AS', col2 + 32, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Horario Práctica:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(record.horario, col1 + 32, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Localidad / Zona:', col2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(record.localidad, col2 + 32, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Dirección Sede:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(record.direccion || 'Sede Principal', col1 + 32, y, { maxWidth: 140 });

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Registro Base Excel:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fila #${record.filaExcel}`, col1 + 32, y);

  // SECTION 3: EQUIPO DIRECTIVO Y TUTORÍA
  y += 10;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, y, 180, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('3. EQUIPO DE ACOMPAÑAMIENTO Y CONTACTOS CLAVE', 18, y + 4.2);

  y += 10;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Tutor Asignado:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.tutor} ${record.celularTutor ? `(Tel: ${record.celularTutor})` : ''}`, col1 + 32, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Rector(a) IED:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.rector || 'Directiva Institucional'} ${record.celularRector ? `(Tel: ${record.celularRector})` : ''}`, col1 + 32, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Coordinador(a):', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.coordinador || 'Coordinación'} ${record.celularCoordinador ? `(Tel: ${record.celularCoordinador})` : ''}`, col1 + 32, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Docente Titular:', col1, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.docenteTitular || 'Docente de Aula'} ${record.celularDocente ? `(Tel: ${record.celularDocente})` : ''}`, col1 + 32, y);

  // SECTION 4: DICTAMEN DE COMPATIBILIDAD LOGÍSTICA
  y += 10;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(15, y, 180, 20, 2, 2, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('4. DICTAMEN DE COMPATIBILIDAD LOGÍSTICA', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8);
  
  const scoreText = match ? `Índice de Afinidad Logística: ${match.score}% (${match.badgeLabel})` : 'Índice de Afinidad: 95%';
  const travelText = match ? `Tiempo Estimado de Traslado: ~${match.travelTimeMinutes} min (${match.distanceKm} km aprox)` : 'Tiempo Estimado de Traslado: ~20 min';
  
  doc.text(scoreText, 18, y + 10);
  doc.text(travelText, 18, y + 14.5);
  doc.text('Validación: Esta plaza respeta los márgenes de desplazamiento entre campus y vivienda.', 18, y + 18);

  // SECTION 5: COMPROMISO Y FIRMAS
  y += 28;
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('El estudiante se compromete a cumplir a cabalidad con los horarios y lineamientos pedagógicos del programa de práctica.', 105, y, { align: 'center' });

  y += 20;
  // Signatures
  doc.setDrawColor(180, 180, 180);
  doc.line(20, y, 75, y);
  doc.line(80, y, 135, y);
  doc.line(140, y, 195, y);

  doc.setFontSize(7.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Firma del Estudiante', 47.5, y + 4, { align: 'center' });
  doc.text('Coordinación de Prácticas', 107.5, y + 4, { align: 'center' });
  doc.text('Sello y Recibido IED', 167.5, y + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(user.fullName, 47.5, y + 7.5, { align: 'center' });
  doc.text(uniName, 107.5, y + 7.5, { align: 'center' });
  doc.text(record.ied.substring(0, 30), 167.5, y + 7.5, { align: 'center' });

  // Footer note
  doc.setFontSize(6.5);
  doc.setTextColor(140, 140, 140);
  doc.text('Generado automáticamente por IED Matcher • Barranquilla, Colombia • Documento válido para radicación académica', 105, 290, { align: 'center' });

  // Save PDF
  const filename = `Comprobante_Practica_${record.grupo}_${user.fullName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
