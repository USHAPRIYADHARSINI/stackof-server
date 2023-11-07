import { client } from '../index.js';

export async function CreateQuestion(data) {            //✔️
    return await client.db('stackoverflow').collection('questions').insertOne(data);
}
// export async function CreateQuestionTag(data) {            //✔️
//     return await client.db('stackoverflow').collection('tags').insertOne(data);
// }

// export async function GetAllTags() {            //✔️
//     return await client.db('stackoverflow').collection('tags').find({}).toArray();
// }
// export async function GetTagByName(tag) {            //✔️
//     return await client.db('stackoverflow').collection('tags').find({tagName:tag}).toArray();
// }

export async function EditQuestion({data},{id}) {            //✔️
    return await client.db('stackoverflow').collection('questions').updateOne({id:id},{$set:{question:data.question, title:data.title,  tags: data.tags, time: data.time }});
}

export async function GetQuestion(id) {                 //✔️
    return await client.db('stackoverflow').collection('questions').findOne({id: id});
}

export async function getQuestionBySearchTag({search}) {           //✔️
    return await client.db('stackoverflow').collection('questions').find({tags:search}).toArray();
}

export async function DeleteQuestion(id) {              //✔️
    return await client.db('stackoverflow').collection('questions').deleteOne({id:id});
}

export async function DeleteQuestionByTag(tags) {        //✔️
    return await client.db('stackoverflow').collection('questions').deleteOne({tags:tags});
}

export async function getAllQuestions() {            //✔️
    return await client.db('stackoverflow').collection('questions').find({}).toArray();
}

export async function getQuestionById(id) {       //✔️
    
    return await client.db('stackoverflow').collection('questions').findOne({id: id});
}

// export async function getQuestionById(identity) {       
//     return await client.db('stackoverflow').collection('questions').find({_id:ObjectId(identity)}).toArray();
// }

// export async function getQuestionByQuestion(question) { 
//     return await client.db('stackoverflow').collection('questions').find({question:question});
// }

// export async function AddViews({id},{userId}) {
//     return await client.db('stackoverflow').collection('questions').findOneAndUpdate({id:id},{$set:{views:[userId]}});
// }

export async function AddMoreViews({id},{userId}) {
    return await client.db('stackoverflow').collection('questions').findOneAndUpdate({id:id},{$push:{views:userId}});
}

// export async function AddVotes({id},{userId}) {
//     return await client.db('stackoverflow').collection('questions').findOneAndUpdate({id:id},{$set:{votes:[userId]}});
// }

export async function AddMoreVotes({id},{userId}) {
    return await client.db('stackoverflow').collection('questions').findOneAndUpdate({id:id},{$push:{votes: userId}});
}

export async function AddAnsToQues({id, ansId}) {
    return await client.db('stackoverflow').collection('questions').findOneAndUpdate({id:id},{$push:{answers: ansId}});
}

// export async function updatequesviews({update}) {
//     return await client.db('stackoverflow').collection('questions').findOneAndUpdate({id:update.id},{$set:{views:[userId]}});
// }

// export async function AddAnswer({data},{id}) {
//     return await client.db('stackoverflow').collection('questions').findOneAndUpdate({id:id},{$addToSet: {answer:{userName: data.userName,time: data.time, answerid:data.answerid,answer:data.answer, code:data.code}}});
// }



// question{
//     tag:'',
//     time:'',
//     question:'',
//     userName:'',
//     views:'',
// }