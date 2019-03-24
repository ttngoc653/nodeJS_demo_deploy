var express = require('express');
var jwt=require('jsonwebtoken');
var user = require('../process/userProcess');
var router = express.Router();

var verifyAccess=(req,res,next)=>{
	var token=req.headers['x-access-token'];
	if(token){
		jwt.verify(token,'7avodoilc', (err,payload) => {
			if(err){
				res.statusCode=403;
				res.JSON({
					msg:'Invalid token',
					error: err
				});
			}else{
				req.token_payload=payload;
				next();
			}
			})
		}else{
			res.statusCode=403;
				res.JSON({
					msg:'Invalid token',
					error: err
				});
			}
		}

var createRefreshToken= function createRefreshToken(){
	var str=randomstring.generate({
	  length: 30,
	  charset: '7avodoilc'
  });
	return str
  }
  

var createNewToken=(req,res,next)=>{
	var acToken=jwt.sign(payload,'7avodoilc',{
		expiresIn: '5m'
	});
	
}


/*
"u":"coldboy@gmail.com",
"p":"123456"
*/
router.post('/login', (req, res) => {
	user.logIn(req.body.u, req.body.p)
	.then(rows => {
		if(rows.length == 1){
			var userAuth=rows[0];
			var payload={
				user: userAuth,
			}
			var acToken=jwt.sign(payload,'7avodoilc',{
				expiresIn: '5m'
			});
			var token=rows[0].token;
			if(rows[0].token===""){
				token=createRefreshToken;
				user.updateToken(rows[0].key,token);
			}

			res.json({
			user: userAuth,
			access_token: acToken,
			refresh_token: token});
			
		}else{
			res.status(405).send({message: `Don't found user`});
		}
	})
	.catch(err => {
		//console.log(err);
		res.status(500).send(err);
	});
})
router.post('')
/*
"u_phone":"0947123456"
"u_mail":"coldboy@gmail.com",
"u_pass":"123456",
"u_name":"Tran Joss",
"u_role":"0"
"u_seat":"1" (if car has 1 seats)
*/
router.post('/signin', (req, res) => {
	user.signIn(req.body.u_name, req.body.u_phone, req.body.u_seat, req.body.u_mail, req.body.u_pass, req.body.u_role)
	.then(value => {
		console.log(value);
		res.status(200).send({message: `Create account successfully!`});
	})
	.catch(err => {
		//console.log(err);
		res.status(500).send(err);
	});
})

router.post('/changeStatus',verifyAccess, (req, res) => {
	console.log(req.body.u_id);
	console.log(req.body.u_status);
	user.changeStatus(req.body.u_id, req.body.u_status)
	.then(value => {
		console.log(value);
		res.status(200).send({message: `Change status success!`});
	})
	.catch(err => {
		//console.log(err);
		res.status(500).send(err);
	});
})

router.post('/findLimitCarCanBook',verifyAccess ,(req, res) => {
	user.findLimitCarCanBook(u_lat,u_log)
	.then(rows => {
		res.status(200).send(JSON.stringify(rows));
	})
	.catch(err => {
		console.log(err);
		res.status(400).send(JSON.stringify(err));
	});
})

module.exports = router;