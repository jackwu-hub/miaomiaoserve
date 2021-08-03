define({ "api": [
  {
    "type": "get",
    "url": "/api2/users/getUser",
    "title": "getUser",
    "version": "0.0.0",
    "name": "getUser",
    "group": "User",
    "description": "<p>API to get the user information.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "userInfo",
            "description": "<p>Info of the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"msg\": \"获取用户信息成功\",\n    \"status\": 0,\n    \"data\": {\n        \"username\": \"admin\",\n        \"isAdmin\": true,\n        \"userHead\": \"http://localhost:3000/uploads/admin.jpeg\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code>user_id</code> of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"msg\": \"获取用户信息失败\",\n    \"status\": -5\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api2/users/login",
    "title": "Login",
    "name": "login",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "request-example",
          "content": "{\n \"username\": \"123\",\n \"password\": \"bbbb\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "error-example",
          "content": "{\n\"msg\": \"登录失败,密码错误\",\n\"status\": -3\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "success-example",
          "content": "{\n\"msg\": \"登录成功\",\n \"status\": 0\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controllers/users.js",
    "groupTitle": "User"
  }
] });