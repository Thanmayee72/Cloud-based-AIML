const form = document.getElementById('healthForm');
const submitBtn = document.getElementById('submitBtn');
const responseMsg = document.getElementById('responseMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    responseMsg.className = 'loading';
    responseMsg.textContent = 'Processing your request...';

    const patientName = document.getElementById('patientName').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const diagnosis = document.getElementById('diagnosis').value.trim();
    
    // Validate form data
    if (!patientName || !age || !diagnosis) {
        responseMsg.className = 'error';
        responseMsg.textContent = 'Please fill in all required fields';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Record';
        return;
    }

    if (isNaN(age)) {
        responseMsg.className = 'error';
        responseMsg.textContent = 'Age must be a number';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Record';
        return;
    }

    const data = {
        patientName,
        age,
        diagnosis
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        console.log('Sending request to server...', data);
        const res = await fetch('http://127.0.0.1:5500/api/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Server returned status ${res.status}`);
        }

        const json = await res.json();
        responseMsg.className = 'success';
        responseMsg.textContent = json.message;
        form.reset();
    } catch (err) {
        console.error('Error:', err);
        responseMsg.className = 'error';
        responseMsg.textContent = err.message || 'Network or server error. Please try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Record';
    }
});

// Clear response message when user starts typing
form.addEventListener('input', () => {
    if (responseMsg.textContent) {
        responseMsg.textContent = '';
        responseMsg.className = '';
    }
});
