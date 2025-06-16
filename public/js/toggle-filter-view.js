document.addEventListener("DOMContentLoaded", function(){
    const filterPanels = document.querySelectorAll(".toggle-filter");
    filterPanels.forEach(panel => {
        panel.addEventListener('click', () => 
        {
            var parentDiv = panel.closest(".filter-panel")
            const filterBody = parentDiv.querySelector(".filter-body");
            filterBody.classList.toggle('hidden');
            panel.textContent = filterBody.classList.contains("hidden") ? "+" : "−";
        }
        )
    })
}
)