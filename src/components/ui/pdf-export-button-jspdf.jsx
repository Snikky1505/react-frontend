"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import { Button } from "./button" // Pastikan path ini benar
import { generateVerificationNumber } from '../../lib/generatorVerificationNumber';

function drawDetailTableHeader(doc, startY, detailsColWidth) {
    const leftMargin = 20
    const rowHeight = 8
    const cellPadding = 5
    doc.setFont('Manrope', 'bold')
    doc.setTextColor(153, 0, 0)
    doc.text('INFORMASI DETAIL', leftMargin, startY)

    doc.setDrawColor(200, 0, 0)
    doc.setLineWidth(0.5)
    doc.line(leftMargin, startY + 2, leftMargin + detailsColWidth, startY + 2)

    const tableHeaderY = startY + 10

    doc.setFillColor(240, 240, 240)
    doc.setDrawColor(200, 200, 200)
    doc.rect(leftMargin, tableHeaderY, 50, rowHeight, 'F')
    doc.rect(leftMargin + 50, tableHeaderY, detailsColWidth - 50, rowHeight, 'F')

    doc.setTextColor(0, 0, 0)
    doc.setFont('Manrope', 'bold')
    doc.text('Field', leftMargin + cellPadding, tableHeaderY + 6)
    doc.text('Value', leftMargin + 50 + cellPadding, tableHeaderY + 6)

    return tableHeaderY + rowHeight
}


