const builder = {
    unauthorized: (prefix) => builder.prepare(403, prefix, 'Authentication Error, please try loggin again!'),
    required: (prefix) => builder.prepare(401, prefix, 'is a required field!'),
    success: (prefix) => builder.prepare(200, prefix, 'Successfully!'),
    error: (prefix) => builder.prepare(501, prefix, 'error!')
}

Object.defineProperty(builder, 'prepare', {
    writable: false,
    value: (code, prefix, message) => {
        return ({
                code,
                message: `${prefix ? `${prefix} ${message}` : message}`
        })
    }
})

module.exports = builder;