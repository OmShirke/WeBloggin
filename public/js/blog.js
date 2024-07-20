let blogId = decodeURI(location.pathname.split("/").pop());

let docRef = db.collection("blogs").doc(blogId);

docRef.get().then((doc) => {
  if (doc.exists) {
    setupBlog(doc.data());
  } else {
    location.replace("/");
  }
});

const setupBlog = (data) => {
  const banner = document.querySelector(".banner");
  const blogTitle = document.querySelector(".title");
  const titleTag = document.querySelector("title");
  const publish = document.querySelector(".published");

  banner.style.backgroundImage = `url(${data.bannerImage})`;

  titleTag.innerHTML += blogTitle.innerHTML = data.title;
  publish.innerHTML += data.publishedAt;

  const article = document.querySelector(".article");
  addArticle(article, data.article);

  const likeButton = document.querySelector(".like-button");
  const dislikeButton = document.querySelector(".dislike-button");
  const likeCount = document.querySelector(".like-count");
  const dislikeCount = document.querySelector(".dislike-count");

  // Fetch current like and dislike counts from Firestore
  db.collection("likes")
    .doc(blogId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        likeCount.textContent = `${data.likes || 0} likes`;
        dislikeCount.textContent = `${data.dislikes || 0} dislikes`;
      } else {
        likeCount.textContent = "0 likes";
        dislikeCount.textContent = "0 dislikes";
      }
    });

  // Add event listeners to handle like and dislike button clicks
  likeButton.addEventListener("click", () => {
    handleLikeDislike(blogId, likeCount, dislikeCount, "like");
  });

  dislikeButton.addEventListener("click", () => {
    handleLikeDislike(blogId, likeCount, dislikeCount, "dislike");
  });
};

const addArticle = (ele, data) => {
  data = data.split("\n").filter((item) => item.length);

  data.forEach((item) => {
    if (item[0] == "#") {
      let hCount = 0;
      let i = 0;
      while (item[i] == "#") {
        hCount++;
        i++;
      }
      let tag = `h${hCount}`;
      ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`;
    } else if (item[0] == "!" && item[1] == "[") {
      let separator;
      for (let i = 0; i <= item.length; i++) {
        if (
          item[i] == "]" &&
          item[i + 1] == "(" &&
          item[item.length - 1] == ")"
        ) {
          separator = i;
        }
      }
      let alt = item.slice(2, separator);
      let src = item.slice(separator + 2, item.length - 1);
      ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
    } else {
      ele.innerHTML += `<p>${item}</p>`;
    }
  });
};

const handleLikeDislike = async (
  blogId,
  likeCountElement,
  dislikeCountElement,
  action
) => {
  const likeRef = db.collection("likes").doc(blogId);
  const doc = await likeRef.get();

  if (doc.exists) {
    const data = doc.data();
    let newLikes = data.likes || 0;
    let newDislikes = data.dislikes || 0;

    if (action === "like") {
      if (data.userLiked) {
        newLikes--;
        data.userLiked = false;
      } else {
        newLikes++;
        data.userLiked = true;
        if (data.userDisliked) {
          newDislikes--;
          data.userDisliked = false;
        }
      }
    } else if (action === "dislike") {
      if (data.userDisliked) {
        newDislikes--;
        data.userDisliked = false;
      } else {
        newDislikes++;
        data.userDisliked = true;
        if (data.userLiked) {
          newLikes--;
          data.userLiked = false;
        }
      }
    }

    await likeRef.update({
      likes: newLikes,
      dislikes: newDislikes,
      userLiked: data.userLiked,
      userDisliked: data.userDisliked,
    });

    likeCountElement.textContent = `${newLikes} likes`;
    dislikeCountElement.textContent = `${newDislikes} dislikes`;
  } else {
    let initialData = {
      likes: 0,
      dislikes: 0,
      userLiked: false,
      userDisliked: false,
    };

    if (action === "like") {
      initialData.likes = 1;
      initialData.userLiked = true;
    } else if (action === "dislike") {
      initialData.dislikes = 1;
      initialData.userDisliked = true;
    }

    await likeRef.set(initialData);

    likeCountElement.textContent = `${initialData.likes} likes`;
    dislikeCountElement.textContent = `${initialData.dislikes} dislikes`;
  }
};
