function capitalizeText(title) {
    return title
        ?.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const getFirebaseAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Invalid email. Check the format.';
        case 'auth/invalid-credential':
            return 'Incorrect email/password. Try again.';
        case 'auth/weak-password':
            return 'Password should be of at least 6 char.';
        case 'auth/email-already-in-use':
            return 'Email in use. Use a different one.';
        case 'auth/missing-password':
            return 'Password required. Enter your password.';
        case 'auth/missing-email':
            return 'Email required. Enter your email.';
        default:
            return 'Unknown error. Try again.';
    }
};

export { capitalizeText, getFirebaseAuthErrorMessage }