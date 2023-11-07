import express from "express";
import { client } from "../index.js";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {
  CreateUser,
  EditUser,
  deleteUserById,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserByName,
  updateUserDetails,
} from "../Services/user.services.js";
dotenv.config();
import nodemailer from "nodemailer";
import crypto from "crypto";

async function genHashedPassword(password) {
  const NO_OF_ROUND = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUND);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(salt);
  console.log(hashedPassword);
  return hashedPassword;
}

router.get("/", async function (request, response) {
  //✔️

  const userFromDb = await getAllUsers(request);
  console.log(userFromDb);
  if (!userFromDb) {
    response.status(400).send({ msg: "error in getting user" });
  } else {
    response.status(200).send(userFromDb);
  }
});

router.delete("/delete/:id", async function (request, response) {
  //✔️

  const { id } = request.params;
  const userFromDb = await getUserById(id);

  if (!userFromDb) {
    response.status(400).send({ msg: "error in getting user" });
  } else {
    await deleteUserById(id);
    response.status(200).send({ users: userFromDb, msg: "user deleted" });
  }
});

router.get("/:id", async function (request, response) {
  try {
    const { id } = request.params;
    console.log(id);
    const {name, email, userid, pp, location, job} = await getUserById(id);
    const userFromDb = {
      name: name,
      email: email,
      userid:userid,
      pp:pp,
      location:location,
      job:job,
      id:id
    }
    console.log(userFromDb);
    if (userFromDb) {
      response.status(200).send({ users: userFromDb });
    } else {
      response.status(400).send({ msg: "error in getting user", err: err });
    }
  } catch (error) {
    response.status(400).send({ msg: "error in getting user", error: error });
  }
});

router.put("/edit/:id", async function (request, response) {
  const { id } = request.params;
  const { name, email, pp } = request.body;

  let userFromDb = await getUserById(id);
  const data = {
    name: name,
    email: email,
    pp: pp,
  };
  if (!userFromDb) {
    response.status(400).send({ msg: "error in getting user" });
  } else {
    const changes = await EditUser({ data: data }, { id: id });
    console.log(userFromDb);
    const changed = await getUserById(id);
    response
      .status(200)
      .send({ users: changed, msg: "user details edited successfully" });
  }
});

router.post("/signup", async function (request, response) {
  //✔️
  const { name, email, password, pp, location, job } = request.body;
  console.log(request.body);

  const userFromDb = await getUserByName(email);
  const userid = crypto.randomBytes(16).toString("hex");

  if (userFromDb) {
    response.status(200).send({ msg: "User Already Exist" });
  } else {
    const hashedPassword = await genHashedPassword(password);
    console.log(password, hashedPassword);
    const result = await CreateUser({
      name: name, //unique
      email: email, //unique
      password: hashedPassword, //unique
      userId: userid, //unique
      pp: pp,
      location: location,
      job: job,
    });
    response.send({ msg: "user created" });
  }
});

router.post("/login", async function (request, response) {
  //✔️
  const { email, password } = request.body;
  const userFromDb = await getUserByName(email);
  // const userbyid = await getUserById(userFromDb.id)
  // console.log(userbyid);
  if (!userFromDb) {
    response
      .status(400)
      .send({ msg: "Invalid Credentials or user doesnot exist" });
  } else {
    const storedPassword = userFromDb.password;
    const isPasswordMatch = await bcrypt.compare(password, storedPassword);
    console.log(password, storedPassword);
    if (isPasswordMatch) {
      const token = jwt.sign(
        { id: userFromDb.userId, email: email, userName: userFromDb.name },
        process.env.SECRET_KEY
      );
      const user= {
        name: userFromDb.name,
        email: userFromDb.email,
        pp:userFromDb.pp,
        location:userFromDb.location,
        job:userFromDb.job,
        id:userFromDb.userId
      }
      response
        .status(200)
        .send({
          msg: "Login Successfully",
          token: token,
          userDetail: user,
        });
      console.log(token, user);
    } else {
      response.status(400).send({ msg: "Invalid Credentials" });
    }
  }
});

