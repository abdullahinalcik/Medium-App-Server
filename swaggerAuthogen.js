"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | FullStack 
------------------------------------------------------- */

const swaggerAutogen=require("swagger-autogen")()
const packageJson = require('./package.json')
require('dotenv').config()


const document = {


	info: {
		version: packageJson.version,
		title: packageJson.title,
		description: packageJson.description,
		termsOfService: "https://github.com/abdullahinalcik",
		contact: { name: packageJson.author, email: "a.inalcik@gmail.com" },
		license: { name: packageJson.license, },
	},
	host: `${process.env.HOST}:${process.env.PORT}`,
	basePath: '/',
	schemes: ['http', 'https'],
	// Token Settings:
	securityDefinitions: {
		Token: {
			type: 'apiKey',
			in: 'header',
			name: 'Authorization',
			description: 'Entry Your SimpleToken for Login. Example: <b>Token <i>...tokenKey...<i></b>'
		}
	},
	security: [{ "Token": true }],
	definition: {
        "User":require("./src/models/user").schema.obj ,
        "Blog":require("./src/models/blog").schema.obj ,
        "Category":require("./src/models/category").schema.obj ,
        "Comment":require("./src/models/comment").schema.obj ,
        "Like":require("./src/models/like").schema.obj ,
        "View":require("./src/models/view").schema.obj ,

	
	}
};

const routes=["./index.js"]

const outputFile="./src/configs/swagger.json"

swaggerAutogen(outputFile,routes,document)
