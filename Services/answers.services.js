import { client } from '../index.js';

export async function AddAnswer({data}) {             //✔️
    return await client.db('stackoverflow').collection('answers').insertOne(data);
}

export async function getAllAnswer(req) {            //✔️
    return await client.db('stackoverflow').collection('answers').find({}).toArray();
}

export async function getAnswerById(answerid) {     //✔️
    return await client.db('stackoverflow').collection('answers').findOne({answerid:answerid});
}

export async function getAnswerByQuestionId(id) {    //✔️
    return await client.db('stackoverflow').collection('answers').find({questionid:id}).toArray();
}

export async function DeleteAnswer(answerid) {         
    return await client.db('stackoverflow').collection('answers').deleteOne({answerid:answerid});
}

export async function EditAnswer({data},{questionid},{answerid}) {      //✔️
    return await client.db('stackoverflow').collection('answers').findOneAndUpdate({answerid: answerid},{$set:{userName:data.userName,time:data.time,answer:data.answer,code:data.code}});
}

export async function DeleteAllAnswers(questionid) {         
    return await client.db('stackoverflow').collection('answers').deleteMany({questionid:questionid});
}