export const CreateSuccess = (statusCode, successMessage, data) => {
  const SuccessObj = {
    status: statusCode,
    message: successMessage,
    data: data,
  };
  return SuccessObj;
};
