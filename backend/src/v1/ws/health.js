const lambda = async event => {
  console.log(event);

  return {
    statusCode: 200,
    body: 'Ok',
  };
};

module.exports = {
  lambda,
};
