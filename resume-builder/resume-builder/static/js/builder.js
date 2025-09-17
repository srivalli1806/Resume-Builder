// Resume Builder JavaScript
class ResumeBuilder {
    constructor() {
        this.currentTemplate = 'modern';
        this.resumeData = {
            personal: {},
            summary: '',
            experience: [],
            education: [],
            skills: {
                technical: '',
                soft: ''
            },
            projects: [],
            certifications: [],
            languages: '',
            additional: ''
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTemplateFromURL();
        this.initializeForm();
        this.updatePreview();
    }

    bindEvents() {
        // Template selection
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => {
                this.currentTemplate = e.target.value;
                this.updateTemplate();
            });
        }

        // Personal information inputs
        const personalInputs = ['fullName', 'title', 'email', 'phone', 'address', 'linkedin', 'website'];
        personalInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updatePreview());
            }
        });

        // Summary
        const summaryElement = document.getElementById('summary');
        if (summaryElement) {
            summaryElement.addEventListener('input', () => this.updatePreview());
        }

        // Skills
        ['technicalSkills', 'softSkills'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updatePreview());
            }
        });

        // Languages and additional info
        ['languages', 'additionalInfo'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updatePreview());
            }
        });

        // Add buttons
        const addExperienceBtn = document.getElementById('addExperience');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => this.addExperience());
        }

        const addEducationBtn = document.getElementById('addEducation');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => this.addEducation());
        }

        const addProjectBtn = document.getElementById('addProject');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => this.addProject());
        }

        const addCertificationBtn = document.getElementById('addCertification');
        if (addCertificationBtn) {
            addCertificationBtn.addEventListener('click', () => this.addCertification());
        }

        // Save and load
        const saveResumeBtn = document.getElementById('saveResume');
        if (saveResumeBtn) {
            saveResumeBtn.addEventListener('click', () => this.saveResume());
        }

        const loadResumeBtn = document.getElementById('loadResume');
        if (loadResumeBtn) {
            loadResumeBtn.addEventListener('click', () => this.loadResume());
        }

        // Zoom controls
        const zoomInBtn = document.getElementById('zoomIn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomIn());
        }

        const zoomOutBtn = document.getElementById('zoomOut');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomOut());
        }

        const resetZoomBtn = document.getElementById('resetZoom');
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => this.resetZoom());
        }

        // Print and download
        const printResumeBtn = document.getElementById('printResume');
        if (printResumeBtn) {
            printResumeBtn.addEventListener('click', () => this.printResume());
        }

        const downloadPDFBtn = document.getElementById('downloadPDF');
        if (downloadPDFBtn) {
            downloadPDFBtn.addEventListener('click', () => this.downloadPDF());
        }
    }

    loadTemplateFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const template = urlParams.get('template');
        if (template && ['modern', 'classic', 'creative', 'professional'].includes(template)) {
            this.currentTemplate = template;
            const templateSelect = document.getElementById('templateSelect');
            if (templateSelect) {
                templateSelect.value = template;
            }
            this.updateTemplate();
        }
    }

    initializeForm() {
        // Add initial experience item
        this.addExperience();
        
        // Add initial education item
        this.addEducation();
    }

    updateTemplate() {
        const preview = document.getElementById('resumePreview');
        if (!preview) return;
        
        const templateDiv = preview.querySelector('div');
        if (templateDiv) {
            // Remove current template class and add new one
            templateDiv.className = `template-${this.currentTemplate}`;
        }
        
        // Update preview
        this.updatePreview();
        
        // Show notification
        this.showNotification(`Template changed to ${this.currentTemplate}`, 'success');
    }

    updatePreview() {
        this.collectFormData();
        this.renderPreview();
    }

    collectFormData() {
        // Personal information
        this.resumeData.personal = {
            name: document.getElementById('fullName').value || 'Your Name',
            title: document.getElementById('title').value || 'Professional Title',
            email: document.getElementById('email').value || 'email@example.com',
            phone: document.getElementById('phone').value || '+1 (555) 123-4567',
            address: document.getElementById('address').value || 'City, State, Country',
            linkedin: document.getElementById('linkedin').value || '',
            website: document.getElementById('website').value || ''
        };

        // Summary
        this.resumeData.summary = document.getElementById('summary').value || 'Write a compelling summary of your professional background, key skills, and career objectives...';

        // Skills
        this.resumeData.skills.technical = document.getElementById('technicalSkills').value || '';
        this.resumeData.skills.soft = document.getElementById('softSkills').value || '';

        // Languages and additional
        this.resumeData.languages = document.getElementById('languages').value || '';
        this.resumeData.additional = document.getElementById('additionalInfo').value || '';

        // Collect experience data
        this.resumeData.experience = [];
        document.querySelectorAll('.experience-item').forEach((item, index) => {
            const inputs = item.querySelectorAll('input, textarea');
            if (inputs.length >= 6) {
                this.resumeData.experience.push({
                    title: inputs[0].value || `Job Title ${index + 1}`,
                    company: inputs[1].value || 'Company Name',
                    location: inputs[2].value || 'Location',
                    startDate: inputs[3].value || '',
                    endDate: inputs[4].value || '',
                    description: inputs[5].value || 'Describe your responsibilities and achievements...'
                });
            }
        });

        // Collect education data
        this.resumeData.education = [];
        document.querySelectorAll('.education-item').forEach((item, index) => {
            const inputs = item.querySelectorAll('input, textarea');
            if (inputs.length >= 6) {
                this.resumeData.education.push({
                    degree: inputs[0].value || `Degree ${index + 1}`,
                    institution: inputs[1].value || 'Institution',
                    field: inputs[2].value || 'Field of Study',
                    startDate: inputs[3].value || '',
                    endDate: inputs[4].value || '',
                    details: inputs[5].value || 'Additional details, GPA, honors...'
                });
            }
        });

        // Collect project data
        this.resumeData.projects = [];
        document.querySelectorAll('.project-item').forEach((item, index) => {
            const inputs = item.querySelectorAll('input, textarea');
            if (inputs.length >= 4) {
                this.resumeData.projects.push({
                    name: inputs[0].value || `Project ${index + 1}`,
                    technologies: inputs[1].value || '',
                    url: inputs[2].value || '',
                    description: inputs[3].value || 'Describe the project, your role, and key achievements...'
                });
            }
        });

        // Collect certification data
        this.resumeData.certifications = [];
        document.querySelectorAll('.certification-item').forEach((item, index) => {
            const inputs = item.querySelectorAll('input, textarea');
            if (inputs.length >= 5) {
                this.resumeData.certifications.push({
                    name: inputs[0].value || `Certification ${index + 1}`,
                    organization: inputs[1].value || 'Issuing Organization',
                    dateEarned: inputs[2].value || '',
                    expiryDate: inputs[3].value || '',
                    details: inputs[4].value || 'Description or credential ID...'
                });
            }
        });
    }

    renderPreview() {
        const preview = document.getElementById('resumePreview');
        const templateDiv = preview.querySelector('div');
        
        // Update header
        const header = templateDiv.querySelector('.header');
        if (header) {
            header.innerHTML = `
                <div class="name">${this.resumeData.personal.name}</div>
                <div class="title">${this.resumeData.personal.title}</div>
                <div class="contact-info">
                    <div>${this.resumeData.personal.email} | ${this.resumeData.personal.phone}</div>
                    <div>${this.resumeData.personal.address}</div>
                    ${this.resumeData.personal.linkedin ? `<div>LinkedIn: ${this.resumeData.personal.linkedin}</div>` : ''}
                    ${this.resumeData.personal.website ? `<div>Website: ${this.resumeData.personal.website}</div>` : ''}
                </div>
            `;
        }

        // Update summary
        const summarySection = templateDiv.querySelector('#previewSummary');
        if (summarySection) {
            summarySection.innerHTML = `
                <div class="section-title">Professional Summary</div>
                <p>${this.resumeData.summary}</p>
            `;
        }

        // Update experience
        const experienceSection = templateDiv.querySelector('#previewExperience');
        if (experienceSection) {
            if (this.resumeData.experience.length > 0) {
                const experienceHTML = this.resumeData.experience.map(exp => `
                    <div class="experience-item mb-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1 fw-bold">${exp.title}</h6>
                                <div class="text-muted">${exp.company} | ${exp.location}</div>
                                <div class="text-muted small">${exp.startDate} - ${exp.endDate || 'Present'}</div>
                            </div>
                        </div>
                        <p class="mb-0 mt-2">${exp.description}</p>
                    </div>
                `).join('');
                experienceSection.innerHTML = `
                    <div class="section-title">Work Experience</div>
                    ${experienceHTML}
                `;
            } else {
                experienceSection.innerHTML = `
                    <div class="section-title">Work Experience</div>
                    <p>Add your work experience here...</p>
                `;
            }
        }

        // Update education
        const educationSection = templateDiv.querySelector('#previewEducation');
        if (educationSection) {
            if (this.resumeData.education.length > 0) {
                const educationHTML = this.resumeData.education.map(edu => `
                    <div class="education-item mb-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1 fw-bold">${edu.degree}</h6>
                                <div class="text-muted">${edu.institution} | ${edu.field}</div>
                                <div class="text-muted small">${edu.startDate} - ${edu.endDate || 'Present'}</div>
                            </div>
                        </div>
                        ${edu.details ? `<p class="mb-0 mt-2">${edu.details}</p>` : ''}
                    </div>
                `).join('');
                educationSection.innerHTML = `
                    <div class="section-title">Education</div>
                    ${educationHTML}
                `;
            } else {
                educationSection.innerHTML = `
                    <div class="section-title">Education</div>
                    <p>Add your education here...</p>
                `;
            }
        }

        // Update skills
        const skillsSection = templateDiv.querySelector('#previewSkills');
        if (skillsSection) {
            const skillsHTML = [];
            if (this.resumeData.skills.technical) {
                skillsHTML.push(`<div><strong>Technical Skills:</strong> ${this.resumeData.skills.technical}</div>`);
            }
            if (this.resumeData.skills.soft) {
                skillsHTML.push(`<div><strong>Soft Skills:</strong> ${this.resumeData.skills.soft}</div>`);
            }
            if (this.resumeData.languages) {
                skillsHTML.push(`<div><strong>Languages:</strong> ${this.resumeData.languages}</div>`);
            }
            
            skillsSection.innerHTML = `
                <div class="section-title">Skills</div>
                ${skillsHTML.length > 0 ? skillsHTML.join('') : '<p>Add your skills here...</p>'}
            `;
        }

        // Update projects
        const projectsSection = templateDiv.querySelector('#previewProjects');
        if (projectsSection) {
            if (this.resumeData.projects.length > 0) {
                const projectsHTML = this.resumeData.projects.map(project => `
                    <div class="project-item mb-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1 fw-bold">${project.name}</h6>
                                ${project.technologies ? `<div class="text-muted">${project.technologies}</div>` : ''}
                                ${project.url ? `<div class="text-muted small">${project.url}</div>` : ''}
                            </div>
                        </div>
                        <p class="mb-0 mt-2">${project.description}</p>
                    </div>
                `).join('');
                projectsSection.innerHTML = `
                    <div class="section-title">Projects</div>
                    ${projectsHTML}
                `;
            } else {
                projectsSection.innerHTML = `
                    <div class="section-title">Projects</div>
                    <p>Add your projects here...</p>
                `;
            }
        }

        // Add certifications section if needed
        if (this.resumeData.certifications.length > 0) {
            let certificationsSection = templateDiv.querySelector('#previewCertifications');
            if (!certificationsSection) {
                certificationsSection = document.createElement('div');
                certificationsSection.id = 'previewCertifications';
                certificationsSection.className = 'section';
                templateDiv.appendChild(certificationsSection);
            }
            
            const certificationsHTML = this.resumeData.certifications.map(cert => `
                <div class="certification-item mb-3">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1 fw-bold">${cert.name}</h6>
                            <div class="text-muted">${cert.organization}</div>
                            <div class="text-muted small">${cert.dateEarned}${cert.expiryDate ? ` - ${cert.expiryDate}` : ''}</div>
                        </div>
                    </div>
                    ${cert.details ? `<p class="mb-0 mt-2">${cert.details}</p>` : ''}
                </div>
            `).join('');
            
            certificationsSection.innerHTML = `
                <div class="section-title">Certifications</div>
                ${certificationsHTML}
            `;
        }

        // Add additional information section if needed
        if (this.resumeData.additional) {
            let additionalSection = templateDiv.querySelector('#previewAdditional');
            if (!additionalSection) {
                additionalSection = document.createElement('div');
                additionalSection.id = 'previewAdditional';
                additionalSection.className = 'section';
                templateDiv.appendChild(additionalSection);
            }
            
            additionalSection.innerHTML = `
                <div class="section-title">Additional Information</div>
                <p>${this.resumeData.additional}</p>
            `;
        }
    }

    addExperience() {
        const container = document.getElementById('experienceContainer');
        const template = document.getElementById('experienceTemplate');
        const clone = template.content.cloneNode(true);
        
        // Add event listeners to the new experience item
        const removeBtn = clone.querySelector('.remove-experience');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                container.removeChild(removeBtn.closest('.experience-item'));
                this.updatePreview();
            });
        }

        // Add input listeners
        const inputs = clone.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        container.appendChild(clone);
        this.updatePreview();
    }

    addEducation() {
        const container = document.getElementById('educationContainer');
        const template = document.getElementById('educationTemplate');
        const clone = template.content.cloneNode(true);
        
        // Add event listeners to the new education item
        const removeBtn = clone.querySelector('.remove-education');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                container.removeChild(removeBtn.closest('.education-item'));
                this.updatePreview();
            });
        }

        // Add input listeners
        const inputs = clone.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        container.appendChild(clone);
        this.updatePreview();
    }

    addProject() {
        const container = document.getElementById('projectContainer');
        const template = document.getElementById('projectTemplate');
        const clone = template.content.cloneNode(true);
        
        // Add event listeners to the new project item
        const removeBtn = clone.querySelector('.remove-project');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                container.removeChild(removeBtn.closest('.project-item'));
                this.updatePreview();
            });
        }

        // Add input listeners
        const inputs = clone.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        container.appendChild(clone);
        this.updatePreview();
    }

    addCertification() {
        const container = document.getElementById('certificationContainer');
        const template = document.getElementById('certificationTemplate');
        const clone = template.content.cloneNode(true);
        
        // Add event listeners to the new certification item
        const removeBtn = clone.querySelector('.remove-certification');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                container.removeChild(removeBtn.closest('.certification-item'));
                this.updatePreview();
            });
        }

        // Add input listeners
        const inputs = clone.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        container.appendChild(clone);
        this.updatePreview();
    }

    saveResume() {
        this.collectFormData();
        
        const resumeData = {
            template: this.currentTemplate,
            data: this.resumeData,
            title: this.resumeData.personal.name || 'Untitled Resume'
        };

        // Save to localStorage
        localStorage.setItem('savedResume', JSON.stringify(resumeData));
        
        this.showNotification('Resume saved successfully!', 'success');
    }

    loadResume() {
        const savedData = localStorage.getItem('savedResume');
        if (savedData) {
            const resumeData = JSON.parse(savedData);
            this.resumeData = resumeData.data;
            this.currentTemplate = resumeData.template;
            
            // Update form fields
            this.populateForm();
            
            // Update template
            const templateSelect = document.getElementById('templateSelect');
            if (templateSelect) {
                templateSelect.value = this.currentTemplate;
            }
            this.updateTemplate();
            
            this.showNotification('Resume loaded successfully!', 'success');
        } else {
            this.showNotification('No saved resume found.', 'warning');
        }
    }

    populateForm() {
        // Populate personal information
        if (this.resumeData.personal) {
            Object.keys(this.resumeData.personal).forEach(key => {
                const element = document.getElementById(key === 'name' ? 'fullName' : key);
                if (element) {
                    element.value = this.resumeData.personal[key];
                }
            });
        }

        // Populate other fields
        if (this.resumeData.summary) document.getElementById('summary').value = this.resumeData.summary;
        if (this.resumeData.skills.technical) document.getElementById('technicalSkills').value = this.resumeData.skills.technical;
        if (this.resumeData.skills.soft) document.getElementById('softSkills').value = this.resumeData.skills.soft;
        if (this.resumeData.languages) document.getElementById('languages').value = this.resumeData.languages;
        if (this.resumeData.additional) document.getElementById('additionalInfo').value = this.resumeData.additional;

        // Clear existing items
        const experienceContainer = document.getElementById('experienceContainer');
        if (experienceContainer) {
            experienceContainer.innerHTML = '';
        }
        const educationContainer = document.getElementById('educationContainer');
        if (educationContainer) {
            educationContainer.innerHTML = '';
        }
        const projectContainer = document.getElementById('projectContainer');
        if (projectContainer) {
            projectContainer.innerHTML = '';
        }
        const certificationContainer = document.getElementById('certificationContainer');
        if (certificationContainer) {
            certificationContainer.innerHTML = '';
        }

        // Populate experience
        this.resumeData.experience.forEach(() => this.addExperience());
        setTimeout(() => {
            const experienceItems = document.querySelectorAll('.experience-item');
            this.resumeData.experience.forEach((exp, index) => {
                if (experienceItems[index]) {
                    const inputs = experienceItems[index].querySelectorAll('input, textarea');
                    if (inputs.length >= 6) {
                        inputs[0].value = exp.title;
                        inputs[1].value = exp.company;
                        inputs[2].value = exp.location;
                        inputs[3].value = exp.startDate;
                        inputs[4].value = exp.endDate;
                        inputs[5].value = exp.description;
                    }
                }
            });
        }, 100);

        // Populate education
        this.resumeData.education.forEach(() => this.addEducation());
        setTimeout(() => {
            const educationItems = document.querySelectorAll('.education-item');
            this.resumeData.education.forEach((edu, index) => {
                if (educationItems[index]) {
                    const inputs = educationItems[index].querySelectorAll('input, textarea');
                    if (inputs.length >= 6) {
                        inputs[0].value = edu.degree;
                        inputs[1].value = edu.institution;
                        inputs[2].value = edu.field;
                        inputs[3].value = edu.startDate;
                        inputs[4].value = edu.endDate;
                        inputs[5].value = edu.details;
                    }
                }
            });
        }, 100);

        // Populate projects
        this.resumeData.projects.forEach(() => this.addProject());
        setTimeout(() => {
            const projectItems = document.querySelectorAll('.project-item');
            this.resumeData.projects.forEach((project, index) => {
                if (projectItems[index]) {
                    const inputs = projectItems[index].querySelectorAll('input, textarea');
                    if (inputs.length >= 4) {
                        inputs[0].value = project.name;
                        inputs[1].value = project.technologies;
                        inputs[2].value = project.url;
                        inputs[3].value = project.description;
                    }
                }
            });
        }, 100);

        // Populate certifications
        this.resumeData.certifications.forEach(() => this.addCertification());
        setTimeout(() => {
            const certificationItems = document.querySelectorAll('.certification-item');
            this.resumeData.certifications.forEach((cert, index) => {
                if (certificationItems[index]) {
                    const inputs = certificationItems[index].querySelectorAll('input, textarea');
                    if (inputs.length >= 5) {
                        inputs[0].value = cert.name;
                        inputs[1].value = cert.organization;
                        inputs[2].value = cert.dateEarned;
                        inputs[3].value = cert.expiryDate;
                        inputs[4].value = cert.details;
                    }
                }
            });
        }, 100);
    }

    zoomIn() {
        const preview = document.getElementById('resumePreview');
        const currentScale = parseFloat(preview.style.transform.replace('scale(', '').replace(')', '')) || 1;
        preview.style.transform = `scale(${Math.min(currentScale + 0.1, 2)})`;
    }

    zoomOut() {
        const preview = document.getElementById('resumePreview');
        const currentScale = parseFloat(preview.style.transform.replace('scale(', '').replace(')', '')) || 1;
        preview.style.transform = `scale(${Math.max(currentScale - 0.1, 0.5)})`;
    }

    resetZoom() {
        const preview = document.getElementById('resumePreview');
        preview.style.transform = 'scale(1)';
    }

    printResume() {
        window.print();
    }

    downloadPDF() {
        // This will be handled by pdf.js
        if (window.generatePDF) {
            window.generatePDF();
        } else {
            this.showNotification('PDF generation is loading...', 'info');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Initialize the resume builder when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/builder') {
        window.resumeBuilder = new ResumeBuilder();
        window.ResumeBuilder = window.resumeBuilder; // For global access
    }
}); 