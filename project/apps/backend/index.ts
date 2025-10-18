import express, { json } from "express"
import cors from "cors"
import { prismaclient } from "db/client";
import { signupschema } from "common/inputs";
import  Jwt  from "jsonwebtoken";
import { authmiddleware } from "./middleware";
const app = express();

app.use(json());

app.use(cors());



app.post("/signin" , async(req , res)=>{
    const{success, data} = signupschema.safeParse(req.body);
    if(!success){
        return res.status(403).json({msg:"invalid inupts"})
    }
    const user = await prismaclient.user.findFirst({
        where:{
            email:data.email
        }
    })
    if(!user){
        return res.status(403).json({msg:"No valid user with this email"})
    }
    if(user.password != data.password){
        res.status(403).send("Invalid credentials")
    }
    const token = Jwt.sign({
        userId: user.id
    } ,process.env.JWT_SECRET!);

    res.json({
        Token : token
    });

})

app.post("/calander/:courseId" , authmiddleware ,  async (req , res)=>{
    const courseId = req.params.courseId;
    const userId = req.userId
    const course =  await prismaclient.course.findFirst({
        where:{
            id:courseId,
            purchase:{
                some:{
                    userId
                }
            }
        }
    })
    if(!course){
        return res.status(411).json({
            message:"course with id does not found"
        })
    }

    res.json({
        id:course.id,
        calander: course.calanderNotionId

    })
})

app.listen(process.env.PORT || 3000)