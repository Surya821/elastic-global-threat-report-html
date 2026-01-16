// scripts/text-flow.js - FIXED VERSION
class TextFlowCalculator {
    static PAGE_HEIGHT = 1122; // pixels
    static HEADER_HEIGHT = 110;
    static FOOTER_HEIGHT = 120;
    static BODY_VERTICAL_PADDING = 220;
    static TOPIC_TITLE_HEIGHT = 90;
    static BODY_MAX_HEIGHT = this.PAGE_HEIGHT - this.HEADER_HEIGHT - this.FOOTER_HEIGHT - this.BODY_VERTICAL_PADDING;
    static BODY_WIDTH = 800;
    static FONT_SIZE = 16;
    static LINE_HEIGHT = 1.6;
    static TABLE_ROW_HEIGHT = 32;
    static TABLE_HEADER_HEIGHT = 40;
    
    // Temporary element for measurements (reused for performance)
    static tempElement = null;
    
    static getTempElement() {
        if (!this.tempElement) {
            this.tempElement = document.createElement('div');
            this.tempElement.style.position = 'absolute';
            this.tempElement.style.visibility = 'hidden';
            this.tempElement.style.width = `${this.BODY_WIDTH}px`;
            this.tempElement.style.fontSize = `${this.FONT_SIZE}px`;
            this.tempElement.style.lineHeight = this.LINE_HEIGHT;
            this.tempElement.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif";
            this.tempElement.style.textAlign = 'justify';
            this.tempElement.style.wordWrap = 'break-word';
            document.body.appendChild(this.tempElement);
        }
        return this.tempElement;
    }
    
    static calculateTextBlocks(text, maxHeight = this.BODY_MAX_HEIGHT) {
        const tempElement = this.getTempElement();
        const words = text.split(" ");
        const blocks = [];
        let currentBlock = [];
        let currentHeight = 0;
        
        for (let i = 0; i < words.length; i++) {
            // Test adding the next word
            const testWords = [...currentBlock, words[i]];
            const testText = testWords.join(" ");
            
            // Measure the height of this text
            tempElement.textContent = testText;
            const testHeight = tempElement.offsetHeight;
            
            // If adding this word exceeds max height and we already have some words
            if (testHeight > maxHeight && currentBlock.length > 0) {
                // Push current block
                blocks.push(currentBlock.join(" "));
                
                // Start new block with current word
                currentBlock = [words[i]];
                tempElement.textContent = words[i];
                currentHeight = tempElement.offsetHeight;
            } else {
                // Add word to current block
                currentBlock.push(words[i]);
                currentHeight = testHeight;
            }
        }
        
        // Add the last block if it has content
        if (currentBlock.length > 0) {
            blocks.push(currentBlock.join(" "));
        }
        
        return blocks;
    }
    
    static measureTextHeight(text) {
        const tempElement = this.getTempElement();
        tempElement.textContent = text;
        return tempElement.offsetHeight;
    }
    
    static calculateTablePages(rows, columns, isFirstPage = false) {
        const pages = [];
        let startIndex = 0;
        
        while (startIndex < rows.length) {
            let availableHeight = this.BODY_MAX_HEIGHT;
            if (isFirstPage) {
                availableHeight -= this.TOPIC_TITLE_HEIGHT;
            }
            availableHeight -= this.TABLE_HEADER_HEIGHT;
            
            const rowsPerPage = Math.floor(availableHeight / this.TABLE_ROW_HEIGHT);
            const pageRows = rows.slice(startIndex, startIndex + rowsPerPage);
            
            pages.push({
                columns,
                rows: pageRows,
                isFirstPage: startIndex === 0 ? isFirstPage : false
            });
            
            startIndex += rowsPerPage;
        }
        
        return pages;
    }
    
    static generatePages(topicData) {
        const pages = [];
        let globalPageNumber = 1;
        
        topicData.forEach(topic => {
            let currentPageBlocks = [];
            let isFirstPage = true;
            let currentHeight = 0;
            let availableHeight = this.BODY_MAX_HEIGHT;
            
            // If first page, account for topic title
            if (isFirstPage) {
                availableHeight -= this.TOPIC_TITLE_HEIGHT;
            }
            
            const pushPage = () => {
                if (currentPageBlocks.length === 0) return;
                
                pages.push({
                    topic,
                    content: currentPageBlocks,
                    pageNumber: globalPageNumber++,
                    isFirstPage
                });
                
                currentPageBlocks = [];
                currentHeight = 0;
                isFirstPage = false;
                availableHeight = this.BODY_MAX_HEIGHT; // Reset for next page
            };
            
            topic.content.forEach(block => {
                // Text block
                if (block.type === "text") {
                    const textBlocks = this.calculateTextBlocks(block.value, availableHeight - currentHeight);
                    
                    textBlocks.forEach((textBlock, index) => {
                        const blockHeight = this.measureTextHeight(textBlock);
                        
                        // If this is the first block on a page
                        if (index === 0 && currentHeight === 0) {
                            currentPageBlocks.push({
                                type: "text",
                                value: textBlock
                            });
                            currentHeight += blockHeight;
                        } 
                        // If we need a new page for this block
                        else if (currentHeight + blockHeight > availableHeight) {
                            pushPage();
                            
                            // Start new page with this block
                            currentPageBlocks.push({
                                type: "text",
                                value: textBlock
                            });
                            currentHeight = blockHeight;
                        }
                        // If block fits on current page
                        else {
                            currentPageBlocks.push({
                                type: "text",
                                value: textBlock
                            });
                            currentHeight += blockHeight;
                        }
                    });
                }
                
                // Chart block - always starts new page
                else if (block.type === "chart") {
                    if (currentPageBlocks.length > 0) {
                        pushPage();
                    }
                    
                    // Chart gets its own page
                    pages.push({
                        topic,
                        content: [block],
                        pageNumber: globalPageNumber++,
                        isFirstPage
                    });
                    
                    // Reset for next content
                    currentPageBlocks = [];
                    currentHeight = 0;
                    isFirstPage = false;
                    availableHeight = this.BODY_MAX_HEIGHT;
                }
                
                // Table block - always starts new page
                else if (block.type === "table") {
                    if (currentPageBlocks.length > 0) {
                        pushPage();
                    }
                    
                    const tablePages = this.calculateTablePages(
                        window.ReportData.sampleData,
                        block.config.columns,
                        isFirstPage
                    );
                    
                    tablePages.forEach((tablePage, index) => {
                        pages.push({
                            topic,
                            content: [{
                                type: "table",
                                config: {
                                    ...block.config,
                                    rows: tablePage.rows
                                }
                            }],
                            pageNumber: globalPageNumber++,
                            isFirstPage: index === 0 ? isFirstPage : false
                        });
                    });
                    
                    // Reset for next content
                    currentPageBlocks = [];
                    currentHeight = 0;
                    isFirstPage = false;
                    availableHeight = this.BODY_MAX_HEIGHT;
                }
            });
            
            // Push any remaining content
            if (currentPageBlocks.length > 0) {
                pushPage();
            }
        });
        
        // Clean up temp element
        if (this.tempElement && this.tempElement.parentNode) {
            document.body.removeChild(this.tempElement);
            this.tempElement = null;
        }
        
        return pages;
    }
}

// Export for use in other scripts
window.TextFlowCalculator = TextFlowCalculator;