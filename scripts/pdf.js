async function generatePDF() {
    const container = document.getElementById('reportContainer');

    // Ensure charts are fully drawn
    await new Promise(res => setTimeout(res, 1000));

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'px', 'a4');

    // ❌ Exclude download page
    const pages = container.querySelectorAll('.report-page:not(.no-pdf)');

    for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save('Global-Threat-Report-2025.pdf');
}
