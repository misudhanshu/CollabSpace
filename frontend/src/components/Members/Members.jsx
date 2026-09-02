import React from "react";
import { FaCrown, FaUser } from "react-icons/fa";

const Members = ({ workspace }) => {
  const members = workspace?.members || [];
  const owner = workspace?.organization?.owner;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarBg = (index) => {
    const colors = [
      "from-blue-600 to-blue-800",
      "from-sky-500 to-blue-600",
      "from-blue-500 to-indigo-700",
      "from-cyan-600 to-blue-700",
    ];
    return colors[index % colors.length];
  };

  const isUserOwner = (member, index) => {
    if (!member) return false;
    if (owner?._id && member._id && owner._id.toString() === member._id.toString()) {
      return true;
    }
    if (owner?.username && member.username && owner.username === member.username) {
      return true;
    }
    return index === 0;
  };

  return (
    <div className="p-4 sm:p-6 text-slate-900 h-full overflow-y-auto max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Workspace Members</h2>
          <p className="text-sm text-slate-500 mt-1">
            People who have access to this workspace
          </p>
        </div>
        <span className="text-xs sm:text-sm bg-blue-50 text-blue-700 border border-blue-200 px-3.5 py-1 rounded-full font-bold shadow-2xs">
          {members.length} Members
        </span>
      </div>

      {members.length === 0 ? (
        <div className="bg-white border border-blue-100 p-8 rounded-2xl text-center shadow-2xs">
          <FaUser className="mx-auto text-3xl text-blue-300 mb-3" />
          <p className="text-slate-500 font-medium">No members found in workspace</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {members.map((member, index) => {
            const name = member.username || member.name || "User";
            const ownerFlag = isUserOwner(member, index);

            return (
              <div
                key={member._id || index}
                className="bg-white border border-blue-100 p-4 sm:p-5 rounded-2xl shadow-2xs transition-all hover:border-blue-300 hover:shadow-md flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4"
              >
                {/* Profile Avatar */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr ${getAvatarBg(
                    index,
                  )} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xs flex-shrink-0 border-2 border-white`}
                >
                  {getInitials(name)}
                </div>

                {/* Member Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">
                      {name}
                    </h3>
                    {ownerFlag ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold w-fit mx-auto sm:mx-0">
                        <FaCrown className="text-amber-500 text-xs" /> Owner
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold w-fit mx-auto sm:mx-0">
                        Member
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Members;
