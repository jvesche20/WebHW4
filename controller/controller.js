const StatusCodes = require('http-status-codes');
const Users = require('../database/user');
const doActionFail = require('../middleware/failValidation');

exports.getUsers = async (request, response) => {
  await doActionFail.doActionFail(request, response, async () => {
    response.json(await Users.find(request.query).select('-_id -__v'));
  });
};

exports.deleteUsers = async (request, response) => {
  await doActionFail.doActionFail(request, response, async () => {
    response.sendStatus((await
    Users.deleteMany(request.query)).deletedCount > 0 ? StatusCodes.OK : StatusCodes.NOT_FOUND);
  });
};

exports.postUser = async (request, response) => {
  await doActionFail.doActionFail(request, response, async () => {
    await new Users(request.body).save();
    response.sendStatus(StatusCodes.CREATED);
  });
};

exports.putUsers = async (request, response) => {
  const { sku } = request.params;
  const product = request.body;
  product.sku = sku;
  await doActionFail.doActionFail(request, response, async () => {
    await Users.findOneAndReplace({ sku }, product, {
      upsert: true,
    });
    response.sendStatus(StatusCodes.OK);
  });
};

exports.userPatch = async (request, response) => {
  const { sku } = request.params;
  const product = request.body;
  delete product.sku;
  await doActionFail.doActionFail(request, response, async () => {
    const patchRequest = await product
      .findOneAndUpdate({ sku }, product, {
        new: true,
      })
      .select('-_id -__v');
    if (patchRequest != null) {
      response.json(patchRequest);
    } else {
      response.sendStatus(StatusCodes.NOT_FOUND);
    }
  });
};
