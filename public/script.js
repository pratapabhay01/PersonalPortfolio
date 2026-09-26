async function loadProjects() {

    const container = document.getElementById("project-container");

    try {

        const response = await fetch("/api/projects");

        const projects = await response.json();

        container.innerHTML = "";

        if (projects.length === 0) {

            container.innerHTML = "<p>No projects added yet.</p>";
            return;

        }

        projects.forEach(project => {

            const card = document.createElement("div");

            card.className = "project-card";

            card.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <p><strong>Technology:</strong> ${project.technology}</p>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        container.innerHTML =
            "<p>Unable to load projects.</p>";

        console.error(error);
    }
}

loadProjects();