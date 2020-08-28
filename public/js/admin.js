const students = document.getElementById("students");
const lis = Array.from(document.querySelectorAll("li"));
const changeBtn = Array.from(document.querySelectorAll(".btn-primary"));
const delBtns = Array.from(document.querySelectorAll(".btn-danger"));
let sortButton = document.getElementById("sort");
console.log(sortButton);
if (students) {
  students.addEventListener("click", async (event) => {
    if (delBtns.includes(event.target)) {
      const button = event.target;
      const listElement = button.parentElement;
      const span = listElement.querySelector("span");
      listElement.remove();
      const id = span.id;
      let response = await fetch("/admin/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      response = await response.json();
      alert(
        `Студент ${response.deletedStudent.firstName} ${response.deletedStudent.lastName} удален`
      );
    }
  });

  sort.addEventListener("submit", async (event) => {
    event.preventDefault();
    const {
      select: { value: select },
    } = event.target;
    let result = await fetch("/admin/sort", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        select,
      }),
    });
    let finalResult = await result.json();
    const hbs = await fetch("/sortDate.hbs");
    const template = await hbs.text();
    const render = Handlebars.compile(template);
    const element = render({ students: finalResult });
    document.getElementById("wrapper").innerHTML = element;
  });
}
