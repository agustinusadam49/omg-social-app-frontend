export const displayUserWhoLikesThisPost = (
  postDataLikes,
  currentUserIdSlice
) => {
  const userLikesPost = postDataLikes;
  if (!userLikesPost.length) return " Belum ada yang menyukai postingan ini";

  const userWhoLikeIt = [];
  const secondIndex = [];

  for (let i = 0; i < userLikesPost.length; i++) {
    if (userLikesPost[i].UserId === currentUserIdSlice) {
      userWhoLikeIt.push({ currentUser: "Anda" });
    } else {
      secondIndex.push(userLikesPost[i]);
    }
  }

  userWhoLikeIt.push({ otherUser: secondIndex });

  for (let j = 0; j < userWhoLikeIt.length; j++) {
    if (userWhoLikeIt[j].otherUser && userWhoLikeIt[j].otherUser.length) {
      userWhoLikeIt[j].otherUser.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
  }

  const persons = userWhoLikeIt.length
    ? userWhoLikeIt[0].currentUser && !userWhoLikeIt[1].otherUser.length
      ? `${userWhoLikeIt[0].currentUser} menyukai postingan ini!`
      : userWhoLikeIt[0].currentUser && userWhoLikeIt[1].otherUser.length
      ? `${userWhoLikeIt[0].currentUser} dan ${userWhoLikeIt[1].otherUser.length} orang yang lain.`
      : userWhoLikeIt[0].otherUser.length &&
        userWhoLikeIt[0].otherUser.length < 2
      ? `${userWhoLikeIt[0].otherUser[0].userName} menyukai postingan ini`
      : `${userWhoLikeIt[0].otherUser[0].userName} dan ${
          userWhoLikeIt[0].otherUser.length - 1
        } orang yang lain.`
    : "Belum ada yang menyukai postingan ini";

  return persons;
};
