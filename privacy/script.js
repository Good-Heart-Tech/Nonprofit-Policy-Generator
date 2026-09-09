// ===== PAGE-SPECIFIC WIRING (engine.js calls this after wizard nav is set up) =====
window.onWizardInit = function() {
    // URL validation as you type
    const websiteUrlInput = document.getElementById('org-website');
    if (websiteUrlInput) {
        websiteUrlInput.addEventListener('input', validateUrl);
        websiteUrlInput.addEventListener('blur', validateUrl);
    }

    // DATA COLLECTION LOGIC - Question 2
    const noDataCollectionCheckbox = document.getElementById('no-data-collection');
    const dataCollectionOptions = document.querySelector('.data-collection-options');
    const thirdPartyServicesContainer = document.getElementById('third-party-services-container');
    const dataSharingContainer = document.getElementById('data-sharing-container');

    if (noDataCollectionCheckbox && dataCollectionOptions) {
        const dataTypeCheckboxes = document.querySelectorAll('.data-collection-options input[type="checkbox"]');

        function updateDataCollectionVisibility() {
            const anyDataTypeSelected = Array.from(dataTypeCheckboxes).some(checkbox => checkbox.checked);

            if (thirdPartyServicesContainer) {
                if (anyDataTypeSelected) {
                    thirdPartyServicesContainer.style.display = 'block';
                    dataSharingContainer.style.display = 'block';
                } else {
                    thirdPartyServicesContainer.style.display = 'none';
                    dataSharingContainer.style.display = 'none';
                    const thirdPartyServices = document.getElementById('third-party-services');
                    if (thirdPartyServices) {
                        thirdPartyServices.value = '';
                    }
                    document.querySelectorAll('input[name="data-sharing"]').forEach(radio => {
                        radio.checked = false;
                    });
                }
            }
        }

        noDataCollectionCheckbox.addEventListener('change', function() {
            if (this.checked) {
                dataTypeCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                });
                dataCollectionOptions.classList.add('disabled');

                if (thirdPartyServicesContainer) {
                    thirdPartyServicesContainer.style.display = 'none';
                    dataSharingContainer.style.display = 'none';
                    const thirdPartyServices = document.getElementById('third-party-services');
                    if (thirdPartyServices) {
                        thirdPartyServices.value = '';
                    }
                    document.querySelectorAll('input[name="data-sharing"]').forEach(radio => {
                        radio.checked = false;
                    });
                }
            } else {
                dataTypeCheckboxes.forEach(checkbox => {
                    checkbox.disabled = false;
                });
                dataCollectionOptions.classList.remove('disabled');
                updateDataCollectionVisibility();
            }
        });

        dataTypeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked && noDataCollectionCheckbox.checked) {
                    noDataCollectionCheckbox.checked = false;
                    dataTypeCheckboxes.forEach(cb => {
                        cb.disabled = false;
                    });
                    dataCollectionOptions.classList.remove('disabled');
                }
                updateDataCollectionVisibility();
            });
        });

        updateDataCollectionVisibility();
    }

    // COOKIE USAGE LOGIC - Question 3
    const cookieCheckboxes = document.querySelectorAll('input[name="cookie-type"]');
    const noCookiesCheckbox = document.querySelector('input[name="cookie-type"][value="none"]');

    if (noCookiesCheckbox) {
        noCookiesCheckbox.addEventListener('change', function() {
            if (this.checked) {
                cookieCheckboxes.forEach(checkbox => {
                    if (checkbox.value !== 'none') {
                        checkbox.checked = false;
                        checkbox.disabled = true;
                    }
                });
            } else {
                cookieCheckboxes.forEach(checkbox => {
                    checkbox.disabled = false;
                    if (checkbox.id === 'essential-cookies') {
                        checkbox.checked = true;
                    }
                });
            }
        });

        cookieCheckboxes.forEach(checkbox => {
            if (checkbox.value !== 'none') {
                checkbox.addEventListener('change', function() {
                    if (this.checked && noCookiesCheckbox.checked) {
                        noCookiesCheckbox.checked = false;
                        cookieCheckboxes.forEach(cb => {
                            if (cb.value !== 'none') {
                                cb.disabled = false;
                            }
                        });
                    }
                });
            }
        });
    }
};

