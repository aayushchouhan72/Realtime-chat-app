// import { useEffect, useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton";
// import { Users } from "lucide-react";

// const Sidebar = () => {
//   const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
//     useChatStore();

//   const { onlineUsers } = useAuthStore();
//   const [onlineTop, setOnlineTop] = useState(false);

//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);

//   const filteredUsers = (() => {
//     if (!users || users.length === 0) return users;
//     if (onlineTop) {
//       const copy = [...users];
//       copy.sort((a, b) => {
//         const aOnline = onlineUsers.includes(a._id) ? 0 : 1;
//         const bOnline = onlineUsers.includes(b._id) ? 0 : 1;
//         return aOnline - bOnline;
//       });
//       return copy;
//     }
//     return users;
//   })();

//   if (isUsersLoading) return <SidebarSkeleton />;

//   return (
//     <aside className="w-full sm:w-20 lg:w-72 border-b sm:border-b-0 sm:border-r border-base-300 flex flex-row sm:flex-col sm:h-full transition-all duration-200">
//       <div className="flex items-center justify-between p-3 sm:p-5 border-b sm:border-b-0">
//         <div className="flex items-center gap-2">
//           <Users className="size-6" />
//           <span className="font-medium hidden sm:block">Contacts</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="flex items-center gap-2 text-sm">
//             <input
//               type="checkbox"
//               className="checkbox checkbox-sm"
//               checked={onlineTop}
//               onChange={(e) => setOnlineTop(e.target.checked)}
//             />
//             <span className="hidden sm:block text-xs">Online on top</span>
//           </label>
//         </div>
//       </div>

//       <div className="overflow-x-auto sm:overflow-y-auto w-full py-3 no-scrollbar">
//         <div className="flex gap-2 px-3 sm:flex-col sm:px-0">
//           {filteredUsers.map((user) => (
//             <button
//               key={user._id}
//               onClick={() => setSelectedUser(user)}
//               className={`flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-3 rounded-md hover:bg-base-300 transition-colors shrink-0 ${
//                 selectedUser?._id === user._id
//                   ? "bg-base-300 ring-1 ring-base-300"
//                   : ""
//               } min-w-[64px] sm:w-full`}
//             >
//               <div className="relative">
//                 <img
//                   src={user.profilePic || "/avatar.png"}
//                   alt={user.name}
//                   className="size-10 sm:size-12 object-cover rounded-full"
//                 />
//                 {onlineUsers.includes(user._id) && (
//                   <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
//                 )}
//               </div>

//               {/* Mobile: show name under avatar like WhatsApp */}
//               <div className="text-center mt-1 sm:hidden">
//                 <div className="text-xs font-medium truncate w-16">
//                   {user.fullName}
//                 </div>
//                 <div className="text-[10px] text-zinc-400">
//                   {onlineUsers.includes(user._id) ? "Online" : "Offline"}
//                 </div>
//               </div>

//               {/* Desktop: show full info */}
//               <div className="hidden lg:block text-left min-w-0">
//                 <div className="font-medium truncate">{user.fullName}</div>
//                 <div className="text-sm text-zinc-400">
//                   {onlineUsers.includes(user._id) ? "Online" : "Offline"}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>

//         {filteredUsers.length === 0 && (
//           <div className="text-center text-zinc-500 py-4">No online users</div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [onlineTop, setOnlineTop] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = (() => {
    if (!users || users.length === 0) return users;
    if (onlineTop) {
      const copy = [...users];
      copy.sort((a, b) => {
        const aOnline = onlineUsers.includes(a._id) ? 0 : 1;
        const bOnline = onlineUsers.includes(b._id) ? 0 : 1;
        return aOnline - bOnline;
      });
      return copy;
    }
    return users;
  })();

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="w-full sm:w-20 lg:w-72 border-b sm:border-b-0 sm:border-r border-base-300 flex flex-row sm:flex-col sm:h-full transition-all duration-200">
      <div className="flex items-center justify-between p-3 sm:p-5 border-b sm:border-b-0">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden sm:block">Contacts</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={onlineTop}
              onChange={(e) => setOnlineTop(e.target.checked)}
            />
            <span className="hidden sm:block text-xs">Online on top</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto sm:overflow-y-auto w-full py-3 no-scrollbar">
        <div className="flex gap-2 px-3 sm:flex-col sm:px-0">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-3 rounded-md hover:bg-base-300 transition-colors shrink-0 ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              } min-w-[64px] sm:w-full`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-10 sm:size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* Mobile: show name under avatar like WhatsApp */}
              <div className="text-center mt-1 sm:hidden">
                <div className="text-xs font-medium truncate w-16">
                  {user.fullName}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>

              {/* Desktop: show full info */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
