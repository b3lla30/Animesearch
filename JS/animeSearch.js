const API_ALBUM = "https://api.jikan.moe/v4/top/anime?type=ona";

function getAlbum(api) {
    fetch(api)
        .then((response) => response.json())
        .then((json) => {
            fillData(json.data); // Cambiamos de 'results' a 'data'
            pagination(json.pagination.previous, json.pagination.next);
        })
        .catch((error) => {
            console.log(error, "Error consumiendo la API");
        });
}

function fillData(results) {
    let cards = "";

    results.forEach((anime) => {
        cards += `
            <div class="col">
                <div class="card h-100" style="width: 12rem;">
                    <img src="${anime.images.jpg.image_url}" class="card-img-top" alt="${anime.title}">
                    <h2 class="card-title">${anime.title}</h2>
                    <div class="card-body">
                        <h5 class="card-title">Episodios: ${anime.episodes || "Desconocido"}</h5>
                        <a href="${anime.url}" target="_blank" class="btn btn-primary">Más información</a>
                    </div>
                </div>
            </div>`;
    });

    document.getElementById("dataAlbum").innerHTML = cards;
}

function pagination(prev, next) {
    let prevDisabled = "";
    let nextDisabled = "";

    if (!prev) {
        prevDisabled = "disabled";
    }
    if (!next) {
        nextDisabled = "disabled";
    }

    let html = `
        <li class="page-item ${prevDisabled}">
            <a class="page-link" onclick="getAlbum('${prev}')">Anterior</a>
        </li>
        <li class="page-item ${nextDisabled}">
            <a class="page-link" onclick="getAlbum('${next}')">Siguiente</a>
        </li>
    `;

    document.getElementById("pagination").innerHTML = html;
}
// Escuchar el clic en el botón de búsqueda
document.getElementById("animeSearchButton").addEventListener("click", () => {
    const query = document.getElementById("animeSearchInput").value.trim();
    if (query) {
        fetchAnime(query);
    } else {
        alert("Por favor, escribe el nombre de un anime.");
    }
});

// Función para buscar animes en la API
function fetchAnime(query) {
    const API_URL = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`;

    fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
            const results = data.data;
            if (results.length > 0) {
                displayAnime(results);
            } else {
                document.getElementById("dataAlbum").innerHTML =
                    "<p class='text-center'>No se encontraron resultados.</p>";
            }
        })
        .catch((error) => {
            console.error("Error al buscar animes:", error);
            document.getElementById("dataAlbum").innerHTML =
                "<p class='text-center'>Hubo un error al realizar la búsqueda. Inténtalo nuevamente más tarde.</p>";
        });
}

// Función para mostrar los resultados en tarjetas
function displayAnime(animes) {
    const container = document.getElementById("dataAlbum");
    container.innerHTML = ""; // Limpia resultados anteriores

    animes.forEach((anime) => {
        const card = `
            <div class="col">
                <div class="card h-100" style="width: 12rem;">
                    <img src="${anime.images.jpg.image_url}" class="card-img-top" alt="${anime.title}">
                    <div class="card-body">
                        <h5 class="card-title">${anime.title}</h5>
                        <p class="card-text">Episodios: ${anime.episodes || "Desconocido"}</p>
                        <a href="${anime.url}" class="btn btn-primary" target="_blank">Más información</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}
// Llamada inicial
getAlbum(API_ALBUM);


