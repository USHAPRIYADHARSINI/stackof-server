import { client } from '../index.js';

export async function CreateCompany(data) {     //✔️
    return await client.db('stackoverflow').collection('companies').insertOne(data);
}

export async function EditCompany(data) {       //✔️
    return await client.db('stackoverflow').collection('companies').findOneAndUpdate({name:data.name}, 
    {$set:{ name: data.name,
            objective: data.objective,
            location: data.location,
            logo: data.logo,
            field: data.field}});   
}

export async function getCompanyById(_id) {
    return await client.db('stackoverflow').collection('companies').findOne({_id:_id});   //not working
}

export async function DeleteCompany(name) {     //✔️
    return await client.db('stackoverflow').collection('companies').deleteOne({name:name});
}

export async function getAllCompanies(req) {    //✔️
    return await client.db('stackoverflow').collection('companies').find({}).toArray();
}

export async function getCompanyByName(name) {  //✔️
    return await client.db('stackoverflow').collection('companies').findOne({name:name});
}
