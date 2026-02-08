import {connect} from "mongoose"

export default async function connectToDb(){

    await connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("mongodb connected sucessfully");
        
    })
    .catch((e)=>{
        console.log("error while connecting to db", e);
        
    })
}