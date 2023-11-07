import express from "express";
const router = express.Router();
import * as dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.js";
import crypto from "crypto";
import { getQuestionById } from "../Services/questions.services.js";
import { AddAnswer, DeleteAnswer, EditAnswer, getAllAnswer, getAnswerById, getAnswerByQuestionId } from "../Services/answers.services.js";
import { getUserByName } from "../Services/user.services.js";

router.get("/:id/get", async function (request, response) {
   
    const { id } = request.params
    console.log(id);
    const answerFromDb = await getAnswerByQuestionId(id);
    console.log(answerFromDb)
    if (!answerFromDb) {
      response.status(400).send({ msg: "Answer doesnot Exist" });
    } else {
      
      console.log(answerFromDb)
      response.status(200).send({answers:answerFromDb, msg: "success"});
    }
  });

router.post("/:id/addanswer" ,async function (request, response) {
  
    const { id } = request.params;
    const { answer, user} = request.body;
    const ansid = crypto.randomBytes(16).toString("hex");
    console.log(ansid);
    const qfromdb = await getQuestionById(id);
    console.log(qfromdb);
    const data = {
      time: new Date(),
      answer: answer,
      user:user,
      answerid: ansid,
      questionid:id,
    };
  
    if (!qfromdb) {
        response.status(400).send({ msg: "Question doesnot Exist" });
    } else {
      try {
        console.log(qfromdb);
        const result = await AddAnswer({ data: data });
        const ans = await getAnswerByQuestionId(id)
        response
          .status(200)
          .send({ ans: ans, msg: "Answer posted successfully" });
      } catch (err) {
        console.log(err);
        response.status(500).send({ msg: "error in posting your answer", error: err });
      }
    }
  });
  
  router.put("/:id/:answerid/edit", async function (request, response) {
    const { id, answerid } = request.params;
    const { answer, code, userName } = request.body;
    const qfromdb = await getQuestionById(id);
    const answerfromdb = await getAnswerById(answerid);
    console.log(qfromdb, answerfromdb);
    if (qfromdb.id === answerfromdb.questionid) {
      const data = {
        userName: userName,
        time: new Date(),
        answer: answer,
        code: code,
      };
      if (!qfromdb || !answerfromdb) {
        response.status(400).send({ msg: "Question/Answer doesnot Exist" });
      } else {
        try {
          console.log(qfromdb);
          const result = await EditAnswer(
            { data: data },
            { questionid: id },
            { answerid: answerid }
          );
          response
            .status(200)
            .send({ company: result, msg: "Answer edited successfully" });
        } catch (err) {
          console.log(err);
          response.send({ msg: "error in editing your answer", error: err });
        }
      }
    } else response.send("error");
  });
  
  router.delete("/:answerid/delete", async function (request, response) {
    
    const { answerid} = request.params;
    const answerfromdb = await getAnswerById(answerid);
    console.log( answerfromdb);
  
    if (!answerfromdb) {
      response.status(400).send({ msg: "Answer doesnot Exist" });
    } else {
      await DeleteAnswer(answerid);
      response.status(200).send({ msg: "Answer deleted" });
    }
  });
  
  router.get("/", async function (request, response) {
   
    const answerFromDb = await getAllAnswer(request);
    if (!answerFromDb) {
      response.status(400).send({ msg: "Answer doesnot Exist" });
    } else {
      response.status(200).send({answers:answerFromDb});
    }
  });

  export default router;