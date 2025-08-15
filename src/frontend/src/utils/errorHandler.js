const errorHandler = (err, formErrorHandler, notificationCallback) => {
  const { error, message } = err.response.data;

  if (typeof error === 'object') {
    Object.keys(error).map((prop) => {
      if (prop === 'avatar') notificationCallback(error[prop][0], { type: 'error' });
      else formErrorHandler(prop, { message: error[prop][0] }, { shouldFocus: true });
    });
    // other backend error
  } else notificationCallback(message ?? error, { type: 'error' });
};

export default errorHandler;
