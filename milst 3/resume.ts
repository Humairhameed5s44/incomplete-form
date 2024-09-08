interface ResumeData {
    name: string;
    email: string;
    number: string;
    education: string;
    skills: string[];
    workExperience: string;
    image?: string;
}

const form = document.getElementById('personal-info-form') as HTMLFormElement;

function handleSubmit(event: Event): void {
    event.preventDefault();

    // Clear previous error messages
    clearErrors();

    // Collect values from form fields
    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const number = (document.getElementById('number') as HTMLInputElement).value.trim();
    const education = (document.getElementById('education') as HTMLTextAreaElement).value.trim();
    const workExperience = (document.getElementById('work-experience') as HTMLTextAreaElement).value.trim();

    // Validate required fields
    let isValid = true;
    if (!name) {
        showError('name', 'Name is required.');
        isValid = false;
    }
    if (!email || !validateEmail(email)) {
        showError('email', 'A valid email is required.');
        isValid = false;
    }
    if (!number) {
        showError('number', 'Phone number is required.');
        isValid = false;
    }
    if (!education) {
        showError('education', 'Education information is required.');
        isValid = false;
    }
    if (!workExperience) {
        showError('work-experience', 'Work experience is required.');
        isValid = false;
    }

    if (!isValid) return; // Stop submission if any field is invalid

    // Collect skills
    const skills = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="skills[]"]'))
        .map(input => input.value.trim())
        .filter(skill => skill); // Filter out empty skills

    // Collect image data if available
    const imageFile = (document.getElementById('image-upload') as HTMLInputElement).files?.[0];
    let imageDataUrl = '';

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
            imageDataUrl = reader.result as string;
            saveDataAndRedirect(name, email, number, education, workExperience, skills, imageDataUrl);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveDataAndRedirect(name, email, number, education, workExperience, skills, imageDataUrl);
    }
}

function saveDataAndRedirect(name: string, email: string, number: string, education: string, workExperience: string, skills: string[], imageDataUrl: string): void {
    const resumeData: ResumeData = {
        name,
        email,
        number,
        education,
        workExperience,
        skills,
        image: imageDataUrl
    };

    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    window.location.href = 'resume.html';  // Redirect to resume page
}

function toggleSkills(): void {
    const skillsSection = document.getElementById('skills-section') as HTMLDivElement;
    skillsSection.style.display = (skillsSection.style.display === 'none') ? 'block' : 'none';
}

function addSkill(): void {
    const skillsList = document.getElementById('skills-list') as HTMLDivElement;
    const newSkillDiv = document.createElement('div');
    newSkillDiv.classList.add('skill-row');
    newSkillDiv.innerHTML = `
        <input type="text" placeholder="Enter your skill" name="skills[]">
        <button type="button" class="remove-skill-btn" onclick="removeSkill(this)">Remove</button>
    `;
    skillsList.appendChild(newSkillDiv);
}

function removeSkill(button: HTMLButtonElement): void {
    button.parentElement?.remove();
}

form.addEventListener('submit', handleSubmit);

// Function to show error messages
function showError(inputId: string, message: string): void {
    const inputElement = document.getElementById(inputId) as HTMLInputElement | null;
    if (inputElement) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.textContent = message;
        inputElement.parentElement?.appendChild(errorElement);
    }
}

// Helper function to clear error messages
function clearErrors(): void {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((msg) => {
        msg.remove();
    });
}

// Email validation function
function validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
}
