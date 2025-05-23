const searchPokemonButton = document.getElementById("searchPokemonButton");
const deleteAllButton = document.getElementById("deleteAllButton");
const createTeamButton = document.getElementById("createTeamButton");
const searchAleatoryButton = document.getElementById("searchAleatoryButton");
const teamPokemon = [];

searchPokemonButton.addEventListener("click", () => {
    const pokemonSearch = document.getElementById("pokemonSearch").value.trim().toLowerCase();
    if (teamPokemon.length >= 6) {
        errorMessage.classList.remove("d-none");
        errorMessage.innerText = "Ya tienes un equipo completo de 6 Pokemon.";
        return;
    }    
        
    if (teamPokemon.includes(pokemonSearch)) {
        errorMessage.classList.remove("d-none");
        errorMessage.innerText = `Ya tienes el Pokemon ${pokemonSearch} en tu equipo.`;
        return;
    }
    searchPokemon(pokemonSearch);
});

deleteAllButton.addEventListener("click", () => {
    teamPokemon.forEach(pokemonName => {
        const card = document.getElementById(`card-${pokemonName}`);
        if (card) {
            card.remove();
        }
    });
    teamPokemon.length = 0;
});

createTeamButton.addEventListener("click", () => {
    const teamNameDisplay = document.getElementById("teamNameDisplay");
    const teamName = document.getElementById("teamName").value.trim();

    teamNameDisplay.innerText = teamName ? `Equipo: ${teamName}` : "Equipo: Sin nombre";
}); 

searchAleatoryButton.addEventListener("click", () => {
    const randomPokemonId = getRandomPokemonId();
    searchPokemon(randomPokemonId);
});

// Funcion para crear la tarjeta de Pokemon. Se crea un div con la clase col-md-4 y se le asigna un id dinamico. Se crea el HTML de la tarjeta de Pokemon y se le asigna al div creado. Se agrega el div al contenedor teamDisplay que ya esta en el HTML.
function createPokemonCard(pokemonData) {
    const cardCol = document.createElement("div");
    cardCol.classList.add("col-md-4");
    cardCol.id = `card-${pokemonData.name.toLowerCase()}`;

    // Se reutiliza el HTML de la tarjeta de Pokemon de la pagina principal. Se borra la parte de descripcion apenas. Las ids del html se definen de forma dinamica.
    const cardHTML = `
        <div class="card h-100">
            <div class="row g-0">
                <div class="col-md-4 d-flex align-items-center justify-content-center">
                    <img class="img-fluid w-100" style="max-width: 100%;" src="${pokemonData.image}" alt="${pokemonData.name}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold mb-1">${pokemonData.name}</h5>
                        <p class="card-text fw-light fst-italic mb-0">#${pokemonData.id}</p>
                        <p class="card-text fw-light fst-italic mb-1">Altura: ${pokemonData.height} m | Peso: ${pokemonData.weight} kg</p>
                        <div id="typeIcons-${pokemonData.name}" class="d-flex gap-2 mb-2 align-items-center"></div>
                        <button class="btn btn-primary mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${pokemonData.id}">Ver habilidades</button>
                        <div id="collapse${pokemonData.id}" class="collapse">
                            <div class="d-flex flex-wrap gap-2">
                                ${pokemonData.abilities.map(ability => `<span class="badge bg-info">${ability}</span>`).join('')}
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-danger" onclick="removePokemon('${pokemonData.name.toLowerCase()}')">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardCol.innerHTML = cardHTML;

    document.getElementById("teamDisplay").appendChild(cardCol);
}

// Funcion para buscar un Pokemon por nombre o ID. Se crea un pokemonData para enviar a la funcion createPokemonCard y se le agrega el Pokemon al array teamPokemon. Se busca la imagen del tipo de Pokemon y se le agrega a la tarjeta de Pokemon.
function searchPokemon(pokemonSearch){
    const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonSearch}`;

    fetch(pokeApiUrl)
        .then(response =>{
            if (!response.ok){
                if (response.status == 404) {
                    throw new Error(`Pokemon: ${pokemonSearch} no se encuentra/no existe`)
                } else{
                    throw new Error(`Error HTTP. Status ${response.status}`)
                }
            }
            return response.json();
        })
        .then(data =>{
            errorMessage.classList.add("d-none");

            const pokemonData = {
                id: data.id,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                height: (data.height * 0.1).toFixed(2),
                weight: (data.weight * 0.1).toFixed(2),
                image: data.sprites.front_default,
                abilities: data.moves.map(element => element.move.name.charAt(0).toUpperCase() + element.move.name.slice(1)),
                types: data.types.map(element => element.type.url),
            };
            teamPokemon.push(pokemonSearch);
            createPokemonCard(pokemonData);
            searchPokemonTypeImages(pokemonData);   
        }).catch(error =>{
            errorMessage.classList.remove("d-none");
            errorMessage.innerText = error.message;
        });
}

// Funcion para buscar la imagen del tipo de Pokemon. Se usa el "name_icon" y se busca el primer icono que funcione iniciando desde el ultimo juego.
// Copiado y pegado pero con el id cambiado para elegir el definido dinamicamente en la funcion createPokemonCard
function searchPokemonTypeImages(pokemonData) {
    pokemonData.types.forEach(typeUrl => {
        fetch(typeUrl)
            .then(response => response.json())
            .then(data => {
                let iconFound = false;
                const typeIconsId = document.getElementById(`typeIcons-${pokemonData.name}`);
                const img = document.createElement("img");

                for (const [key, value] of Object.entries(data.sprites)) {
                    const game = Object.values(value);
        
                    for (let i = game.length - 1; i >= 0; i--){
                        const currentGame = game[i];
                        if (currentGame.name_icon){
                            img.src = currentGame.name_icon;
                            img.style.width = "45px";
                            img.style.height = "22px";
                            typeIconsId.appendChild(img);
                            iconFound = true;
                            break;
                        }
                    }
                    if (iconFound) break;
                }
            })
            .catch(error => console.error(`Error al obtener la imagen del tipo: ${error}`));
    });
};

function removePokemon(pokemonName) {
    const index = teamPokemon.findIndex(p => p.toLowerCase() === pokemonName.toLowerCase());

    if (index !== -1) {
        teamPokemon.splice(index, 1);
    }
    const card = document.getElementById(`card-${pokemonName.toLowerCase()}`);
    if (card) {
        card.remove();
    }
    
}

//Copiado y pegado ya que por alguna razon no se puede importar desde api.js
function getRandomPokemonId(){
    // La PokeAPI se reparte entre pokemones estandar (1-1025) y los legendarios (10001-10277). Se divide la probabilidad entre ambos rangos de pokemones, siendo 0.787 la probabilidad de que el pokemon sea estandar y 0.213 la probabilidad de que sea legendario.
    const standardPokemon = Math.random() < 0.787;

    if (standardPokemon){
        return Math.floor(Math.random() * 1025) + 1;
    } else{
        return Math.floor(Math.random() * 277) + 10001;
    }
}