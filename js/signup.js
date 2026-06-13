window.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const FORM_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSeLOlpVbhx2bNZ5GRmNowvA6EUVA92Zo077sijcan1yn300TQ/viewform';

  const FIELD_MAP = {
    frc: {
      program: 'entry.1699233058',
      programValue: 'FRC  (Grades 7-12th)',
      name: 'entry.573650983',
      email: 'entry.1010324525',
      phone: 'entry.238358888'
    },
    ftc: {
      program: 'entry.1699233058',
      programValue: null,
      name: 'entry.753107151',
      email: 'entry.505493070',
      phone: 'entry.850285063'
    }
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const program = form.querySelector('input[name="program"]:checked').value;
    const map = FIELD_MAP[program];
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();

    const params = new URLSearchParams();
    params.set('usp', 'pp_url');
    if (map.programValue) params.set(map.program, map.programValue);
    if (name) params.set(map.name, name);
    if (email) params.set(map.email, email);
    if (phone) params.set(map.phone, phone);

    window.open(FORM_BASE + '?' + params.toString(), '_blank', 'noopener');
  });
});
