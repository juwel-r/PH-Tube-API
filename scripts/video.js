//Second to Hours and Minutes Converter ===>>
function uploadTime(sec) {
  let day = parseInt(sec / 86400);
  if (day > 0) {
    day = day + " Day";
  } else {
    day = "";
  }
  const hours = parseInt(sec / 3600);
  const remainingSec = sec % 3600;
  const minutes = parseInt(remainingSec / 60);
  const remainingSec2 = remainingSec % 60;
  return `${day} ${hours} Hours ${minutes} Minutes ago`;
}

/////////////////////////////////////////////

//Load Categories Button ======>>>
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

//Dsplay Categories ======>>>>
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categories-container");
  categories.forEach((item) => {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
            <button id="${item.category_id}" class="btn categoriesBtn" onclick="loadByCategories(${item.category_id})">${item.category}</button>
            `;
    categoriesContainer.appendChild(btnDiv);
  });
};

//Load Videos =====>>>
const loadVideos = (searchKeyword = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchKeyword}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

//Dsplay Videos ======>>>>
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videosContainer");
  videoContainer.innerText = "";
  if (videos.length > 0) {
    videos.forEach((video) => {
      const div = document.createElement("div");
      videoContainer.classList.add("grid");
      div.classList = "card card-compact ";
      div.innerHTML = `
          <figure class="rounded-2xl h-[200px] relative">
            <img onclick="showVideoData('${video.video_id}')"
              class="h-full w-full object-cover"
              src=${video.thumbnail}
              alt="${video.title}"
            />
            <div
              class="absolute bottom-0 right-0 bg-black/90 text-white m-3 rounded-lg"
            >${
              video.others.posted_date?.length > 0
                ? `<p class="p-2 text-xs">${uploadTime(
                    video.others.posted_date
                  )}</p>`
                : ""
            }
            </div>
          </figure>
          <div class="py-2 flex flex-row items-start gap-3">
            <div class="w-10 h-10">
              <img
                id="author-pic"
                class="h-full w-full rounded-full"
                src=${video.authors[0].profile_picture}
                alt=""
              />
            </div>
            <div>
              <h2 class="card-title">${video.title}!</h2>
              <div class="flex justify-start items-center gap-2">
                <span>J${video.authors[0].profile_name}</span>
                ${
                  video.authors[0].verified == true
                    ? `<div id="verifyBadge" class="h-5 w-5">
                  <img src="./resources/verified.png" alt="" />
                </div>`
                    : ""
                }
              </div>
              <p>${video.others.views} Views</p>
            </div>
          </div>
      `;
      videoContainer.appendChild(div);
    });
  } else {
    videoContainer.classList.remove("grid");
    const div = document.createElement("div");
    div.classList =
      "h-screen mx-auto flex flex-col justify-center items-center overflow-hidden gap-8";
    div.innerHTML = `
        <div><img src="./resources/Icon.png" alt=""></div>
        <h3 class="text-3xl text-center font-bold">Oops!! Sorry, There is <br> no content here</h3>
     `;
    videoContainer.appendChild(div);
  }
};

//Load Videos by Categories ======>>>
function loadByCategories(id) {
  const buttons = document.getElementsByClassName("categoriesBtn");
  for (let button of buttons) {
    button.classList.remove("activeColor");
  }
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const activeBtn = document.getElementById(`${id}`);
      activeBtn.classList.add("activeColor");
      displayVideos(data.category);
    })
    .catch((error) => console.log(error));
}

// Show Modal ====>>
async function showVideoData(vedioId) {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/video/${vedioId}`
    );
    const data = await res.json();
    document.getElementById("modalBox").innerHTML = `
        <div class="h-2/6"><img class="h-full w-full" src="${data.video.thumbnail}" alt=""></div>
            <h3 class="text-lg font-bold">${data.video.title}</h3>
            <p class="py-4">${data.video.description}</p>
            <div class="modal-action">
              <form method="dialog">
                <button class="btn">Close</button>
              </form>
            </div>
        `;
    my_modal_1.showModal();
  } catch (error) {
    console.log("ERROR: ",error);
  }
}

//Search Keywords ====>>
document.getElementById("search-input").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});

loadCategories();
loadVideos();
