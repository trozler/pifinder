module.exports.handler = async function (event) {
  return {
    StatusCode: 200,
    body: JSON.stringify(
      {
        message: "Get to /hello",
        input: event,
      },
      null,
      2
    ),
  };
};
