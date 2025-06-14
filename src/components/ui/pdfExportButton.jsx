import html2pdf from 'html2pdf.js';
import logo from '/public/sijitu-white.png'; // Pastikan logo ini di-public

function PdfExportButton({ data }) {
  const exportPDF = () => {
    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 0.5,
      filename: 'laporan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    html2pdf().set(opt).from(element).outputPdf('bloburl')
    .then(pdfUrl => {
      window.open(pdfUrl, '_blank'); // buka tab baru
    });
  };

  return (
    <div>
      <button
        onClick={exportPDF}
        className="bg-red-800 text-white px-4 py-2 rounded mb-4"
      >
        Export PDF
      </button>

      <div target="_blank" id="pdf-content" className="p-8 font-[Manrope] text-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-black via-red-800 to-black text-white p-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <img src={logo} alt="Logo" className="w-14" />
            <div>
              <div className="text-lg font-bold leading-none">SIJITU</div>
              <div className="text-xs">Sistem Uji Tuntas</div>
            </div>
          </div>
          <div className="text-right text-xs">
            <div>Tanggal: {new Date().toLocaleDateString('id-ID')}</div>
            <div className="font-bold">test</div>
            <div>This document is valid as proof of screening on the SIJITU web platform</div>
          </div>
        </div>

        {/* Gambar dan Informasi Dasar */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="text-red-800 font-bold border-b-2 border-red-800 mb-2">LAMPIRAN GAMBAR</h2>
            <img
              src="/public/sijitu-white.png"
              alt="Foto"
              className="border border-black max-w-xs mx-auto"
            />
          </div>
          <div>
            <h2 className="text-red-800 font-bold border-b-2 border-red-800 mb-2">INFORMASI DASAR</h2>
            <table className="w-full border border-black">
              <tbody>
                {/* {data.basic.map((item, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1 font-semibold bg-gray-100">{item.label}</td>
                    <td className="border border-black p-1">{item.value || '-'}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informasi Detail */}
        <div className="mt-6 break-after-page">
          <h2 className="text-red-800 font-bold border-b-2 border-red-800 mb-2">INFORMASI DETAIL</h2>
          <table className="w-full border border-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-1 text-left">Field</th>
                <th className="border border-black p-1 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {/* {data.details.map((item, i) => (
                <tr key={i} className="break-inside-avoid">
                  <td className="border border-black p-1 align-top font-medium">{item.label || '-'}</td>
                  <td className="border border-black p-1 whitespace-pre-line">{item.value || '-'}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>

        <div className="text-xs italic text-gray-700 mt-2">
          * Laporan ini dapat memuat informasi tambahan di masa mendatang
        </div>

        <div className="text-xs mt-8 text-right">Page <span className="pageNumber">1</span> of <span className="totalPages">1</span></div>
      </div>
    </div>
  );
}

export default PdfExportButton;
