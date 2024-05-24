import ChatList from "./chatList/ChatList";
import "./list.scss";
import UserInfo from "./userInfo/UserInfo";
const List = () => {
  return (
    <div className="list">
        <UserInfo />
        <ChatList />
    </div>
  )
}

export default List