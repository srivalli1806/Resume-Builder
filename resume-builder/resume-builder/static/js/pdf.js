// PDF Generation functionality using jsPDF and HTML2Canvas
window.generatePDF = function() {
    const resumePreview = document.getElementById('resumePreview');
    const downloadBtn = document.getElementById('downloadPDF');
    
    if (!resumePreview) {
        console.error('Resume preview element not found');
        return;
    }

    // Show loading state
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating PDF...';
    downloadBtn.disabled = true;

    // Get the resume content
    const resumeContent = resumePreview.querySelector('div');
    const templateClass = resumeContent.className;
    
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 210mm;
        height: 297mm;
        background: white;
        padding: 20mm;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
    `;

    // Clone the resume content
    const clonedContent = resumeContent.cloneNode(true);
    tempContainer.appendChild(clonedContent);
    document.body.appendChild(tempContainer);

    // Configure HTML2Canvas options
    const canvasOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 170 * 2.83465, // 170mm in pixels at 96 DPI
        height: 257 * 2.83465, // 257mm in pixels at 96 DPI (A4 minus margins)
        scrollX: 0,
        scrollY: 0
    };

    // Generate PDF
    html2canvas(tempContainer, canvasOptions).then(canvas => {
        try {
            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Get canvas dimensions
            const imgWidth = 170; // A4 width minus margins
            const pageHeight = 297; // A4 height
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
            heightLeft -= pageHeight - 40; // Account for margins

            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 20, position + 20, imgWidth, imgHeight);
                heightLeft -= pageHeight - 40;
            }

            // Generate filename
            const name = document.getElementById('fullName')?.value || 'resume';
            const filename = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_resume.pdf`;

            // Download the PDF
            pdf.save(filename);

            // Show success notification
            if (window.ResumeBuilder) {
                window.ResumeBuilder.showNotification('PDF downloaded successfully!', 'success');
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            if (window.ResumeBuilder) {
                window.ResumeBuilder.showNotification('Error generating PDF. Please try again.', 'danger');
            }
        } finally {
            // Restore button state
            downloadBtn.innerHTML = originalContent;
            downloadBtn.disabled = false;
        }
    }).catch(error => {
        console.error('Error capturing resume:', error);
        if (window.ResumeBuilder) {
            window.ResumeBuilder.showNotification('Error capturing resume. Please try again.', 'danger');
        }
        
        // Restore button state
        downloadBtn.innerHTML = originalContent;
        downloadBtn.disabled = false;
        
        // Remove temporary container
        if (tempContainer.parentNode) {
            document.body.removeChild(tempContainer);
        }
    });
};

