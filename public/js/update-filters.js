import filterInstance from '/js/filter-instance.js'; 

document.addEventListener("DOMContentLoaded", function(){
      document.getElementById('make-filter')
      .addEventListener("submit", function(event){
        event.preventDefault();
        addMakeArray()
      })  
})

function addMakeArray()
{
    const makeForm = document.getElementById('make-filter');
    const makeInputs = makeForm.querySelectorAll('input:checked');
    const selectedMake = Array.from(makeInputs).map(input => input.value);
    filterInstance.setMake(selectedMake);
}