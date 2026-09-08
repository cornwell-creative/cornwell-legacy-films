(() => {
  const form = document.getElementById('clf-contact-form');
  const status = document.getElementById('form-status');

  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    const subject = `Cornwell Legacy Films Inquiry — ${data.name}`;
    const body = [
      'Hello Gerald,',
      '',
      'I would like to start a conversation about a story I hope to preserve.',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || 'Not provided'}`,
      `Project: ${data.project || 'Not selected'}`,
      '',
      'Story / project details:',
      data.message,
      '',
      'Thank you.',
    ].join('\n');

    status.className = 'status show';
    status.textContent = 'Opening your email app…';
    window.location.href = `mailto:gerald@cornwelllegacyfilms.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