export default function PDFExportButtonJSPDF(props) {
    const { selectedResult, fileName = "sijitu-report" } = props
    const [isExporting, setIsExporting] = useState(false)

    const getImageBase64 = async (url) => {
        const response = await fetch(url)
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }
      

    const exportToPDF = async () => {
        try {
            setIsExporting(true)
            const doc = new jsPDF();
            // Theme colors - red-800 and black gradient
            const primaryColor = [153, 27, 27]
            const secondaryColor = [30, 30, 30]
            const leftMargin = 20
            const rightMargin = 190
            const pageWidth = doc.internal.pageSize.getWidth();
            const headerHeight = 30;
            const steps = 100;

            for (let i = 0; i < steps; i++) {
                const ratio = i / (steps - 1);
                let r, g, b;
                // Gradient: black → red-800 → black
                if (ratio < 0.5) {
                  // from black (0,0,0) to red-800 (153, 27, 27)
                  const t = ratio * 2;
                  r = 0 + t * (153 - 0);
                  g = 0 + t * (27 - 0);
                  b = 0 + t * (27 - 0);
                } else {
                  // from red-800 (153, 27, 27) to black (0,0,0)
                  const t = (ratio - 0.5) * 2;
                  r = 153 - t * (153 - 0);
                  g = 27 - t * (27 - 0);
                  b = 27 - t * (27 - 0);
                }
              
                doc.setFillColor(r, g, b);
                const barWidth = pageWidth / steps;
                doc.rect(i * barWidth, 0, barWidth, headerHeight, "F");
              }

            // Header background
            // doc.setFillColor(...primaryColor)
            // doc.rect(0, 0, 210, 30, 'F')

            // Tambahkan logo dari public folder
            try {
            const logoBase64 = await getImageBase64(`${window.location.origin}/sijitu-white.png`)
            doc.addImage(logoBase64, 'PNG', leftMargin, 8, 50, 14)
            } catch (error) {
            console.error('Error loading logo:', error)
            }

            // Judul dan tanggal
            doc.setFont('Manrope', 'bold')
            // doc.setFontSize(22)
            doc.setTextColor(255, 255, 255)
            // doc.text('LAPORAN SIJITU', leftMargin + 50, 20)

            const today = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
            })
            doc.setFontSize(10)
            doc.text(`Tanggal: ${today}`, rightMargin - 10, 15, { align: 'right' })
            const verificationNumber = generateVerificationNumber('SSB001');
            doc.text(verificationNumber, rightMargin - 10, 20, { align: 'right' })
            doc.setFontSize(8)
            doc.text(`This document is valid as proof of screening on the SIJITU web platform`, rightMargin - 10, 24, { align: 'right' })

            let yPos = 40

            if (selectedResult) {
                
            const colWidth = 85
            const xPos = leftMargin + colWidth + 10
            doc.setFont('Manrope', 'bold')
            doc.setFontSize(14)
            doc.setTextColor(...primaryColor)
            doc.text('INFORMASI DASAR', xPos, yPos)

            doc.setDrawColor(...primaryColor)
            doc.setLineWidth(0.5)
            doc.line(xPos, yPos + 1, 200, yPos + 1)

            yPos += 5

            const tableData = [
                ['ID', selectedResult.id || '-'],
                ['Source', selectedResult.source || '-'],
                ['Nama', selectedResult.name || '-'],
                ['Date of Birth', selectedResult.dob || '-'],
                ['Tags', selectedResult.tags || '-']
            ]

            const cellPadding = 5
            const rowHeight = 8
            const tableStartY = yPos
            const tableStartX = leftMargin + colWidth + 10

            doc.setFillColor(240, 240, 240)
            doc.rect(tableStartX, tableStartY, colWidth, rowHeight, 'F')
            doc.setFontSize(10)
            doc.text('Field', tableStartX + cellPadding, tableStartY + 6)
            doc.text('Value', tableStartX + 35 + cellPadding, tableStartY + 6)

            for (let i = 0; i < tableData.length; i++) {
                const row = tableData[i]
                const rowY = tableStartY + (i + 1) * rowHeight

                if (i % 2 === 0) {
                doc.setFillColor(250, 250, 250)
                doc.rect(tableStartX, rowY, colWidth, rowHeight, 'F')
                }

                doc.setDrawColor(200, 200, 200)
                doc.rect(tableStartX, rowY, 35, rowHeight)
                doc.rect(tableStartX + 35, rowY, colWidth - 35, rowHeight)

                doc.setFont('Manrope', 'bold')
                doc.setFontSize(9)
                doc.setTextColor(...secondaryColor)
                doc.text(row[0], tableStartX + cellPadding, rowY + 6)

                doc.setFont('Manrope', 'normal')
                doc.text(row[1], tableStartX + 35 + cellPadding, rowY + 6)
            }

            doc.setDrawColor(...secondaryColor)
            doc.setLineWidth(0.5)
            doc.rect(tableStartX, tableStartY, colWidth, rowHeight * (tableData.length + 1))

            if (selectedResult.image_path_enc) {
                const imageX = leftMargin
                const imageY = yPos + 5
                const imageWidth = 60
                const imageHeight = 60

                doc.setFont('Manrope', 'bold')
                doc.setFontSize(14)
                doc.setTextColor(...primaryColor)
                doc.text('LAMPIRAN GAMBAR', imageX, imageY - 10)

                doc.setDrawColor(...primaryColor)
                doc.setLineWidth(0.5)
                doc.line(imageX, imageY - 9, imageX + imageWidth, imageY - 9)

                doc.setDrawColor(...secondaryColor)
                doc.setLineWidth(0.5)
                doc.rect(imageX, imageY - 5, imageWidth, imageHeight)

                try {
                doc.addImage(
                    selectedResult.image_path_enc,
                    'JPEG',
                    imageX + 2,
                    (imageY - 5) + 2,
                    imageWidth - 4,
                    imageHeight - 4
                )
                } catch (error) {
                doc.setTextColor(255, 0, 0)
                doc.text('Error loading image', imageX + 5, imageY + 20)
                }
            }

            yPos = tableStartY + (tableData.length + 1) * rowHeight + 25

            doc.setFont('Manrope', 'bold')
            doc.setFontSize(14)
            doc.setTextColor(...primaryColor)
            doc.text('INFORMASI DETAIL', leftMargin, yPos)

            doc.setDrawColor(...primaryColor)
            doc.setLineWidth(0.5)
            doc.line(leftMargin, yPos + 1, rightMargin + 10, yPos + 1)

            yPos += 5

            const detailsTableData = [
                ['Deskripsi', selectedResult.details?.additionalInfo || '-'],
                ['Related Entities', selectedResult.details?.relatedEntities || '-'],
                ['Identification Numbers', selectedResult.details?.identificationNumbers || '-'],
                ['Alias', selectedResult.details?.accurisAlias || '-'],
                ['Address', selectedResult.details?.accurisAddress || '-'],
                ['Relationship', selectedResult.details?.accurisIndividualAsociation || '-'],
                ['Relationship Business', selectedResult.details?.accurisIndividualBusinessAsociation || '-'],
                ['Reputational Risk Exposure Information', selectedResult.details?.accurisRRE || '-'],
                ['Regulatory Enforcement List Information', selectedResult.details?.accurisREL || '-'],
                ['Sanction Information', selectedResult.details?.accurisSanction || '-'],
                ['Evidence Information', selectedResult.details?.accurisEvidence || '-'],
            ]

            const detailsTableStartY = yPos
            // const detailsColWidth = rightMargin - leftMargin - 20
            const detailsColWidth = rightMargin - 10
            let currentY = detailsTableStartY + rowHeight
            // let currentY = drawDetailTableHeader(doc, 80, detailsColWidth)

            doc.setFillColor(240, 240, 240)
            doc.rect(leftMargin, detailsTableStartY, detailsColWidth, rowHeight, 'F')
            doc.setFontSize(10)
            doc.text('Field', leftMargin + cellPadding, detailsTableStartY + 6)
            doc.text('Value', leftMargin + 60 + cellPadding, detailsTableStartY + 6)

            //rev3
            const pageHeight = doc.internal.pageSize.height
            const topMargin = 30
            const fieldColWidth = 60
            const valueColWidth = detailsColWidth - fieldColWidth
            const bottomMargin = 20;
            const lineHeight = 5; // tinggi per baris teks

            detailsTableData.forEach(([field, value]) => {
              if(Array.isArray(value)) {
                value.forEach((item, index) => {
                  const title = `${field} [${index + 1}]`;

                  const stringValue = typeof item === 'object'
                    ? Object.entries(item).map(([k, v]) => `${k}: ${v}`).join('\n')
                    : String(item);

                  const splitValue = doc.splitTextToSize(stringValue, detailsColWidth - fieldColWidth - 2 * cellPadding);
                  const valueHeight = splitValue.length * lineHeight;
                  const rowHeight = Math.max(20, valueHeight);

                  // Page break if needed
                  if (currentY + rowHeight > pageHeight - bottomMargin) {
                    doc.addPage();
                    currentY = topMargin;
                  }

                  // Draw cells
                  doc.setDrawColor(200);
                  doc.rect(leftMargin, currentY, fieldColWidth, rowHeight);
                  doc.rect(leftMargin + fieldColWidth, currentY, detailsColWidth - fieldColWidth, rowHeight);

                  // Text
                  const splitTitle = doc.splitTextToSize(title, fieldColWidth - 2 * cellPadding);
                  const titleHeight = splitTitle.length * lineHeight;
                  doc.setFont('Manrope', 'bold');
                  doc.setTextColor(...secondaryColor);
                  // doc.text(title, leftMargin + cellPadding, currentY + 6);
                  doc.text(splitTitle, leftMargin + cellPadding, currentY + 6);

                  doc.setFont('Manrope', 'normal');
                  doc.setTextColor(0, 0, 0);
                  doc.text(splitValue, leftMargin + fieldColWidth + cellPadding, currentY + 6);

                  currentY += rowHeight;
                });
              }else{
                // Konversi objek menjadi string jika bukan string
                if (typeof value !== 'string') {
                  try {
                    value = JSON.stringify(value, null, 2);
                  } catch {
                    value = String(value);
                  }
                }

                const splitValue = doc.splitTextToSize(value, detailsColWidth - fieldColWidth - 2 * cellPadding);
                const valueHeight = splitValue.length * lineHeight;
                const rowHeight = Math.max(10, valueHeight); // minimal 10 untuk jaga-jaga

                // 🚨 Buat page baru jika tinggi konten melebihi batas halaman
                if (currentY + rowHeight > pageHeight - bottomMargin) {
                  doc.addPage();
                  currentY = topMargin;

                  // (Opsional) Tambahkan ulang header informasi detail di halaman baru
                  doc.setFont('Manrope', 'bold');
                  doc.setTextColor(...primaryColor);
                  doc.text("INFORMASI DETAIL", leftMargin, currentY);
                  doc.setDrawColor(...primaryColor)
                  doc.setLineWidth(0.5)
                  doc.line(leftMargin, currentY + 1, rightMargin + 10, currentY + 1)
                  currentY += 5;
                }

                // Gambar background putih
                doc.setFillColor(255, 255, 255);
                doc.rect(leftMargin, currentY, detailsColWidth, rowHeight, 'F');

                // Gambar kolom
                doc.setDrawColor(200, 200, 200);
                doc.rect(leftMargin, currentY, fieldColWidth, rowHeight);
                doc.rect(leftMargin + fieldColWidth, currentY, detailsColWidth - fieldColWidth, rowHeight);

                // Tulis teks field dan value
                doc.setFont('Manrope', 'bold');
                doc.setTextColor(...secondaryColor);
                doc.text(field, leftMargin + cellPadding, currentY + 6);

                doc.setFont('Manrope', 'normal');
                doc.setTextColor(0, 0, 0);
                doc.text(splitValue, leftMargin + fieldColWidth + cellPadding, currentY + 6);

                currentY += rowHeight;
              }
            });

            yPos = currentY + 15
            doc.setFont('Manrope', 'italic')
            doc.setFontSize(9)
            doc.setTextColor(100, 100, 100)
            doc.text('* Laporan ini dapat memuat informasi tambahan di masa mendatang', leftMargin, yPos)
            } else {
            doc.setFont('Manrope', 'italic')
            doc.setFontSize(12)
            doc.setTextColor(150, 150, 150)
            doc.text('Tidak ada data yang dipilih', leftMargin, 50)
            }

            const totalPages = doc.internal.getNumberOfPages()
            for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i)
            doc.setFont('Manrope', 'italic')
            doc.setFontSize(8)
            doc.setTextColor(100, 100, 100)
            doc.text(`Page ${i} of ${totalPages}`, rightMargin + 10, 285, { align: 'right' })

            for (let j = 0; j < 2; j++) {
                const gradientColor = [
                Math.max(0, primaryColor[0] - j * 30),
                Math.max(0, primaryColor[1] - j * 5),
                Math.max(0, primaryColor[2] - j * 5)
                ]
                doc.setDrawColor(...gradientColor)
                doc.setLineWidth(0.5)
                doc.line(leftMargin, 280 - j, rightMargin + 10, 280 - j)
            }
            }

            // Simpan file
            doc.save(`${fileName}.pdf`)
        } catch (error) {
        console.error("Error exporting PDF:", error)
        alert("Failed to export PDF. Please try again.")
        } finally {
        setIsExporting(false)
        }
  }

  return (
    <Button onClick={exportToPDF} disabled={isExporting} className="bg-red-600 hover:bg-red-700 text-white">
      <Download className="w-4 h-4 mr-2" />
      {isExporting ? "Exporting..." : "Export to PDF"}
    </Button>
  )
}