// Alternative PDF generation method using print styles
window.generatePDFPrint = function() {
    const resumePreview = document.getElementById('resumePreview');
    if (!resumePreview) {
        console.error('Resume preview element not found');
        return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const resumeContent = resumePreview.querySelector('div').cloneNode(true);
    
    // Create print-friendly HTML
    const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resume</title>
            <style>
                @page {
                    size: A4;
                    margin: 20mm;
                }
                
                body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    line-height: 1.4;
                    color: #333;
                    background: white;
                    margin: 0;
                    padding: 0;
                }
                
                .template-modern .header {
                    background: #007bff !important;
                    color: white !important;
                    padding: 20px !important;
                    margin-bottom: 20px !important;
                }
                
                .template-modern .name {
                    font-size: 24px !important;
                    font-weight: bold !important;
                    margin-bottom: 5px !important;
                }
                
                .template-modern .title {
                    font-size: 16px !important;
                    opacity: 0.9 !important;
                }
                
                .template-modern .section {
                    margin-bottom: 20px !important;
                    padding: 0 !important;
                    border: none !important;
                }
                
                .template-modern .section-title {
                    font-size: 16px !important;
                    font-weight: bold !important;
                    color: #007bff !important;
                    margin-bottom: 10px !important;
                    text-transform: uppercase !important;
                    border-bottom: 2px solid #007bff !important;
                    padding-bottom: 5px !important;
                }
                
                .template-classic .header {
                    text-align: center !important;
                    padding: 20px !important;
                    border-bottom: 3px solid #007bff !important;
                    margin-bottom: 20px !important;
                }
                
                .template-classic .name {
                    font-size: 24px !important;
                    font-weight: bold !important;
                    margin-bottom: 5px !important;
                }
                
                .template-classic .title {
                    font-size: 16px !important;
                    font-style: italic !important;
                }
                
                .template-classic .section {
                    margin-bottom: 20px !important;
                    padding: 0 !important;
                }
                
                .template-classic .section-title {
                    font-size: 16px !important;
                    font-weight: bold !important;
                    color: #007bff !important;
                    margin-bottom: 10px !important;
                    border-bottom: 1px solid #ccc !important;
                    padding-bottom: 5px !important;
                }
                
                .template-professional .header {
                    background: #333 !important;
                    color: white !important;
                    padding: 20px !important;
                    margin-bottom: 20px !important;
                }
                
                .template-professional .name {
                    font-size: 24px !important;
                    font-weight: bold !important;
                    margin-bottom: 5px !important;
                }
                
                .template-professional .title {
                    font-size: 16px !important;
                    opacity: 0.9 !important;
                }
                
                .template-professional .section {
                    margin-bottom: 20px !important;
                    padding: 0 !important;
                    border: none !important;
                }
                
                .template-professional .section-title {
                    font-size: 16px !important;
                    font-weight: bold !important;
                    color: #333 !important;
                    margin-bottom: 10px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                }
                
                .experience-item, .education-item, .project-item, .certification-item {
                    margin-bottom: 15px !important;
                }
                
                .experience-item h6, .education-item h6, .project-item h6, .certification-item h6 {
                    font-size: 14px !important;
                    font-weight: bold !important;
                    margin-bottom: 5px !important;
                }
                
                .text-muted {
                    color: #666 !important;
                }
                
                .small {
                    font-size: 11px !important;
                }
                
                p {
                    margin: 0 0 10px 0 !important;
                }
                
                @media print {
                    body {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
            </style>
        </head>
        <body>
            ${resumeContent.outerHTML}
        </body>
        </html>
    `;
    
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
};

// Enhanced PDF generation with better formatting
window.generateEnhancedPDF = function() {
    const resumePreview = document.getElementById('resumePreview');
    const downloadBtn = document.getElementById('downloadPDF');
    
    if (!resumePreview) {
        console.error('Resume preview element not found');
        return;
    }

    // Show loading state
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating PDF...';
    downloadBtn.disabled = true;

    // Get resume data
    const resumeData = window.resumeBuilder ? window.resumeBuilder.resumeData : {};
    
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Set font
        pdf.setFont('helvetica');
        
        // Page dimensions
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const contentWidth = pageWidth - (2 * margin);
        
        let yPosition = margin;
        
        // Header
        pdf.setFillColor(0, 123, 255);
        pdf.rect(margin, yPosition, contentWidth, 30, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text(resumeData.personal?.name || 'Your Name', margin + 5, yPosition + 15);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(resumeData.personal?.title || 'Professional Title', margin + 5, yPosition + 25);
        
        yPosition += 35;
        
        // Contact information
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        const contactInfo = [
            resumeData.personal?.email || 'email@example.com',
            resumeData.personal?.phone || '+1 (555) 123-4567',
            resumeData.personal?.address || 'City, State, Country'
        ].filter(Boolean);
        
        contactInfo.forEach((info, index) => {
            pdf.text(info, margin, yPosition + (index * 5));
        });
        
        yPosition += (contactInfo.length * 5) + 10;
        
        // Summary
        if (resumeData.summary && resumeData.summary !== 'Write a compelling summary...') {
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('PROFESSIONAL SUMMARY', margin, yPosition);
            yPosition += 8;
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth - 10);
            pdf.text(summaryLines, margin, yPosition);
            yPosition += (summaryLines.length * 5) + 10;
        }
        
        // Experience
        if (resumeData.experience && resumeData.experience.length > 0) {
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('WORK EXPERIENCE', margin, yPosition);
            yPosition += 8;
            
            resumeData.experience.forEach(exp => {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text(exp.title || 'Job Title', margin, yPosition);
                yPosition += 5;
                
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.text(`${exp.company || 'Company'} | ${exp.location || 'Location'}`, margin, yPosition);
                yPosition += 5;
                
                pdf.setFontSize(9);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`${exp.startDate || ''} - ${exp.endDate || 'Present'}`, margin, yPosition);
                yPosition += 5;
                
                pdf.setTextColor(0, 0, 0);
                if (exp.description && exp.description !== 'Describe your responsibilities...') {
                    const descLines = pdf.splitTextToSize(exp.description, contentWidth - 10);
                    pdf.text(descLines, margin, yPosition);
                    yPosition += (descLines.length * 4) + 5;
                }
                
                yPosition += 5;
            });
        }
        
        // Education
        if (resumeData.education && resumeData.education.length > 0) {
            if (yPosition > pageHeight - 50) {
                pdf.addPage();
                yPosition = margin;
            }
            
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('EDUCATION', margin, yPosition);
            yPosition += 8;
            
            resumeData.education.forEach(edu => {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text(edu.degree || 'Degree', margin, yPosition);
                yPosition += 5;
                
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.text(`${edu.institution || 'Institution'} | ${edu.field || 'Field of Study'}`, margin, yPosition);
                yPosition += 5;
                
                pdf.setFontSize(9);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`${edu.startDate || ''} - ${edu.endDate || 'Present'}`, margin, yPosition);
                yPosition += 5;
                
                pdf.setTextColor(0, 0, 0);
                if (edu.details && edu.details !== 'Additional details...') {
                    const detailLines = pdf.splitTextToSize(edu.details, contentWidth - 10);
                    pdf.text(detailLines, margin, yPosition);
                    yPosition += (detailLines.length * 4) + 5;
                }
                
                yPosition += 5;
            });
        }
        
        // Skills
        if ((resumeData.skills?.technical || resumeData.skills?.soft || resumeData.languages) && 
            (resumeData.skills.technical !== '' || resumeData.skills.soft !== '' || resumeData.languages !== '')) {
            
            if (yPosition > pageHeight - 50) {
                pdf.addPage();
                yPosition = margin;
            }
            
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('SKILLS', margin, yPosition);
            yPosition += 8;
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            
            if (resumeData.skills.technical) {
                pdf.setFont('helvetica', 'bold');
                pdf.text('Technical Skills:', margin, yPosition);
                yPosition += 5;
                pdf.setFont('helvetica', 'normal');
                pdf.text(resumeData.skills.technical, margin, yPosition);
                yPosition += 8;
            }
            
            if (resumeData.skills.soft) {
                pdf.setFont('helvetica', 'bold');
                pdf.text('Soft Skills:', margin, yPosition);
                yPosition += 5;
                pdf.setFont('helvetica', 'normal');
                pdf.text(resumeData.skills.soft, margin, yPosition);
                yPosition += 8;
            }
            
            if (resumeData.languages) {
                pdf.setFont('helvetica', 'bold');
                pdf.text('Languages:', margin, yPosition);
                yPosition += 5;
                pdf.setFont('helvetica', 'normal');
                pdf.text(resumeData.languages, margin, yPosition);
                yPosition += 8;
            }
        }
        
        // Generate filename
        const name = resumeData.personal?.name || 'resume';
        const filename = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_resume.pdf`;
        
        // Download the PDF
        pdf.save(filename);
        
        // Show success notification
        if (window.ResumeBuilder) {
            window.ResumeBuilder.showNotification('PDF downloaded successfully!', 'success');
        }
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        if (window.ResumeBuilder) {
            window.ResumeBuilder.showNotification('Error generating PDF. Please try again.', 'danger');
        }
    } finally {
        // Restore button state
        downloadBtn.innerHTML = originalContent;
        downloadBtn.disabled = false;
    }
};

// Initialize PDF generation when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/builder') {
        // Set the default PDF generation method
        window.generatePDF = window.generateEnhancedPDF;
    }
}); 