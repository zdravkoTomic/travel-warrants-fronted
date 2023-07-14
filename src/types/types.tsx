export interface IServerSideApiViolations {
    propertyPath?: string | null,
    message?: string,
    code?: string
}

export interface IServerResponse {
    ok?: boolean | null | undefined,
    redirected?: boolean,
    statusText?: string,
    status?: number
}