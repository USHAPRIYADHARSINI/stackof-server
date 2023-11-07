import express from 'express';
const router = express.Router();
import * as dotenv from 'dotenv';
dotenv.config();
import { CreateCompany, DeleteCompany, EditCompany, getAllCompanies, getCompanyByName } from '../Services/companies.services.js';

// company{
//     name:'',
//     objective:'',
//     location:'',
//      filed:"",
//     logo:'',
// }

//code - ✔️
//postman - ✔️
//CRUD - ✔️
//auth - ❌

router.post('/create', async function(request, response){                           //done ✔️
    const {name, location, objective, logo, field} = request.body; 
    console.log(request.body)

    const companyFromDb = await getCompanyByName(name);

    if(companyFromDb){
      response.status(400).send({msg:"Company Already Exist"})
    }else{
      const result = await CreateCompany({
        name:name,
        objective:objective,
        location:location,
        logo:logo,
        field:field,
      });
      response.send({company:result, msg:"company created"})
    }
  })

  router.get('/:companyname', async function(request, response){                    //done ✔️
    const {companyname} = request.params
    console.log(companyname)
    const companyFromDb = await getCompanyByName(companyname);
    console.log(companyFromDb)
    if(!companyFromDb){
      response.status(400).send({msg:"Company doesnot Exist"})
    }else{
      response.status(200).send(companyFromDb)
    }
  })

  router.put('/:companyname/edit', async function(request, response){               //done ✔️
    const {name, location, objective, logo, field} = request.body; 
    const {companyname} = request.params

    console.log(request.body , companyname)

    const companyFromDb = await getCompanyByName(companyname);
    console.log(companyFromDb)

    if(!companyFromDb){
      response.status(400).send({msg:"Company doesnot Exist"})
    }else{
      const result = await EditCompany({
        name:name,
        objective:objective,
        location:location,
        logo:logo,
        field:field,
      });
      response.send({company:result, msg:"company Edited"})
    }
  })

  router.delete('/:companyname/delete', async function(request, response){          //done ✔️
    const {companyname} = request.params
    const companyFromDb = await getCompanyByName(companyname);

    if(!companyFromDb){
      response.status(400).send({msg:"Company doesnot Exist"})
    }else{
      await DeleteCompany(companyname)
      response.status(200).send({msg:"company deleted"})
    }
  })

  router.get('/', async function(request, response){                                //done ✔️
    const companyFromDb = await getAllCompanies(request)
    if(!companyFromDb){
        response.status(400).send({msg:"Companies doesnot Exist"})
    }else{
        response.status(200).send(companyFromDb)
    }
  })

  export default router ;