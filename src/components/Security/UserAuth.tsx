export function getCurrentUser() {
    const currentUser = localStorage.getItem('user')
    return (currentUser !== null) ? JSON.parse(currentUser) : null
}

export function isAuthorized(requiredRoles: string[]): boolean {
    if (!getCurrentUser()) {
        return false
    }

    return getCurrentUser().roles && getCurrentUser().roles.some((role: any) => requiredRoles.includes(role));
}

export function isFullyAuthenticated() {
    return getCurrentUser() && isAuthorized(['ROLE_EMPLOYEE']) && getCurrentUser().fullyAuthorized
}