import axios from 'axios'
import qs from 'qs'
export default{
    host:"http://localhost:3000",
    getUserId:function(userId){
        this.userId=userId
    },
    userId:"",
  
    getMusic:function(id,msg){
        this.music.id=id;
        this.music.msg=msg
    },
    music:{id:"",msg:{}},
}