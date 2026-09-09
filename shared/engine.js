// ===== SHARED WIZARD ENGINE =====
// Used by every policy generator page (privacy, ai-use, acceptable-use, mobile-device).
//
// Each page provides its own step markup (.question-card, .step, next/back buttons
// with data-next/data-prev/data-skip-if) and defines these globals:
//   window.generatePolicyContent()      -> required: returns the policy as a markdown string
//   window.validateStep(stepNumber)     -> optional: return false to block moving past a step
//   window.onWizardInit()               -> optional: wire up page-specific field behavior
//
// This file only handles what's common: step navigation, the progress bar, the
// wizard show/hide toggle, generating + displaying the policy, markdown-to-HTML
// rendering, copy-to-clipboard, the footer year, and the FAQ toggle.

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    initWizardNavigation();
    initPolicyGeneration();

    if (typeof window.onWizardInit === 'function') {
        window.onWizardInit();
    }
});

// ===== STEP NAVIGATION =====
function initWizardNavigation() {
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const progressFill = document.getElementById('progress-fill');
    const currentStepText = document.getElementById('current-step');
    const steps = document.querySelectorAll('.step');
    const totalSteps = steps.length || 1;

    let currentStep = 1;
    updateProgressBar();

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            let nextStep = parseInt(button.getAttribute('data-next'), 10);

            // If the element named in data-skip-if is checked, skip the step after next.
            const skipIfElementId = button.getAttribute('data-skip-if');
            if (skipIfElementId && document.getElementById(skipIfElementId)?.checked) {
                nextStep += 1;
            }

            if (validateStep(currentStep)) {
                document.getElementById(`question-${currentStep}`).classList.remove('active');
                document.getElementById(`question-${nextStep}`).classList.add('active');
                currentStep = nextStep;
                updateProgressBar();
            }
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prevStep = parseInt(button.getAttribute('data-prev'), 10);
            document.getElementById(`question-${currentStep}`).classList.remove('active');
            document.getElementById(`question-${prevStep}`).classList.add('active');
            currentStep = prevStep;
            updateProgressBar();
        });
    });

    const toggleWizardBtn = document.getElementById('toggle-wizard-btn');
    const wizardContainer = document.getElementById('wizard-container');
    if (toggleWizardBtn && wizardContainer) {
        toggleWizardBtn.addEventListener('click', () => {
            const isHidden = wizardContainer.style.display === 'none';
            wizardContainer.style.display = isHidden ? 'block' : 'none';
            toggleWizardBtn.innerHTML = isHidden
                ? '<i class="fas fa-chevron-up"></i> Hide Form'
                : '<i class="fas fa-chevron-down"></i> Show Form';
        });
    }

    function updateProgressBar() {
        if (progressFill) {
            const progressPercentage = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 100;
            progressFill.style.width = `${progressPercentage}%`;
        }
        if (currentStepText) {
            currentStepText.textContent = currentStep;
        }
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.toggle('completed', stepNumber < currentStep);
            step.classList.toggle('active', stepNumber === currentStep);
        });
    }
}

function validateStep(step) {
    if (typeof window.validateStep === 'function') {
        return window.validateStep(step);
    }
    return true;
}

// ===== POLICY GENERATION =====
function initPolicyGeneration() {
    const generateButton = document.getElementById('generate-policy');
    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const lastStep = document.querySelectorAll('.question-card').length || 1;
            if (!validateStep(lastStep)) {
                return;
            }
            if (typeof window.generatePolicyContent !== 'function') {
                console.error('This page has no window.generatePolicyContent() defined.');
                return;
            }
            displayPolicy(window.generatePolicyContent());
        });
    }

    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const format = button.getAttribute('data-format');
            const policyContent = document.getElementById('policy-content');
            const markdown = policyContent?.getAttribute('data-markdown') || '';
            let textToCopy = '';

            if (format === 'markdown') {
                textToCopy = markdown;
            } else if (format === 'plaintext') {
                textToCopy = convertMarkdownToPlainText(markdown);
            } else if (format === 'richtext') {
                textToCopy = policyContent.innerHTML;
            }

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard. Please try again.');
            });
        });
    });
}

function displayPolicy(policyContent) {
    policyContent = policyContent.trim();

    const wizardContainer = document.getElementById('wizard-container');
    if (wizardContainer) {
        wizardContainer.style.display = 'none';
    }

    const toggleWizardContainer = document.getElementById('toggle-wizard-container');
    if (toggleWizardContainer) {
        toggleWizardContainer.style.display = 'block';
    }

    const policyDisplay = document.getElementById('policy-display');
    if (policyDisplay) {
        policyDisplay.style.display = 'block';
    }

    const policyContentElement = document.getElementById('policy-content');
    if (policyContentElement) {
        policyContentElement.innerHTML = convertMarkdownToHTML(policyContent);
        policyContentElement.setAttribute('data-markdown', policyContent);
    }

    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.display = 'flex';
    }
}

// ===== MARKDOWN CONVERSION =====
function convertMarkdownToHTML(markdown) {
    markdown = markdown.trim();

    let html = markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/- (.*$)/gm, '<li>$1</li>')
        .replace(/([^>\n])\n([^<\n])/g, '$1 $2')
        .replace(/\n\n+/g, '</p><p>');

    if (!html.startsWith('<h1>') && !html.startsWith('<p>')) {
        html = '<p>' + html + '</p>';
    }

    html = html.replace(/<li>(.*?)<\/li>/g, '<li class="tight-item">$1</li>');
    html = html.replace(/(<li class="tight-item">.*?<\/li>)+/g, match => `<ul class="tight-list">${match}</ul>`);
    html = html.replace(/<p>(<ul)/g, '$1');
    html = html.replace(/<\/ul>(<\/p>)/g, '</ul>');

    return html;
}

function convertMarkdownToPlainText(markdown) {
    return markdown
        .replace(/^# (.*$)/gm, '$1\n')
        .replace(/^## (.*$)/gm, '\n$1\n')
        .replace(/^### (.*$)/gm, '\n$1\n')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/- (.*$)/gm, '- $1\n')
        .replace(/\n\n+/g, '\n\n')
        .trim();
}

// ===== FAQ TOGGLE =====
function toggleFAQ() {
    const faqContent = document.getElementById('faq-answer');
    const faqIcon = document.getElementById('faq-icon');
    if (!faqContent || !faqIcon) {
        return;
    }
    const toggleIcon = faqIcon.closest('.toggle-icon');

    faqContent.classList.toggle('show');

    if (faqContent.classList.contains('show')) {
        faqIcon.classList.remove('fa-chevron-down');
        faqIcon.classList.add('fa-chevron-up');
        toggleIcon?.classList.add('rotated');
    } else {
        faqIcon.classList.remove('fa-chevron-up');
        faqIcon.classList.add('fa-chevron-down');
        toggleIcon?.classList.remove('rotated');
    }
}
