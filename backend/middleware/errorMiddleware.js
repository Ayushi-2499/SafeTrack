const errorHandler = (err, req, res, next) => {
    // If the status code is already set, use it, otherwise set 500 (Server Error)
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    
    // Send the error in a clean JSON format
    res.json({
        message: err.message,
        // Do not send the 'stack' trace in production mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    errorHandler,
};