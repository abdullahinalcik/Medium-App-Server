"use strict";
/* -------------------------------------------------------
    EXPRESS_JS - BLOG-API Controller
------------------------------------------------------- */
// User Controller:
const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  list: async (req, res) => {
    /*
             #swagger.tags = ['Users']
              #swagger.summary = "List Users"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
            
          
        
        */

    const data = await res.getModelList(User);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      data,
    });
  },

  create: async (req, res) => {
    /*
             #swagger.tags = ['Users']
             #swagger.summary = "Create User"
             #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
    "username": "admin",
    "password": "aA?123456",
    "email": "admin@site.com",
    "first_name": "admin",
    "last_name": "admin",
    "image":"",
    "bio":"",
    "isAdmin": false
}}
        
        */
/*{
    "username": "required",
    "password": "required",
    "email": "required",
    "first_name": "required",
    "last_name": "required",
    "image":"",
    "bio":"",
    "isAdmin": false
}
            */
    const user = await User.create(req.body);

    // register
    const tokenData = await Token.create({
      user_id: user._id,
      token: passwordEncrypt(user._id + Date.now()),
    });

    user._doc.id = user._id;
    user._doc.token = tokenData.token;

    res.status(201).send(user);
  },

  read: async (req, res) => {
    /*
             #swagger.tags = ['Users']
              #swagger.summary = "Get Single User"
        
        */
    const data = await User.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
             #swagger.tags = ['Users']
             #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {                    
                    $ref: '#/definitions/User'
                
                }
            }
        
        */
    const data = await User.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      data,
      new: await User.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
             #swagger.tags = ['Users']
              #swagger.summary = "Delete User"
        
        */
    const data = await User.delete({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
