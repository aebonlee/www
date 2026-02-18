// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '전송 중...';
            submitBtn.disabled = true;
            
            // Simulate form submission (Replace with actual backend API call)
            setTimeout(() => {
                // Success message
                alert(`문의해 주셔서 감사합니다, ${formData.name}님!\n\n빠른 시일 내에 ${formData.email}로 답변 드리겠습니다.`);
                
                // Reset form
                contactForm.reset();
                submitBtn.textContent = original Text;
                submitBtn.disabled = false;
                
                // Log data (for development - remove in production)
                console.log('Form submitted:', formData);
                
                /* 
                // Example: EmailJS integration
                emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                    .then(function(response) {
                        alert('문의가 성공적으로 전송되었습니다!');
                        contactForm.reset();
                    }, function(error) {
                        alert('전송 중 오류가 발생했습니다. 다시 시도해 주세요.');
                    });
                */
                
                /*
                // Example: FormSpree integration
                fetch('https://formspree.io/f/YOUR_FORM_ID', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    alert('문의가 성공적으로 전송되었습니다!');
                    contactForm.reset();
                })
                .catch(error => {
                    alert('전송 중 오류가 발생했습니다.');
                });
                */
            }, 1500);
        });
    }
});
