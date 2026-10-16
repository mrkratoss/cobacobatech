document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        
        const resMsg = document.getElementById('resMessage');
        if (result.success) {
          resMsg.style.color = 'green';
          resMsg.innerText = result.message;
          form.reset();
        } else {
          resMsg.style.color = 'red';
          resMsg.innerText = result.message;
        }
      } catch (error) {
        console.error('Error submitting reservation:', error);
      }
    });
  }
});