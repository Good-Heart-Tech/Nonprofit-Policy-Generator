// ===== PAGE-SPECIFIC WIRING (engine.js calls this after wizard nav is set up) =====
window.onWizardInit = function() {
    const reimbursementRadios = document.querySelectorAll('input[name="reimbursement"]');
    const reimbursementDetailsContainer = document.getElementById('reimbursement-details-container');

    function updateReimbursementDetailsVisibility() {
        const wantsReimbursement = document.getElementById('reimbursement-yes').checked;
        reimbursementDetailsContainer.style.display = wantsReimbursement ? 'block' : 'none';
        if (!wantsReimbursement) {
            document.getElementById('reimbursement-details').value = '';
        }
    }

    reimbursementRadios.forEach(radio => {
        radio.addEventListener('change', updateReimbursementDetailsVisibility);
    });
    updateReimbursementDetailsVisibility();
};

// ===== VALIDATION (called by engine.js) =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

window.validateStep = function(step) {
    switch (step) {
        case 1: {
            const orgName = document.getElementById('org-name').value.trim();
            const contactEmail = document.getElementById('contact-email').value.trim();

            if (!orgName) {
                alert('Please enter your organization name.');
                return false;
            }
            if (!contactEmail || !validateEmail(contactEmail)) {
                alert('Please enter a valid contact email address.');
                return false;
            }
            return true;
        }

        case 2: {
            if (!document.querySelector('input[name="scope"]:checked')) {
                alert('Please select which devices this policy covers.');
                return false;
            }
            return true;
        }

        case 3: {
            if (document.querySelectorAll('input[name="security"]:checked').length === 0) {
                alert('Please select at least one security requirement.');
                return false;
            }
            return true;
        }

        case 5: {
            const reportHours = document.getElementById('report-hours').value.trim();
            if (!reportHours || Number(reportHours) <= 0) {
                alert('Please enter how many hours staff have to report a lost or stolen device.');
                return false;
            }
            return true;
        }

        default:
            return true;
    }
};

// ===== CONTENT FORMATTING =====
function formatSecurityRequirements(types) {
    const descriptions = {
        'passcode': "- A PIN, passcode, or biometric lock (fingerprint/face) must be enabled at all times.",
        'encryption': "- Device storage encryption must be enabled.",
        'updates': "- Operating system and security updates must be installed promptly when available.",
        'remote-wipe': "- Users consent to a remote wipe of organizational data (and, where the device is organization-owned, the entire device) if it is lost, stolen, or the user's access is terminated."
    };

    let text = "";
    types.forEach(type => {
        if (descriptions[type]) {
            text += descriptions[type] + "\n";
        }
    });
    return text || "- Devices must meet the security requirements communicated by IT before accessing organizational data.\n";
}

function formatSeparation(types) {
    const descriptions = {
        'container': "- Organizational email and apps must be accessed through a separate managed app or work profile, not mixed with personal accounts.",
        'no-local-storage': "- Organizational files and data may not be permanently stored on the personal device outside of approved, managed apps.",
        'personal-apps-allowed': "- Personal apps and use of the device are otherwise unrestricted and will not be monitored by the organization."
    };

    let text = "";
    types.forEach(type => {
        if (descriptions[type]) {
            text += descriptions[type] + "\n";
        }
    });
    return text;
}

function scopeDescription(scope) {
    switch (scope) {
        case 'byod':
            return "personal phones and tablets (\"BYOD\" devices) that staff, volunteers, or contractors use to access organizational data";
        case 'org-owned':
            return "phones and tablets owned and issued by the organization";
        case 'both':
        default:
            return "both organization-owned phones/tablets and personal devices (\"BYOD\") used to access organizational data";
    }
}

// ===== POLICY GENERATION (called by engine.js) =====
window.generatePolicyContent = function() {
    const orgName = document.getElementById('org-name').value.trim();
    const contactEmail = document.getElementById('contact-email').value.trim();

    const scope = document.querySelector('input[name="scope"]:checked')?.value || 'both';
    const includesByod = scope === 'byod' || scope === 'both';

    const securityTypes = Array.from(document.querySelectorAll('input[name="security"]:checked')).map(cb => cb.value);
    const securityText = formatSecurityRequirements(securityTypes);

    const separationTypes = includesByod
        ? Array.from(document.querySelectorAll('input[name="separation"]:checked')).map(cb => cb.value)
        : [];
    const separationText = formatSeparation(separationTypes);

    const reportHours = document.getElementById('report-hours').value.trim() || "24";
    const reportMethod = document.getElementById('report-method').value.trim();

    const wantsReimbursement = document.getElementById('reimbursement-yes').checked;
    const reimbursementDetails = document.getElementById('reimbursement-details').value.trim();

    return `# Mobile Device Policy

**${orgName}** relies on mobile devices to carry out our work, and this policy sets out the security and usage rules for devices that access our data. This policy applies to ${scopeDescription(scope)}.

## Security Requirements

Any device covered by this policy must meet the following requirements before it can be used to access ${orgName}'s email, files, or systems:

${securityText}

${includesByod ? `## Personal (BYOD) Devices: App & Data Separation

For personal devices, we require the following to keep organizational data separate from personal data:

${separationText || "- Organizational data must be kept reasonably separate from personal data and apps.\n"}
` : ''}

## Acceptable Use

- Devices covered by this policy should be used in a manner consistent with ${orgName}'s Acceptable Use Policy.
- Do not share your device, passcode, or organizational accounts with anyone else, including family members.
- Report any suspected malware, unauthorized access, or unusual activity on your device to ${contactEmail || "[your contact email]"} as soon as possible.

## Lost or Stolen Devices

If a device covered by this policy is lost or stolen, it must be reported within **${reportHours} hours**.${reportMethod ? ` ${reportMethod}` : ` Please contact ${contactEmail || "[your contact email]"} as soon as possible.`} Prompt reporting allows us to remotely lock or wipe organizational data before it can be accessed by someone else.

## Reimbursement & Stipends

${wantsReimbursement ?
    `${orgName} offers a stipend or reimbursement toward personal device costs for staff required to use their own device for work.${reimbursementDetails ? ` ${reimbursementDetails}` : ''}` :
    `${orgName} does not currently offer a stipend or reimbursement for personal device use.`}

## Termination & Offboarding

When an employee, volunteer, or contractor's relationship with ${orgName} ends, or if their access is otherwise terminated, organizational data and access must be removed from any device they used, including personal devices. This may involve a remote wipe of organizational apps and data, revoking account access, and returning any organization-owned devices.

## Enforcement

Failure to comply with this policy may result in loss of access to organizational systems from your device, disciplinary action, or termination of employment or engagement, depending on the severity of the violation.

## Acknowledgment

By using a device covered by this policy to access ${orgName}'s data, you acknowledge that you have read, understood, and agree to comply with this Mobile Device Policy. Questions should be directed to ${contactEmail || "[your contact email]"}.

**Effective Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
};
