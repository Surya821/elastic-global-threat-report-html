document.addEventListener('DOMContentLoaded', () => {
    try {        
        // Check if data is loaded
        if (!window.ReportData) {
            return;
        }
        
        // Create pagination manager
        const paginationManager = new PaginationManager('reportContainer');
        window.paginationManager = paginationManager;
        
        // Initialize all charts after a delay to ensure DOM is ready
        setTimeout(() => {            
            // Initialize charts on all pages
            for (let i = 0; i < paginationManager.totalPages; i++) {
                paginationManager.initializeChartsOnPage(i);
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error:', error);
    }
});