// ===== VALIDATION =====
function validateUrl() {
    const websiteInput = document.getElementById('org-website');
    const url = websiteInput.value.trim();

    if (!url) {
        return true; // Empty URL is valid (optional field)
    }

    if (!/^https?:\/\//i.test(url)) {
        websiteInput.value = 'https://' + url;
    }

    try {
        new URL(websiteInput.value);
        return true;
    } catch (e) {
        return false;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

window.validateStep = function(step) {
    switch (step) {
        case 1: {
            const orgName = document.getElementById('org-name').value.trim();
            const website = document.getElementById('org-website').value.trim();

            if (!orgName) {
                alert('Please enter your organization name.');
                return false;
            }
            if (website && !validateUrl()) {
                alert('Please enter a valid website URL.');
                return false;
            }
            return true;
        }

        case 2: {
            const noDataCollectionCheckbox = document.getElementById('no-data-collection');
            const dataTypeCheckboxes = document.querySelectorAll('input[name="data-type"]:checked');

            if (!noDataCollectionCheckbox.checked && dataTypeCheckboxes.length === 0) {
                alert('Please select at least one type of data you collect, or select "We don\'t collect any personal information".');
                return false;
            }

            const anyDataTypeSelected = Array.from(document.querySelectorAll('.data-collection-options input[type="checkbox"]:checked')).length > 0;
            if (anyDataTypeSelected) {
                const thirdPartyServices = document.getElementById('third-party-services').value.trim();
                if (!thirdPartyServices) {
                    alert('Please provide information about your third-party service providers.');
                    return false;
                }

                const dataSharingRadios = document.querySelectorAll('input[name="data-sharing"]:checked');
                if (dataSharingRadios.length === 0) {
                    alert('Please select whether you share user data with third parties.');
                    return false;
                }
            }
            return true;
        }

        case 3: {
            const cookieCheckboxes = document.querySelectorAll('input[name="cookie-type"]:checked');
            if (cookieCheckboxes.length === 0) {
                alert('Please select at least one cookie option.');
                return false;
            }
            return true;
        }

        case 4: {
            const contactEmail = document.getElementById('contact-email').value.trim();
            if (!contactEmail) {
                alert('Please enter a contact email address.');
                return false;
            }
            if (!validateEmail(contactEmail)) {
                alert('Please enter a valid email address.');
                return false;
            }
            return true;
        }

        default:
            return true;
    }
};

// ===== CONTENT FORMATTING =====
function formatDataTypes(types) {
    if (types.includes('none') || types.length === 0) {
        return "We do not collect any personal information.";
    }

    const dataTypeDescriptions = {
        'name': "- **Names**: We collect names to personalize our communications with you.",
        'email': "- **Email Addresses**: We collect email addresses to communicate with you about our programs and services.",
        'address': "- **Physical Addresses**: We collect physical addresses for donation receipts and occasional physical mailings.",
        'phone': "- **Phone Numbers**: We collect phone numbers to contact you about important updates or opportunities.",
        'donation': "- **Donation Information**: We collect donation information to process your contributions and provide tax receipts.",
        'other': "- **Other Information**: We may collect other information as specified in our communications with you."
    };

    let formattedText = "";
    types.forEach(type => {
        if (dataTypeDescriptions[type]) {
            formattedText += dataTypeDescriptions[type] + "\n";
        }
    });
    return formattedText;
}

function formatCookieTypes(types) {
    if (types.includes('none') || types.length === 0) {
        return "We do not use cookies on our website.";
    }

    const cookieDescriptions = {
        'essential': "- **Essential/Functional Cookies**: These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.",
        'analytics': "- **Analytics Cookies**: We use these cookies to collect information about how visitors use our website. This helps us improve our site and your experience.",
        'marketing': "- **Marketing/Advertising Cookies**: These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.",
        'social': "- **Social Media Cookies**: These cookies enable social media features on our website, such as sharing content on social platforms."
    };

    let formattedText = "";
    types.forEach(type => {
        if (cookieDescriptions[type]) {
            formattedText += cookieDescriptions[type] + "\n";
        }
    });
    return formattedText;
}

function formatDataSharing(type) {
    let baseText = "As a nonprofit organization committed to transparency, we may share information under these specific circumstances:\n\n";
    baseText += "- **Service Providers**: With trusted partners who help us operate our website, process donations, or deliver our programs.\n";
    baseText += "- **Legal Requirements**: When required by law, such as in response to a valid legal request or to protect our rights.\n";
    baseText += "- **With Your Permission**: When you've explicitly asked us to share your information.\n\n";

    switch (type) {
        case 'yes':
            return baseText + "**Additional Sharing**: We may also share information with other organizations that align with our mission and values. We carefully select these partners and ensure they maintain appropriate privacy and security standards. This sharing helps us extend our impact and better serve our community.";
        case 'no':
        default:
            return baseText + "**Limited Sharing**: Beyond the circumstances described above, we do not share your personal information with other organizations. We value the trust you place in us and are committed to protecting your privacy.";
    }
}

// ===== POLICY GENERATION (called by engine.js) =====
window.generatePolicyContent = function() {
    const collectsNoData = document.getElementById('no-data-collection').checked;
    const anyDataTypeSelected = Array.from(document.querySelectorAll('.data-collection-options input[type="checkbox"]:checked')).length > 0;

    const formData = {
        organization: {
            name: document.getElementById('org-name').value.trim(),
            website: document.getElementById('org-website').value.trim()
        },
        dataCollection: {
            collectsNoData: collectsNoData,
            anyDataTypeSelected: anyDataTypeSelected
        },
        thirdPartyServices: collectsNoData ?
            "We do not use any third-party services to process personal data as we do not collect any personal information." :
            (anyDataTypeSelected ? document.getElementById('third-party-services')?.value.trim() || null : null),
        cookieUsage: Array.from(document.querySelectorAll('input[name="cookie-type"]:checked')).map(cb => cb.value),
        dataSharing: document.querySelector('input[name="data-sharing"]:checked')?.value || 'no',
        contact: {
            email: document.getElementById('contact-email').value.trim()
        }
    };

    const dataTypes = Array.from(document.querySelectorAll('input[name="data-type"]:checked')).map(cb => cb.value);
    const personalDataTypes = formatDataTypes(dataTypes);
    const cookieTypes = formatCookieTypes(formData.cookieUsage);
    const dataSharingText = formatDataSharing(formData.dataSharing);

    return `# Privacy Policy
**${formData.organization.name}** is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website ${formData.organization.website ? `(${formData.organization.website})` : ''}.

## Information We Collect

${formData.dataCollection.collectsNoData ?
    "We do not collect any personal information about you when you visit our website." :
    formData.dataCollection.anyDataTypeSelected ?
    `We collect the following types of information:
${personalDataTypes}` :
    "We collect minimal information necessary to provide our services."}

## How We Use Your Information

${formData.dataCollection.collectsNoData ?
    "Since we don't collect personal information, we don't use your information for any purpose." :
    `We use the information we collect for:
- Providing and improving our services
- Communicating with you about our programs and services
- Understanding how visitors use our website`}

${formData.dataCollection.anyDataTypeSelected && formData.thirdPartyServices ?
    `\n## Third-Party Service Providers\n\nWe work with third-party providers, such as ${formData.thirdPartyServices}. These providers process data on our behalf in compliance with this policy.` : ''}

## Cookies and Tracking Technologies

${formData.cookieUsage.includes('none') ?
    "We do not use cookies or other tracking technologies on our website." :
    `We use the following types of cookies and tracking technologies:
${cookieTypes}`}

${!formData.dataCollection.collectsNoData ? `
## How We Share Your Information

${dataSharingText}

## Data Retention

We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, including any legal, accounting, or reporting requirements.` : ''}

## Data Protection

We implement reasonable precautions to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.

## Your Rights

${formData.dataCollection.collectsNoData ?
    "Since we don't collect personal information, there is no personal data for you to access, correct, or delete." :
    "Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data.\n\nTo exercise your privacy rights, please email " + (formData.contact.email || "[your contact email]") + " with 'Privacy Request' in the subject line. We will verify your identity and respond within 30 days as required by law."}

## Children's Privacy

Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

## External Websites

Our website may include links to third-party websites for your convenience and reference. ${formData.organization.name} is not responsible for the content, security, or privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.

## Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at ${formData.contact.email || "[your contact email]"}.

**Effective Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
};
