import "./Avatar.css";

const Avatar = ({ avatar, name }) => {
  const avatarUrl = avatar ? avatar : null;
  const firstLetter = name?.[0]?.toUpperCase() || "?";

  return (
    <div className="avatar">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="avatar"
          className="avatar-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = "none";
          }}
        />
      ) : (
        <span className="avatar-letter">{firstLetter}</span>
      )}
    </div>
  );
};

export default Avatar;
