import React, { useContext, useEffect, useState } from 'react'
import {Authcontext} from '../Context Api/Authcontext'
import { db } from '../Firebase';
import { onSnapshot,doc } from 'firebase/firestore';
import { Chatcontext } from '../Context Api/Chatcontext';
const Chatsmember = () => {
  // This will hold the searched users data and the last message between the curruser and the serached user.
 // ...


  const [chatuser, setchatuser] = useState([]);
  const { currentUser } = useContext(Authcontext);
  const { dispatch } = useContext(Chatcontext);

  useEffect(() => {
    const getchats = () => {
      const unsub = onSnapshot(doc(db, "userChat", currentUser.uid), (doc) => {
        setchatuser(doc.data() || {}); // Set to an empty object if doc.data() is falsy
      });

      // Cleanup
      return () => {
        unsub();
      };
    };

    currentUser.uid && getchats();
  }, [currentUser.uid]);

  console.log("chatuser data is here:", chatuser);
  console.log(Object.entries(chatuser));

  const handleSelect = (user) => {
    dispatch({ type: "Change_User", payload: user });
  };

  return (
    <>
      <div className="chatmember">
        {/* Check if chatuser is an object with keys before using Object.entries */}
        {Object.keys(chatuser).length > 0 &&
          Object.entries(chatuser)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((chat) => (
              <div className="userchat" key={chat[0]} onClick={() => handleSelect(chat[1].userinfo)}>
                <img src={chat[1].userinfo.photoURL} alt="" />
                <div className="userinfo">
                  <span>{chat[1].userinfo.displayName}</span>
                  <p style={{ color: "white", marginTop: "1px" }}>{chat[1].lastMessage?.text}</p>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};





export default Chatsmember
