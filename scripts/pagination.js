// scripts/pagination.js - Fixed without navigation
class PaginationManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.pages = [];
        this.currentPage = 0;
        this.totalPages = 0;
        this.chartInstances = {};
        this.init();
    }
    
    init() {
        this.generateAllPages();
        this.scrollToCurrentPage();
    }
    
    generateAllPages() {
        this.container.innerHTML = '';
        this.chartInstances = {};
        
        const pages = [
            this.createFirstPage(),
            this.createSecondPage(),
            ...this.createContentPages()
        ];
        
        this.pages = pages;
        this.totalPages = pages.length;
        
        // Append all pages to container
        pages.forEach((page, index) => {
            page.dataset.pageIndex = index;
            this.container.appendChild(page);
        });
    }
    
    // REMOVE the entire createNavigation method
    
    createFirstPage() {
        const page = document.createElement('div');
        page.className = 'report-page first-page';
        page.id = 'page-1';
        
        page.innerHTML = `
            <div class="page-content">
                <div class="year-text">2025</div>
                <div class="logo-container">
                    <img src="${window.ReportData.assets.logo}" alt="logo" class="page-logo">
                </div>
                <div class="title-container">
                    <div class="title-line-1">GLOBAL</div>
                    <div class="title-line-2">THREAT</div>
                    <div class="title-line-3">REPORT</div>
                </div>
            </div>
        `;
        
        return page;
    }
    
    createSecondPage() {
        const page = document.createElement('div');
        page.className = 'report-page second-page';
        page.id = 'page-2';
        
        page.innerHTML = `
            <div class="page-content">
                <div class="toc-header">
                    <p>TABLE</p>
                    <p>OF</p>
                    <p>CONTENT</p>
                </div>
                <div class="toc-content">
                    <table class="toc-table">
                        <tr>
                            <td class="toc-number">01</td>
                            <td class="toc-title">Introduction</td>
                            <td class="toc-page">02</td>
                        </tr>
                        <tr>
                            <td class="toc-number">02</td>
                            <td class="toc-title">Executive summary</td>
                            <td class="toc-page">03</td>
                        </tr>
                        <tr>
                            <td class="toc-number">03</td>
                            <td class="toc-title">Trends and correlations</td>
                            <td class="toc-page">07</td>
                        </tr>
                        <tr>
                            <td class="toc-number">04</td>
                            <td class="toc-title">Inside Elastic</td>
                            <td class="toc-page">37</td>
                        </tr>
                        <tr>
                            <td class="toc-number">05</td>
                            <td class="toc-title">Threat profiles</td>
                            <td class="toc-page">42</td>
                        </tr>
                        <tr>
                            <td class="toc-number">06</td>
                            <td class="toc-title">Recommendations</td>
                            <td class="toc-page">48</td>
                        </tr>
                        <tr>
                            <td class="toc-number">07</td>
                            <td class="toc-title">Conclusion</td>
                            <td class="toc-page">49</td>
                        </tr>
                    </table>
                </div>
                <div class="toc-footer">
                    <div class="toc-footer-content">
                        <img src="${window.ReportData.assets.logo}" alt="logo" class="toc-footer-logo">
                        <div class="toc-footer-text">
                            <p>GLOBAL THREAT</p>
                            <p>REPORT 2025</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return page;
    }
    
    createContentPages() {
        const contentPages = [];
        const pages = window.TextFlowCalculator.generatePages(window.ReportData.topicData);
        
        pages.forEach((pageData, index) => {
            const page = document.createElement('div');
            page.className = 'report-page content-page';
            page.id = `page-${index + 3}`;
            
            // Set background image
            page.style.backgroundImage = `url(${pageData.topic.bg})`;
            page.style.backgroundSize = 'cover';
            page.style.backgroundPosition = 'top';
            
            page.innerHTML = `
                <div class="page-gradient-overlay"></div>
                <div class="page-inner">
                    <div class="page-header">
                        <img src="${window.ReportData.assets.header}" alt="header" class="page-header-img">
                    </div>
                    <div class="page-body">
                        ${this.renderPageContent(pageData)}
                    </div>
                    <div class="page-footer">
                        <div class="footer-border">
                            <div class="footer-content">
                                <div class="flex justify-start">
                                    <img src="${window.ReportData.assets.logo}" alt="logo" class="footer-logo">
                                </div>
                                <div class="footer-center">
                                    GLOBAL THREAT REPORT 2025
                                </div>
                                <div class="footer-right">
                                    ${pageData.pageNumber < 10 ? '0' + pageData.pageNumber : pageData.pageNumber}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            contentPages.push(page);
        });
        
        return contentPages;
    }
    
    renderPageContent(pageData) {
        let html = '';
        
        if (pageData.isFirstPage) {
            html += `<h1 class="topic-title">${pageData.topic.topic}</h1>`;
        }
        
        pageData.content.forEach((block, index) => {
            if (block.type === 'text') {
                html += `<p class="text-content">${block.value}</p>`;
            } else if (block.type === 'chart') {
                const chartId = `chart-${pageData.pageNumber}-${index}`;
                html += `
                    <div class="chart-container">
                        ${block.config.title ? `<h3 class="chart-title">${block.config.title}</h3>` : ''}
                        ${block.config.description ? `<p class="chart-description">${block.config.description}</p>` : ''}
                        <div class="${block.config.type === 'pie' ? 'pie-chart-wrapper' : 'chart-wrapper'}">
                            <canvas id="${chartId}"></canvas>
                        </div>
                    </div>
                `;
                
                // Store chart config for later initialization
                this.chartInstances[chartId] = block.config;
            } else if (block.type === 'table') {
                html += `
                    <div class="table-container">
                        ${block.config.title ? `<h3 class="table-title">${block.config.title}</h3>` : ''}
                        <div class="table-wrapper">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        ${block.config.columns.map(col => `<th>${col}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${block.config.rows.map(row => `
                                        <tr>
                                            ${block.config.columns.map(col => `<td>${row[col]}</td>`).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }
        });
        
        return html;
    }
    
    initializeChartsOnPage(pageIndex) {
        const page = this.pages[pageIndex];
        if (!page) return;
        
        // Find all chart canvases in this page
        const chartCanvases = page.querySelectorAll('canvas[id^="chart-"]');
        
        chartCanvases.forEach(canvas => {
            const chartId = canvas.id;
            const config = this.chartInstances[chartId];
            
            if (config && !canvas.chartInstance) {
                try {
                    canvas.chartInstance = window.ChartRenderer.renderChart(config, chartId);
                    console.log(`✅ Chart created: ${chartId}`);
                } catch (error) {
                    console.error(`❌ Error creating chart ${chartId}:`, error);
                }
            }
        });
    }
    
    // REMOVED: nextPage(), prevPage(), goToPage() methods
    
    // REMOVED: updateNavigation() method
    
    scrollToCurrentPage() {
        const page = this.pages[this.currentPage];
        if (page) {
            page.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Export for use in other scripts
window.PaginationManager = PaginationManager;