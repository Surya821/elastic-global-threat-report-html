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
    }

    generateAllPages() {
        this.container.innerHTML = "";
        this.chartInstances = {};

        const pages = [
            this.createFirstPage(),
            this.createSecondPage(),
            ...this.createContentPages(),
            this.createDownloadPage(), // ✅ LAST PAGE
        ];

        this.pages = pages;
        this.totalPages = pages.length;

        pages.forEach((page, index) => {
            page.dataset.pageIndex = index;
            this.container.appendChild(page);
        });
    }

    createWatermark() {
        return `
            <div class="page-watermark">
                CyberSRC
            </div>
        `;
    }

    // REMOVE the entire createNavigation method

    createFirstPage() {
        const page = document.createElement("div");
        page.className = "report-page first-page";
        page.id = "page-1";

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

    generateTOCData() {
        const pages = window.TextFlowCalculator.generatePages(
            window.ReportData.topicData,
        );
        const toc = [];

        pages.forEach((page, index) => {
            if (page.isFirstPage) {
                toc.push({
                    id: page.topic.id,
                    title: page.topic.topic,
                    pageNumber: page.pageNumber,
                    anchor: `#page-${index + 3}`,
                });
            }
        });

        return toc;
    }

    createSecondPage() {
        const page = document.createElement("div");
        page.className = "report-page second-page";
        page.id = "page-2";

        const tocData = this.generateTOCData();

        page.innerHTML = `
        ${this.createWatermark()}
            <div class="page-content">
                <div class="toc-header">
                    <p>TABLE</p>
                    <p>OF</p>
                    <p>CONTENT</p>
                </div>
    
                <div class="toc-content">
                    <table class="toc-table">
                        ${tocData
                        .map(
                            (item, index) => `
                                    <tr>
                                        <td class="toc-number">
                                            ${String(index + 1).padStart(2, "0")}
                                        </td>
            
                                        <td class="toc-title">
                                            <a class="toc-a" href="${item.anchor}">
                                                ${item.title}
                                            </a>
                                        </td>
            
                                        <td class="toc-page">
                                            ${String(item.pageNumber).padStart(2, "0")}
                                        </td>
                                    </tr>
                                `,
                        )
                        .join("")}
                    </table>
                </div>
    
                <div class="toc-footer">
                    <div class="toc-footer-content">
                        <img src="${window.ReportData.assets.logo}" class="toc-footer-logo" />
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
        const pages = window.TextFlowCalculator.generatePages(
            window.ReportData.topicData,
        );

        pages.forEach((pageData, index) => {
            const page = document.createElement("div");
            page.className = "report-page content-page";
            page.id = `page-${index + 3}`;

            page.style.backgroundImage = `url(${pageData.topic.bg})`;
            page.style.backgroundSize = "cover";
            page.style.backgroundPosition = "top";

            page.innerHTML = `
            ${this.createWatermark()}
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
                                    ${pageData.pageNumber < 10 ? "0" + pageData.pageNumber : pageData.pageNumber}
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
        let html = "";

        if (pageData.isFirstPage) {
            html += `<h1 class="topic-title">${pageData.topic.topic}</h1>`;
        }

        pageData.content.forEach((block, index) => {
            if (block.type === "text") {
                html += `<p class="text-content">${block.value}</p>`;
            } else if (block.type === "chart") {
                const chartId = `chart-${pageData.pageNumber}-${index}`;
                html += `
                    <div class="chart-container">
                        ${block.config.title ? `<h3 class="chart-title">${block.config.title}</h3>` : ""}
                        ${block.config.description ? `<p class="chart-description">${block.config.description}</p>` : ""}
                        <div class="${block.config.type === "pie" ? "pie-chart-wrapper" : "chart-wrapper"}">
                            <canvas id="${chartId}"></canvas>
                        </div>
                    </div>
                `;

                // Store chart config for later initialization
                this.chartInstances[chartId] = block.config;
            } else if (block.type === "table") {
                html += `
                    <div class="table-container">
                        ${block.config.title ? `<h3 class="table-title">${block.config.title}</h3>` : ""}
                        <div class="table-wrapper">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        ${block.config.columns.map((col) => `<th>${col}</th>`).join("")}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${block.config.rows
                        .map(
                            (row) => `
                                        <tr>
                                            ${block.config.columns.map((col) => `<td>${row[col]}</td>`).join("")}
                                        </tr>
                                    `,
                        )
                        .join("")}
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

        chartCanvases.forEach((canvas) => {
            const chartId = canvas.id;
            const config = this.chartInstances[chartId];

            if (config && !canvas.chartInstance) {
                try {
                    canvas.chartInstance = window.ChartRenderer.renderChart(
                        config,
                        chartId,
                    );
                    console.log(`✅ Chart created: ${chartId}`);
                } catch (error) {
                    console.error(`❌ Error creating chart ${chartId}:`, error);
                }
            }
        });
    }

    createDownloadPage() {
        const page = document.createElement('div');
        page.className = 'report-page download-page no-pdf';
        page.id = 'page-download';
    
        page.innerHTML = `
            <div class="page-content download-ui">
                <h1>Download Report</h1>
                <p>You can download the complete report as a PDF.</p>
    
                <button class="download-btn" onclick="downloadPDF()">
                    Download PDF
                </button>
            </div>
        `;
    
        return page;
    }
    
}

// Export for use in other scripts
window.PaginationManager = PaginationManager;
