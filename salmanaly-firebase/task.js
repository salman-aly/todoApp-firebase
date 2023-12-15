let createTaskBtn = document.getElementById("createTask");

let createTask = () => {
  // User created task
  let userInput = document.getElementById("userTask").value;
  // console.log(userInput)

  // The div where user task is available
  let userTasks = document.querySelector(".createTask");

  if (userInput.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please create a task!",
    });
  } else {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Task successfully created",
      showConfirmButton: false,
      timer: 1000,
    });

    setTimeout(() => {
      userTasks.innerHTML += `
            <p class="paragraph">
                ${userInput}
                <a href="#">
                    <i id="del" class="bx bxs-trash-alt bx-flashing" style="color: #ffffff"></i>
                </a>
            </p>
        `;
    }, 1500);

    // Hide the default content
    let hide = document.getElementById("hideDefault");
    hide.style.display = "none";
  }

  document.getElementById("userTask").value = "";

  // Single task delete

  let del = document.getElementById("del");
  del.addEventListener("click", () => {
    let p = document.querySelector(".paragraph");
    p.remove();
  });

  // Remove all tasks at once
  let removeAll = document.getElementById("removeAll");

  removeAll.addEventListener("click", () => {
    userTasks.remove();
  });
};

createTaskBtn.addEventListener("click", createTask);
