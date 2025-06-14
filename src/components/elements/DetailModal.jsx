import React from "react";
import Modal from "react-modal";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

Modal.setAppElement("#root");

const DetailModal = ({ isOpen, onClose, detailData }) => {
//   const exportPDF = () => {
//     const input = document.getElementById("pdf-content");
//     html2canvas(input).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF();
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("detail.pdf");
//     });
//   };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Detail Modal">
      <div id="pdf-content" style={{ padding: "20px" }}>
        <h2 className="text-dark">Detail Data</h2>
        <p><strong>Nama:</strong> {detailData.nama}</p>
        <p><strong>Email:</strong> {detailData.email}</p>
        <p><strong>Alamat:</strong> {detailData.alamat}</p>
        {/* Tambahkan lebih banyak field sesuai kebutuhan */}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button>Export ke PDF</button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>Tutup</button>
      </div>
    </Modal>
  );
};

export default DetailModal;
