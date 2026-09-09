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
            const resourcesChecked = document.querySelectorAll('input[name="resource-type"]:checked').length;
            const otherResource = document.getElementById('resource-other').value.trim();
            if (resourcesChecked === 0 && !otherResource) {
                alert('Please select at least one resource this policy covers.');
                return false;
            }
            return true;
        }

        case 3: {
            const prohibitedChecked = document.querySelectorAll('input[name="prohibited-type"]:checked').length;
            const otherProhibited = document.getElementById('prohibited-other').value.trim();
            if (prohibitedChecked === 0 && !otherProhibited) {
                alert('Please select at least one prohibited use.');
                return false;
            }
            return true;
        }

        case 4: {
            const monitoringSelected = document.querySelector('input[name="monitoring"]:checked');
            if (!monitoringSelected) {
                alert('Please indicate whether your organization monitors use of its systems.');
                return false;
            }
            return true;
        }

        case 5: {
            const enforcementSelected = document.querySelector('input[name="enforcement"]:checked');
            if (!enforcementSelected) {
                alert('Please select how policy violations should generally be handled.');
                return false;
            }
            return true;
        }

        default:
            return true;
    }
};

// ===== CONTENT FORMATTING =====
function formatResources(types, otherText) {
    const resourceDescriptions = {
        'email': "- **Email**: Organizational email accounts and any messages sent, received, or stored through them.",
        'internet': "- **Internet Access**: Web browsing and any internet connectivity provided by the organization.",
        'devices': "- **Computers & Devices**: Organization-owned computers, laptops, tablets, and phones.",
        'software': "- **Software & Cloud Applications**: Software, SaaS tools, and cloud accounts provisioned by the organization.",
        'network': "- **Network & Wi-Fi**: Wired and wireless network access at organization facilities or provided remotely."
    };

    let formattedText = "";
    types.forEach(type => {
        if (resourceDescriptions[type]) {
            formattedText += resourceDescriptions[type] + "\n";
        }
    });
    if (otherText) {
        formattedText += `- **Other**: ${otherText}\n`;
    }
    return formattedText || "- Any organization-owned technology, accounts, or resources.\n";
}

function formatProhibitedUses(types, otherText) {
    const prohibitedDescriptions = {
        'illegal': "- Engaging in illegal activity of any kind.",
        'harassment': "- Harassment, discrimination, or creating, viewing, or distributing offensive content.",
        'unauthorized-access': "- Attempting to access systems, accounts, or data you are not authorized to use.",
        'personal-use': "- Excessive personal use of organizational resources during work hours.",
        'unauthorized-software': "- Installing unauthorized software, browser extensions, or hardware.",
        'credential-sharing': "- Sharing passwords, login credentials, or access codes with anyone else."
    };

    let formattedText = "";
    types.forEach(type => {
        if (prohibitedDescriptions[type]) {
            formattedText += prohibitedDescriptions[type] + "\n";
        }
    });
    if (otherText) {
        formattedText += `- ${otherText}\n`;
    }
    return formattedText || "- Any use that violates applicable law or this organization's other policies.\n";
}

function formatEnforcement(type) {
    switch (type) {
        case 'case-by-case':
            return "Violations of this policy will be addressed on a case-by-case basis at the discretion of leadership, taking into account the severity of the violation, whether it was intentional, and any prior history of policy violations. Responses may range from a verbal conversation to termination of employment or engagement, and may include legal action where warranted.";
        case 'progressive':
        default:
            return "Violations of this policy will generally be addressed through progressive discipline: a verbal warning for a first, minor violation; a written warning for repeated or more serious violations; and suspension or termination of employment or engagement for severe or repeated violations. Serious violations, such as illegal activity or unauthorized access to sensitive data, may result in immediate termination and, where warranted, legal action, regardless of prior history.";
    }
}

// ===== POLICY GENERATION (called by engine.js) =====
window.generatePolicyContent = function() {
    const orgName = document.getElementById('org-name').value.trim();
    const contactEmail = document.getElementById('contact-email').value.trim();

    const resourceTypes = Array.from(document.querySelectorAll('input[name="resource-type"]:checked')).map(cb => cb.value);
    const resourceOther = document.getElementById('resource-other').value.trim();
    const resourcesText = formatResources(resourceTypes, resourceOther);

    const prohibitedTypes = Array.from(document.querySelectorAll('input[name="prohibited-type"]:checked')).map(cb => cb.value);
    const prohibitedOther = document.getElementById('prohibited-other').value.trim();
    const prohibitedText = formatProhibitedUses(prohibitedTypes, prohibitedOther);

    const monitors = document.querySelector('input[name="monitoring"]:checked')?.value === 'yes';
    const monitoringDetails = document.getElementById('monitoring-details').value.trim();

    const enforcementType = document.querySelector('input[name="enforcement"]:checked')?.value || 'progressive';
    const enforcementText = formatEnforcement(enforcementType);

    return `# Acceptable Use Policy

**${orgName}** provides technology and resources to help staff, volunteers, and contractors carry out our mission. This policy explains what is and is not acceptable when using those resources.

## Scope

This policy applies to everyone who uses ${orgName}'s technology and resources, including employees, volunteers, board members, and contractors. It covers:

${resourcesText}

## Acceptable Use

You may use ${orgName}'s resources to carry out your job duties or volunteer responsibilities, and for reasonable, limited personal use that does not interfere with your work or violate this policy. You are expected to:

- Use good judgment and act professionally when using organizational resources.
- Keep your account credentials confidential and report any suspected compromise immediately.
- Follow any additional guidance provided by your supervisor or IT contact.
- Report any misuse of resources or suspected security incidents to ${contactEmail || "[your contact email]"}.

## Prohibited Uses

The following are prohibited when using ${orgName}'s resources:

${prohibitedText}

## Monitoring & Privacy

${monitors ?
    `${orgName} monitors use of its systems to protect its resources, data, and people, and to ensure compliance with this policy. Staff, volunteers, and contractors should not expect privacy when using organizational email, internet, devices, or network access.${monitoringDetails ? `\n\n${monitoringDetails}` : ''}` :
    `${orgName} does not routinely monitor use of its systems, but reserves the right to review activity if misuse or a security incident is suspected.${monitoringDetails ? `\n\n${monitoringDetails}` : ''}`}

## Enforcement

${enforcementText}

## Acknowledgment

By using ${orgName}'s technology and resources, you acknowledge that you have read, understood, and agree to comply with this Acceptable Use Policy. Questions about this policy should be directed to ${contactEmail || "[your contact email]"}.

## Policy Updates

This policy may be updated from time to time. Staff, volunteers, and contractors will be notified of material changes and are expected to comply with the current version.

**Effective Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
};
