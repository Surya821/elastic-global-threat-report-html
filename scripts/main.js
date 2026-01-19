document.addEventListener('DOMContentLoaded', () => {
    try {
        if (!window.ReportData) return;

        const paginationManager = new PaginationManager('reportContainer');
        window.paginationManager = paginationManager;

        // Disable chart animations (CRITICAL)
        Chart.defaults.animation = false;

        setTimeout(() => {
            for (let i = 0; i < paginationManager.totalPages; i++) {
                paginationManager.initializeChartsOnPage(i);
            }
        }, 500);

    } catch (error) {
        console.error(error);
    }
});

window.downloadPDF = async function () {
    await generatePDF();
};
