export const ApplicationException = ({
    message = "error",
    options = {
        cause: {
            status: 400
        }
    }
} = {}) => {
    throw new Error(message, options)
}


export const ConflictException = (message = "conflict Error", issues = []) => {
    return ApplicationException({
        message,
        options: {
            cause: {
                status: 409,
                issues
            }
        }
    })
}


export const NotfoundException = (message = "Notfound Error", issues = []) => {
    return ApplicationException({
        message,
        options: {
            cause: {
                status: 404,
                issues
            }
        }
    })
}


export const BadException = (message = "bad request exception", issues = []) => {
    return ApplicationException({
        message,
        options: {
            cause: {
                status: 400,
                issues
            }
        }
    })
}


export const UnauthorizedException = (message = "Unauthorized Error", issues = []) => {
    return ApplicationException({
        message,
        options: {
            cause: {
                status: 401,
                issues
            }
        }
    })
}


export const ForbiddenException = (message = "Forbidden Error", issues = []) => {
    return ApplicationException({
        message,
        options: {
            cause: {
                status: 403,
                issues
            }
        }
    })
}