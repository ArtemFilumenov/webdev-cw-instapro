import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, page, user } from "../index.js";
import { addLike, disLike } from "../api.js";
import { formatDistanceToNow } from 'date-fns';

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  const userPost = posts.map((item) => {
    return `                 <li class="post">
    ${page === POSTS_PAGE ? `<div class="post-header" data-userid="${item.user.id}">
    <img src="${item.user.imageUrl}" class="post-header__user-image">
    <p class="post-header__user-name">${item.user.name}</p>
</div>` : ''} 
    <div class="post-image-container">
      <img class="post-image" src="${item.imageUrl}">
    </div>
    <div class="post-likes">
      <button data-id="${item.id}" class="like-button">
        ${item.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'}
      </button>
      <p class="post-likes-text">
        Нравится: <strong>${item.likes.length}</strong>
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${item.user.name}</span>
      ${item.description}
    </p>
    <p class="post-date">
      ${formatDistanceToNow(new Date(item.createdAt), {
        addSuffix: true,
        // locale: ruLocale,
        // Источник: https://uchet-jkh.ru/i/biblioteka-date-fns-sozdanie-taimera-prosto-i-effektivno
      })}
    </p>
  </li>
  `
  }).join('');

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                ${page === USER_POSTS_PAGE ? `<div class="posts-user-header" data-userid="${posts[0]?.user.id}">
                <img src="${posts[0]?.user.imageUrl}" class="posts-user-header__user-image">
                <p class="posts-user-header__user-name">${posts[0]?.user.name}</p>
            </div>` : ''} <ul class="posts">
                  ${userPost}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      const id = userEl.dataset.userid;
      console.log(id);
      goToPage(USER_POSTS_PAGE, id);
    });
  }
  function initLikeButtonListeners() {
    const buttonElements = document.querySelectorAll('.like-button')
    for (const buttonElement of buttonElements) {
        buttonElement.addEventListener('click', () => {
          const id = buttonElement.dataset.id
          const found = posts.find((item) => item.id === id)
          if (found.isLiked) {
            disLike(id).then(() =>{
              goToPage(POSTS_PAGE)
            })
        } else {
            addLike(id).then(() =>{
              goToPage(POSTS_PAGE)
            })
        }
      })
    }
  }

  if(user) {
    initLikeButtonListeners();
  }
}







