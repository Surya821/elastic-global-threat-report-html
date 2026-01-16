// main.js - IMPROVED VERSION
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Starting report initialization...');
        
        // Check if data is loaded
        if (!window.ReportData) {
            console.error('ReportData not loaded');
            return;
        }
        
        console.log('Data loaded successfully');
        
        // Create pagination manager
        const paginationManager = new PaginationManager('reportContainer');
        window.paginationManager = paginationManager;
        
        console.log('Pagination manager created, total pages:', paginationManager.totalPages);
        
        // Initialize all charts after a delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Initializing all charts...');
            
            // Initialize charts on all pages
            for (let i = 0; i < paginationManager.totalPages; i++) {
                paginationManager.initializeChartsOnPage(i);
            }
            
            // Debug: Check if charts were created
            const charts = document.querySelectorAll('canvas');
            console.log(`Total canvases found: ${charts.length}`);
            
            charts.forEach((canvas, i) => {
                console.log(`Canvas ${i}: ${canvas.id}, width: ${canvas.width}, height: ${canvas.height}`);
            });
        }, 1000);
        
    } catch (error) {
        console.error('Error:', error);
    }
});