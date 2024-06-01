import Joi from "joi";
import { verifyToken } from "../utils/tokens.js";


export function validateLogin(req, res, next) {
    const { error, value } = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(32).required()
    }).validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}

export function validateAdmin(req, res, next) {
  const auth = req.headers["authorization"];
  if(!auth) return res.status(401).json({ error: "Authorization header missing!" });

  let token = auth.split(" ")[1];
  if(!token) return res.status(401).json({ error: "Token missing" });

  let tokenData = verifyToken(token);
  if(tokenData.role !== "ADMIN") return res.status(401).json({ error: "Permission Denied" });
  req.user = tokenData;
  next();
}

export function validateSeller(req, res, next) {
  const auth = req.headers["authorization"];
  if(!auth) return res.status(401).json({ error: "Authorization header missing!" });

  let token = auth.split(" ")[1];
  if(!token) return res.status(401).json({ error: "Token missing" });

  let tokenData = verifyToken(token);
  if(tokenData.role !== "SELLER") return res.status(401).json({ error: "Permission Denied" });
  req.user = tokenData;
  next();
}

export function validateUser(req, res, next) {
  const auth = req.headers["authorization"];
  if(!auth) return res.status(401).json({ error: "Authorization header missing!" });

  let token = auth.split(" ")[1];
  if(!token) return res.status(401).json({ error: "Token missing" });

  let tokenData = verifyToken(token);
  if(tokenData.role !== "USER") return res.status(401).json({ error: "Permission Denied" });
  req.user = tokenData;
  next();
}

export function validateToken(req, res, next) {
  const auth = req.headers["authorization"];
  if(!auth) return res.status(401).json({ error: "Authorization header missing!" });

  let token = auth.split(" ")[1];
  if(!token) return res.status(401).json({ error: "Token missing" });

  let tokenData = verifyToken(token);
  if(!tokenData.role) return res.status(401).json({ error: "Permission Denied" });
  req.user = tokenData;
  next();
}

export function justDecodeTokenIfExist(req, res, next) {
  const auth = req.headers["authorization"];
  if(!auth) return next();

  let token = auth.split(" ")[1];
  if(!token) return next();

  let tokenData ={};
  try {
    tokenData = verifyToken(token);
    if(!tokenData.role) return next();
    req.user = tokenData;
  } catch (error) {
    req.user = {};
  }
  next();
}