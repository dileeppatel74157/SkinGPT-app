import { jsPDF } from 'jspdf';
import { SkinScan, UserProfile } from '../types';

export function exportReportToPDF(report: SkinScan, profile?: UserProfile, shouldSave = true) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2); // 180mm
  let y = 15;

  // Helper to ensure we don't overflow the page
  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > 275) {
      doc.addPage();
      y = 20;
      
      // Draw sub-page running header
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("SkinGPT Skin Analysis Lab — Report", margin, 11);
      doc.text(`Date: ${report.date}`, pageWidth - margin - 35, 11);
      
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.2);
      doc.line(margin, 13, pageWidth - margin, 13);
      y = 20;
    }
  };

  // --- 1. COVER / HEADER BANNER ---
  // Deep indigo/slate colored background box for main header
  doc.setFillColor(15, 23, 42); // slate-900 (brand deep color)
  doc.rect(margin, y, contentWidth, 38, 'F');

  // Title text inside banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text("SkinGPT", margin + 8, y + 14);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(129, 140, 248); // indigo-400 accent
  doc.text("ADVANCED CLINICAL SKIN DIAGNOSTIC REPORT", margin + 8, y + 20);

  // Date and Metadata badge inside header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(pageWidth - margin - 62, y + 8, 54, 22, 'F');
  doc.setTextColor(241, 245, 249); // slate-100
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text("REPORT METADATA", pageWidth - margin - 58, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${report.date}`, pageWidth - margin - 58, y + 19);
  doc.text(`ID: ${report.id.substring(0, 13).toUpperCase()}`, pageWidth - margin - 58, y + 24);

  y += 45;

  // --- 2. USER PROFILE INFO SECTION ---
  checkPageOverflow(35);
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, y, contentWidth, 26, 'F');
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("USER PROFILE", margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42); // slate-900

  const pName = profile?.name || "Dileep Patel";
  const pEmail = profile?.email || "dileeppatel74157@gmail.com";
  const pAge = profile?.age || 26;
  const pLoc = profile?.location || "San Francisco, CA";
  const pClimate = profile?.climate || "Temperate";

  doc.setFont('helvetica', 'bold');
  doc.text(`Patient Name:`, margin + 6, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(pName, margin + 28, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text(`Email Address:`, margin + 6, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(pEmail, margin + 28, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.text(`Age:`, margin + 6, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(`${pAge} Years`, margin + 14, y + 22);

  // Right-side profile info
  doc.setFont('helvetica', 'bold');
  doc.text(`Location:`, margin + 95, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(pLoc, margin + 112, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text(`Local Climate:`, margin + 95, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(pClimate, margin + 118, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.text(`Primary Skin Type:`, margin + 95, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text(report.skinType.toUpperCase(), margin + 124, y + 22);

  y += 34;

  // --- 3. DIAGNOSTIC WELLNESS SCORES ---
  checkPageOverflow(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Skin Wellness Scorecard", margin, y);
  
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.setLineWidth(0.8);
  doc.line(margin, y + 2, margin + 22, y + 2);
  
  y += 8;

  // Overall Score Gauge Box (Left side) & Component Metrics (Right side)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, y, 48, 38, 'F');
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.rect(margin, y, 48, 38, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("OVERALL INDEX", margin + 12, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text(`${report.score.overall}`, margin + 14, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("/ 100 max", margin + 14, y + 28);

  // Component Metrics Bars
  const scoreMetrics = [
    { label: 'Hydration', score: report.score.hydration, color: [6, 182, 212] }, // cyan
    { label: 'Oil Control', score: report.score.oilControl, color: [245, 158, 11] }, // amber
    { label: 'Barrier Health', score: report.score.barrier, color: [16, 185, 129] }, // emerald
    { label: 'Clarity', score: report.score.clarity, color: [99, 102, 241] }, // indigo
    { label: 'Texture Smoothness', score: report.score.texture, color: [168, 85, 247] } // purple
  ];

  let barY = y + 4;
  scoreMetrics.forEach((m) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(m.label, margin + 56, barY + 3);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`${m.score}%`, margin + 168, barY + 3);

    // Draw gray background bar
    doc.setFillColor(241, 245, 249);
    doc.rect(margin + 56, barY + 5, 120, 2.2, 'F');

    // Draw active colored bar
    doc.setFillColor(m.color[0], m.color[1], m.color[2]);
    doc.rect(margin + 56, barY + 5, 120 * (m.score / 100), 2.2, 'F');

    barY += 7;
  });

  y += 44;

  // Active Concerns Tag row
  checkPageOverflow(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("ACTIVE DERMATOLOGICAL CONCERNS UNDER MONITOR:", margin, y);
  
  let concernX = margin + 84;
  report.concerns.forEach((concern) => {
    const textWidth = doc.getTextWidth(concern) + 6;
    if (concernX + textWidth > pageWidth - margin) {
      y += 5;
      concernX = margin;
    }
    doc.setFillColor(239, 246, 255); // blue-50
    doc.rect(concernX, y - 3, textWidth - 2, 4.5, 'F');
    doc.setDrawColor(191, 219, 254); // blue-200
    doc.setLineWidth(0.1);
    doc.rect(concernX, y - 3, textWidth - 2, 4.5, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(29, 78, 216); // blue-700
    doc.text(concern, concernX + 2, y);
    concernX += textWidth;
  });

  y += 10;

  // --- 4. QUALITATIVE INSIGHTS SECTION ---
  checkPageOverflow(65);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Clinical Analysis Insights", margin, y);
  
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.setLineWidth(0.8);
  doc.line(margin, y + 2, margin + 22, y + 2);
  
  y += 8;

  const insightsList = [
    { title: "Redness & Erythema", text: report.analysis.redness },
    { title: "Pores & Sebum Volume", text: report.analysis.pores },
    { title: "Collagen & Fine Lines", text: report.analysis.wrinkles },
    { title: "Oiliness / Sebum Overload", text: report.analysis.oiliness },
    { title: "Dehydration & Scaling", text: report.analysis.dryness },
    { title: "Active Impurities / Acne", text: report.analysis.acne }
  ];

  let colWidth = 56;
  let gap = 6;
  let startX = margin;
  let rowHeight = 22;

  insightsList.forEach((item, index) => {
    const colIdx = index % 3;
    const rowIdx = Math.floor(index / 3);
    const boxX = startX + (colIdx * (colWidth + gap));
    const boxY = y + (rowIdx * (rowHeight + gap));

    // Draw nice subtle frame for each insight
    doc.setFillColor(255, 255, 255);
    doc.rect(boxX, boxY, colWidth, rowHeight, 'F');
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.setLineWidth(0.3);
    doc.rect(boxX, boxY, colWidth, rowHeight, 'S');

    // Little colored vertical strip on the left margin
    doc.setFillColor(99, 102, 241); // indigo accent
    doc.rect(boxX, boxY, 1.5, rowHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(item.title, boxX + 4, boxY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139); // slate-500
    const lines = doc.splitTextToSize(item.text, colWidth - 7);
    doc.text(lines.slice(0, 3), boxX + 4, boxY + 10); // Print up to 3 lines
  });

  y += 54;

  // --- 5. CLINICAL SKINCARE ROUTINE SCHEDULE ---
  checkPageOverflow(70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Clinical Skincare Protocol", margin, y);
  
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.setLineWidth(0.8);
  doc.line(margin, y + 2, margin + 22, y + 2);
  
  y += 8;

  // Routine Step Generator Helper
  const printRoutineList = (steps: any[], title: string, themeColor: [number, number, number]) => {
    checkPageOverflow(18);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 6, 'F');
    
    doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.rect(margin, y, 3, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin + 6, y + 4.2);
    
    y += 9;

    if (!steps || steps.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("No active steps suggested for this slot.", margin + 6, y);
      y += 8;
      return;
    }

    steps.forEach((s) => {
      const instrLines = doc.splitTextToSize(s.instructions, contentWidth - 45);
      const rowH = Math.max(12, 6 + (instrLines.length * 3));
      checkPageOverflow(rowH + 4);

      // Draw horizontal step row background
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, contentWidth, rowH, 'F');
      
      // Step badge
      doc.setFillColor(241, 245, 249);
      doc.rect(margin + 2, y + 1, 15, 5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(`STEP ${s.step}`, margin + 4, y + 4.5);

      // Name & Category
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(s.name, margin + 20, y + 4.5);
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`(${s.category})`, margin + 20 + doc.getTextWidth(s.name) + 2, y + 4.5);

      // Instructions
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(instrLines, margin + 20, y + 9);

      // Active Ingredients Tags
      if (s.activeIngredients && s.activeIngredients.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(99, 102, 241);
        doc.text(`Actives: ${s.activeIngredients.join(', ')}`, margin + 20, y + 9 + (instrLines.length * 3.2));
      }

      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(margin, y + rowH + 1, pageWidth - margin, y + rowH + 1);

      y += rowH + 3;
    });
  };

  printRoutineList(report.routine.morning, "MORNING PROTOCOL — Preventative & Shielding", [245, 158, 11]);
  y += 4;
  printRoutineList(report.routine.evening, "EVENING PROTOCOL — Corrective & Rebuilding", [79, 70, 229]);

  y += 6;

  // --- 6. TARGETED PRODUCT RECOMMENDATIONS ---
  checkPageOverflow(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Targeted Clinical Recommendations", margin, y);
  
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.setLineWidth(0.8);
  doc.line(margin, y + 2, margin + 22, y + 2);
  
  y += 8;

  report.recommendations.forEach((prod) => {
    const reasonLines = doc.splitTextToSize(prod.reason, contentWidth - 45);
    const boxH = Math.max(22, 10 + (reasonLines.length * 3));
    checkPageOverflow(boxH + 4);

    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, y, contentWidth, boxH, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.25);
    doc.rect(margin, y, contentWidth, boxH, 'S');

    // Left indicator tag for tier
    let tierColor = [16, 185, 129]; // emerald (Budget)
    if (prod.tier === 'Premium') tierColor = [168, 85, 247]; // purple
    if (prod.tier === 'Mid-range') tierColor = [59, 130, 246]; // blue
    doc.setFillColor(tierColor[0], tierColor[1], tierColor[2]);
    doc.rect(margin, y, 1.5, boxH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(`${prod.brand} — ${prod.name}`, margin + 5, y + 5);

    // Efficacy match badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(79, 70, 229);
    doc.text(`Efficacy Match: ${prod.confidenceScore}%`, pageWidth - margin - 38, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(reasonLines, margin + 5, y + 9);

    // Timeline and ingredients tags
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Estimated Timeline: ${prod.expectedTimeline}`, margin + 5, y + boxH - 2.5);

    if (prod.activeIngredients && prod.activeIngredients.length > 0) {
      doc.text(`Key Actives: ${prod.activeIngredients.join(', ')}`, margin + 65, y + boxH - 2.5);
    }

    y += boxH + 4;
  });

  // --- 7. FOOTER CLINICAL DISCLAIMER ---
  checkPageOverflow(25);
  y = Math.min(y, pageHeight - 32);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184); // slate-400
  const disclaimer = "Disclaimer: SkinGPT represents an educational assessment based on advanced computer-vision algorithms and clinical database mappings. These evaluations strictly represent cosmetic routine and ingredient optimizations and do not constitute clinical, dermatological, or medical diagnoses. Please consult a board-certified dermatologist for chronic skin conditions or clinical prescriptions.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("© 2026 SkinGPT Skin Lab. All rights preserved.", margin, y + 10);

  // Download PDF
  const filename = `SkinGPT_Report_${pName.replace(/\s+/g, '_')}_${report.date.replace(/\//g, '-')}.pdf`;
  if (shouldSave) {
    doc.save(filename);
  }
  return doc;
}
