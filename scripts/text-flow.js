// scripts/text-flow.js - FIXED TO CONTINUE TEXT AFTER TABLE IN SAME PAGE
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
    
    // Temporary element for measurements
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
    
    static measureTextHeight(text) {
        const tempElement = this.getTempElement();
        tempElement.textContent = text;
        return tempElement.offsetHeight;
    }
    
    static calculateTextBlocks(text, maxHeight = this.BODY_MAX_HEIGHT) {
        const tempElement = this.getTempElement();
        const words = text.split(" ");
        const blocks = [];
        let currentBlock = [];
        let currentHeight = 0;
        
        for (let i = 0; i < words.length; i++) {
            const testWords = [...currentBlock, words[i]];
            const testText = testWords.join(" ");
            
            tempElement.textContent = testText;
            const testHeight = tempElement.offsetHeight;
            
            if (testHeight > maxHeight && currentBlock.length > 0) {
                blocks.push(currentBlock.join(" "));
                currentBlock = [words[i]];
                tempElement.textContent = words[i];
                currentHeight = tempElement.offsetHeight;
            } else {
                currentBlock.push(words[i]);
                currentHeight = testHeight;
            }
        }
        
        if (currentBlock.length > 0) {
            blocks.push(currentBlock.join(" "));
        }
        
        return blocks;
    }
    
    static generatePages(topicData) {
        const pages = [];
        let globalPageNumber = 1;
        
        topicData.forEach(topic => {
            let currentPageBlocks = [];
            let currentHeight = 0;
            let isFirstPage = true;
            
            // Calculate available height for the first page
            let availableHeight = this.BODY_MAX_HEIGHT;
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
                
                // Reset for next page
                currentPageBlocks = [];
                currentHeight = 0;
                isFirstPage = false;
                availableHeight = this.BODY_MAX_HEIGHT;
            };
            
            // Process all content blocks
            for (let i = 0; i < topic.content.length; i++) {
                const block = topic.content[i];
                
                // Handle text blocks
                if (block.type === "text") {
                    const textBlocks = this.calculateTextBlocks(block.value, availableHeight - currentHeight);
                    
                    for (let j = 0; j < textBlocks.length; j++) {
                        const textBlock = textBlocks[j];
                        const textBlockHeight = this.measureTextHeight(textBlock) + 20;
                        
                        // Check if text fits on current page
                        if (currentHeight + textBlockHeight <= availableHeight) {
                            currentPageBlocks.push({
                                type: "text",
                                value: textBlock
                            });
                            currentHeight += textBlockHeight;
                        } else {
                            // Start new page
                            pushPage();
                            currentPageBlocks.push({
                                type: "text",
                                value: textBlock
                            });
                            currentHeight = textBlockHeight;
                        }
                    }
                }
                // Handle chart blocks
                else if (block.type === "chart") {
                    // Estimated chart height
                    const chartHeight = 350;
                    
                    // Check if chart fits on current page
                    if (currentHeight + chartHeight <= availableHeight) {
                        currentPageBlocks.push(block);
                        currentHeight += chartHeight;
                    } else {
                        // Check if we should start new page
                        if (currentPageBlocks.length > 0) {
                            pushPage();
                        }
                        currentPageBlocks.push(block);
                        currentHeight = chartHeight;
                    }
                }
                // Handle table blocks - KEY FIX HERE
                else if (block.type === "table") {
                    const allData = window.ReportData.sampleData;
                    const totalRows = allData.length;
                    
                    // Calculate table height on current page
                    const remainingSpace = availableHeight - currentHeight;
                    const minTableHeight = this.TABLE_HEADER_HEIGHT + this.TABLE_ROW_HEIGHT;
                    
                    if (remainingSpace >= minTableHeight) {
                        // We can start table on current page
                        const spaceForRows = remainingSpace - this.TABLE_HEADER_HEIGHT;
                        const rowsThatFit = Math.floor(spaceForRows / this.TABLE_ROW_HEIGHT);
                        
                        if (rowsThatFit > 0) {
                            const rowsForThisPage = Math.min(rowsThatFit, totalRows);
                            const remainingRows = totalRows - rowsForThisPage;
                            
                            // Add table for this page
                            currentPageBlocks.push({
                                type: "table",
                                config: {
                                    ...block.config,
                                    rows: allData.slice(0, rowsForThisPage),
                                    isPartial: remainingRows > 0
                                }
                            });
                            
                            currentHeight += this.TABLE_HEADER_HEIGHT + (rowsForThisPage * this.TABLE_ROW_HEIGHT);
                            
                            // If we have remaining rows, continue on next pages
                            if (remainingRows > 0) {
                                let rowsProcessed = rowsForThisPage;
                                
                                while (rowsProcessed < totalRows) {
                                    // Check if next block after table is text and can fit on current page
                                    // BEFORE pushing a new page
                                    const hasNextContent = i < topic.content.length - 1;
                                    const isLastTableSegment = (rowsProcessed + rowsThatFit) >= totalRows;
                                    
                                    if (hasNextContent && isLastTableSegment) {
                                        const nextBlock = topic.content[i + 1];
                                        if (nextBlock.type === "text") {
                                            // Check if we should add text to this page instead of starting new page
                                            const remainingSpaceAfterTable = availableHeight - currentHeight;
                                            if (remainingSpaceAfterTable > 100) { // At least 100px for some text
                                                // Don't push page, let text be added after table
                                                break;
                                            }
                                        }
                                    }
                                    
                                    pushPage();
                                    
                                    // Calculate rows for this new page
                                    const spaceForRowsOnNewPage = availableHeight - this.TABLE_HEADER_HEIGHT;
                                    const rowsThatFitOnNewPage = Math.floor(spaceForRowsOnNewPage / this.TABLE_ROW_HEIGHT);
                                    const rowsForThisNewPage = Math.min(rowsThatFitOnNewPage, totalRows - rowsProcessed);
                                    
                                    currentPageBlocks.push({
                                        type: "table",
                                        config: {
                                            ...block.config,
                                            rows: allData.slice(rowsProcessed, rowsProcessed + rowsForThisNewPage),
                                            isPartial: (rowsProcessed + rowsForThisNewPage) < totalRows,
                                            isContinuation: true
                                        }
                                    });
                                    
                                    currentHeight = this.TABLE_HEADER_HEIGHT + (rowsForThisNewPage * this.TABLE_ROW_HEIGHT);
                                    rowsProcessed += rowsForThisNewPage;
                                    
                                    // Check after last table segment if text can fit on same page
                                    if (rowsProcessed >= totalRows) {
                                        // This is the last table segment
                                        // Check if there's text after table that can fit
                                        if (i < topic.content.length - 1) {
                                            const nextBlock = topic.content[i + 1];
                                            if (nextBlock.type === "text") {
                                                const textHeight = this.measureTextHeight(nextBlock.value.substring(0, 200)) + 20;
                                                
                                                if (availableHeight - currentHeight > textHeight * 0.3) { // At least 30% of text would fit
                                                    // Don't push page - text will be added in next iteration
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            // Not enough space - start new page
                            pushPage();
                            this.processTableFromBeginning(block, allData, currentPageBlocks, currentHeight, availableHeight, pushPage);
                        }
                    } else {
                        // Not enough space - start new page
                        pushPage();
                        this.processTableFromBeginning(block, allData, currentPageBlocks, currentHeight, availableHeight, pushPage);
                    }
                }
            }
            
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
    
    // Helper method to process table from beginning of a page
    static processTableFromBeginning(block, allData, currentPageBlocks, currentHeight, availableHeight, pushPage) {
        const totalRows = allData.length;
        
        // Calculate rows that fit on a fresh page
        const spaceForRows = availableHeight - this.TABLE_HEADER_HEIGHT;
        const rowsThatFit = Math.floor(spaceForRows / this.TABLE_ROW_HEIGHT);
        const rowsForThisPage = Math.min(rowsThatFit, totalRows);
        const remainingRows = totalRows - rowsForThisPage;
        
        currentPageBlocks.push({
            type: "table",
            config: {
                ...block.config,
                rows: allData.slice(0, rowsForThisPage),
                isPartial: remainingRows > 0
            }
        });
        
        currentHeight = this.TABLE_HEADER_HEIGHT + (rowsForThisPage * this.TABLE_ROW_HEIGHT);
        
        // Handle remaining rows
        if (remainingRows > 0) {
            let rowsProcessed = rowsForThisPage;
            
            while (rowsProcessed < totalRows) {
                pushPage();
                
                const spaceForNextPage = availableHeight - this.TABLE_HEADER_HEIGHT;
                const rowsThatFitNext = Math.floor(spaceForNextPage / this.TABLE_ROW_HEIGHT);
                const rowsForNextPage = Math.min(rowsThatFitNext, totalRows - rowsProcessed);
                
                currentPageBlocks.push({
                    type: "table",
                    config: {
                        ...block.config,
                        rows: allData.slice(rowsProcessed, rowsProcessed + rowsForNextPage),
                        isPartial: (rowsProcessed + rowsForNextPage) < totalRows,
                        isContinuation: true
                    }
                });
                
                currentHeight = this.TABLE_HEADER_HEIGHT + (rowsForNextPage * this.TABLE_ROW_HEIGHT);
                rowsProcessed += rowsForNextPage;
            }
        }
    }
}

// Export for use in other scripts
window.TextFlowCalculator = TextFlowCalculator;