router.patch("/edituser", async function (request, response) {
  //✔️
  const { name, location, job, pp, email } = request.body;
  const userFromDb = await getUserByName(email);
  if (!userFromDb) {
    response
      .status(400)
      .send({ msg: "Invalid Credentials or user doesnot exist" });
  } else {
    // const storedPassword = userFromDb.password;
    // const isPasswordMatch = await bcrypt.compare(password, storedPassword);
    // console.log(password,storedPassword)
    const updateDetails = {
      name: name,
      location: location,
      job: job,
      pp: pp,
    };
    const update = await updateUserDetails(
      { data: updateDetails },
      { email: email }
    );
    const newUserDetails = await getUserByEmail(email);
    if (update && newUserDetails) {
      const token = jwt.sign(
        { id: newUserDetails.id, email: email, userName: newUserDetails.name },
        process.env.SECRET_KEY
      );
      response
        .status(200)
        .send({
          msg: "User Edited Successfully",
          token: token,
          userDetail: newUserDetails,
        });
      console.log(token);
    } else {
      response.status(400).send({ msg: "Invalid Credentials" });
    }
  }
});

router.post("/forgotPassword", async function (request, response) {
  //done
  const { email } = request.body;
  try {
    if (!email) {
      response.status(400).send({ msg: "Invalid Credentials" });
    } else {
      if (email) {
        const userFromDb = await getUserByName(email);
        const token = jwt.sign(
          { id: userFromDb.id },
          process.env.SECRET_KEY
          //   {
          //   expiresIn:120000
          // }
        ); // continue from here

        const setuserToken = await client
          .db("forgotpassword")
          .collection("users")
          .findOneAndUpdate(
            { email: userFromDb.email },
            { $set: { verifyToken: token } },
            { returnDocument: "after" }
          );
        if (setuserToken) {
          var transporter = await nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
          var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "mail to reset Password",
            text: `This Link will be valid only once - http://localhost:3000/PasswordReset/${email}/${setuserToken.value.verifyToken}`,
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              response.status(401).send({ msg: "Email Not Send" });
            } else {
              response.status(201).send({ msg: "Email Sent Successfully" });
            }
          });
        }
      } else {
        response.status(400).send({ msg: "Invalid Credentials" });
      }
    }
  } catch (error) {
    response.status(400).send({ msg: "Invalid Credentials" });
  }
});

router.post("/PasswordReset/:email/:token", async function (request, response) {
  const { email, token } = request.params;
  const { password } = request.body;
  try {
    const validuser = await client
      .db("forgotpassword")
      .collection("users")
      .findOne({ email: email, verifyToken: token });
    if (validuser) {
      const newhashedPassword = await genHashedPassword(password);

      console.log(newhashedPassword, "hashed password in reset password");

      const setnewuserPassword = await client
        .db("forgotpassword")
        .collection("users")
        .updateOne(
          { email: email },
          { $set: { password: newhashedPassword } },
          { $unset: { verifyToken: 1 } }
        );
      const removeToken = await client
        .db("forgotpassword")
        .collection("users")
        .updateOne({ email: email }, { $unset: { verifyToken: 1 } });
      console.log(setnewuserPassword, removeToken);
      response.send({
        msg: "Success",
      });
    } else {
      response.send({
        msg: "User not exist",
      });
    }
  } catch (error) {
    response.status(400).send({ msg: "User not exist" });
  }
});

router.patch("/editvote/:questionid/:userid",async function (request, response) {           //✔️
    const { questionid, userid } = request.params;
    const userFromDb = await getUserById(userid);
    var result

    if (!userFromDb) {
      response.status(400).send({ msg: "User Doesnot Exist" });
    } else {
      if (
        !userFromDb.questionVotes ||
        userFromDb.questionVotes.length === 0  ||
        userFromDb.questionVotes === null
      ) {
          result = await EditVoteQ({userId: userid},{votes: [questionid]});
      }else {
        const isqes = userFromDb.questionVotes.filter((m) => m === questionid);
        if (!isqes) {
          const newvote = userFromDb.questionVotes.push(questionid)
          result = await EditVoteQ({userId: userid },{votes: newvote,});
        }
      }

      const votes = await getUserById(userid);
      response.status(200).send(votes.questionVotes);
    }
  }
);

router.patch("/editvote/:answerid/:userid",async function (request, response) {           //✔️
  const { answerid, userid } = request.params;
  const userFromDb = await getUserById(userid);
  var result

  if (!userFromDb) {
    response.status(400).send({ msg: "User Doesnot Exist" });
  } else {
    if (
      !userFromDb.answerVotes ||
      userFromDb.answerVotes.length === 0 ||
      userFromDb.answerVotes === null
    ) {
        result = await EditVoteA({userId: userid},{votes: [answerid]});
    }else {
      const isqes = userFromDb.answerVotes.filter((m) => m === answerid);
      if (!isqes) {
        const newvote = userFromDb.answerVotes.push(answerid)
        result = await EditVoteA({userId: userid },{votes: newvote,});
      }
    }

    const votes = await getUserById(userid);
    response.status(200).send(votes.answerVotes);
  }
}
);

export default router;
