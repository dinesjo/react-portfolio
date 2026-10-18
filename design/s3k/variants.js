import { projectRecords } from "../../src/data/projectRecords.js";

const project = projectRecords.find(({ id }) => id === "s3k-interrupts");
for (const card of document.querySelectorAll(".project-copy")) {
  card.querySelector(".summary").textContent = project.description;
  card.querySelector(".date").textContent = project.date;
  card.querySelector(".stack span").textContent = project.technologies.join(" · ");
}

const drafts = document.querySelector(".drafts");
const controls = document.querySelectorAll("[data-mode][aria-pressed]");
for (const button of controls) {
  button.addEventListener("click", () => {
    drafts.dataset.mode = button.dataset.mode;
    for (const control of controls) {
      control.setAttribute("aria-pressed", String(control === button));
    }
  });
}
