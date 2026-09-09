// ===== POLICY TEMPLATE =====
const POLICY_TEMPLATE = `# Purpose

At $orgName, we believe in using technology responsibly to enhance our mission and support the communities we serve. This policy provides guidelines for the ethical and secure use of AI tools, such as ChatGPT, Google Gemini, Microsoft Copilot, and others, to ensure alignment with our nonprofit values, data security, and confidentiality.

# Scope

This policy applies to all employees, volunteers, and contractors using AI tools to support $orgName's work. It covers all AI technologies that generate human-like text, insights, recommendations, or automations, including current and future AI advancements.

# Definitions

- AI Tools: Software or platforms that generate text, insights, recommendations, or automate tasks based on machine learning models.

- Confidential Data: Any sensitive or proprietary information related to $orgName, its stakeholders, operations, or systems, including but not limited to donor records, beneficiary details, financials, internal strategies, and any data protected by privacy regulations or ethical considerations.

# Policy

## Appropriate Use

- AI tools may be used to assist with tasks such as drafting reports, answering general inquiries, brainstorming ideas, and improving efficiency.
- AI-generated content must be reviewed by a human before being used in official communications, grant applications, donor outreach, or decision-making.
- AI should never replace human judgment in critical areas such as legal, financial, or ethical decision-making.

## Confidentiality & Data Protection

- Do not enter, upload, or share confidential or sensitive information, including donor records, beneficiary details, financial data, or proprietary strategies, into AI tools.
- Any data shared with AI tools could become publicly accessible. Always assume AI interactions are not private.
- If AI-generated insights include sensitive content, consult the appropriate team before use.
- AI vendors must comply with relevant data privacy regulations and nonprofit security standards.

## Security Best Practices

- Use strong passwords and enable multi-factor authentication (if applicable) when accessing AI platforms.
- Do not share login credentials for AI tools.
- AI integrations with third-party platforms must be reviewed and approved by the IT team or leadership.
- AI-generated code or automation scripts must be reviewed for security risks before implementation.
- Only use AI tools that are linked to an official $orgName email account. Do not use personal accounts for AI-related work.

## Privacy & Ethical Considerations

- AI tools must be used in a way that upholds respect, dignity, and inclusion. They must never be used to generate content that is harassing, discriminatory, or misleading.
- Do not use AI to impersonate individuals, fabricate testimonials, or manipulate public opinion.
- Employees should remain transparent when AI-generated content is used in external communications.
- Be aware of AI biases and critically assess AI-generated outputs to ensure fairness and accuracy.

## Compliance & Legal Considerations

- Always adhere to applicable laws and regulations regarding data privacy (e.g., GDPR, CCPA) and intellectual property.
- Respect copyright laws and verify the originality of AI-generated content before publishing or distributing it.
- AI vendors must be evaluated for compliance with organizations regulations before adoption.

## Human Oversight & Responsible Innovation

- AI should support, not replace, human expertise. When using AI for significant decisions, human review is required.
- Employees are encouraged to explore AI's benefits while ensuring responsible and ethical usage.

## Monitoring, Audits & Incident Reporting

- $orgName may periodically review AI tool usage to ensure compliance with this policy. This may include monitoring logs or conducting internal audits.
- Monitoring will be conducted solely for policy adherence and security purposes, not for employee performance tracking.
- Any AI-related security concerns, misuse, or ethical issues should be reported to the IT or leadership team.

## Exception Process

If an employee, volunteer, or contractor needs to use AI tools beyond the defined scope of this policy, they must seek approval from the IT or leadership team.

## Consequences of Non-Compliance

- Violations of this policy may result in corrective action, including revocation of AI tool access, disciplinary measures, or, in severe cases, termination of employment or contract.
- Legal action may be pursued if policy violations result in regulatory breaches or harm to $orgName or its stakeholders.

## Policy Updates & Acknowledgment

As AI technology evolves, this policy may be updated. Employees will be notified of any changes and are expected to comply with the latest version. By using AI tools at $orgName, you acknowledge and agree to follow this policy.`;

// ===== VALIDATION (called by engine.js) =====
window.validateStep = function(step) {
    if (step === 1) {
        const orgName = document.getElementById('org-name').value.trim();
        if (!orgName) {
            alert('Please enter your organization name.');
            return false;
        }
    }
    return true;
};

// ===== POLICY GENERATION (called by engine.js) =====
window.generatePolicyContent = function() {
    const orgName = document.getElementById('org-name').value.trim();
    return POLICY_TEMPLATE.replace(/\$orgName/g, orgName);
};
