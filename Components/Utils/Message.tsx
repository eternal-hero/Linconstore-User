import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { useRouter } from "next/router";
import { baseUrl } from "../../Helpers/baseUrl";
import axios from "axios";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Cookies from "js-cookie";

const Message = ({ normalChatRooms, getChatRooms }) => {

  const router = useRouter();

  const startChat = (chat) => {
    const productDetail= {
      owner: chat?.sellerId,
      id: chat?.productId
    }
    localStorage.setItem('product_detail', JSON.stringify(productDetail))
    localStorage.setItem('currentChatRoomName', chat.roomName)
    router.push('/chat')
  }

  const removeChat = async (e, chat) => {
    e.stopPropagation()
    // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // const token = localStorage.getItem('token');
    const userInfo = JSON.parse(Cookies.get('userInfo'));
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: token
      }
    }
    try {
      const resp = await axios.delete(`${baseUrl}/deleteChatRoom?buyerId=${userInfo?._id}&role=user&roomId=${chat.roomName}`, config)
      resp?.data?.acknowledged && getChatRooms({url: `buyerChatRoom?buyerId=${userInfo?._id}`})
    } catch (error) {
      console.log(error);
      
    }
}

  return (
    <div>
      { normalChatRooms.map((chat, index) => (
         <Box
         key={index}
         sx={{ border: "1px solid gray", my: 1, width: "100%" }}
         className={"pointer"}
         style={{ borderRadius: '5px'}}
         onClick={() => startChat(chat)}
       >
         <Stack
           sx={{
             p: 1.5,
             borderRadius: '10px',
             display: "flex",
             flexDirection: 'row',
             alignItems: "center",
             justifyContent: "space-between",
           }}
         >
           {/* <Typography variant={"h6"}>{chat?.buyerDetails?.firstName + ' '+ chat?.buyerDetails?.lastName}</Typography> */}
           <Typography fontSize={14} >Seller</Typography>
           <Box sx={{
             display: "flex",
             alignItems: "center",
             gap: "8px",
           }}>
             <Typography className="text-ellipsis" width={"150px"} fontSize={14} >{chat?.productDetails?.title}</Typography>
             {/* <p onClick={removeChat}>remove</p> */}
             <DeleteTwoToneIcon onClick={e => removeChat(e, chat)} />
           </Box>
 
           {/* <Avatar variant={"circular"} sx={{ color: "white", bgcolor: "black" }}>
             +1
           </Avatar> */}
         </Stack>
       </Box>
       ))}

    </div>
    
  );
};
export default Message;
