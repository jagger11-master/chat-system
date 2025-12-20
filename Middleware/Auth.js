const jwt =require('jsonwebtoken');

const auth= (req,res,next) =>{
    const  token = req.header('Authorization')?.split(' ')[1];
    if(!token) return res.status(401).json({error:'Access denied.No token provided.'});
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        //this now contain userID and role
        req.user = decode;
        next();
    } catch(error){
        res.status(400).json({error:'Invalid Token'});
    }
};
//helper middleware to restric specific pages  to admin only
const isAdmin =(req,res,next) =>{
    if(req.user.role !=='admin'){
        return res.status(403).json({error:'Admin resource! Access denied'});
    }
    next();
}
module.exports = { auth, isAdmin };
