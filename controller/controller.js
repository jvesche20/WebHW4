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
  const user = request.body;
  user.sku = sku;
  await doActionFail.doActionFail(request, response, async () => {
    await Users.findOneAndReplace({ sku }, user, {
      upsert: true,
    });
    response.sendStatus(StatusCodes.OK);
  });
};

exports.userPatch = async (request, response) => {
  const { sku } = request.params;
  const user = request.body;
  delete user.sku;
  await doActionFail.doActionFail(request, response, async () => {
    const patchRequest = await user
      .findOneAndUpdate({ sku }, user, {
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
