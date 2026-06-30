const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration({ name, email, password }) {
    const errors = {};
    const trimmedName = name?.trim() || '';
    const trimmedEmail = email?.trim().toLowerCase() || '';

    if (!trimmedName) {
        errors.name = 'Name is required';
    } else if (trimmedName.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    } else if (trimmedName.length > 50) {
        errors.name = 'Name must be 50 characters or less';
    }

    if (!trimmedEmail) {
        errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
        errors.email = 'Enter a valid email address';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Za-z]/.test(password)) {
        errors.password = 'Password must include at least one letter';
    } else if (!/\d/.test(password)) {
        errors.password = 'Password must include at least one number';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
        values: {
            name: trimmedName,
            email: trimmedEmail,
            password,
        },
    };
}

module.exports = { validateRegistration };
