import { useEffect, useState } from "react";
import "./chatList.scss";
import AddUser from "../../addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  const [input, setInput] = useState("");

  useEffect(() => {
    if (!currentUser?.id) return;

    const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      if (!res.exists()) return;

      const items = res.data().chats || [];
      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user };
      });
      const chatData = await Promise.all(promises);

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unsub();
    };
  }, [currentUser?.id]);

  const handleSelect = async (chat) => {
      
    const userChatsRef = doc(db,"userchats",currentUser.id);
    const userChatsSnapshot = await getDoc(userChatsRef);

    if (userChatsSnapshot.exists()) {
      const userChatsData = userChatsSnapshot.data();

      const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chat.chatId);
      if (chatIndex > -1) {
        userChatsData.chats[chatIndex].isSeen = true;
        await updateDoc(userChatsRef, {
          chats: userChatsData.chats,
        });
      }
    }

    const userChats = chats.map (item => {
        const {user, ...rest} = item;
        return rest;
    })

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true;

    try {
        await updateDoc(userChatsRef,{
            chats: userChats,

        })

    changeChat(chat.chatId, chat.user);
        
    } catch (error) {
        console.log(error);
        
    }

  };

  const filteredChats = 
  chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="Search" />
          <input type="text" placeholder="Search" onChange = {(e) => {
              setInput(e.target.value)
          }}/>
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="Add"
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div className="item" key={chat.chatId} 
             onClick={() => handleSelect(chat)}
             style={{
               backgroundColor: chat.isSeen ? "transparent" : "#5183fe"
             }}>
          <img src={chat.user?.avatar || "./avatar.png"} alt="User Avatar" />
          <div className="textContainer">
            <span>{chat.user?.username || "Unknown User"}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
