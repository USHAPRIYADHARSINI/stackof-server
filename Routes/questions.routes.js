import express from "express";
const router = express.Router();
import * as dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.js";
import crypto from "crypto";
import {
  AddAnsToQues,
  AddMoreViews,
  AddMoreVotes,
  CreateQuestion,
  DeleteQuestion,
  EditQuestion,
  getAllQuestions,
  getQuestionById,
} from "../Services/questions.services.js";
import {
  DeleteAllAnswers,
  getAnswerByQuestionId,
} from "../Services/answers.services.js";

// question{
//     tag:'',
//     time:'',
//     question:'',
//     userName:'',
//     vote:'',
// }

router.post("/create", auth , async function (request, response) {
  //✔️
  const { question, tags, user, title } = request.body;
  const id = crypto.randomBytes(16).toString("hex");
  console.log(id);
  console.log(request.body);
  try {
    const result = await CreateQuestion({
      user: user,
      title: title,
      tags: tags,
      time: new Date(),
      id: id,
      question: question,
      views: [],
      votes: [],
      answers: [],
    });
    // const tagsFromDb = await GetTagByName(tag);
    // if (!tagsFromDb) {
    //   await CreateQuestionTag({
    //     tagName: tag,
    //   });
    // }
    response.status(200).send({ question: result, msg: "Question created" });
  } catch {
    response.status(400).send({ msg: "error in posting your question" });
  }
});

router.patch("/:id/edit",auth, async function (request, response) {
  //✔️
  const { question, tags, title } = request.body;
  const { id } = request.params;
  console.log(id);
  console.log(request.body);
  try {
    const result = await EditQuestion(
      {
        question: question,
        tags: tags,
        time: new Date(),
        title: title,
      },
      { id: id }
    );
    response.status(200).send({ question: result, msg: "Question Edited" });
  } catch {
    response.status(400).send({ msg: "error in editing your question" });
  }
});

// router.patch("/:id/editviews", async function (request, response) {
//   //✔️
//   // const { question, tag, code, detail, language } = request.body;
//   const { id } = request.params;
//   console.log(id);
//   // console.log(request.body);
//   try {
//     const questionFromDb = await getQuestionById(id);
//     const updateviews = +(questionFromDb.views) + 1
//     const update = {
//       id : id ,
//     views : updateviews
//     }
//     updatequesviews(update)

//     response.status(200).send({ question: result, msg: "Question Edited" });
//   } catch {
//     response.status(400).send({ msg: "error in editing your question" });
//   }
// });

router.get("/alltag", async function (request, response) {
  //✔️ used params
  try {
    const result = await getAllQuestions();
    if (!result) {
      response.status(400).send({ msg: "question doesnot exist" });
    } else {
      response.status(200).send(result);
    }
  } catch (error) {
    response.send({ msg: "error in getting your question", error: error });
  }
});

// router.get('/tag/getall', async function(request, response){                 //✔️
//   try{
//     const data = await GetAllTags();
//     return response.status(200).send({"data":data,"msg":"success"});
//   }catch(error){
//     response.status(400).send({msg: "error in getting tags", error: error})
//   }
// })

// router.get("/tag/:search", async function (request, response) {
//   //✔️ used params
//   const { search } = request.params;
//   console.log(search);
//   try {
//     const allTags = await GetAllTags();
//     console.log(allTags, "allTags");
//     const length = search.length;
//     console.log(length);
//     const l = allTags.length;
//     var e = [];
//     console.log(l, e);
//     for (let i = 0; i <= l; i++) {
//       var p = allTags[i].tagName;
//       console.log(p);
//       const splitTags = p.split("");
//       console.log(splitTags);
//       const fTags = splitTags.slice(0, length);
//       const findTags = fTags.join("");
//       console.log(findTags, search);
//       if (findTags == search) {
//         console.log("success");
//         if (e === []) {
//           // tomorrow start from here...............................
//           e = [p];
//           console.log(e, "here");
//         } else {
//           e.push(p);
//           console.log(e);
//         }
//       }
//     }
//     if (e) {
//       response.status(200).send(e);
//     } else {
//       response.status(400).send({ msg: "question doesnot exist" });
//     }
//   } catch (error) {
//     response
//       .status(400)
//       .send({ msg: "error in getting your question", error: error });
//   }
// });

