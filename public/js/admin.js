const students = document.getElementById('students');
const lis = Array.from(document.querySelectorAll('li'));
const changeBtn = Array.from(document.querySelectorAll('.btn-primary'));
const delBtns = Array.from(document.querySelectorAll('.btn-danger'));
if (students) {
  students.addEventListener('click', async (event) => {
    if (delBtns.includes(event.target)) {
      const button = event.target;
      const listElement = button.parentElement;
      const span = listElement.querySelector('span');
      listElement.remove();
      const id = span.id;
      let response = await fetch('/admin/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      response = await response.json();
      alert(
        `Студент ${response.deletedStudent.firstName} ${response.deletedStudent.lastName} удален`
      );
    }
  });
}