// router.get("/tagsearch/:search", async function (request, response) {
//   const { search } = request.params;
//   console.log(search);
//   try {
//     const question = await getQuestionBySearchTag(search);
//     if (question) {
//       response.status(200).send(question);
//     } else {
//       response.status(400).send({ msg: "No such question exists" });
//     }
//   } catch (error) {
//     response
//       .status(500)
//       .send({ msg: "internal server error", error: error.msg });
//   }
// });

router.get("/:id/get", async function (request, response) {
  //✔️ one of the method to write the route
  const { id } = request.params;
  // const {id: id} = request.params
  console.log(id);
  const questionFromDb = await getQuestionById(id);
  console.log(questionFromDb, "getting question by id");

  // response.send('hello')
  if (!questionFromDb) {
    response.status(400).send({ msg: "Question doesnot Exist" });
  } else {
    console.log(questionFromDb);
    response.status(200).send({ msg: "success", question: questionFromDb });
  }
});

router.delete("/:id/delete",auth, async function (request, response) {
  //✔️
  const { id } = request.params;
  const companyFromDb = await getQuestionById(id);
  // const answersFfomDb = await getAnswerByQuestionId(id);
  try {
    if (!companyFromDb) {
      response.status(400).send({ msg: "Question doesnot Exist" });
    } else {
      await DeleteQuestion(id);
      // if(answersFfomDb){
      //   await DeleteAllAnswers(id);
      // }
      response.status(200).send({ msg: "Question deleted" });
    }
  } catch {
    error;
  }
  {
    response.status(500).send({ msg: "Server Error" });
  }
});

router.get("/", async function (request, response) {
  //✔️
  const companyFromDb = await getAllQuestions(request);
  if (!companyFromDb) {
    response.status(400).send({ msg: "Question doesnot Exist" });
  } else {
    response.status(200).send(companyFromDb);
  }
});

router.put("/:id/views/:userId", async function (request, res) {
  const { id, userId } = request.params;
  const qfromdb = await getQuestionById(id);
  // const viewing = parseInt(qfromdb.views) + 1;
  try {
    var views;
    if (qfromdb.views.length === 0) {
      views = await AddMoreViews({ id }, { userId });
      const qf = await getQuestionById(id);
      res.status(200).send({ msg: "success", question: qf });
    }else if (qfromdb.views.length > 0) {
      const isUser = qfromdb.views.filter((m) => m === userId);
      if (isUser.length === 0) {
        views = await AddMoreViews({ id }, { userId });
      }
      const qf = await getQuestionById(id);
      res.status(200).send({ msg: "success", question: qf });
    }
  } catch (error) {
    res.status(400).send({ msg: "error", error: error });
  }
});

router.put("/:id/votes/:userId", async function (request, res) {
  const { id, userId } = request.params;
  const qfromdb = await getQuestionById(id);
  // const viewing = parseInt(qfromdb.views) + 1;
  try {
    var votes;
    if(qfromdb.votes.length === 0){
      votes = await AddMoreVotes({ id }, { userId });
      const qf = await getQuestionById(id);
      res.status(200).send({ msg: "success", question: qf });
    }else if (qfromdb.votes.length > 0) {
      console.log(qfromdb.votes);
      const isUser = qfromdb.votes.filter((m) => m === userId);
      console.log(isUser);
      if (isUser.length === 0) {
        votes = await AddMoreVotes({ id }, { userId });
      }
      const qf = await getQuestionById(id);
      res.status(200).send({ msg: "success", question: qf });
    }
  } catch (error) {
    res.status(400).send({ msg: "error", error: error });
  }
});

router.patch("/:id/addanswer/:ansId", async function (request, res) {
  const { id, ansId } = request.params;

  // const viewing = parseInt(qfromdb.views) + 1;
  try {
    const addAns = await AddAnsToQues({ id, ansId });
    const qfromdb = await getQuestionById(id);
    res.status(200).send({ msg: "success", question: qfromdb });
  } catch (error) {
    res.status(400).send({ msg: "error", error: error });
  }
});

export default router;
